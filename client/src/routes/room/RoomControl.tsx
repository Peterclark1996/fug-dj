import RoomPanel from "../../types/RoomPanel"
import PanelSelectionButton from "../../library/PanelSelectionButton"

type RoomControlProps = {
    selectedRoomPanel: RoomPanel
    setSelectedRoomPanel: (panel: RoomPanel) => void
}

const RoomControl = ({ selectedRoomPanel, setSelectedRoomPanel }: RoomControlProps) => {
    return (
        <div className="flex grow">
            <PanelSelectionButton
                icon="fa-comments"
                backgroundColour="bg-cyan-200"
                textColour="text-cyan-200"
                direction="down"
                selected={selectedRoomPanel === "chat"}
                onClick={() => setSelectedRoomPanel("chat")}
            />
            <PanelSelectionButton
                icon="fa-list-ul"
                backgroundColour="bg-green-300"
                textColour="text-green-300"
                direction="down"
                selected={selectedRoomPanel === "queue"}
                onClick={() => setSelectedRoomPanel("queue")}
            />
            <PanelSelectionButton
                icon="fa-users"
                backgroundColour="bg-rose-300"
                textColour="text-rose-300"
                direction="down"
                selected={selectedRoomPanel === "users"}
                onClick={() => setSelectedRoomPanel("users")}
            />
        </div>
    )
}

export default RoomControl
