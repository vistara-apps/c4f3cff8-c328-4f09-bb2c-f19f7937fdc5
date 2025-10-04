import { MiniKit } from '@farcaster/miniapp-sdk';
import { db } from './redis';

export interface PaymentRequest {
  userId: string;
  amount: string; // in ETH, e.g., "0.0005"
  description: string;
  itemId: string; // e.g., "premium_pack_1"
}

export interface PaymentResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

export class PaymentService {
  private miniKit: typeof MiniKit;

  constructor() {
    this.miniKit = MiniKit;
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    try {
      if (!this.miniKit.isInitialized) {
        throw new Error('MiniKit not initialized');
      }

      // Prepare transaction for x402 micro-payment
      const transaction = {
        to: process.env.PAYMENT_RECIPIENT_ADDRESS || '0x0000000000000000000000000000000000000000',
        value: this.ethToWei(request.amount),
        data: this.encodePaymentData(request.itemId, request.userId),
      };

      const result = await this.miniKit.wallet.sendTransaction(transaction);

      if (result.success) {
        // Update user's premium unlocks
        const user = await db.getUser(request.userId);
        if (user) {
          const premiumUnlocks = [...(user.premiumUnlocks || []), request.itemId];
          await db.updateUser(request.userId, { premiumUnlocks });
        }

        return {
          success: true,
          transactionHash: result.transactionHash,
        };
      } else {
        return {
          success: false,
          error: result.error || 'Transaction failed',
        };
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed',
      };
    }
  }

  async unlockWithStreak(userId: string, itemId: string, requiredStreak: number): Promise<boolean> {
    try {
      const user = await db.getUser(userId);
      if (!user) return false;

      const currentStreak = parseInt(user.currentStreak) || 0;
      if (currentStreak >= requiredStreak) {
        const premiumUnlocks = [...(user.premiumUnlocks || []), itemId];
        await db.updateUser(userId, { premiumUnlocks });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Streak unlock error:', error);
      return false;
    }
  }

  private ethToWei(ethAmount: string): string {
    // Simple conversion: 1 ETH = 10^18 wei
    const eth = parseFloat(ethAmount);
    const wei = eth * 10 ** 18;
    return wei.toString();
  }

  private encodePaymentData(itemId: string, userId: string): string {
    // Encode payment metadata for x402 protocol
    // This is a simplified implementation
    const data = JSON.stringify({
      protocol: 'x402',
      type: 'micro-payment',
      itemId,
      userId,
      timestamp: Date.now(),
    });

    // Convert to hex (simplified)
    return '0x' + Buffer.from(data).toString('hex');
  }

  getPaymentAmount(itemType: string): string {
    // Define pricing for different items
    const prices: Record<string, string> = {
      'premium_pack_1': '0.0005', // ~$1
      'premium_pack_2': '0.001',  // ~$2
      'pod_access': '0.001',      // ~$2
      'streak_boost': '0.0001',   // ~$0.20
    };

    return prices[itemType] || '0.0005';
  }
}

export const paymentService = new PaymentService();

