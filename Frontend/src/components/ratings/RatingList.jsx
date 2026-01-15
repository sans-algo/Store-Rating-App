import React from 'react';
import { Star } from 'lucide-react';

const RatingList = ({ ratings }) => {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  if (!ratings || ratings.length === 0) {
    return <p className="text-gray-500">No reviews yet</p>;
  }

  return (
    <div className="space-y-4">
      {ratings.map((rating) => (
        <div key={rating._id} className="border-b pb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{rating.userId?.username}</span>
              <div className="flex">{renderStars(rating.rating)}</div>
            </div>
            <span className="text-sm text-gray-500">
              {new Date(rating.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-700">{rating.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default RatingList;
