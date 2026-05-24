import { optimizeImage } from "@/lib/cloudinary";
import { getCurrentUser } from "@/lib/users";
import Image from "next/image";

export default async function ProfileImage() {
    const user = await getCurrentUser();
    let imageSource = '/icons/profile-image.png';
    if (user?.image) {
        imageSource = optimizeImage(user.image, 26, 26, 60, true);
    }
    return (
        <Image
            src={imageSource}
            alt={'Profile image'}
            width={26} height={26}
            className="rounded-full width-[26px] height-[26px] object-fill"
        />
    )
}