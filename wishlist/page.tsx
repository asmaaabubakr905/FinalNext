'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ArrowLeft } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import MovieGrid from '@/components/MovieGrid';
import { Button } from '@/components/ui/button';

export default function WishlistPage() {
  const { wishlist, wishlistCount } = useWishlist();

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/" className="inline-block mb-4">
            <Button variant="outline" className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Movies
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center">
            <Heart className="h-8 w-8 mr-3 text-red-500 fill-current" />
            My Wishlist
          </h1>
          <p className="text-slate-400 mt-2">
            {wishlistCount === 0 
              ? 'Your wishlist is empty' 
              : `${wishlistCount} movie${wishlistCount === 1 ? '' : 's'} in your wishlist`
            }
          </p>
        </div>
      </div>

      {/* Wishlist Content */}
      {wishlist.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-24 w-24 mx-auto text-slate-600 mb-6" />
          <h2 className="text-2xl font-semibold text-white mb-4">Your wishlist is empty</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Start adding movies to your wishlist by clicking the heart icon on any movie card.
          </p>
          <Link href="/">
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              Browse Movies
            </Button>
          </Link>
        </div>
      ) : (
        <MovieGrid movies={wishlist} showOverview={true} />
      )}
    </div>
  );
}