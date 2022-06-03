export function LineTitle({children}) {
    return (
        < >
            <hr className="lineTitle-line"/>
            <div className="lineTitle-title">{children}</div>
        </ >
    );
}