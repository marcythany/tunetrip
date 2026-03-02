import { Header } from '@/components/layout/Header';
import { MapProvider } from '@/components/map/MapProvider';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'TuneTrip - Música pelo mundo',
	description: 'Descubra as músicas mais populares em cada país',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='pt-BR' suppressHydrationWarning>
			<body className={`${inter.className} antialiased`}>
				<SessionProvider>
					<ThemeProvider
						attribute='class'
						defaultTheme='dark'
						enableSystem
						disableTransitionOnChange
					>
						<MapProvider>
							<Header />
							<main className='min-h-screen'>{children}</main>
							<Toaster position='top-center' richColors />
						</MapProvider>
					</ThemeProvider>
				</SessionProvider>
			</body>
		</html>
	);
}
