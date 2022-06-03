import Image from "next/image";

export function ResponsiveImage({src, alt = 'ResponsiveImage'}) {
    return (
        <div className={'image-container'}>
            <Image src={src} alt={alt} className={'image'} layout={"fill"} />
        </div>
    );
}