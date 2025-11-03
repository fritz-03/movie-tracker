'use client';

import { useState } from 'react';

const GENRES = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 
  'Documentary', 'Drama', 'Fantasy', 'Horror', 'Mystery', 
  'Romance', 'Sci-Fi', 'Thriller', 'Western'
];

interface AddMovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMovieAdded: () => void;
  userId: number;
}

export default function AddMovieModal({ isOpen, onClose, onMovieAdded, userId }: AddMovieModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    rating: '',
    watchDate: '',
    imageUrl: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Reset form
        setFormData({
          title: '',
          genre: '',
          rating: '',
          watchDate: '',
          imageUrl: '',
          notes: ''
        });
        onMovieAdded(); // Refresh dashboard stats
        onClose(); // Close modal
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      genre: '',
      rating: '',
      watchDate: '',
      imageUrl: '',
      notes: ''
    });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">🎬 Add New Movie</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Required Fields Section */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📽️ Movie Details (Required)</h3>
            
            {/* Title */}
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Movie Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter the movie title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            {/* Genre and Rating Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-2">
                  Genre *
                </label>
                <select
                  id="genre"
                  name="genre"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.genre}
                  onChange={handleChange}
                >
                  <option value="">Select a genre</option>
                  {GENRES.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating (1-10) *
                </label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  min="1"
                  max="10"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="1-10"
                  value={formData.rating}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Watch Date */}
            <div className="mb-4">
              <label htmlFor="watchDate" className="block text-sm font-medium text-gray-700 mb-2">
                Watch Date *
              </label>
              <input
                type="date"
                id="watchDate"
                name="watchDate"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.watchDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Optional Fields Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🎭 Optional Details</h3>
            
            {/* Image URL */}
            <div className="mb-4">
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Movie Poster URL
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/poster.jpg"
                value={formData.imageUrl}
                onChange={handleChange}
              />
            </div>

            {/* Notes */}
            <div className="mb-4">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Personal Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Share your thoughts about the movie..."
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Movie'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}