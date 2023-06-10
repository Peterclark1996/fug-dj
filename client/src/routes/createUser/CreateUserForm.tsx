import { useState } from "react"
import Button from "../../library/Button"
import InfoIcon from "../../library/InfoIcon"
import Input from "../../library/Input"
import useApiMutation from "../../hooks/useApiMutation"
import { useNavigate } from "react-router-dom"

const CreateUserForm = () => {
    const [shouldShowFormErrors, setShouldShowFormErrors] = useState<boolean>(false)

    const [displayName, setDisplayName] = useState<string>("")

    const navigate = useNavigate()
    const navToHome = () => {
        navigate("/home")
    }

    const putUserDataRequest = useApiMutation("put", "user")
    const onCreateUserClick = () =>
        putUserDataRequest.execute({ displayName }).then(result => {
            if (result.statusCode === 200) {
                navToHome()
            } else if (result.statusCode === 400) {
                setShouldShowFormErrors(true)
            }
        })

    const shouldShowFormAsInvalid = shouldShowFormErrors && displayName.trim().length < 3

    return (
        <div className="flex bg-slate-700 h-screen w-screen text-white items-center justify-center">
            <div className="py-2 rounded bg-slate-600 form-emboss outline outline-1 outline-slate-800">
                <span className="text-3xl mx-2">Welcome to fug dj</span>
                <div className="flex flex-col items-center mt-2">
                    <div className="flex mb-2">
                        <div className="flex w-10" />
                        <Input
                            placeholder="Pick a display name"
                            invalidMessage={
                                shouldShowFormAsInvalid ? "Display name must be at least 3 characters" : undefined
                            }
                            value={displayName}
                            onChange={setDisplayName}
                        />
                        <div className="flex w-10 items-center justify-center">
                            {shouldShowFormAsInvalid && (
                                <InfoIcon infoMessage="Display name must be at least 3 characters" />
                            )}
                        </div>
                    </div>
                    <Button colour="bg-green-400" text="Create user" onClick={onCreateUserClick} />
                </div>
            </div>
        </div>
    )
}

export default CreateUserForm
