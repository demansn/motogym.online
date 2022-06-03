import React from "react";
import {VideoIcon} from "./VideoIcon";

export function ResultVideo({video}) {
    return (
        <a href={video} target="_blank" rel="noreferrer">
            <VideoIcon />
        </a>
    );
}