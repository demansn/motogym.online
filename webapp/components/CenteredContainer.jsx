
export function CenteredContainer({children}) {
    return (
        <div className='row h-75 justify-content-center align-items-center'>
            <div className="col-12 text-center">
                {children}
            </div>
        </div>
    );
}