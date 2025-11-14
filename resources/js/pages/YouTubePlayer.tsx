import { useRef, useState } from 'react';
import { FaPause, FaPlayCircle } from 'react-icons/fa';
import { TbPlayerTrackNextFilled } from 'react-icons/tb';
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

    const opts = {
        height: '390',
        width: '640',
        playerVars: {
            autoplay: 1,
            loop: 1,
        },
    };

    const onReady = (event: YouTubeEvent) => {
        playerRef.current = event.target;
        playerRef.current.getVideoData() as VideoData;
        setCurrentTitle(playerRef.current.getVideoData().title);
    };

    const onEnd = () => {
        const nextIndex = (currentIndex + 1) % videoIds.length;
        setCurrentIndex(nextIndex);
    };

    const playVideo = () => {
        if (playerRef.current) {
            playerRef.current.playVideo();
            console.log('Currently playing:', playerRef.current.getVideoData().title);
        }
        setIsPlaying(true);
    };

    const pauseVideo = () => {
        if (playerRef.current) {
            playerRef.current.pauseVideo();
        }
        setIsPlaying(false);
    };

    const nextVideo = () => {
        const nextIndex = (currentIndex + 1) % videoIds.length;
        setCurrentIndex(nextIndex);
        setCurrentTitle(playerRef.current.getVideoData().title);
        setIsPlaying(true);
    };

    return (
        <div className={className}>
            <YouTube className="hidden" videoId={videoIds[currentIndex]} opts={opts} onReady={onReady} onEnd={onEnd} />
            <h1>{currentTitle}</h1>
            <div className="text-3xl">
                <button onClick={isPlaying ? pauseVideo : playVideo}>{isPlaying ? <FaPause /> : <FaPlayCircle />}</button>
                <button onClick={nextVideo}>
                    <TbPlayerTrackNextFilled />
                </button>
            </div>
        </div>
    );
};

export default YouTubePlayer;
