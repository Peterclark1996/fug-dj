type RoomProps = {
    username: string
}

const Room = ({ username }: RoomProps) => {
    return (
        <div>
            <h1>Connected as: {username}</h1>
        </div>
    )
}

export default Room
