import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const VALID_GENRES = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 
  'Documentary', 'Drama', 'Fantasy', 'Horror', 'Mystery', 
  'Romance', 'Sci-Fi', 'Thriller', 'Western'
];

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

    // Fetch user's movies
    const movies = await prisma.movie.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        genre: true,
        rating: true,
        watchDate: true,
        imageUrl: true,
        notes: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      movies,
      count: movies.length
    }, { status: 200 });

  } catch (error) {
    console.error('Fetch movies error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, genre, rating, watchDate, imageUrl, notes, userId } = await request.json();

    // Validation for required fields
    if (!title || !genre || !rating || !watchDate || !userId) {
      return NextResponse.json(
        { error: 'Title, genre, rating, watch date, and user ID are required' },
        { status: 400 }
      );
    }

    // Validate genre
    if (!VALID_GENRES.includes(genre)) {
      return NextResponse.json(
        { error: 'Invalid genre. Please select from the available options.' },
        { status: 400 }
      );
    }

    // Validate rating (1-10)
    const ratingNum = parseInt(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 10) {
      return NextResponse.json(
        { error: 'Rating must be a number between 1 and 10' },
        { status: 400 }
      );
    }

    // Validate watch date
    const watchDateObj = new Date(watchDate);
    if (isNaN(watchDateObj.getTime())) {
      return NextResponse.json(
        { error: 'Invalid watch date format' },
        { status: 400 }
      );
    }

    // Create movie
    const movie = await prisma.movie.create({
      data: {
        title: title.trim(),
        genre,
        rating: ratingNum,
        watchDate: watchDateObj,
        imageUrl: imageUrl?.trim() || null,
        notes: notes?.trim() || null,
        userId: parseInt(userId)
      },
      select: {
        id: true,
        title: true,
        genre: true,
        rating: true,
        watchDate: true,
        imageUrl: true,
        notes: true,
        createdAt: true,
        user: {
          select: {
            name: true
          }
        }
      }
    });

    // Log the new movie to terminal
    console.log('New movie added:', {
      id: movie.id,
      title: movie.title,
      genre: movie.genre,
      rating: movie.rating,
      user: movie.user.name
    });

    return NextResponse.json({
      message: 'Movie added successfully',
      movie
    }, { status: 201 });

  } catch (error) {
    console.error('Add movie error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}