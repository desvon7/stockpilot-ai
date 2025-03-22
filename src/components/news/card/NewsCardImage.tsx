
import React from 'react';

interface NewsCardImageProps {
  imageUrl?: string;
  title: string;
  compact?: boolean;
}

const NewsCardImage: React.FC<NewsCardImageProps> = ({ imageUrl, title, compact = false }) => {
  if (!imageUrl) return null;

  if (compact) {
    return (
      <div className="h-16 w-16 rounded overflow-hidden shrink-0">
        <img 
          src={imageUrl} 
          alt="" 
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
    );
  }

  return (
    <div className="h-48 overflow-hidden">
      <img 
        src={imageUrl} 
        alt={title} 
        className="w-full h-full object-cover transition-transform hover:scale-105"
        onError={(e) => {
          // Hide image container if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          if (target.parentElement) {
            target.parentElement.style.display = 'none';
          }
        }}
      />
    </div>
  );
};

export default NewsCardImage;
