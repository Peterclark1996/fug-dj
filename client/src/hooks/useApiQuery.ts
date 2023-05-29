import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import ApiState from "./ApiState"
import { getApiUrl } from "./constants"

const useApiQuery = <T>(url: string, canRunImmediately = true) => {
    const sanitisiedUrl = url.startsWith("/") ? url : "/" + url

    const [lastFetchedUrl, setLastFetchedUrl] = useState<string>()
    const [data, setData] = useState<T>()
    const [state, setState] = useState<ApiState>({
        errored: false,
        loading: false,
        loaded: false
    })
    const [couldRunImmediately, setCouldRunImmediately] = useState(canRunImmediately)

    useEffect(() => {
        if (!couldRunImmediately && canRunImmediately) {
            setLastFetchedUrl(undefined)
            setData(undefined)
            setState({
                errored: false,
                loading: false,
                loaded: false
            })
        }
        setCouldRunImmediately(canRunImmediately)
    }, [canRunImmediately, couldRunImmediately])

    const callApi = useCallback(() => {
        setState({
            errored: false,
            loading: true,
            loaded: false
        })

        setLastFetchedUrl(sanitisiedUrl)

        return axios
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
    }, [sanitisiedUrl])

    useEffect(() => {
        if (lastFetchedUrl === sanitisiedUrl && (state.errored || state.loading || state.loaded)) return

        if (!canRunImmediately) return

        callApi()
    }, [callApi, canRunImmediately, lastFetchedUrl, sanitisiedUrl, state.errored, state.loaded, state.loading])

    const execute = () => {
        if (state.loading) return

        return callApi()
    }

    return { data, hasErrored: state.errored, isLoading: state.loading, hasLoaded: state.loaded, execute }
}

export default useApiQuery
