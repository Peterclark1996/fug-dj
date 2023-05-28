type ButtonProps = {
    className?: string
    icon?: string
    text: string
    onClick: () => void
}

const Button = ({ className = "", icon, text, onClick }: ButtonProps) => {
    return (
        <div role="button" className={`${className} py-1 px-2 rounded bg-green-400 form-emboss`} onClick={onClick}>
            {text}
            {icon && <i className={`flex grow w-50% h-50% ms-2 fa-solid ${icon}`} />}
        </div>
    )
}

export default Button
