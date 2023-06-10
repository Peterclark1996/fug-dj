import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react"
import { EventFromServer, EventFromServerType } from "./EventFromServer"
import { EventToServer } from "./EventToServer"
import { useParams } from "react-router-dom"
import { useAuth } from "@clerk/clerk-react"

const getSocketUrl = () => {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        return "ws://localhost:8080/socket/room"
    }
    return `wss://${window.location.host}/socket/room`
}

const limitedRetries = false
const maxRetries = 5

const eventListeners: { [key: string]: (event: EventFromServer) => void } = {}

const addListenerToSocket = (eventType: EventFromServerType, func: (event: EventFromServer) => void) =>
    (eventListeners[eventType] = func)

type Status = "connecting" | "connected" | "disconnected" | "failed"

const WebSocketContext = createContext<{
    status: Status
    connect: (socketUrl: string, retriesRemaining?: number) => void
    disconnect: () => void
    on: (event: EventFromServerType, func: (event: EventFromServer) => void) => void
    send: (event: EventToServer) => void
}>({
    status: "disconnected",
    connect: () => undefined,
    disconnect: () => undefined,
    on: addListenerToSocket,
    send: () => undefined
})

const onEventReceived = (messageEvent: MessageEvent<EventFromServer>, setStatus: (status: Status) => void) => {
    const event: EventFromServer = JSON.parse(messageEvent.data.toString())

    if (event.type === "CONNECTION_SUCCESS") {
        setStatus("connected")
    }

    if (event.type === "CONNECTION_FAILED") {
        setStatus("failed")
    }

    const listener = eventListeners[event.type]

    if (listener != undefined) listener(event)
}

type WebSocketProviderProps = {
    children: ReactNode
}

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
    const [connection, setConnection] = useState<WebSocket | undefined>()

    const [hasFailedToConnect, setHasFailedToConnect] = useState(false)
    const [status, setStatus] = useState<Status>("connecting")

    const { getToken } = useAuth()

    const sendToSocket = useCallback(
        (event: EventToServer) => {
            if (connection === undefined || connection.readyState !== WebSocket.OPEN) return

            const eventToSend = {
                type: event.type,
                data: JSON.stringify(event.data)
            }

            connection.send(JSON.stringify(eventToSend))
        },
        [connection]
    )

    const disconnectFromSocket = () => {
        setStatus("disconnected")
    }

    const onMessage = (messageEvent: MessageEvent<EventFromServer>) => {
        onEventReceived(messageEvent, setStatus)
    }

    const connectToSocket = useCallback(
        (socketUrl: string, retriesRemaining = maxRetries) => {
            if (hasFailedToConnect) return

            if (limitedRetries && retriesRemaining === 0) {
                setConnection(undefined)
                setHasFailedToConnect(true)
                return
            }

            if (
                connection !== undefined &&
                (connection.readyState === WebSocket.CONNECTING || connection.readyState === WebSocket.OPEN)
            ) {
                connection.onmessage = onMessage
                return
            }

            const reconnectToSocketOnClose = (reason: string, retries = maxRetries) => {
                if (limitedRetries && retries === 1) {
                    setConnection(undefined)
                    setHasFailedToConnect(true)
                    return
                }

                const nextAmountOfRetries = retries - 1
                setTimeout(() => {
                    connectToSocket(socketUrl, nextAmountOfRetries)
                }, 3000)
            }

            const newConnection = new WebSocket(socketUrl)

            newConnection.onopen = () => {
                setConnection(newConnection)
                setHasFailedToConnect(false)
                newConnection.onclose = event => reconnectToSocketOnClose(event.reason)
            }

            newConnection.onmessage = onMessage

            newConnection.onclose = event => reconnectToSocketOnClose(event.reason, retriesRemaining)

            newConnection.onerror = (error: Event) => {
                console.error("Socket error: ", error)
                newConnection.close()
            }
        },
        [connection, hasFailedToConnect]
    )

    const { roomId } = useParams()

    useEffect(() => {
        setStatus("connecting")
        getToken().then(token => {
            connectToSocket(`${getSocketUrl()}/${roomId}?token=${token}`)
        })
    }, [connectToSocket, getToken, roomId])

    const value = {
        status: hasFailedToConnect ? "failed" : status,
        connect: connectToSocket,
        disconnect: disconnectFromSocket,
        on: addListenerToSocket,
        send: sendToSocket
    }

    return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>
}

export const useWebSocket = () => useContext(WebSocketContext)
