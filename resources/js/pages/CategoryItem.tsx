import { useEffect, useRef, useState } from 'react';
import { MdNavigateNext } from 'react-icons/md';

type Props = {
    label: string;
    children: React.ReactNode;
};

export default function CategoryItem({ label, children }: Props) {
    const [open, setOpen] = useState(false);
    const contentRef = useRef<HTMLUListElement | null>(null);
    const [measuredHeight, setMeasuredHeight] = useState(0);

    useEffect(() => {
        if (!contentRef.current) return;
        requestAnimationFrame(() => {
            const h = contentRef.current?.scrollHeight ?? 0;
            setMeasuredHeight(h);
        });
    }, []);

    return (
        <li>
            <button
                type="button"
                className="flex w-full -skew-x-12 items-center justify-between border-2 p-2"
                aria-expanded={open}
                onClick={() => setOpen((p) => !p)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setOpen((p) => !p);
                    }
                }}
            >
                <span>{label}</span>
                <MdNavigateNext className={`text-2xl transition-transform ${open ? 'rotate-90' : ''}`} />
            </button>
            <ul
                ref={contentRef}
                aira-hidden={`"${!open}"`}
                style={{
                    height: open ? `${measuredHeight}px` : '0px',
                }}
                className={`-skew-x-12 overflow-hidden transition-all ${open ? 'border-2' : ''} transition-[height] duration-220 ease-out`}
            >
                {children}
            </ul>
        </li>
    );
}
