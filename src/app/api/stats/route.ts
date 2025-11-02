import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Movie {
  id: number;
  title: string;
  genre: string;
  rating: number;
  watchDate: Date;
  createdAt: Date;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const userIdInt = parseInt(userId);

    // Get all user's movies
    const movies: Movie[] = await prisma.movie.findMany({
      where: { userId: userIdInt },
      select: {
        id: true,
        title: true,
        genre: true,
        rating: true,
        watchDate: true,
        createdAt: true
      }
    });

    // Calculate statistics
    const totalMovies = movies.length;
    
    const averageRating = totalMovies > 0 
      ? Math.round((movies.reduce((sum: number, movie: Movie) => sum + movie.rating, 0) / totalMovies) * 10) / 10
      : 0;

    // Find favorite genre (most watched)
    const genreCounts = movies.reduce((acc: Record<string, number>, movie: Movie) => {
      acc[movie.genre] = (acc[movie.genre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const favoriteGenre = Object.entries(genreCounts).length > 0
      ? Object.entries(genreCounts).sort(([,a], [,b]) => (b as number) - (a as number))[0]
      : null;

    // Get recent movies (last 5)
    const recentMovies = movies
      .sort((a: Movie, b: Movie) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    // Get this month's movies
    const currentMonth = new Date();
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const moviesThisMonth = movies.filter((movie: Movie) => 
      new Date(movie.createdAt) >= firstDayOfMonth
    ).length;

    // Get highest rated movie
    const highestRatedMovie = movies.length > 0
      ? movies.reduce((prev: Movie, current: Movie) => 
          (prev.rating > current.rating) ? prev : current
        )
      : null;

    // Genre distribution
    const genreDistribution = Object.entries(genreCounts)
      .map(([genre, count]) => ({ genre, count: count as number }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({
      stats: {
        totalMovies,
        averageRating,
        favoriteGenre: favoriteGenre ? {
          name: favoriteGenre[0],
          count: favoriteGenre[1]
        } : null,
        moviesThisMonth,
        highestRatedMovie,
        genreDistribution
      },
      recentMovies
    }, { status: 200 });

  } catch (error) {
    console.error('Fetch stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}