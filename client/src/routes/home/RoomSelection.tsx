import { useClerk } from "@clerk/clerk-react"
import Button from "../../library/Button"
import { useNavigate } from "react-router-dom"
import useApiQuery from "../../hooks/useApiQuery"
import RoomStateDto from "../../dtos/RoomStateDto"
import Loading from "../../library/Loading"

const RoomSelection = () => {
    const { signOut } = useClerk()

    const allRoomsRequest = useApiQuery<RoomStateDto[]>("room")
    const rooms = allRoomsRequest.data ?? []

    const navigate = useNavigate()

    return (
        <Loading isLoading={allRoomsRequest.isLoading}>
            <div className="flex flex-col m-2">
                {rooms.map(room => (
                    <Button
                        key={room.roomId}
                        className="mb-2 mx-auto"
                        colour="bg-green-400"
                        text={`Join: ${room.displayName}`}
                        onClick={() => navigate(`/room/${room.roomId}`)}
                    />
                ))}
                <Button
                    className="mx-auto"
                    icon="fa-arrow-right-from-bracket"
                    colour="bg-slate-400"
                    text="Logout"
                    onClick={signOut}
                />
            </div>
        </Loading>
    )
}

export default RoomSelection
