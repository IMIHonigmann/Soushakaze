import { gsap } from 'gsap';
import { useEffect, useRef, useState } from 'react';

interface CountProps {
    from: number;
    to: number;
    duration?: number;
    delay?: number;
    format?: (n: number) => string;
    className?: string;
}

export default function Count({ from, to, duration = 0.3, delay = duration / 3, format = (n) => String(Math.round(n)), className }: CountProps) {
    const obj = useRef({ v: from });
    const divRef = useRef(null);
    const [value, setValue] = useState(from);

    useEffect(() => {
        obj.current.v = from;
        const tl = gsap.timeline();
        tl.to(obj.current, {
            v: to,
            duration: duration - delay,
            ease: 'power1.out',
            onUpdate: () => setValue(obj.current.v),
            delay,
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
                duration,
                ease: 'power4.out',
                yoyo: true,
                repeat: 1,
            },
            0,
        )
            .to(
                divRef.current,
                {
                    color: to - from >= 0 ? '#a3e635' : '#e72832',
                    duration: duration - delay * 2,
                    ease: 'power2.out',
                    yoyo: true,
                    repeat: 1,
                },
                delay,
            )
            .to(
                divRef.current,
                {
                    y: Math.max(Math.min(-1 * (to - from) * 0.125, 10), -10),
                    duration: ((duration - delay) / (delay > 0 ? 3 : 2)) * 0.5,
                    ease: 'sine.out',
                    yoyoEase: true,
                    yoyo: true,
                    repeat: 5,
                },
                delay,
            );
        return () => {
            tl.kill();
        };
    }, [from, to, duration, delay]);

    return (
        <div ref={divRef} className={`-skew-x-12 text-3xl ${className}`}>
            {format(value)}€
        </div>
    );
}
