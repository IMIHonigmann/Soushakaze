export function makeSelectionKey(weaponId: number, sel: Record<string, number | string | undefined>) {
    const values = Object.entries(sel ?? {})
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([, v]) => String(v));
    return `${weaponId}:${values.join('|')}`;
}
