type UsersPanelProps = {
    connectedUsers: string[]
}

const UsersPanel = ({ connectedUsers }: UsersPanelProps) => {
    return (
        <div className="flex flex-col">
            {connectedUsers.map(user => (
                <span key={user}>{user}</span>
            ))}
        </div>
    )
}

export default UsersPanel
