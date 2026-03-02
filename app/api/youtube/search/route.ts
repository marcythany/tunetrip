import { searchYouTubeVideo } from '@/lib/youtube/search';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const query = searchParams.get('q');

	if (!query) {
		return NextResponse.json(
			{ error: 'Query parameter "q" é obrigatório' },
			{ status: 400 },
		);
	}

	try {
		const result = await searchYouTubeVideo(query);
		if (!result) {
			return NextResponse.json(
				{ error: 'Nenhum vídeo encontrado' },
				{ status: 404 },
			);
		}
		return NextResponse.json(result);
	} catch (error) {
		console.error('Erro na API de busca do YouTube:', error);
		return NextResponse.json(
			{ error: 'Erro interno no servidor' },
			{ status: 500 },
		);
	}
}
