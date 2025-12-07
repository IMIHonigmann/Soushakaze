import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { FaCamera } from 'react-icons/fa';
import Navbar from './Navbar';

type User = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
};

type Props = {
    user: User;
};

export default function Profile({ user }: Props) {
    const tabs = [
        'Overview',
        'Orders',
        'Loyalty programmes',
        'Soushakaze Kesommak',
        'Return an item',
        'Returns',
        'Sell back items',
        'Try now',
        'Personal details',
        'Addresses',
        'Gift Cards',
        'Newsletters',
    ];
    const [tab, setTab] = useState('overview');
    return (
        <>
            <Navbar />
            <main className="grid grid-cols-[20%_80%] gap-8">
                <nav>
                    <div className="mb-6">
                        <h3 className="mb-2 text-lg font-bold">Your account</h3>
                        <ul className="ml-4 space-y-1">
                            {tabs.map((tab, index) => (
                                <li className="hover:bg-zinc-800" key={index} id={tab.toLowerCase()}>
                                    <Link className="block h-full w-full" href={tab}>
                                        {tab}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="mb-6">
                        <h3 className="mb-2 text-lg font-bold">Items you own</h3>
                        <ul className="ml-4 space-y-1">
                            <li>Fashion</li>
                            <li>Beauty</li>
                        </ul>
                    </div>
                    <div className="mb-6">
                        <h3 className="mb-2 text-lg font-bold">Make it yours</h3>
                        <ul className="ml-4 space-y-1">
                            <li>Your sizes</li>
                            <li>Your brands</li>
                            <li>Your creators</li>
                        </ul>
                    </div>
                    <div className="mb-6">
                        <h3 className="mb-2 text-lg font-bold">More</h3>
                        <ul className="ml-4 space-y-1">
                            <li>Help & FAQ</li>
                        </ul>
                    </div>
                    <div className="mb-6">
                        <h3 className="mb-2 text-lg font-bold">Data and privacy</h3>
                        <ul className="ml-4 space-y-1">
                            <li>Recommendation preferences</li>
                            <li>Request or delete data</li>
                        </ul>
                    </div>
                </nav>
                <div>
                    <h2>Welcome back {user.name}</h2>
                    <span className="inline-block rounded-full border-2 p-8">
                        <FaCamera />
                    </span>
                    <li className="mb-5">
                        <strong>Joined in:</strong> {new Date(user.created_at).toLocaleDateString()}
                    </li>
                    <ul>
                        <li>
                            <strong>Email:</strong> {user.email}
                        </li>
                        <li>
                            <strong>Email Verified At:</strong> {user.email_verified_at ?? 'Not verified'}
                        </li>
                    </ul>
                </div>
            </main>
        </>
    );
}
