import { optimizeImage } from "@/lib/optimize-image";
import { getCurrentUser } from "@/lib/users";
import Image from "next/image";

export default async function ProfileImage() {
    const user = await getCurrentUser();
    let imageSource = '/icons/profile-image.png';
    if (user?.image) {
        imageSource = optimizeImage(user.image, 72, 72, 80, true, true);
    }
    return (
        <Image
            src={imageSource}
            alt={'Profile image'}
            width={28} height={28}
            className="rounded-full width-[26px] height-[26px] object-fill"
        />
    )
}