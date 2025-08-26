import { router } from '@inertiajs/react';
import { RefObject, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import { FaCartShopping, FaUser } from 'react-icons/fa6';

type Props = {
    formRef?: RefObject<HTMLFormElement | null>;
};
export default function Navbar({ formRef }: Props) {
    const searchInputRef = useRef<HTMLInputElement | null>(null);

    function getQueriedRoute() {
        if (formRef) {
            formRef.current?.requestSubmit();
            return;
        }
        const params: Record<string, string | number | string[]> = {
            name: searchInputRef.current?.value ?? '',
        };
        const options = {
            preserveState: true,
            preserveScroll: true,
        };
        router.get(route('queried-products'), params, options);
    }

    return (
        <div className="group">
            <div className="grid grid-cols-[1fr_2fr_3fr_auto] items-center gap-16 py-8 text-xl">
                <span onClick={() => router.get(route('queried-products'))} className="cursor-pointer text-4xl font-extrabold">
                    SOUSHA.KAZE
                </span>
                <div className="flex justify-between">
                    <span>Shop</span>
                    <span>On Sale</span>
                    <span>New Arrivals</span>
                    <span>Brands</span>
                </div>
                <div className="flex items-center justify-between gap-6">
                    <input
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                getQueriedRoute();
                            }
                        }}
                        ref={searchInputRef}
                        className="w-full rounded-4xl border-2 p-4"
                        placeholder="🔎 Search for weapons..."
                    />
                    <FaSearch
                        className="cursor-pointer text-4xl transition-[colors_transform] hover:scale-110 hover:text-lime-400"
                        onClick={() => getQueriedRoute()}
                    />
                </div>
                <div className="flex justify-between gap-6">
                    <FaCartShopping />
                    <FaUser />
                </div>
            </div>
            <div className="flex justify-center">
                <div className="mb-8 h-0.5 w-11/12 bg-gray-300 text-center opacity-50 transition-[width_opacity] group-hover:w-full group-hover:opacity-100" />
            </div>
        </div>
    );
}
