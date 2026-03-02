'use client';

import { Input } from '@/components/ui/input';
import { COUNTRIES, COUNTRY_BY_CODE } from '@/lib/constants';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useMap } from './MapProvider';

export default function SearchBar() {
	const [query, setQuery] = useState('');
	const [suggestions, setSuggestions] = useState<typeof COUNTRIES>([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const { mapRef } = useMap();

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				wrapperRef.current &&
				!wrapperRef.current.contains(event.target as Node)
			) {
				setShowSuggestions(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setQuery(value);
		if (value.length > 1) {
			const filtered = COUNTRIES.filter(
				(c) =>
					c.name.toLowerCase().includes(value.toLowerCase()) ||
					c.code.toLowerCase().includes(value.toLowerCase()),
			).slice(0, 5);
			setSuggestions(filtered);
			setShowSuggestions(true);
		} else {
			setSuggestions([]);
			setShowSuggestions(false);
		}
	};

	const selectCountry = (code: string) => {
		const country = COUNTRY_BY_CODE[code];
		if (country && mapRef.current) {
			console.log('[SearchBar] voando para:', country.name);
			mapRef.current.flyTo([country.lat, country.lng], country.zoom);
			setQuery('');
			setSuggestions([]);
			setShowSuggestions(false);
		}
	};

	return (
		<div
			ref={wrapperRef}
			className='absolute left-4 top-4 z-50 pointer-events-auto'
		>
			<div className='relative w-64'>
				<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
				<Input
					type='text'
					placeholder='Buscar país...'
					value={query}
					onChange={handleSearch}
					onFocus={() => query.length > 1 && setShowSuggestions(true)}
					className='border-teal-800/30 bg-background/80 pl-8 backdrop-blur-sm'
				/>
				{showSuggestions && suggestions.length > 0 && (
					<ul className='absolute mt-1 w-full rounded-md border border-teal-800/30 bg-background/95 shadow-lg backdrop-blur-sm'>
						{suggestions.map((country) => (
							<li
								key={country.code}
								onMouseDown={(e) => {
									e.preventDefault();
									selectCountry(country.code);
								}}
								className='cursor-pointer px-3 py-2 text-sm transition-colors hover:bg-teal-900/50'
							>
								<span className='mr-2'>{country.flag}</span>
								{country.name} ({country.code})
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
