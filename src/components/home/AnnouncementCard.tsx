
import React from 'react';

interface AnnouncementCardProps {
  announcement: {
    date: string;
    title: string;
    content: string;
  };
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement }) => {
  return (
    <div className="flex p-4 border border-border rounded-lg mb-8 bg-amber-50">
      <div className="mr-4 bg-amber-200 text-center p-2 rounded-md w-16">
        <div className="text-lg font-bold">Mar</div>
        <div className="text-2xl font-bold">26</div>
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className="font-medium text-gray-600">{announcement.title}</h3>
          <button className="text-gray-400">✕</button>
        </div>
        <p className="text-sm mt-1">{announcement.content}</p>
        <button className="text-green-500 font-medium text-sm mt-2">Remind me</button>
      </div>
    </div>
  );
};

export default AnnouncementCard;
