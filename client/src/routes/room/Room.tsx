import { useParams } from "react-router-dom"
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
import UsersPanel from "./UsersPanel"
import RoomList from "./RoomList"
import Stage from "./Stage"
import MainContentControl from "./MainContentControl"
import MainContentPanel from "../../types/MainContentPanel"
import MediaLibrary from "./MediaLibrary/MediaLibrary"
import { useWebSocket } from "../../contexts/socket/WebSocketContext"
import {
    EventFromServer,
    EventFromServer_NextMediaStarted,
    EventFromServer_RoomStateUpdated
} from "../../contexts/socket/EventFromServer"
import QueuedMediaDto from "../../dtos/QueuedMediaDto"

type RoomProps = {
    username: string
}

const Room = ({ username }: RoomProps) => {
    const { roomId } = useParams()

    const [latestRoomState, setLatestRoomState] = useState<RoomStateDto>()
    const [currentlyPlaying, setCurrentlyPlaying] = useState<{ queuedMedia: QueuedMediaDto; timeStarted: string }>()

    const { status, on } = useWebSocket()

    useEffect(() => {
        on("ROOM_STATE_UPDATED", (data: EventFromServer) => {
            const event = data as EventFromServer_RoomStateUpdated
            setLatestRoomState(event.data)
        })
        on("NEXT_MEDIA_STARTED", (data: EventFromServer) => {
            const event = data as EventFromServer_NextMediaStarted
            setCurrentlyPlaying(event.data)
        })
    }, [on])

    const roomStateRequest = useApiQuery<RoomStateDto>(`room/${roomId}`)

    const roomState = latestRoomState
        ? latestRoomState
        : roomStateRequest.data ?? {
              displayName: "Connecting...",
              connectedUsers: [],
              queue: []
          }

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
                return <Stage username={username} />
            case "library":
                return <MediaLibrary onClose={() => setSelectedMainContentPanel("stage")} />
        }
    }

    return (
        <div className="h-screen w-screen">
            <Loading isLoading={roomStateRequest.isLoading || status == "connecting"}>
                <div className="flex h-screen text-white">
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
                                currentlyPlayingMedia={currentlyPlaying?.queuedMedia}
                                currentlyPlayingStartTime={currentlyPlaying?.timeStarted}
                            />
                        </div>
                        <div className="flex grow bg-slate-700 form-emboss z-0">{getMainContentPanel()}</div>
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
