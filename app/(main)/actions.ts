'use server';

import { auth } from '@/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import type { SpotifyTrack } from '@/types/spotify';

export async function addFavorite(track: SpotifyTrack, countryCode: string) {
	const session = await auth();
	if (!session?.user?.id) throw new Error('Não autorizado');

	const supabase = createAdminClient();
	const { error } = await supabase.from('favorites').insert({
		user_id: session.user.id,
		track_id: track.id,
		track_name: track.name,
		artist_name: track.artists[0].name,
		preview_url: track.preview_url,
		country_code: countryCode,
	});

	if (error) throw new Error('Erro ao salvar favorito');
}
