import { Link } from '@inertiajs/react';
import { gsap } from 'gsap';
import { useEffect, useRef, useState } from 'react';
import Navbar from './Navbar';

export default function FrontPage() {
    const textRef = useRef(null);
    const [word, setWord] = useState('Flag');

    useEffect(() => {
        const words = ['Gun', 'Attachment', 'Match', 'Flag'];
        let index = 0;

        const interval = setInterval(() => {
            gsap.to(textRef.current, {
                opacity: 0,
                y: -20,
                scaleY: 0.9,
                duration: 0.4,
                ease: 'power2.out',
                onComplete: () => {
                    index = (index + 1) % words.length;
                    setWord(words[index]);

                    gsap.set(textRef.current, { y: 20 });
                    gsap.to(textRef.current, {
                        opacity: 1,
                        y: 0,
                        scaleY: 1,
                        duration: 0.5,
                        ease: 'power2.out',
                    });
                },
            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <h1 className="bg-zinc-900 p-1 text-center">
                Sign up and fully top up your weapon with no extra cost{' '}
                <Link href={route('register')} className="text-blue-300 underline transition-colors hover:text-blue-500">
                    Sign Up Now
                </Link>
            </h1>
            <main className="mx-32">
                <header>
                    <Navbar />
                </header>
                <div className="mt-16 grid grid-cols-2">
                    <div>
                        <section className="flex flex-col place-items-start gap-8">
                            <h2 className="text-7xl font-extrabold">
                                Winning the CTF One{' '}
                                <strong ref={textRef} className="changing-word">
                                    {word}
                                </strong>{' '}
                                At A Time
                            </h2>
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
                    <div className="place-self-center">Image</div>
                </div>
            </main>
            <div className="flex justify-between bg-zinc-800 p-8">
                {Array.from({ length: 10 }, (_, i) => (
                    <div key={i}>Element {i + 1}</div>
                ))}
            </div>
        </>
    );
}
