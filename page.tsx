'use client';

import React, { useState, useEffect } from 'react';
import { Movie, MoviesResponse } from '@/types/movie';
import { tmdbService } from '@/lib/tmdb';
import { useLanguage } from '@/contexts/LanguageContext';
import MovieGrid from '@/components/MovieGrid';
import Pagination from '@/components/Pagination';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Film } from 'lucide-react';

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { currentLanguage } = useLanguage();

  const fetchMovies = async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      const response: MoviesResponse = await tmdbService.getNowPlayingMovies(page, currentLanguage);
      setMovies(response.results);
      setTotalPages(Math.min(response.total_pages, 500)); // TMDb API limit
      setCurrentPage(page);
    } catch (err) {
      setError('Failed to fetch movies. Please try again later.');
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(1);
  }, [currentLanguage]);

  const handlePageChange = (page: number) => {
    fetchMovies(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && movies.length === 0) {
    return <LoadingSpinner size="lg" />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Film className="h-16 w-16 mx-auto text-slate-600 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Oops! Something went wrong</h2>
        <p className="text-slate-400 mb-4">{error}</p>
        <button
          onClick={() => fetchMovies(currentPage)}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Now Playing Movies
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Discover the latest movies currently playing in theaters around the world
        </p>
      </div>

      {/* Movies Grid */}
      {loading ? (
        <LoadingSpinner size="lg" />
      ) : (
        <>
          <MovieGrid movies={movies} />
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}