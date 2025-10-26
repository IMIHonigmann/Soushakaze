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
    const divRef = useRef(null);
    const [value, setValue] = useState(from);

    useEffect(() => {
        obj.current.v = from;
        const tl = gsap.timeline();
        tl.to(obj.current, {
            v: to,
            duration,
            ease: 'power1.out',
            onUpdate: () => setValue(obj.current.v),
        });
        tl.fromTo(
            divRef.current,
            {
                scale: 1,
                transformOrigin: '0% 0%',
                color: '#ffffff',
            },
            {
                scale: 1.5,
                transformOrigin: '0% 0%',
                color: '#a3e635',
                duration,
                ease: 'power4.out',
                yoyo: true,
                repeat: 1,
            },
            0,
        );
        return () => {
            tl.kill();
        };
    }, [from, to, duration]);

    return (
        <div ref={divRef} className="-skew-x-12 text-3xl">
            {format(value)}€
        </div>
    );
}
