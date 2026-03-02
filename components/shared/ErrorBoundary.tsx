'use client';

import { Component, ReactNode } from 'react';

interface Props {
	children: ReactNode;
	fallback?: ReactNode | ((error: Error) => ReactNode);
}

interface State {
	hasError: boolean;
	error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		// Opcional: logar erro para serviço externo
		console.error('[ErrorBoundary]', error, errorInfo);
	}

	render() {
		const { hasError, error } = this.state;
		const { children, fallback } = this.props;

		if (hasError && error) {
			if (typeof fallback === 'function') {
				return fallback(error);
			}
			return (
				fallback ?? (
					<div className='flex min-h-50 flex-col items-center justify-center rounded-lg border border-red-800/30 bg-red-950/20 p-6 text-center'>
						<div className='mb-4 text-4xl'>⚠️</div>
						<h2 className='mb-2 text-lg font-semibold text-red-400'>
							Algo deu errado
						</h2>
						<p className='mb-4 text-sm text-red-300/80'>{error.message}</p>
						<button
							onClick={() => this.setState({ hasError: false, error: null })}
							className='rounded-md bg-red-900/50 px-4 py-2 text-sm text-red-200 transition-colors hover:bg-red-800/60'
						>
							Tentar novamente
						</button>
					</div>
				)
			);
		}

		return children;
	}
}
