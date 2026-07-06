import { state } from '@/stores/customizerProxy';
import { Area, Attachment } from '@/types/types';

type Props = {
    editFormData: {
        Fields: Record<string, any>;
        TargetType: 'Area' | 'Attachment';
        targetName?: string;
    } | null;
    setEditFormData: React.Dispatch<React.SetStateAction<any>>;
};

const toInt = (value: FormDataEntryValue | null) => parseInt((value as string) ?? '', 10) || 0;

export default function EditForm({ editFormData, setEditFormData }: Props) {
    return (
        <div
            onClick={() => {
                setEditFormData(null);
            }}
            className="absolute flex h-screen w-screen items-center justify-center bg-black/75"
        >
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);

                    if (editFormData?.TargetType === 'Area') {
                        const newName = (formData.get('Area Name') as string)?.trim();
                        if (newName) {
                            if (editFormData.targetName) {
                                // rename: move the existing group to the new key
                                if (newName !== editFormData.targetName && !state.grouped[newName]) {
                                    state.grouped[newName] = state.grouped[editFormData.targetName] ?? [];
                                    delete state.grouped[editFormData.targetName];
                                }
                            } else if (!state.grouped[newName]) {
                                // create a new, empty area group
                                state.grouped[newName] = [];
                            }
                        }
                        setEditFormData(null);
                        return;
                    }

                    if (editFormData?.TargetType === 'Attachment') {
                        const areaKey = formData.get('Area') as string;

                        const newAttachment: Attachment = {
                            id: -1,
                            seller_id: null,
                            manufacturer_id: null,
                            name: formData.get('Attachment Name') as string,
                            price_modifier: Number(formData.get('Price Modifier')) || 0,
                            area: areaKey as Area,
                            image_blob: null,
                            power_modifier: toInt(formData.get('Power Modifier')),
                            accuracy_modifier: toInt(formData.get('Accuracy Modifier')),
                            mobility_modifier: toInt(formData.get('Mobility Modifier')),
                            handling_modifier: toInt(formData.get('Handling Modifier')),
                            magsize_modifier: toInt(formData.get('Magsize Modifier')),
                        };

                        if (!state.grouped[areaKey]) state.grouped[areaKey] = [];
                        const list = state.grouped[areaKey];

                        const editIndex = editFormData?.targetName ? list.findIndex((att) => att.name === editFormData.targetName) : -1;
                        if (editIndex !== -1) {
                            newAttachment.id = list[editIndex].id;
                            list[editIndex] = newAttachment;
                        } else {
                            list.push(newAttachment);
                        }
                    }
                    setEditFormData(null);
                }}
            >
                <ul onClick={(e) => e.stopPropagation()} className="flex-col border bg-zinc-950 p-8">
                    {Object.entries(editFormData?.Fields ?? {}).map(([field, value]) => (
                        <li className="my-1 flex justify-between" key={field}>
                            <span className="pr-8">{field}:</span>{' '}
                            <input
                                name={field}
                                className="border from-[#F94327] to-[#FF7D14] transition-all focus:bg-linear-to-r focus:text-black focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                defaultValue={value}
                            />
                        </li>
                    ))}
                    <button type="submit" className="mt-6 block w-full rounded-sm bg-orange-500 p-2 text-black transition-all hover:invert">
                        {editFormData?.targetName ? 'Edit' : 'Add New'} {editFormData?.TargetType}
                    </button>
                </ul>
            </form>
        </div>
    );
}
