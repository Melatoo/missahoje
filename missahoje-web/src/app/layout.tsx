import type { Metadata } from 'next';
import { Inter, Cinzel, Lora } from 'next/font/google';
import Providers from '../lib/react-query';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel' });
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
    <html lang="pt-BR">
      <body className={`${inter.variable} ${cinzel.variable} ${lora.variable}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
