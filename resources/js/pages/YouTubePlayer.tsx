import { useEffect, useRef, useState } from 'react';
import { FaCompactDisc, FaPause, FaPlayCircle } from 'react-icons/fa';
import { TbPlayerTrackNextFilled, TbPlayerTrackPrevFilled } from 'react-icons/tb';
import YouTube, { YouTubeEvent, YouTubePlayer as YouTubePlayerType } from 'react-youtube';

type VideoData = {
    video_id: string;
    author: string;
    title: string;
    isPlayable: boolean;
    errorCode: string | null;
    backgroundable: boolean;
    cpn: string;
    isLive: boolean;
    isWindowedLive: boolean;
    isManifestless: boolean;
    allowLiveDvr: boolean;
    hasProgressBarBoundaries: boolean;
    isListed: boolean;
    isMultiChannelAudio: boolean;
    isPremiere: boolean;
    itct: string;
    paidContentOverlayDurationMs: number;
    playerResponseCpn: string;
    progressBarEndPositionUtcTimeMillis: number | null;
    progressBarStartPositionUtcTimeMillis: number | null;
};

type Props = {
    videoIds: string[];
    className?: string;
    isPlaying: boolean;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
};

const YouTubePlayer = ({ videoIds = [], className, isPlaying, setIsPlaying }: Props) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentTitle, setCurrentTitle] = useState('Loading...');
    const playerRef = useRef<YouTubePlayerType | null>(null);
    const isInertiaVisit = useRef(false);

    useEffect(() => {
        const navigationType = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        isInertiaVisit.current = navigationType?.type === 'navigate' && document.referrer.includes(window.location.host);
        isInertiaVisit.current = document.referrer !== '' && document.referrer.includes(window.location.host);
        setIsPlaying(isInertiaVisit.current);
    }, [setIsPlaying]);

    const opts = {
        height: '390',
        width: '640',
        playerVars: {
            autoplay: 1,
            loop: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            iv_load_policy: 3,
            cc_load_policy: 0,
            vq: 'tiny',
        },
    };

    const onReady = (event: YouTubeEvent) => {
        playerRef.current = event.target;
        playerRef.current.getVideoData() as VideoData;
        setCurrentTitle(playerRef.current.getVideoData().title);
    };

    const onStateChange = (event: YouTubeEvent) => {
        if (event.data === 1) {
            setIsPlaying(true);
        } else if (event.data === 2) {
            setIsPlaying(false);
        }
    };

    const onEnd = () => {
        const nextIndex = (currentIndex + 1) % videoIds.length;
        setCurrentIndex(nextIndex);
    };

    const playVideo = () => {
        if (playerRef.current) {
            playerRef.current.playVideo();
        }
    };

    const pauseVideo = () => {
        if (playerRef.current) {
            playerRef.current.pauseVideo();
        }
    };

    const nextVideo = (increment = 1) => {
        const nextIndex = (currentIndex + increment + videoIds.length) % videoIds.length;
        setCurrentIndex(nextIndex);
    };

    return (
        <div className={className} style={{ animationDuration: '0.5s' }}>
            {/* spotify musikleiste reinlegen */}
            <span
                className={`pointer-events-auto w-1/3 rounded-b-4xl border-b-2 border-orange-500 bg-[radial-gradient(circle,#73737350_0.5px,black_1px)] bg-size-[3px_3px] transition-all ${isPlaying ? 'shadow-[0_0_20px_rgba(249,115,22,0.7)]' : ''} overflow-hidden p-4 pb-9`}
            >
                <YouTube
                    className="hidden"
                    videoId={videoIds[currentIndex]}
                    opts={opts}
                    onStateChange={onStateChange}
                    onReady={onReady}
                    onEnd={onEnd}
                />
                <div className="mb-2 flex items-center text-xl *:px-2">
                    <FaCompactDisc
                        key={currentIndex}
                        className={`text-5xl ${isPlaying ? 'animate-spin-720 text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)] ease-in-out' : 'animate-ping transition-all duration-1000'}`}
                        style={{
                            animationIterationCount: isPlaying ? 'infinite' : '3',
                            animationDuration: isPlaying ? '2s' : '',
                        }}
                    />
                    <span className="text-3xl text-zinc-800">|</span>
                    <a
                        href={`https://www.youtube.com/watch?v=${videoIds[currentIndex]}`}
                        className="transition-colors hover:text-orange-500"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <div className="group relative">
                            <div className="relative w-96 overflow-hidden">
                                <h1
                                    key={currentTitle}
                                    className="animate-fade-from-above animate-scroll-text inline-block min-w-full overflow-hidden font-hitmarker-condensed whitespace-nowrap hover:underline"
                                >
                                    {currentTitle}
                                </h1>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="flex items-center justify-center gap-2 text-2xl">
                    <TbPlayerTrackPrevFilled
                        onClick={() => nextVideo(-1)}
                        className="cursor-pointer transition-all duration-100 active:scale-90 active:text-orange-400"
                    />
                    <button
                        className="text-6xl transition-all duration-100 active:scale-80 active:opacity-50"
                        onClick={isPlaying ? pauseVideo : playVideo}
                    >
                        {isPlaying ? <FaPause /> : <FaPlayCircle />}
                    </button>
                    <TbPlayerTrackNextFilled onClick={() => nextVideo()} className="cursor-pointer active:scale-90 active:text-orange-400" />
                </div>
            </span>
        </div>
    );
};

export default YouTubePlayer;
