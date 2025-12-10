import { Link } from '@inertiajs/react';
import { useState } from 'react';
import Layout from './MainLayout';

export default function ProfileLayout({ children, className }: { children: React.ReactNode; className?: string }) {
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
        <Layout className="grid grid-cols-[20%_80%] gap-8">
            <nav>
                <div className="mb-6">
                    <h3 className="mb-2 text-lg font-bold">Your account</h3>
                    <ul className="ml-4 space-y-1">
                        {tabs.map((tab, index) => (
                            <li className="hover:bg-zinc-800" key={index} id={tab.toLowerCase()}>
                                <Link className="block h-full w-full" href={`/profile/${tab.toLowerCase()}`}>
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
            <main className={className}>{children}</main>
        </Layout>
    );
}
