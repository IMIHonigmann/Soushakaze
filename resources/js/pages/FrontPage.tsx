import { Link } from '@inertiajs/react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useEffect, useRef, useState } from 'react';
import Layout from './layouts/MainLayout';

gsap.registerPlugin(SplitText);

export default function FrontPage() {
    const wordRef = useRef<HTMLElement | null>(null);
    const kanjiRef = useRef<HTMLElement | null>(null);
    const textRef = useRef<HTMLHeadingElement | null>(null);
    const [index, setIndex] = useState(0);
    const wordValues = [
        { word: 'Gun', color: '#ff3b30', kanji: '銃' },
        { word: 'Attachment', color: '#af52de', kanji: '装備' },
        { word: 'Flag', color: '#ffcc00', kanji: '旗' },
        { word: 'Match', color: '#50d71e', kanji: '勝負' },
    ];

    useEffect(() => {
        const split = SplitText.create(textRef.current, { type: 'words,lines', mask: 'lines' });

        gsap.from(split.lines, {
            rotationX: -100,
            transformOrigin: '50% 50% -160px',
            opacity: 0,
            duration: 0.8,
            ease: 'power3',
            stagger: 0.25,
            onComplete: () => {
                textRef.current!.classList.remove('overflow-hidden');
            },
        });

        const interval = setInterval(() => {
            gsap.to([wordRef.current, kanjiRef.current], {
                opacity: 0,
                y: -20,
                scaleY: 0.9,
                duration: 0.4,
                ease: 'power2.out',
                onComplete: () => {
                    setIndex((prev) => (prev + 1) % wordValues.length);

                    gsap.set([wordRef.current, kanjiRef.current], { y: 20 });
                    gsap.to([wordRef.current, kanjiRef.current], {
                        opacity: 1,
                        y: 0,
                        scaleY: 1,
                        duration: 0.5,
                        ease: 'power2.out',
                    });
                },
            });
        }, 3000);

        return () => {
            clearInterval(interval);
            split.revert();
        };
    }, [wordValues.length]);

    return (
        <>
            <h1 className="bg-zinc-900 p-1 text-center">
                Sign up and fully top up your weapon with no extra cost{' '}
                <Link href={route('register')} className="text-blue-300 underline transition-colors hover:text-blue-500">
                    Sign Up Now
                </Link>
            </h1>
            <Layout>
                <div className="mt-16 grid grid-cols-[60%_40%]">
                    <div>
                        <section className="flex flex-col place-items-start gap-8">
                            <h3 ref={textRef} className="overflow-hidden text-8xl leading-32 font-extrabold">
                                Winning the CTF One{' '}
                                <span className="relative inline-block">
                                    <span
                                        style={{
                                            color: wordValues[index].color + '1a',
                                        }}
                                        className="absolute inset-0 -z-10 flex w-auto items-center justify-center text-center text-9xl tracking-widest whitespace-nowrap"
                                        ref={kanjiRef}
                                    >
                                        {wordValues[index].kanji}
                                    </span>
                                    <strong ref={wordRef} className="changing-word text-[#50d71e]" style={{ color: wordValues[index].color }}>
                                        {wordValues[index].word}
                                    </strong>
                                </span>{' '}
                                At A Time
                            </h3>
                            <p className="text-lg opacity-75">
                                Browse through our diverse range of meticulously crafted guns, designed to bring out your personality and cater to
                                your playstyle.
                            </p>
                            <Link
                                href={route('queried-products')}
                                className="ml-4 rounded-full bg-zinc-800 px-12 py-3 transition-colors hover:bg-zinc-900"
                            >
                                Shop Now
                            </Link>
                        </section>
                        <ul className="mt-8 mb-24 flex items-center justify-center justify-items-center divide-x divide-zinc-700 text-4xl [&>*]:px-16">
                            <li>
                                <div>200+</div>
                                <div className="text-sm">International Brands</div>
                            </li>
                            <li>
                                <div>2,000+</div>
                                <div className="text-sm">Quality Guns</div>
                            </li>
                            <li>
                                <div>30,000+</div>
                                <div className="text-sm">Happy Customers</div>
                            </li>
                        </ul>
                    </div>
                    <img
                        src="/goofy-ahh-apple.gif"
                        alt="Hero Image"
                        className="fade-in-image w-full place-self-center transition-all duration-2000 ease-in-out hover:translate-y-96 hover:scale-[600%]"
                    />
                </div>
            </Layout>

            <div className="flex justify-between bg-zinc-800 p-8">
                {Array.from({ length: 10 }, (_, i) => (
                    <div key={i}>Element {i + 1}</div>
                ))}
            </div>
        </>
    );
}
