import { useState } from 'react';

export default function Customizer() {
    const [selected, setSelected] = useState(0);
    return (
        <>
            <ul>
                {['None (Ironsights)', 'Red Dot Sight', 'Holographic Sight', 'ACOG Scope'].map((option, idx) => {
                    return (
                        <li
                            key={option}
                            className="cursor-pointer"
                            style={{
                                fontWeight: selected === idx ? 'bold' : 'normal',
                                background: selected === idx ? '#FF0000' : 'transparent',
                            }}
                            onClick={() => setSelected(idx)}
                        >
                            {option}
                        </li>
                    );
                })}
            </ul>
        </>
    );
}
