import PanelSelectionButton from "../../library/PanelSelectionButton"
import MainContentPanel from "../../types/MainContentPanel"

type MainContentControlProps = {
    selectedMainContentPanel: MainContentPanel
    setSelectedMainContentPanel: (panel: MainContentPanel) => void
}

const MainContentControl = ({ selectedMainContentPanel, setSelectedMainContentPanel }: MainContentControlProps) => {
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
        </div>
    )
}

export default MainContentControl
