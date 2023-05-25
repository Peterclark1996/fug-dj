import axios from "axios"
import { useEffect, useState } from "react"

type ApiState = {
    errored: boolean
    loading: boolean
    loaded: boolean
}

const getApiUrl = () => {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        return "http://localhost:8080/api"
    }
    return `http://${window.location.host}/api`
}

const useApiQuery = <T>(url: string, canRun = true) => {
    const sanitisiedUrl = url.startsWith("/") ? url : "/" + url

    const [lastFetchedUrl, setLastFetchedUrl] = useState<string>()
    const [data, setData] = useState<T>()
    const [state, setState] = useState<ApiState>({
        errored: false,
        loading: false,
        loaded: false
    })
    const [couldRun, setCouldRun] = useState(canRun)

    useEffect(() => {
        if (!couldRun && canRun) {
            setLastFetchedUrl(undefined)
            setData(undefined)
            setState({
                errored: false,
                loading: false,
                loaded: false
            })
        }
        setCouldRun(canRun)
    }, [canRun, couldRun])

    useEffect(() => {
        if (lastFetchedUrl === sanitisiedUrl && (state.errored || state.loading || state.loaded)) return

        if (!canRun) return

        setState({
            errored: false,
            loading: true,
            loaded: false
        })

        setLastFetchedUrl(sanitisiedUrl)

        console.log(getApiUrl() + sanitisiedUrl)

        axios
            .get(getApiUrl() + sanitisiedUrl)
            .then(res => {
                setState({
                    errored: false,
                    loading: false,
                    loaded: true
                })

                setData(res.data)
            })
            .catch(() => {
                setState({
                    errored: true,
                    loading: false,
                    loaded: true
                })
            })
    }, [canRun, lastFetchedUrl, state, sanitisiedUrl])

    return { data, hasErrored: state.errored, isLoading: state.loading, hasLoaded: state.loaded }
}

export default useApiQuery
