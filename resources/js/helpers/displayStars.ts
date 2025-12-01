export function displayStars(unparsedRating: string) {
    const num = parseFloat(unparsedRating);
    if (isNaN(num) || num <= 0) return '';

    const rounded = Math.round(Math.max(0, Math.min(5, num)) * 2) / 2;
    const full = Math.floor(rounded);
    const hasHalf = rounded - full === 0.5;

    return '★'.repeat(full) + (hasHalf ? '½' : '') + '☆'.repeat(5 - full - Number(hasHalf));
}
