import { useNavigate, useParams } from "react-router-dom"
import useApiQuery from "../../hooks/useApiQuery"
import RoomStateDto from "../../dtos/RoomStateDto"
import Loading from "../../library/Loading"
import HeadInfo from "./HeadInfo"
import HeadLogo from "./HeadLogo"
import RoomControl from "./RoomControl"
import ChatPanel from "./ChatPanel"
import { useEffect, useState } from "react"
import RoomPanel from "../../types/RoomPanel"
import QueuePanel from "./QueuePanel"
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
    EventFromServer_RoomStateUpdated
} from "../../contexts/EventFromServer"
import UserDataDto from "../../dtos/UserDataDto"

const defaultRoomState: RoomStateDto = {
    displayName: "Connecting...",
    connectedUsers: [],
    queue: [],
    currentlyPlayingMedia: undefined,
    currentlyPlayingMediaStartedAt: undefined
}

const Room = () => {
    const { roomId } = useParams()

    const [latestRoomState, setLatestRoomState] = useState<RoomStateDto>()

    const { status, on } = useWebSocket()

    useEffect(() => {
        on("ROOM_STATE_UPDATED", (data: EventFromServer) => {
            const event = data as EventFromServer_RoomStateUpdated
            setLatestRoomState(event.data)
        })
        on("NEXT_MEDIA_STARTED", (data: EventFromServer) => {
            const event = data as EventFromServer_NextMediaStarted
            setLatestRoomState(currentState => ({
                ...(currentState ?? defaultRoomState),
                currentlyPlayingMedia: event.data.queuedMedia,
                currentlyPlayingMediaStartedAt: event.data.timeStarted
            }))
        })
    }, [on])

    const userStateRequest = useApiQuery<UserDataDto>("user")
    const roomStateRequest = useApiQuery<RoomStateDto>(`room/${roomId}`, status === "connected")

    const roomState = latestRoomState ? latestRoomState : roomStateRequest.data ?? defaultRoomState

    const [selectedRoomPanel, setSelectedRoomPanel] = useState<RoomPanel>("chat")
    const [selectedMainContentPanel, setSelectedMainContentPanel] = useState<MainContentPanel>("stage")

    const getRoomPanel = () => {
        switch (selectedRoomPanel) {
            case "chat":
                return <ChatPanel />
            case "queue":
                return <QueuePanel queue={roomState.queue} />
            case "users":
                return <UsersPanel connectedUsers={roomState.connectedUsers} />
        }
    }

    const getMainContentPanel = () => {
        switch (selectedMainContentPanel) {
            case "stage":
                return <Stage currentlyPlayingMedia={roomState.currentlyPlayingMedia} />
            case "library":
                return <MediaLibrary onClose={() => setSelectedMainContentPanel("stage")} />
        }
    }

    const navigate = useNavigate()

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
