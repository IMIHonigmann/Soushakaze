import { gsap } from 'gsap';
import { useEffect, useRef, useState } from 'react';

interface CountProps {
    from: number;
    to: number;
    duration?: number;
    format?: (n: number) => string;
}

export default function Count({ from, to, duration = 0.3, format = (n) => String(Math.round(n)) }: CountProps) {
    const obj = useRef({ v: from });
    const [value, setValue] = useState(from);

    useEffect(() => {
        obj.current.v = from;
        const tween = gsap.to(obj.current, {
            v: to,
            duration,
            ease: 'power1.out',
            onUpdate: () => setValue(obj.current.v),
        });
        return () => tween.kill();
    }, [from, to, duration]);

    return <span>{format(value)}</span>;
}
