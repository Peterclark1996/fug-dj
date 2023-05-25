import { useParams } from "react-router-dom"
import useApiQuery from "../hooks/useApiQuery"
import RoomStateDto from "../dtos/RoomStateDto"

type RoomProps = {
    username: string
}

const Room = ({ username }: RoomProps) => {
    const { roomId } = useParams()

    const roomStateRequest = useApiQuery<RoomStateDto>(`room/${roomId}`)

    return (
        <div>
            <h1>
                Connected to room: '{roomId}' as: '{username}'
            </h1>
            <br />
            <h2>Room state</h2>
            {roomStateRequest.isLoading ? (
                <span>Loading...</span>
            ) : roomStateRequest.hasErrored ? (
                <span>Failed to load room state</span>
            ) : (
                <div>
                    <span>Room Name: {roomStateRequest.data?.name}</span>
                    <span>Connected Users: {roomStateRequest.data?.connectedUsers}</span>
                    <span>Queue: {roomStateRequest.data?.queue.map(media => media.videoId)}</span>
                </div>
            )}
        </div>
    )
}

export default Room
