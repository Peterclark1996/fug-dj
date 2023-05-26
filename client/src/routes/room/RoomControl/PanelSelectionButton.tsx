type PanelSelectionButtonProps = {
    icon: string
    backgroundColour: string
    textColour: string
    selected: boolean
    onClick: () => void
}

const PanelSelectionButton = ({ icon, backgroundColour, textColour, selected, onClick }: PanelSelectionButtonProps) => {
    return (
        <div className={`flex flex-col grow items-stretch cursor-pointer bg-slate-600`} onClick={onClick}>
            <i className={`flex grow w-50% h-50% p-3 ${selected ? textColour : "text-slate-800"} fa-solid ${icon}`} />
            <div className={`max-h-1 flex grow ${selected ? backgroundColour : "bg-slate-800"}`}></div>
        </div>
    )
}

export default PanelSelectionButton
