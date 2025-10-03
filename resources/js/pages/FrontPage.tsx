import Navbar from './Navbar';

type Props = {};

export default function FrontPage({}: Props) {
    return (
        <>
            <main className="mx-32">
                <div className="grid grid-cols-2">
                    <div>
                        <header>
                            <h1>
                                Sign up and fully top up your weapon with no extra cost{' '}
                                <a href="#" className="text-blue-300 underline">
                                    Sign Up Now
                                </a>
                            </h1>
                            <Navbar />
                        </header>
                        <section>
                            <h2>Winning the CTF One Flag At A Time, One Attachment At A Time</h2>
                            <p>
                                Browse through our diverse range of meticulously crafted guns, designed to bring out your personality and cater to
                                your playstyle.
                            </p>
                            <button>Shop Now</button>
                        </section>
                        <ul className="mt-8 flex gap-4">
                            <li>200+ International Brands</li>
                            <li>2,000+ Quality Guns</li>
                            <li>30,000+ Happy Customers</li>
                        </ul>
                    </div>
                    <div>Image</div>
                </div>
            </main>
            <div className="flex justify-between bg-zinc-800 p-8">
                {Array.from({ length: 10 }, (_, i) => (
                    <div key={i}>Element 2{i + 1}</div>
                ))}
            </div>
        </>
    );
}
