export interface SponsorBlockSegment {
    segment: number,
    UUID: string,
    actionType: string,
    category?: string,
    videoDuration?: number,
    userID?: string,
    locked?: boolean,
    votes?: number,
    description?: string

}