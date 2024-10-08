import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import ApiState from "./ApiState"
import { getApiUrl } from "./constants"
import { useAuth } from "@clerk/clerk-react"
import useIsMounted from "./useIsMounted"

const useApiQuery = <T>(url: string, canRunImmediately = true) => {
    const isMounted = useIsMounted()

    const sanitisiedUrl = url.startsWith("/") ? url : "/" + url

    const [lastFetchedUrl, setLastFetchedUrl] = useState<string>()
    const [data, setData] = useState<T>()
    const [statusCode, setStatusCode] = useState<number>()
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

    const { getToken } = useAuth()

    const callApi = useCallback(async () => {
        setState({
            errored: false,
            loading: true,
            loaded: false
        })
        setStatusCode(undefined)
        setLastFetchedUrl(sanitisiedUrl)

        try {
            const res = await axios.get(getApiUrl() + sanitisiedUrl, {
                headers: {
                    Authorization: `Bearer ${await getToken()}`
                },
                validateStatus: () => true
            })

            if (!isMounted.current) return

            setState({
                errored: false,
                loading: false,
                loaded: true
            })

            setStatusCode(res.status)
            if (res.status === 200) {
                setData(res.data)
            }
        } catch {
            setState({
                errored: true,
                loading: false,
                loaded: true
            })
        }
    }, [getToken, isMounted, sanitisiedUrl])

    useEffect(() => {
        if (lastFetchedUrl === sanitisiedUrl && (state.errored || state.loading || state.loaded)) return

        if (!canRunImmediately) return

        callApi()
    }, [callApi, canRunImmediately, lastFetchedUrl, sanitisiedUrl, state.errored, state.loaded, state.loading])

    const execute = () => {
        if (state.loading) return

        return callApi()
    }

    return { data, hasErrored: state.errored, isLoading: state.loading, hasLoaded: state.loaded, statusCode, execute }
}

export default useApiQuery
