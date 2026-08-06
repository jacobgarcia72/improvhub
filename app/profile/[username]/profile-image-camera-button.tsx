'use client';

import { updateUserCoverImage, updateUserProfileImage } from "@/actions/auth-actions";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function ProfileImageCameraButton({ type, action = 'Change' }: { type: 'profile' | 'cover', action?: 'Add' | 'Change' }) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const formRef = useRef<HTMLFormElement | null>(null);
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const [error, setError] = useState('');

    const inputName = type === 'profile' ? 'image' : 'coverImage';
    const label = type === 'profile' ? 'profile picture' : 'cover photo';

    async function handleSubmit(formData: FormData) {
        setPending(true);
        setError('');
        const result = type === 'profile'
            ? await updateUserProfileImage(formData)
            : await updateUserCoverImage(formData);
        setPending(false);
        if (result?.message) {
            setError(result.message);
            return;
        }
        router.refresh();
    }

    return (
        <form action={handleSubmit} ref={formRef} className={`absolute ${type === 'profile' ? 'right-1 top-1' : 'right-2 top-2'} z-10`}>
            <input
                className="hidden"
                type="file"
                accept="image/png, image/jpeg"
                name={inputName}
                ref={inputRef}
                onChange={() => formRef.current?.requestSubmit()}
            />
            <button
                type="button"
                disabled={pending}
                onClick={() => inputRef.current?.click()}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white shadow transition-colors hover:bg-black/80 disabled:bg-gray-500 focus:outline-none focus:ring-1.5 focus:ring-white focus:ring-offset-1.5 focus:ring-offset-black"
                aria-label={`${action} ${label}`}
                title={`${action} ${label}`}
            >
                <FontAwesomeIcon icon={faCamera} />
            </button>
            {error ? <p className="absolute right-0 mt-1 w-56 rounded bg-red-700 px-2 py-1 text-xs text-white shadow">{error}</p> : null}
        </form>
    );
}
