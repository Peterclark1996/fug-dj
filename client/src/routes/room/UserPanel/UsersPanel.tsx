import User from "./User"

type UsersPanelProps = {
    connectedUsers: string[]
}

const UsersPanel = ({ connectedUsers }: UsersPanelProps) => {
    return (
        <div className="flex flex-col grow px-4">
            {connectedUsers.map(user => (
                <User key={user} username={user} />
            ))}
        </div>
    )
}

export default UsersPanel
