import { playLower } from '@/pages/AttAudio';
import { state } from '@/stores/customizerProxy';
import { Area, Attachment } from '@/types/types';
import { useSnapshot } from 'valtio';
import { DynamicIcon } from './DynamicIcon';

export function AttachmentListElement({ area, att, children, sound }: { area: Area; att: Attachment; children?: React.ReactNode; sound?: string }) {
    const snap = useSnapshot(state);
    return (
        <li
            key={`attachment-${area}-${att.id}`}
            onClick={() => handleSelect(snap, area as Area, att, sound)}
            className="group relative cursor-pointer items-center overflow-hidden border border-transparent transition-shadow select-none hover:border-red-600 hover:shadow-[0_0_40px_rgba(249,115,22,0.9)]"
        >
            <div
                className={`absolute inset-0 bg-linear-to-l from-orange-500 to-transparent transition-opacity duration-200 ${snap.selected[area]?.id === att.id ? 'opacity-100' : 'opacity-0'}`}
            />
            <div className="absolute inset-0 bg-linear-to-l from-red-600 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
            <div className="pointer-events-none relative z-10 flex items-center gap-4">
                <DynamicIcon
                    className={`skew-x-3 transition-transform duration-150 ease-out group-hover:scale-105 ${snap.selected[area].id === att.id ? 'scale-110' : ''}`}
                >
                    {children}
                </DynamicIcon>
                <div className="text-xl">
                    <div className="leading-none">{att.name}</div>
                    {att.id !== 0 && <div className="-skew-x-12 text-lg font-extrabold">{att.price_modifier}€</div>}
                </div>
            </div>
        </li>
    );
}

const handleSelect = (snap: any, area: Area, attachment: Attachment, sound = 'select_attachment_subtle') => {
    if (snap.selected[area].id !== attachment.id) playLower(`/sounds/${sound}.mp3`);
    state.selected[area] = attachment;
    updateQueryParams(snap, area, attachment.id);
    state.currentAreaSelection = area;
};

const updateQueryParams = (snap: any, area: Area, attachmentId: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set(area, attachmentId.toString());
    window.history.replaceState({}, '', url);
};
