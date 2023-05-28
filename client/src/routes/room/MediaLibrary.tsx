import { useState } from "react"
import Input from "../../library/Input"
import Button from "../../library/Button"
import useApiMutation from "../../hooks/useApiMutation"

const MediaLibrary = () => {
    const [mediaToAdd, setMediaToAdd] = useState<string>("")

    const addNewMediaRequest = useApiMutation("post", "playlist/_default/media")

    const onAddClick = () => addNewMediaRequest.execute({ url: mediaToAdd })

    return (
        <div className="flex flex-col p-3">
            <span className="me-auto">Media Library</span>
            <div className="flex items-center">
                <span>Url</span>
                <Input className="ms-2" value={mediaToAdd} onChange={setMediaToAdd} />
                <Button className="ms-2" icon="fa-plus" text="Add" onClick={onAddClick} />
            </div>
        </div>
    )
}

export default MediaLibrary
