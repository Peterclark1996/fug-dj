import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react"
import { EventFromServer, EventFromServerType } from "./EventFromServer"
import { EventToServer } from "./EventToServer"
import { useParams } from "react-router-dom"

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

const WebSocketContext = createContext<{
    connect: (socketUrl: string, retriesRemaining?: number) => void
    disconnect: () => void
    on: (event: EventFromServerType, func: (event: EventFromServer) => void) => void
    send: (event: EventToServer) => void
}>({
    connect: () => undefined,
    disconnect: () => undefined,
    on: addListenerToSocket,
    send: () => undefined
})

const onEventReceived = (messageEvent: MessageEvent<EventFromServer>) => {
    const event: EventFromServer = JSON.parse(messageEvent.data.toString())

    const listener = eventListeners[event.type]

    if (listener != undefined) listener(event)
}

type WebSocketProviderProps = {
    children: ReactNode
}

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
    const [connection, setConnection] = useState<WebSocket | undefined>()

    const [hasFailedToConnect, setHasFailedToConnect] = useState(false)

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
        console.log("DISCONNECTING")
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
                connection.onmessage = onEventReceived
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

            newConnection.onmessage = onEventReceived

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
        connectToSocket(`${getSocketUrl()}/${roomId}`)
    }, [connectToSocket, roomId])

    const value = {
        connect: connectToSocket,
        disconnect: disconnectFromSocket,
        on: addListenerToSocket,
        send: sendToSocket
    }

    return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>
}

export const useWebSocket = () => useContext(WebSocketContext)
