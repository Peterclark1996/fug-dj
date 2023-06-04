import { useClerk } from "@clerk/clerk-react"
import PanelSelectionButton from "../../library/PanelSelectionButton"
import MainContentPanel from "../../types/MainContentPanel"

type MainContentControlProps = {
    selectedMainContentPanel: MainContentPanel
    setSelectedMainContentPanel: (panel: MainContentPanel) => void
}

const MainContentControl = ({ selectedMainContentPanel, setSelectedMainContentPanel }: MainContentControlProps) => {
    const { signOut } = useClerk()

    return (
        <div>
            <PanelSelectionButton
                icon="fa-book"
                backgroundColour="bg-amber-200"
                textColour="text-amber-200"
                direction="right"
                selected={selectedMainContentPanel === "library"}
                onClick={() =>
                    setSelectedMainContentPanel(selectedMainContentPanel === "library" ? "stage" : "library")
                }
            />
            <PanelSelectionButton
                icon="fa-arrow-right-from-bracket"
                backgroundColour=""
                textColour=""
                direction="right"
                selected={false}
                onClick={signOut}
            />
        </div>
    )
}

export default MainContentControl
