import classes from "./Loading.module.scss"

type LoadingProps = {
    children: JSX.Element
    isLoading: boolean
}

const Loading = ({ children, isLoading }: LoadingProps) => {
    if (isLoading) {
        return (
            <div className="relative">
                <div className="absolute inset-0">
                    <div
                        className={`absolute h-5 w-5 m-auto rounded-full border-2 border-x-blue-500 border-y-transparent inset-0 ${classes.spinner}`}
                    />
                </div>
                <div className="invisible">{children}</div>
            </div>
        )
    }

    return <>{children}</>
}

export default Loading
