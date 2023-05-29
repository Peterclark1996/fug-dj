import axios from "axios"
import { useState } from "react"
import ApiState from "./ApiState"
import { getApiUrl } from "./constants"

const useApiMutation = <T>(method: "post" | "put" | "patch" | "delete", url: string) => {
    const sanitisiedUrl = url.startsWith("/") ? url : "/" + url

    const [data, setData] = useState<T>()
    const [state, setState] = useState<ApiState>({
        errored: false,
        loading: false,
        loaded: false
    })

    const execute = (requestBody: unknown = undefined) => {
        if (state.loading) return Promise.resolve()

        setState({
            errored: false,
            loading: true,
            loaded: false
        })

        return callAxiosWithMethod(method, getApiUrl() + sanitisiedUrl, requestBody)
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
    }

    return { data, hasErrored: state.errored, isLoading: state.loading, hasLoaded: state.loaded, execute }
}

const callAxiosWithMethod = (method: "post" | "put" | "patch" | "delete", url: string, requestBody: unknown) => {
    switch (method) {
        case "post":
            return axios.post(url, requestBody)
        case "put":
            return axios.put(url, requestBody)
        case "patch":
            return axios.patch(url, requestBody)
        case "delete":
            return axios.delete(url)
    }
}

export default useApiMutation
