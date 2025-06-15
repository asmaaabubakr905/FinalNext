'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Calendar, 
  Clock, 
  Star, 
  Heart, 
  ExternalLink,
  ArrowLeft 
} from 'lucide-react';
import { MovieDetails, Movie } from '@/types/movie';
import { tmdbService } from '@/lib/tmdb';
import { useWishlist } from '@/contexts/WishlistContext';
import { useLanguage } from '@/contexts/LanguageContext';
import MovieGrid from '@/components/MovieGrid';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface Props {
  movie: MovieDetails;
}

export default function MovieDetailsClient({ movie }: Props) {
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { currentLanguage } = useLanguage();

  const inWishlist = isInWishlist(movie.id);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const recommendationsData = await tmdbService.getMovieRecommendations(movie.id, currentLanguage);
        setRecommendations(recommendationsData.results.slice(0, 12));
      } catch (err) {
        console.error('Error fetching recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [movie.id, currentLanguage]);

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(movie.id);
    } else {
      addToWishlist(movie);
    }
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: amount >= 1000000 ? 'compact' : 'standard',
    }).format(amount);
  };

  return (
    <div>
      {/* Back Button */}
      <Link href="/" className="inline-block mb-6">
        <Button variant="outline" className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Movies
        </Button>
      </Link>

      {/* Movie Hero Section */}
      <div className="relative rounded-xl overflow-hidden mb-8">
        {movie.backdrop_path && (
          <div className="absolute inset-0">
            <Image
              src={tmdbService.getBackdropUrl(movie.backdrop_path)}
              alt={movie.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          </div>
        )}
        
        <div className="relative p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="flex-shrink-0">
              <div className="w-64 mx-auto md:mx-0">
                <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src={tmdbService.getPosterUrl(movie.poster_path)}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    sizes="256px"
                  />
                </div>
              </div>
            </div>

            {/* Movie Info */}
            <div className="flex-1 text-white">
              {/* Title and Year */}
              <div className="mb-4">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>
                {movie.tagline && (
                  <p className="text-slate-300 text-lg italic">{movie.tagline}</p>
                )}
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {movie.release_date && (
                  <div className="flex items-center text-slate-300">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(movie.release_date).getFullYear()}
                  </div>
                )}
                
                {movie.runtime > 0 && (
                  <div className="flex items-center text-slate-300">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatRuntime(movie.runtime)}
                  </div>
                )}
                
                {movie.vote_average > 0 && (
                  <div className="flex items-center text-slate-300">
                    <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                    {movie.vote_average.toFixed(1)} ({movie.vote_count.toLocaleString()} votes)
                  </div>
                )}
              </div>

              {/* Genres */}
              {movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres.map((genre) => (
                    <Badge 
                      key={genre.id} 
                      variant="secondary"
                      className="bg-slate-700 text-white hover:bg-slate-600"
                    >
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Overview */}
              {movie.overview && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Overview</h3>
                  <p className="text-slate-300 leading-relaxed">{movie.overview}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={handleWishlistToggle}
                  variant={inWishlist ? "default" : "outline"}
                  className={`${
                    inWishlist 
                      ? "bg-red-500 hover:bg-red-600 text-white" 
                      : "bg-slate-800 border-slate-600 text-white hover:bg-red-500"
                  }`}
                >
                  <Heart className={`h-4 w-4 mr-2 ${inWishlist ? 'fill-current' : ''}`} />
                  {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </Button>

                {movie.homepage && (
                  <a href={movie.homepage} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Official Site
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Production Info */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Production Details</h3>
          <div className="space-y-3 text-slate-300">
            {movie.budget > 0 && (
              <div className="flex justify-between">
                <span>Budget:</span>
                <span>{formatCurrency(movie.budget)}</span>
              </div>
            )}
            {movie.revenue > 0 && (
              <div className="flex justify-between">
                <span>Revenue:</span>
                <span>{formatCurrency(movie.revenue)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Status:</span>
              <span>{movie.status}</span>
            </div>
            <div className="flex justify-between">
              <span>Original Language:</span>
              <span>{movie.original_language.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Production Companies */}
        {movie.production_companies.length > 0 && (
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Production Companies</h3>
            <div className="space-y-2">
              {movie.production_companies.slice(0, 5).map((company) => (
                <div key={company.id} className="text-slate-300">
                  {company.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {!loading && recommendations.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">You Might Also Like</h2>
          <MovieGrid movies={recommendations} />
        </div>
      )}
      
      {loading && (
        <div className="text-center py-8">
          <LoadingSpinner size="md" />
          <p className="text-slate-400 mt-2">Loading recommendations...</p>
        </div>
      )}
    </div>
  );
}