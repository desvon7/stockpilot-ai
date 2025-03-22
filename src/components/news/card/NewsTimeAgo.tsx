
import React from 'react';

interface NewsTimeAgoProps {
  publishedAt: string;
}

const NewsTimeAgo: React.FC<NewsTimeAgoProps> = ({ publishedAt }) => {
  const formattedDate = new Date(publishedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Calculate time ago for more user-friendly display
  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    // Less than a minute
    if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    }
    
    // Less than an hour
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }
    
    // Less than a day
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
    
    // Less than a week
    const days = Math.floor(hours / 24);
    if (days < 7) {
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
    
    // Default to formatted date
    return formattedDate;
  };

  return <span title={formattedDate}>{getTimeAgo(publishedAt)}</span>;
};

export default NewsTimeAgo;
