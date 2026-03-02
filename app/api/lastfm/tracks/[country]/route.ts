// app/api/lastfm/tracks/[country]/route.ts
import { getTopTracksByCountry } from '@/lib/lastfm/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ country: string }> },
) {
	try {
		const { country } = await params;
		console.log(`[Last.fm API] Recebido código do país: ${country}`);

		if (!country || country.length !== 2) {
			return NextResponse.json(
				{ error: 'Código de país inválido' },
				{ status: 400 },
			);
		}

		const tracks = await getTopTracksByCountry(country, 10);

		return NextResponse.json({ tracks });
	} catch (error) {
		console.error('[Last.fm API] Erro:', error);
		return NextResponse.json(
			{ error: 'Erro interno no servidor' },
			{ status: 500 },
		);
	}
}
