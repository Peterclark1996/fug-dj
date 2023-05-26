type LoadingProps = {
    children: JSX.Element
    isLoading: boolean
}

const Loading = ({ children, isLoading }: LoadingProps) => {
    if (isLoading)
        return (
            <div>
                <span>Loading...</span>
            </div>
        )
    return children
}

export default Loading
