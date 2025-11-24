const DEFAULT_VOLUME = 0.5;

export function playLower(src: string) {
    const audio = new Audio(src);
    audio.src = src;
    audio.volume = DEFAULT_VOLUME;
    audio.play();
}
