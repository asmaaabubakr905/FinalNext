import { notFound } from 'next/navigation';
import { MovieDetails } from '@/types/movie';
import { tmdbService } from '@/lib/tmdb';
import MovieDetailsClient from './MovieDetailsClient';

interface Props {
  params: { id: string }
}

export async function generateStaticParams() {
  // Generate static params for most popular movies
  try {
    const response = await tmdbService.getNowPlayingMovies(1);
    return response.results.slice(0, 20).map((movie) => ({
      id: movie.id.toString(),
    }));
  } catch {
    return [];
  }
}

export default async function MovieDetailsPage({ params }: Props) {
  const movieId = parseInt(params.id);
  
  if (isNaN(movieId)) {
    notFound();
  }

  try {
    const movie = await tmdbService.getMovieDetails(movieId);
    return <MovieDetailsClient movie={movie} />;
  } catch {
    notFound();
  }
}