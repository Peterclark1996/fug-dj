import { useParams } from "react-router-dom"
import useApiQuery from "../../hooks/useApiQuery"
import RoomStateDto from "../../dtos/RoomStateDto"
import Loading from "../../library/Loading"
import HeadInfo from "./HeadInfo"
import HeadLogo from "./HeadLogo"
import RoomControl from "./RoomControl"
import ChatPanel from "./ChatPanel"
import { useState } from "react"
import RoomPanel from "../../types/RoomPanel"
import QueuePanel from "./QueuePanel"
import UsersPanel from "./UsersPanel"
import RoomList from "./RoomList"
import Stage from "./Stage"
import MainContentControl from "./MainContentControl"
import MainContentPanel from "../../types/MainContentPanel"
import MediaLibrary from "./MediaLibrary/MediaLibrary"

type RoomProps = {
    username: string
}

const Room = ({ username }: RoomProps) => {
    const { roomId } = useParams()

    const roomStateRequest = useApiQuery<RoomStateDto>(`room/${roomId}`)

    const roomState = roomStateRequest.data ?? {
        name: "Connecting...",
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
            <Loading isLoading={roomStateRequest.isLoading}>
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
                            <HeadInfo />
                        </div>
                        <div className="flex grow bg-slate-700 form-emboss z-0">{getMainContentPanel()}</div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex h-12 bg-slate-500 form-emboss z-20">
                            <RoomControl
                                selectedRoomPanel={selectedRoomPanel}
                                setSelectedRoomPanel={setSelectedRoomPanel}
                            />
                        </div>
                        <div className="flex grow bg-slate-600 form-emboss z-10">{getRoomPanel()}</div>
                    </div>
                </div>
            </Loading>
        </div>
    )
}

export default Room
