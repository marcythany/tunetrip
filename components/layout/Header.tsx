'use client';

import { Menu } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';

const navItems = [
	{ name: 'Mapa', href: '/' },
	{ name: 'Favoritos', href: '/favorites' },
];

export function Header() {
	const pathname = usePathname();
	const { data: session, status } = useSession();
	const isLoading = status === 'loading';

	return (
		<header className='sticky top-0 z-50 w-full border-b border-teal-900/30 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60'>
			<div className='container flex h-16 items-center justify-between'>
				{/* Logo */}
				<Link href='/' className='flex items-center space-x-2'>
					<span className='bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-xl font-bold text-transparent'>
						TuneTrip
					</span>
				</Link>

				{/* Desktop Navigation */}
				<nav className='hidden items-center space-x-6 text-sm font-medium md:flex'>
					{navItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								'transition-colors hover:text-teal-400',
								pathname === item.href ?
									'text-foreground'
								:	'text-foreground/60',
							)}
						>
							{item.name}
						</Link>
					))}
				</nav>

				{/* Right side actions */}
				<div className='flex items-center gap-3'>
					<ThemeToggle />

					{!isLoading && session?.user ?
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Avatar className='h-8 w-8 cursor-pointer'>
									<AvatarImage
										src={session.user.image ?? ''}
										alt={session.user.name ?? ''}
									/>
									<AvatarFallback>
										{session.user.name?.charAt(0).toUpperCase()}
									</AvatarFallback>
								</Avatar>
							</DropdownMenuTrigger>
							<DropdownMenuContent align='end'>
								<DropdownMenuItem asChild>
									<Link href='/favorites'>Meus Favoritos</Link>
								</DropdownMenuItem>
								<DropdownMenuItem
									className='text-red-400'
									onClick={() => signOut({ callbackUrl: '/' })}
								>
									Sair
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					:	<Button asChild variant='default' size='sm' disabled={isLoading}>
							<Link href='/login'>Entrar</Link>
						</Button>
					}

					{/* Mobile Menu */}
					<Sheet>
						<SheetTrigger asChild>
							<Button variant='ghost' size='icon' className='md:hidden'>
								<Menu className='h-5 w-5' />
								<span className='sr-only'>Abrir menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side='right' className='w-[300px] sm:w-[400px]'>
							<SheetHeader>
								<SheetTitle className='text-left text-teal-400'>
									TuneTrip
								</SheetTitle>
							</SheetHeader>
							<nav className='mt-8 flex flex-col gap-4'>
								{navItems.map((item) => (
									<Link
										key={item.href}
										href={item.href}
										className={cn(
											'py-2 text-lg transition-colors hover:text-teal-400',
											pathname === item.href ?
												'font-medium text-foreground'
											:	'text-foreground/60',
										)}
									>
										{item.name}
									</Link>
								))}
							</nav>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
}
