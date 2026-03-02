'use client';

import { useEffect, useState } from 'react';

interface GeolocationState {
	loading: boolean;
	accuracy: number | null;
	latitude: number | null;
	longitude: number | null;
	error: string | null;
}

export function useGeolocation(options?: PositionOptions) {
	const [state, setState] = useState<GeolocationState>(() => {
		// Verifica suporte apenas uma vez na inicialização
		if (typeof window !== 'undefined' && !navigator.geolocation) {
			return {
				loading: false,
				accuracy: null,
				latitude: null,
				longitude: null,
				error: 'Geolocalização não é suportada pelo seu navegador.',
			};
		}
		return {
			loading: true,
			accuracy: null,
			latitude: null,
			longitude: null,
			error: null,
		};
	});

	useEffect(() => {
		// Se o navegador não suporta, não faz nada
		if (typeof window === 'undefined' || !navigator.geolocation) return;
		// Se já temos um erro (ex: suporte negado), não tenta novamente
		if (state.error) return;

		const onSuccess = (position: GeolocationPosition) => {
			setState({
				loading: false,
				accuracy: position.coords.accuracy,
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
				error: null,
			});
		};

		const onError = (error: GeolocationPositionError) => {
			setState((prev) => ({
				...prev,
				loading: false,
				error: error.message,
			}));
		};

		const watchId = navigator.geolocation.watchPosition(
			onSuccess,
			onError,
			options,
		);

		return () => {
			navigator.geolocation.clearWatch(watchId);
		};
	}, [options, state.error]); // Depende apenas de options; recria o watch se options mudar

	return state;
}
