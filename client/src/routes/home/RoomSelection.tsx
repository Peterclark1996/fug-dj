import { useClerk } from "@clerk/clerk-react"
import Button from "../../library/Button"
import { useNavigate } from "react-router-dom"

const RoomSelection = () => {
    const { signOut } = useClerk()

    const navigate = useNavigate()
    const navToDefaultRoom = () => {
        navigate("/room/default")
    }

    return (
        <div className="flex justify-around m-2">
            <Button icon="fa-arrow-right-from-bracket" colour="bg-slate-400" text="Logout" onClick={signOut} />
            <Button colour="bg-green-400" text="Join Room" onClick={navToDefaultRoom} />
        </div>
    )
}

export default RoomSelection
