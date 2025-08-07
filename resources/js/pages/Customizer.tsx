import { useState } from 'react';
import CustomizerScene from './CustomizerScene';

type Attachment = {
    id: number;
    name: string;
    area: string;
};

interface Props {
    weaponName: string;
    attachments: Attachment[];
}

export default function Customizer({ weaponName, attachments }: Props) {
    const grouped = attachments.reduce<Record<string, Attachment[]>>((acc, att) => {
        acc[att.area] = acc[att.area] || [];
        acc[att.area].push(att);
        return acc;
    }, {});

    const [selected, setSelected] = useState<Record<string, number>>(() => {
        const initial: Record<string, number> = {};
        Object.entries(grouped).forEach(([area, attachments]) => {
            // Default to first attachment's id in each area
            initial[area] = attachments[0]?.id ?? 0;
        });
        return initial;
    });

    const handleSelect = (area: string, id: number) => {
        setSelected((prev) => ({
            ...prev,
            [area]: id,
        }));
    };

    return (
        <>
            <CustomizerScene />
            <div className="text-5xl">{weaponName}</div>
            <div className="flex justify-center">
                <div className="absolute bottom-10 flex justify-center gap-8">
                    {Object.entries(grouped).map(([area, attachments]) => (
                        <div key={area}>
                            <strong>{area}</strong>
                            <ul>
                                <li
                                    key={`standard-${area}`}
                                    style={{
                                        fontWeight: selected[area] === 0 ? 'bold' : 'normal',
                                        background: selected[area] === 0 ? '#FF0000' : 'transparent',
                                    }}
                                    onClick={() => handleSelect(area, 0)}
                                    className="cursor-pointer"
                                >
                                    Factory issue
                                </li>
                                {attachments.map((a) => (
                                    <li
                                        key={a.id}
                                        style={{
                                            fontWeight: selected[area] === a.id ? 'bold' : 'normal',
                                            background: selected[area] === a.id ? '#FF0000' : 'transparent',
                                        }}
                                        onClick={() => handleSelect(area, a.id)}
                                        className="cursor-pointer"
                                    >
                                        {a.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
