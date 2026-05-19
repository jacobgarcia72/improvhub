'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Button from './button';

export default function ImagePicker({ label = 'Image', name = 'image' }: {
    label?: string;
    name?: string;
}) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const imageInput = useRef<HTMLInputElement | null>(null);

    function handlePickImage() {
        if (imageInput.current) {
            imageInput.current.click();
        }
    }

    function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError('Image file size exceeds 5MB limit');
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setSelectedImage(null);
        }
    }

    return (
        <div className='flex flex-col'>
            <label htmlFor={name}>{label}</label>
            {selectedImage && <div className='mb-2'>
                <Image src={selectedImage} alt="Selected image" width={500} height={500} />
            </div>}
            <input
                className='hidden'
                type='file'
                id={name}
                accept='image/png, image/jpeg'
                name={name}
                ref={imageInput}
                onChange={handleImageChange}
            />
            <Button type="button" caption={!selectedImage ?  "Pick Image" : "Change Image"} onClick={handlePickImage} />
            {error && <p className='text-red-600'>{error}</p>}
        </div>
    )
}
