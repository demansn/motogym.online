import {T} from "./T";

export function TextWithTitle({text, title}) {
    if (!text) {
        return null;
    }

    return (
        <span >
            <div className="h5 text-muted textWithTitle-title">
                <T >{title}</T>
            </div>
            <div className="h3 textWithTitle-text">{text}</div>
        </ span>
    );
}