interface ContextMenuProps {
    className?: string;
    x: number;
    y: number;
    actionFunctions: Record<string, (() => void) | -1>;
}

export default function ContextMenu({ className, x, y, actionFunctions }: ContextMenuProps) {
    return (
        <ul
            className={`fixed divide-y-2 divide-zinc-500 bg-zinc-950 p-2 *:first:rounded-t-md *:last:rounded-b-md ${className}`}
            style={{ left: `${x}px`, top: `${y}px` }}
        >
            {Object.entries(actionFunctions).map(([option, callback]) => (
                <li
                    className={`${typeof callback === 'number' && callback === -1 ? 'pointer-events-none opacity-50' : ''} p-2 hover:bg-zinc-500`}
                    key={option}
                    onClick={() => {
                        if (typeof callback === 'function') callback();
                    }}
                >
                    <button>{option}</button>
                </li>
            ))}
        </ul>
    );
}
