import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const movieId = parseInt(id);
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (isNaN(movieId)) {
      return NextResponse.json(
        { error: 'Invalid movie ID' },
        { status: 400 }
      );
    }

    // Delete the movie in a single query (faster - avoids extra round-trip)
    const deleted = await prisma.movie.deleteMany({
      where: { 
        id: movieId,
        userId: parseInt(userId)
      }
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: 'Movie not found or you do not have permission to delete it' },
        { status: 404 }
      );
    }

    // Log the deletion to terminal
    console.log('Movie deleted:', {
      id: movieId,
      userId: parseInt(userId)
    });

    return NextResponse.json({
      message: 'Movie deleted successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Delete movie error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}