export const getApiUrl = () => {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        return "http://localhost:8080/api"
    }
    return `http://${window.location.host}/api`
}
