import { useEffect, useState } from "react"
import Input from "../../../library/Input"
import Button from "../../../library/Button"
import Chat from "./Chat"
import { useWebSocket } from "../../../contexts/WebSocketContext"
import { EventFromServer, EventFromServer_UserSentMessage } from "../../../contexts/EventFromServer"
import Message from "../../../types/Message"

type ChatPanelProps = {
    username: string
}

const ChatPanel = ({ username }: ChatPanelProps) => {
    const { on, send } = useWebSocket()

    const [messages, setMessages] = useState<Message[]>([])
    const [messageInputValue, setMessageInputValue] = useState("")

    useEffect(() => {
        on("USER_SENT_MESSAGE", (data: EventFromServer) => {
            const event = data as EventFromServer_UserSentMessage

            setMessages(existingMessages => [
                {
                    id: (existingMessages[0]?.id ?? 0) + 1,
                    username: event.data.username,
                    message: event.data.message,
                    timestamp: event.data.timestamp
                },
                ...existingMessages
            ])
        })
    }, [on])

    const onSendMessage = () => {
        if (messageInputValue === "") return

        send({
            type: "USER_SENT_MESSAGE",
            data: {
                username,
                message: messageInputValue
            }
        })

        setMessageInputValue("")
    }

    return (
        <div className="flex flex-col grow m-2 overflow-auto">
            <div className="flex flex-col-reverse grow items-start rounded mb-2 px-2 overflow-auto bg-slate-700 form-deboss">
                {messages.map(m => (
                    <Chat key={m.id} message={m.message} username={m.username} />
                ))}
                <div className="m-auto" />
            </div>
            <div className="flex mt-auto">
                <Input
                    className="grow"
                    placeholder="Type a message..."
                    stretch={true}
                    value={messageInputValue}
                    onChange={setMessageInputValue}
                />
                <Button className="ms-2" colour="bg-cyan-600" icon="fa-play" onClick={onSendMessage} />
            </div>
        </div>
    )
}

export default ChatPanel
