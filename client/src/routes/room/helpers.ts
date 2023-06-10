import moment from "moment"

const SECONDS_IN_HOUR = 3600

export const secondsToTimeFormat = (seconds: number) =>
    moment.utc(seconds * 1000).format(seconds > SECONDS_IN_HOUR ? "HH:mm:ss" : "mm:ss")

export const seededRandomColour = (seed: string): string => {
    const numericSeed = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const hexCode = Math.floor(Math.abs(Math.sin(numericSeed) * 16777215)).toString(16)
    return `#${hexCode}`
}
