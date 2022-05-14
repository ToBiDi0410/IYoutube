export interface Format {
    type: "VIDEO" | "AUDIO";
    itag: number;
    url: string;
    mime: string;
    bitrate?: number;
    averageBitrate?: number;
    quality?: string;
    height?: number;
    width?: number;
    fps?: number;
    qualityLabel?: string;
    colorInfo?: {
        matrixCoefficients: string;
        primaries: string;
        transferCharacteristics: string;
    };
    audioQuality?: string;
    audioSampleRate?: number;
    audioChannels?: number;
    loudness?: number;
}
