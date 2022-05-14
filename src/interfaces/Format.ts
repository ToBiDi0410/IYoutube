export interface Format {
    type: "VIDEO" | "AUDIO";
    itag: number;
    url: string;
    mime: string;

    //Common
    bitrate?: number;
    averageBitrate?: number;
    quality?: string;

    //Video
    height?: number;
    width?: number;
    fps?: number;
    qualityLabel?: string;
    colorInfo?: {
        matrixCoefficients: string,
        primaries: string,
        transferCharacteristics: string
    }

    //Audio
    audioQuality?: string;
    audioSampleRate?: number;
    audioChannels?: number;
    loudness?: number;
}