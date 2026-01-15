import React from 'react';
import { Star } from 'lucide-react';

const StoreCard = ({ store, onRate }) => {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
      <h3 className="text-xl font-bold mb-2">{store.name}</h3>
      <p className="text-gray-600 mb-2">{store.category}</p>
      <p className="text-sm text-gray-500 mb-3">{store.address}</p>
      <p className="text-sm mb-4">{store.description}</p>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          {renderStars(store.averageRating)}
          <span className="ml-2 text-sm text-gray-600">
            {store.averageRating.toFixed(1)} ({store.totalRatings} reviews)
          </span>
        </div>
      </div>
      <button
        onClick={() => onRate(store)}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Rate Store
      </button>
    </div>
  );
};

export default StoreCard;