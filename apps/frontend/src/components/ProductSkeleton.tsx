import React from "react";

const ProductSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="w-full h-36 sm:h-40 lg:h-48 bg-gray-200"></div>
      <div className="p-3 sm:p-4 min-h-[140px] sm:min-h-[160px] lg:min-h-[180px] flex flex-col">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1 sm:gap-2">
          <div className="flex-1">
            <div className="h-4 sm:h-5 lg:h-6 bg-gray-200 rounded mb-1"></div>
            <div className="h-4 sm:h-5 lg:h-6 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div className="w-16 h-4 bg-gray-200 rounded-full self-start"></div>
        </div>
        <div className="flex-1 mb-2 sm:mb-3">
          <div className="h-3 sm:h-4 bg-gray-200 rounded mb-1"></div>
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div className="mt-auto">
          <div className="h-6 sm:h-7 lg:h-8 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
