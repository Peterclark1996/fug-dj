import { seededRandomColour } from "../helpers"
import classes from "./Chat.module.scss"

type ChatProps = {
    message: string
    username: string
}

const Chat = ({ message, username }: ChatProps) => {
    return (
        <div className="flex text-sm my-1">
            <span className="break-all">
                <span
                    style={{ color: seededRandomColour(username) }}
                    className={`${classes.chat} inline-block leading-none align-middle font-semibold truncate`}
                >
                    {username}
                </span>
                {`: ${message}`}
            </span>
        </div>
    )
}

export default Chat
