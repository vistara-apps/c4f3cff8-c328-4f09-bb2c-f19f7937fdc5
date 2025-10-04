import { MiniKit } from '@farcaster/miniapp-sdk';

export interface AuthUser {
  fid: string;
  username: string;
  walletAddress?: string;
}

export class AuthService {
  private miniKit: typeof MiniKit;

  constructor() {
    this.miniKit = MiniKit;
  }

  async initialize() {
    try {
      await this.miniKit.init();
      return true;
    } catch (error) {
      console.error('Failed to initialize MiniKit:', error);
      return false;
    }
  }

  async signIn(): Promise<AuthUser | null> {
    try {
      if (!this.miniKit.isInitialized) {
        await this.initialize();
      }

      const result = await this.miniKit.signIn();
      if (result?.user) {
        return {
          fid: result.user.fid.toString(),
          username: result.user.username,
          walletAddress: result.user.walletAddress,
        };
      }
      return null;
    } catch (error) {
      console.error('Sign in failed:', error);
      return null;
    }
  }

  async signOut() {
    try {
      await this.miniKit.signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }

  getCurrentUser(): AuthUser | null {
    if (!this.miniKit.user) return null;

    return {
      fid: this.miniKit.user.fid.toString(),
      username: this.miniKit.user.username,
      walletAddress: this.miniKit.user.walletAddress,
    };
  }

  get isAuthenticated(): boolean {
    return !!this.miniKit.user;
  }
}

export const authService = new AuthService();

