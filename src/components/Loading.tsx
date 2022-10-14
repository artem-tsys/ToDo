export function Loading({ isShow } : {isShow : boolean}): JSX.Element | null {
    if(!isShow) {
        return null;
    }
    return <div className='loading'>
        Loading ...
    </div>
}
