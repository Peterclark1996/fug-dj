import axios from "axios"
import { useEffect, useState } from "react"
import ApiState from "./ApiState"
import { getApiUrl } from "./constants"

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
