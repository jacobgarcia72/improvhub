import { getCurrentUser } from "@/lib/users";
import Image from "next/image";

export default async function ProfileImage() {
    const user = await getCurrentUser();
    let imageSource = '/icons/profile-image.png';
    if (user?.image) {
        imageSource = user.image.split('upload/').join('upload/c_thumb,g_face,h_226,w_226,q_60/');
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