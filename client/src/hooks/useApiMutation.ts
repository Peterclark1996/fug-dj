import axios from "axios"
import { useState } from "react"
import ApiState from "./ApiState"
import { getApiUrl } from "./constants"
import { useAuth } from "@clerk/clerk-react"

const useApiMutation = <T>(method: "post" | "put" | "patch" | "delete", url: string) => {
    const sanitisiedUrl = url.startsWith("/") ? url : "/" + url

    const [data, setData] = useState<T>()
    const [state, setState] = useState<ApiState>({
        errored: false,
        loading: false,
        loaded: false
    })

    const { getToken } = useAuth()

    const execute = async (requestBody: unknown = undefined) => {
        if (state.loading) {
            return Promise.resolve({
                data: undefined,
                statusCode: 0
            })
        }

        setState({
            errored: false,
            loading: true,
            loaded: false
        })

        const res = await callAxiosWithMethod(
            method,
            getApiUrl() + sanitisiedUrl,
            requestBody,
            (await getToken()) ?? ""
        )
        setState({
            errored: false,
            loading: false,
            loaded: true
        })

        const dataSafe = res.status === 200 ? res.data : undefined

        setData(dataSafe)

        return {
            data: dataSafe,
            statusCode: res.status
        }
    }

    return { data, hasErrored: state.errored, isLoading: state.loading, hasLoaded: state.loaded, execute }
}

const callAxiosWithMethod = (
    method: "post" | "put" | "patch" | "delete",
    url: string,
    requestBody: unknown,
    token: string
) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        validateStatus: () => true
    }
    switch (method) {
        case "post":
            return axios.post(url, requestBody, config)
        case "put":
            return axios.put(url, requestBody, config)
        case "patch":
            return axios.patch(url, requestBody, config)
        case "delete":
            return axios.delete(url, config)
    }
}

export default useApiMutation
