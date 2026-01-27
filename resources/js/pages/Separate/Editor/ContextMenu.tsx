interface ContextMenuProps {
    className?: string;
    x: number;
    y: number;
    actionFunctions: Record<string, (() => void) | -1> | null;
}

export default function ContextMenu({ className, x, y, actionFunctions }: ContextMenuProps) {
    return (
        <ul
            className={`fixed divide-y-2 divide-zinc-500 border-dashed bg-zinc-950 p-2 select-none *:first:rounded-t-md *:last:rounded-b-md ${className}`}
            style={{ left: `${x}px`, top: `${y}px` }}
        >
            {Object.entries(actionFunctions ?? {}).map(([option, callback]) => (
                <li
                    className={`${typeof callback === 'number' && callback === -1 ? 'pointer-events-none opacity-50' : ''} cursor-pointer p-2 hover:bg-zinc-500`}
                    key={option}
                    onClick={() => {
                        if (typeof callback === 'function') callback();
                    }}
                >
                    {option}
                </li>
            ))}
        </ul>
    );
}
