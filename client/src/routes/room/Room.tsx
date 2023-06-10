import { useNavigate, useParams } from "react-router-dom"
import useApiQuery from "../../hooks/useApiQuery"
import RoomStateDto from "../../dtos/RoomStateDto"
import Loading from "../../library/Loading"
import HeadInfo from "./HeadInfo"
import HeadLogo from "./HeadLogo"
import RoomControl from "./RoomControl"
import ChatPanel from "./ChatPanel/ChatPanel"
import { useEffect, useState } from "react"
import RoomPanel from "../../types/RoomPanel"
import QueuePanel from "./QueuePanel/QueuePanel"
import UsersPanel from "./UserPanel/UsersPanel"
import RoomList from "./RoomList"
import Stage from "./Stage"
import MainContentControl from "./MainContentControl"
import MainContentPanel from "../../types/MainContentPanel"
import MediaLibrary from "./MediaLibrary/MediaLibrary"
import { useWebSocket } from "../../contexts/WebSocketContext"
import {
    EventFromServer,
    EventFromServer_NextMediaStarted,
    EventFromServer_RoomStateUpdated,
    EventFromServer_UserSentMessage
} from "../../contexts/EventFromServer"
import UserDataDto from "../../dtos/UserDataDto"
import QueuedMediaDto from "../../dtos/QueuedMediaDto"
import useApiMutation from "../../hooks/useApiMutation"
import SavedMediaDto from "../../dtos/SavedMediaDto"
import moment from "moment"
import Message from "../../types/Message"

const defaultRoomState: RoomStateDto = {
    roomId: "",
    displayName: "Connecting...",
    owner: "",
    visibility: "public",
    connectedUsers: [],
    queue: [],
    currentlyPlayingMedia: undefined,
    currentlyPlayingMediaStartedAt: undefined
}

const Room = () => {
    const { roomId } = useParams()

    const [latestRoomState, setLatestRoomState] = useState<RoomStateDto>()

    const { status, on } = useWebSocket()

    const userStateRequest = useApiQuery<UserDataDto>("user")
    const roomStateRequest = useApiQuery<RoomStateDto>(`room/${roomId}`, status === "connected")

    const roomState = latestRoomState ? latestRoomState : roomStateRequest.data ?? defaultRoomState

    const [selectedRoomPanel, setSelectedRoomPanel] = useState<RoomPanel>("chat")
    const [selectedMainContentPanel, setSelectedMainContentPanel] = useState<MainContentPanel>("stage")

    const [mediaQueue, setMediaQueue] = useState<(QueuedMediaDto & { playlistId: string })[]>([])

    const queueMediaRequest = useApiMutation("post", `room/${roomId}/queue`)
    const addMediaToQueue = (media: SavedMediaDto, playlistId: string) => {
        const userId = userStateRequest.data?.userId

        if (!userId) return

        const mediaToQueue = {
            mediaId: media.mediaId,
            userWhoQueued: userId,
            timeQueued: moment().toISOString(),
            displayName: media.displayName,
            thumbnailUrl: media.thumbnailUrl,
            lengthInSeconds: media.lengthInSeconds,
            playlistId: playlistId
        }

        if (mediaQueue.length === 0 && roomState.queue.find(m => m.userWhoQueued === userId) === undefined) {
            queueMediaRequest.execute({
                playlistId: playlistId,
                mediaId: mediaToQueue.mediaId
            })
        } else {
            setMediaQueue(currentQueue => [...currentQueue, mediaToQueue])
        }
    }

    const unqueueMediaRequest = useApiMutation("delete", `room/${roomId}/queue`)

    const removeMediaFromServerQueue = () => {
        setMediaQueue(currentQueue => {
            if (currentQueue.length > 0) {
                queueMediaRequest.execute({
                    playlistId: currentQueue[0].playlistId,
                    mediaId: currentQueue[0].mediaId
                })
                return filterQueue(currentQueue, currentQueue[0])
            } else {
                unqueueMediaRequest.execute()
            }

            return []
        })
    }

    const removeMediaFromLocalQueue = (media: QueuedMediaDto) =>
        setMediaQueue(currentQueue => filterQueue(currentQueue, media))

    const [messages, setMessages] = useState<Message[]>([])

    const navigate = useNavigate()

    useEffect(() => {
        on("CONNECTION_FAILED", () => {
            navigate("/home")
        })
        on("ROOM_STATE_UPDATED", (data: EventFromServer) => {
            const event = data as EventFromServer_RoomStateUpdated
            setLatestRoomState(event.data)
        })
        on("NEXT_MEDIA_STARTED", (data: EventFromServer) => {
            const event = data as EventFromServer_NextMediaStarted

            setMediaQueue(currentQueue => {
                if (mediaQueue.length > 0) {
                    const firstInQueue = mediaQueue.sort((a, b) => a.timeQueued.localeCompare(b.timeQueued))[0]

                    if (
                        firstInQueue.mediaId === event.data.queuedMedia.mediaId &&
                        firstInQueue.userWhoQueued === event.data.queuedMedia.userWhoQueued
                    ) {
                        if (currentQueue.length > 1) {
                            queueMediaRequest.execute({
                                playlistId: currentQueue[1].playlistId,
                                mediaId: currentQueue[1].mediaId
                            })
                        }

                        return filterQueue(currentQueue, firstInQueue)
                    }
                }

                return currentQueue
            })

            setLatestRoomState(currentState => ({
                ...(currentState ?? defaultRoomState),
                currentlyPlayingMedia: event.data.queuedMedia,
                currentlyPlayingMediaStartedAt: event.data.timeStarted
            }))
        })
        on("USER_SENT_MESSAGE", (data: EventFromServer) => {
            const event = data as EventFromServer_UserSentMessage

            setMessages(existingMessages => [
                {
                    id: (existingMessages[0]?.id ?? 0) + 1,
                    username: event.data.username,
                    message: event.data.message,
                    timestamp: event.data.timestamp
                },
                ...existingMessages
            ])
        })
    }, [mediaQueue, navigate, on, queueMediaRequest])

    const getRoomPanel = () => {
        switch (selectedRoomPanel) {
            case "chat":
                return <ChatPanel username={userStateRequest.data?.displayName ?? ""} messages={messages} />
            case "queue":
                return (
                    <QueuePanel
                        userId={userStateRequest.data?.userId ?? ""}
                        roomQueue={roomState.queue}
                        userQueue={mediaQueue}
                        removeMediaFromServerQueue={removeMediaFromServerQueue}
                        removeMediaFromLocalQueue={removeMediaFromLocalQueue}
                    />
                )
            case "users":
                return <UsersPanel connectedUsers={roomState.connectedUsers} />
        }
    }

    const getMainContentPanel = () => {
        switch (selectedMainContentPanel) {
            case "stage":
                return <Stage currentlyPlayingMedia={roomState.currentlyPlayingMedia} />
            case "library":
                return (
                    <MediaLibrary
                        onClose={() => setSelectedMainContentPanel("stage")}
                        addMediaToQueue={addMediaToQueue}
                    />
                )
        }
    }

    if (userStateRequest.statusCode === 404 || roomStateRequest.statusCode === 404) {
        navigate("/home")
    }

    return (
        <div className="h-screen w-screen text-white bg-slate-700">
            <Loading isLoading={roomStateRequest.isLoading || userStateRequest.isLoading || status == "connecting"}>
                <div className="flex h-screen">
                    <div className="flex flex-col">
                        <div className="flex h-12 bg-slate-500 form-emboss z-20">
                            <HeadLogo />
                        </div>
                        <div className="flex flex-col grow bg-slate-600 form-emboss z-10">
                            <RoomList />
                            <MainContentControl
                                selectedMainContentPanel={selectedMainContentPanel}
                                setSelectedMainContentPanel={setSelectedMainContentPanel}
                            />
                        </div>
                    </div>
                    <div className="flex grow flex-col">
                        <div className="flex h-12 bg-slate-500 form-emboss z-20">
                            <HeadInfo
                                currentlyPlayingMedia={roomState.currentlyPlayingMedia}
                                currentlyPlayingStartTime={roomState.currentlyPlayingMediaStartedAt}
                            />
                        </div>
                        <div className="flex grow bg-slate-700 z-0">{getMainContentPanel()}</div>
                    </div>
                    <div className="flex flex-col max-w-xs w-80">
                        <div className="flex h-12 bg-slate-500 form-emboss z-20">
                            <RoomControl
                                selectedRoomPanel={selectedRoomPanel}
                                setSelectedRoomPanel={setSelectedRoomPanel}
                            />
                        </div>
                        <div className="flex grow bg-slate-600 form-emboss z-10 overflow-auto">{getRoomPanel()}</div>
                    </div>
                </div>
            </Loading>
        </div>
    )
}

export default Room

const filterQueue = (
    queue: (QueuedMediaDto & { playlistId: string })[],
    media: QueuedMediaDto
): (QueuedMediaDto & { playlistId: string })[] =>
    queue.filter(queuedMedia => queuedMedia.mediaId !== media.mediaId || queuedMedia.timeQueued !== media.timeQueued)
