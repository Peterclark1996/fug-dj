import { useState } from "react"
import Loading from "./Loading"
import useIsMounted from "../hooks/useIsMounted"

type ButtonProps = {
    className?: string
    icon?: string
    text?: string
    colour: string
    onClick: () => void | Promise<unknown>
}

const Button = ({ className = "", icon, text, colour, onClick }: ButtonProps) => {
    const isMounted = useIsMounted()

    const [isLoading, setIsLoading] = useState(false)

    const onButtonClick = () => {
        const result: void | Promise<unknown> = onClick()
        if (result instanceof Promise) {
            setIsLoading(true)
            result
                .then(() => {
                    if (isMounted) {
                        setIsLoading(false)
                    }
                })
                .catch(() => {
                    if (isMounted) {
                        setIsLoading(false)
                    }
                })
        }
    }

    return (
        <div
            role="button"
            className={`
                ${className} ${text ? "" : "w-9"}
                h-9 py-1 px-2 rounded ${colour} form-emboss flex content-center items-center
            `}
            onClick={onButtonClick}
        >
            <Loading isLoading={isLoading}>
                <>
                    {text && text}
                    {icon && <i className={`flex grow ${text ? "ms-2" : ""} fa-solid ${icon}`} />}
                </>
            </Loading>
        </div>
    )
}

export default Button
