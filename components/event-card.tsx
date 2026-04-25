import { Event } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const ShowCard: React.FC<{ event: Event }> = ({ event }) => {
  return (
    <Link href={event.id}>
      <div className="border rounded p-4 mb-4">
        <div className="flex flex-row">
          <Image src={event.imageUrl || ''} alt={event.title} />
          <div>
            <h2 className="text-xl font-bold mb-2">{event.title}</h2>
            <p className="text-gray-600 mb-1">{event.date} at {event.time}</p>
            <p className="text-gray-800">{event.description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ShowCard;
