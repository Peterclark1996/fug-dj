import { useEffect, useRef } from "react"
import classes from "./Input.module.scss"

type InputProps = {
    className?: string
    placeholder?: string
    invalidMessage?: string
    stretch?: boolean
    value: string
    onChange: (value: string) => void
}

const Input = ({ className = "", placeholder = "", invalidMessage, stretch = false, value, onChange }: InputProps) => {
    const inputRef = useRef<HTMLInputElement>(null)

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value)
    }

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.width = "auto"
            inputRef.current.style.width = `${inputRef.current.scrollWidth}px`
        }
    }, [value])

    return (
        <div className={`${className} rounded ${invalidMessage ? classes.invalid : ""}`}>
            <input
                ref={stretch ? undefined : inputRef}
                placeholder={placeholder}
                className="w-full rounded border-0 px-2 outline-none h-9 text-slate-800 form-deboss"
                value={value}
                onChange={onInputChange}
            />
        </div>
    )
}

export default Input
