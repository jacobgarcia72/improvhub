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
            width={30} height={30}
            className="rounded-full width-[30px] height-[30px] object-fill border-1 border-black shadow-sm shadow-black transition-all duration-200 group-hover:scale-110"
        />
    )
}