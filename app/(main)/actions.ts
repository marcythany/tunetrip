'use server';

import { auth } from '@/auth';
import { createAdminClient } from '@/lib/supabase/admin';

export interface FavoriteTrackInput {
	id: string; // identificador único (ex: "nome-musica-artista")
	name: string;
	artistName: string;
	preview_url: string | null; // sempre null para Last.fm, mas mantido por compatibilidade
}

export async function addFavorite(
	track: FavoriteTrackInput,
	countryCode: string,
) {
	const session = await auth();
	if (!session?.user?.id) throw new Error('Não autorizado');

	const supabase = createAdminClient();
	const { error } = await supabase.from('favorites').insert({
		user_id: session.user.id,
		track_id: track.id,
		track_name: track.name,
		artist_name: track.artistName,
		preview_url: track.preview_url,
		country_code: countryCode,
	});

	if (error) throw new Error('Erro ao salvar favorito');
}
