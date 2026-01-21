interface ContextMenuProps {
    className?: string;
    x: number;
    y: number;
    actionFunctions: Record<string, () => void>;
}

export default function ContextMenu({ className, x, y, actionFunctions }: ContextMenuProps) {
    return (
        <ul className={`fixed bg-purple-950 p-4 ${className}`} style={{ left: `${x}px`, top: `${y}px` }}>
            {Object.entries(actionFunctions).map(([option, callback]) => (
                <li
                    key={option}
                    onClick={() => {
                        callback();
                    }}
                >
                    <button>{option}</button>
                </li>
            ))}
        </ul>
    );
}
