import moment from "moment"

const SECONDS_IN_HOUR = 3600

export const secondsToTimeFormat = (seconds: number) =>
    moment.utc(seconds * 1000).format(seconds > SECONDS_IN_HOUR ? "HH:mm:ss" : "mm:ss")
