import { useState } from 'react';

type CartItem = { weaponName: string; selectedAttachments: Record<string, number> };

export default function Cart() {
    const cartItem = localStorage.getItem('cart');
    const [cartArray, setCartArray] = useState<CartItem[]>(cartItem ? JSON.parse(cartItem) : []);

    return (
        <>
            {cartArray.length > 0 ? (
                <>
                    {cartArray.map((item, idx) => (
                        <div key={idx}>
                            {item.weaponName} <br />
                            {Object.entries(item.selectedAttachments).map(([area, id]) => (
                                <div key={area}>
                                    {area}: {id}
                                </div>
                            ))}
                            <br />
                        </div>
                    ))}
                    <button
                        onClick={() => {
                            localStorage.removeItem('cart');
                            setCartArray([]);
                        }}
                    >
                        {' '}
                        Delete all elements from cart
                    </button>
                </>
            ) : (
                <div className="flex h-full min-h-screen items-center justify-center">Cart is empty</div>
            )}
            <br />
        </>
    );
}
