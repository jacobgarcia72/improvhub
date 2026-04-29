import { Event } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const ShowCard: React.FC<{ event: Event, href?: string }> = ({ event, href }) => {
  return (
    <Link href={href || event.id} className="mb-4">
      <div className="h-40 border rounded border-gray-300 shadow-md">
        <div className="flex flex-row h-full">
          <div className="w-48 h-full">
            {event.imageUrl ? (
              <Image src={event.imageUrl} alt={event.title} />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
          </div>
          <div className="p-4 w-full">
            <h2 className="text-xl">{event.title}</h2>
            <p className="text-gray-600 mb-1">{event.date} at {event.time}</p>
            <p className="text-gray-800">{event.description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ShowCard;
