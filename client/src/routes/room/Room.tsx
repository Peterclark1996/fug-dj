import { useParams } from "react-router-dom"
import useApiQuery from "../../hooks/useApiQuery"
import RoomStateDto from "../../dtos/RoomStateDto"
import Loading from "../../library/Loading"
import HeadInfo from "./HeadInfo"
import HeadLogo from "./HeadLogo"
import RoomControl from "./RoomControl/RoomControl"
import ChatPanel from "./ChatPanel"
import { useState } from "react"
import RoomPanel from "../../types/RoomPanel"
import QueuePanel from "./QueuePanel"
import UsersPanel from "./UsersPanel"
import RoomList from "./RoomList"
import Stage from "./Stage"

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

    return (
        <div className="h-screen w-screen">
            <Loading isLoading={roomStateRequest.isLoading}>
                <div className="flex h-screen">
                    <div className="flex flex-col">
                        <div className="flex h-12 bg-slate-500 drop-shadow-lg z-2">
                            <HeadLogo />
                        </div>
                        <div className="flex grow bg-slate-600 z-1">
                            <RoomList />
                        </div>
                    </div>
                    <div className="flex grow flex-col">
                        <div className="flex h-12 bg-slate-500 drop-shadow-lg z-3">
                            <HeadInfo />
                        </div>
                        <div className="flex grow bg-slate-700 z-0">
                            <Stage username={username} />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex h-12 bg-slate-500 drop-shadow-lg z-2">
                            <RoomControl
                                selectedRoomPanel={selectedRoomPanel}
                                setSelectedRoomPanel={setSelectedRoomPanel}
                            />
                        </div>
                        <div className="flex grow bg-slate-600 z-1">{getRoomPanel()}</div>
                    </div>
                </div>
            </Loading>
        </div>
    )
}

export default Room
