type StageProps = {
    username: string
}

const Stage = ({ username }: StageProps) => {
    return (
        <div className="flex flex-col">
            <span>Stage</span>
            <span>username: {username}</span>
        </div>
    )
}

export default Stage
