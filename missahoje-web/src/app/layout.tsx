import type { Metadata } from 'next';
import { Inter, Lora } from 'next/font/google';
import Providers from '../lib/react-query';
import { LayoutShell } from '../components/layouts/LayoutShell';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const lora = Lora({ subsets: ['latin'], variable: '--font-lora' });

export const metadata: Metadata = {
  title: 'Missa Hoje - Encontre Missas Perto de Você',
  description: 'Descubra os horários das missas nas paróquias mais próximas. Simples, sagrado e rápido.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${lora.variable}`}>
      <body>
        <Providers>
          <LayoutShell>
            {children}
          </LayoutShell>
        </Providers>
      </body>
    </html>
  );
}
