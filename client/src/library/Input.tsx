import { useEffect, useRef } from "react"
import classes from "./Input.module.scss"

type InputProps = {
    className?: string
    placeholder?: string
    invalidMessage?: string
    mode?: "fittext" | "stretch"
    value: string
    onChange: (value: string) => void
    onEnterPressed?: () => void
}

const Input = ({
    className = "",
    placeholder = "",
    invalidMessage,
    mode = "fittext",
    value,
    onChange,
    onEnterPressed
}: InputProps) => {
    const inputRef = useRef<HTMLInputElement>(null)

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value)
    }

    useEffect(() => {
        if (mode !== "fittext") return

        if (inputRef.current) {
            inputRef.current.style.width = "auto"
            inputRef.current.style.width = `${inputRef.current.scrollWidth}px`
        }
    }, [mode, value])

    useEffect(() => {
        const currentRef = inputRef.current

        if (!currentRef) return

        const func = (event: KeyboardEvent) => {
            if (event.key === "Enter" && onEnterPressed) {
                onEnterPressed()
            }
        }

        currentRef.addEventListener("keyup", func)

        return () => currentRef.removeEventListener("keyup", func)
    }, [onEnterPressed])

    return (
        <div className={`${className} rounded ${invalidMessage ? classes.invalid : ""}`}>
            <input
                ref={inputRef}
                placeholder={placeholder}
                className="w-full rounded border-0 px-2 outline-none h-9 text-slate-800 form-deboss"
                value={value}
                onChange={onInputChange}
            />
        </div>
    )
}

export default Input
