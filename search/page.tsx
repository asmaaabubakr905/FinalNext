'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, ArrowLeft } from 'lucide-react';
import { Movie, SearchMoviesResponse } from '@/types/movie';
import { tmdbService } from '@/lib/tmdb';
import { useLanguage } from '@/contexts/LanguageContext';
import MovieGrid from '@/components/MovieGrid';
import Pagination from '@/components/Pagination';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const { currentLanguage } = useLanguage();

  const searchMovies = async (searchQuery: string, page: number) => {
    if (!searchQuery.trim()) {
      setMovies([]);
      setTotalPages(1);
      setTotalResults(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response: SearchMoviesResponse = await tmdbService.searchMovies(
        searchQuery, 
        page, 
        currentLanguage
      );
      setMovies(response.results);
      setTotalPages(Math.min(response.total_pages, 500)); // TMDb API limit
      setTotalResults(response.total_results);
      setCurrentPage(page);
    } catch (err) {
      setError('Failed to search movies. Please try again later.');
      console.error('Error searching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      searchMovies(query, 1);
    } else {
      setMovies([]);
      setLoading(false);
    }
  }, [query, currentLanguage]);

  const handlePageChange = (page: number) => {
    searchMovies(query, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center justify-center">
          <Search className="h-8 w-8 mr-3 text-red-500" />
          Search Results
        </h1>
        {query && (
          <div className="text-slate-400">
            {loading ? (
              <p>Searching for "{query}"...</p>
            ) : (
              <p>
                {totalResults === 0 
                  ? `No results found for "${query}"` 
                  : `Found ${totalResults.toLocaleString()} result${totalResults === 1 ? '' : 's'} for "${query}"`
                }
              </p>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {!query ? (
        <div className="text-center py-16">
          <Search className="h-24 w-24 mx-auto text-slate-600 mb-6" />
          <h2 className="text-2xl font-semibold text-white mb-4">No search query</h2>
          <p className="text-slate-400 mb-8">
            Use the search bar in the navigation to find movies.
          </p>
          <Link href="/">
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              Browse Movies
            </Button>
          </Link>
        </div>
      ) : loading ? (
        <LoadingSpinner size="lg" />
      ) : error ? (
        <div className="text-center py-12">
          <Search className="h-16 w-16 mx-auto text-slate-600 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Search failed</h2>
          <p className="text-slate-400 mb-4">{error}</p>
          <Button
            onClick={() => searchMovies(query, currentPage)}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Try Again
          </Button>
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-16">
          <Search className="h-24 w-24 mx-auto text-slate-600 mb-6" />
          <h2 className="text-2xl font-semibold text-white mb-4">No movies found</h2>
          <p className="text-slate-400 mb-8">
            Try searching with different keywords or check your spelling.
          </p>
          <Link href="/">
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              Browse Popular Movies
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <MovieGrid movies={movies} showOverview={true} />
          
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