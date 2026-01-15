import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { ratingAPI } from '../../services/api';

const RatingForm = ({ store, onSuccess, onCancel }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      setError('');
      await ratingAPI.create({
        storeId: store._id,
        rating,
        comment
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rating');
    }
  };

  return (
    <div className="space-y-4">
      <p className="font-semibold">{store?.name}</p>
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      <div>
        <label className="block mb-2">Your Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => setRating(star)}>
              <Star
                size={32}
                className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
              />
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block mb-2">Your Review</label>
        <textarea
          className="w-full p-3 border rounded"
          rows="4"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          className="flex-1 bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
        >
          Submit Rating
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-700 p-3 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RatingForm;