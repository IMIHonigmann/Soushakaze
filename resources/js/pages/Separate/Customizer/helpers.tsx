import React from 'react';
import { FaAngleDoubleUp } from 'react-icons/fa';
import { FaBoltLightning } from 'react-icons/fa6';
import { GiStarFormation } from 'react-icons/gi';

export function DynamicIcon({ children, className }: { children: React.ReactNode; className?: string }) {
    const childArray = React.Children.toArray(children).filter(Boolean);
    const childCount = childArray.length;
    return (
        <div className={`relative h-16 w-16 border-2 bg-black ${className}`}>
            <div
                className={`relative z-10 grid h-full w-full grid-cols-2 grid-rows-2 *:p-2 ${childCount === 2 ? 'place-items-center gap-0 p-2.5 text-5xl [&>*:first-child]:col-start-2 [&>*:last-child]:col-start-1 [&>*:last-child]:row-start-2' : childCount === 3 ? 'place-items-center p-2 text-5xl [&>*:last-child]:col-span-2 [&>*:last-child]:justify-self-center' : childCount === 4 ? 'place-items-center text-5xl' : 'text-6xl'}`}
            >
                {childCount >= 5 ? <GiStarFormation className="text-yellow-400 drop-shadow-[0_0_12px_rgba(255,215,0,0.8)]" /> : children}
            </div>
            <div className="absolute -right-0.5 bottom-0 z-20 rounded-full p-1">
                {childArray.length > 0 &&
                    childArray.length < 4 &&
                    (childArray[0] as any).props?.id !== 'factory_issue' &&
                    (childCount > 1 ? (
                        <FaAngleDoubleUp className="text-xl text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.9)]" />
                    ) : (
                        <FaBoltLightning className="text-xl text-yellow-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.9)]" />
                    ))}
            </div>
        </div>
    );
}
