type PanelSelectionButtonProps = {
    icon: string
    backgroundColour: string
    textColour: string
    direction: "down" | "right"
    selected: boolean
    onClick: () => void
}

const PanelSelectionButton = ({
    icon,
    backgroundColour,
    textColour,
    direction,
    selected,
    onClick
}: PanelSelectionButtonProps) => {
    return (
        <div
            role="button"
            className={`flex ${direction === "down" ? "flex-col" : ""} grow items-stretch bg-slate-600`}
            onClick={onClick}
        >
            <i
                className={`flex grow w-50% h-50% px-3 ${direction === "down" ? "py-3" : "py-4"} ${
                    selected ? textColour : "text-slate-800"
                } fa-solid ${icon}`}
            />
            <div
                className={`${direction === "down" ? "h-1" : "w-1"} flex ${
                    selected ? backgroundColour : "bg-slate-800"
                }`}
            />
        </div>
    )
}

export default PanelSelectionButton
