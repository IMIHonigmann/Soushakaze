type Props = {};

export default function Cart({}: Props) {
    const cartItem = localStorage.getItem('cart');
    const cartObject: { weaponName: string; selectedAttachments: Record<string, number> } = cartItem ? JSON.parse(cartItem) : null;
    return (
        <>
            <div>{cartObject.weaponName}</div>
            <div>
                {Object.entries(cartObject.selectedAttachments).map(([area, id]) => (
                    <div key={id}>
                        {area}: {id}
                    </div>
                ))}
            </div>
        </>
    );
}
