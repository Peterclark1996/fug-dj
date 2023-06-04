import classes from "./InfoIcon.module.scss"

type InfoIconProps = {
    infoMessage: string
}

const InfoIcon = ({ infoMessage }: InfoIconProps) => {
    return (
        <i className={`${classes.tooltip} fa-solid fa-triangle-exclamation fa-lg text-red-500`}>
            <div role="tooltip" className={`${classes.tooltiptext} rounded p-1 text-white default-font`}>
                {infoMessage}
            </div>
        </i>
    )
}

export default InfoIcon
