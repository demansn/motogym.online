import {VideoIcon} from "./VideoIcon";

export function VideoLink({href}) {
    return (
        <a href={href} target="_blank" rel="noreferrer">
            <VideoIcon />
        </a>
    );
}