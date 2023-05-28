type ButtonProps = {
    className?: string
    icon?: string
    text?: string
    colour: string
    onClick: () => void
}

const Button = ({ className = "", icon, text, colour, onClick }: ButtonProps) => {
    return (
        <div
            role="button"
            className={`${className} ${text ? "" : "w-9 "} h-9 py-1 px-2 rounded ${colour} form-emboss`}
            onClick={onClick}
        >
            {text && text}
            {icon && <i className={`flex grow w-50% h-50% ${text ? "ms-2" : "fa-xl"} fa-solid ${icon}`} />}
        </div>
    )
}

export default Button
