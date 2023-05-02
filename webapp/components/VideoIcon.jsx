import videoIcon from "../public/images/video-icon.png";
import Image from "next/legacy/image";

export function VideoIcon() {
    return <Image src={videoIcon} alt={'videoIcon'} className='video-icon' width={32} height={32} />;
}
