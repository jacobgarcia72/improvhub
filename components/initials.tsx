export default function Initials({ firstName, lastName, width, rounded }: { firstName: string, lastName: string, width: number, rounded?: boolean }) {
    const initials = firstName[0] + lastName[0];
    let fontSize = 'md';
    if (width < 32) {
        fontSize = 'xs';
    } else if (width < 36) {
        fontSize = 'sm';
    } else if (width < 48) {
        fontSize = 'md';
    } else if (width < 64) {
        fontSize = 'lg';
    } else if (width < 96) {
        fontSize = 'xl';
    } else if (width < 120) {
        fontSize = '2xl';
    }
    return (
        <div style={{height: `${width}px`, width: `${width}px`}} className={`bg-indigo-800/60 flex justify-center items-center align-center ${rounded ? 'rounded-full' : 'rounded'} h-[${width}px] w-[${width}px] `}>
            <div className={`text-${fontSize} text-white font-light`}>{initials}</div>
        </div>
    )
}