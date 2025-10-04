'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { MiniAppProvider } from '@farcaster/miniapp-sdk';
import { base } from 'wagmi/chains';
import { type ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || 'cdp_demo_key'}
      chain={base}
    >
      <MiniAppProvider>
        {children}
      </MiniAppProvider>
    </OnchainKitProvider>
  );
}
