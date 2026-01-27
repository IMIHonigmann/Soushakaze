import { Area, Attachment } from '@/types/types';

type Props = {
    editFormData: {
        Fields: string[];
        ButtonName: string;
        EditTarget: 'area' | 'attachment';
        targetName?: string;
    } | null;
    attachments: Record<string, Attachment[]>;
    setEditFormData: React.Dispatch<React.SetStateAction<any>>;
};

export default function EditForm({ editFormData, setEditFormData, attachments }: Props) {
    return (
        <div
            onClick={() => {
                setEditFormData(null);
            }}
            className="absolute flex h-screen w-screen items-center justify-center bg-black/75"
        >
            <form
                onSubmit={(e) => {
                    const formData = new FormData(e.currentTarget);

                    e.preventDefault();
                    if (editFormData?.EditTarget === 'area') {
                        return;
                    }
                    if (editFormData?.EditTarget === 'attachment') {
                        const areaKey = formData.get('Area') as string;

                        const newAttachment: Attachment = {
                            id: -1,
                            seller_id: null,
                            manufacturer_id: null,
                            name: formData.get('Attachment Name') as string,
                            price_modifier: formData.get('Price Modifier') as unknown as number,
                            area: formData.get('Area') as Area,
                            image_blob: null,
                            power_modifier: parseInt(formData.get('Power Modifier')) as unknown as number,
                            accuracy_modifier: parseInt(formData.get('Accuracy Modifier')) as unknown as number,
                            mobility_modifier: parseInt(formData.get('Mobility Modifier')) as unknown as number,
                            handling_modifier: parseInt(formData.get('Handling Modifier')) as unknown as number,
                            magsize_modifier: parseInt(formData.get('Magsize Modifier')) as unknown as number,
                        };

                        if (editFormData?.targetName) {
                            const elementIndexToEdit = attachments[areaKey].findIndex((att) => att.name === editFormData?.targetName);
                            newAttachment.id = attachments[areaKey][elementIndexToEdit].id;
                            attachments[areaKey][elementIndexToEdit] = newAttachment;
                        }
                        if (!editFormData?.targetName) attachments[areaKey].push(newAttachment);
                        console.log('done');
                    }
                    return;
                }}
            >
                <ul onClick={(e) => e.stopPropagation()} className="flex-col border bg-zinc-950 p-8">
                    {(editFormData?.Fields ?? []).map((field) => (
                        <li className="my-1 flex justify-between" key={field}>
                            <span className="pr-8">{field}:</span>{' '}
                            <input
                                name={field}
                                className="border from-[#F94327] to-[#FF7D14] transition-all focus:bg-linear-to-r focus:text-black focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            />
                        </li>
                    ))}
                    <button type="submit" className="mt-6 block w-full rounded-sm bg-orange-500 p-2 text-black transition-all hover:invert">
                        {editFormData?.ButtonName}
                    </button>
                </ul>
            </form>
        </div>
    );
}
