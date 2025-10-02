export function makeSelectionKey(weaponId: number, sel: Record<string, number | string | undefined>) {
    const sorted = Object.fromEntries(Object.entries(sel ?? {}).sort(([a], [b]) => a.localeCompare(b)));
    return `${weaponId}:${encodeURIComponent(JSON.stringify(sorted))}`;
}
