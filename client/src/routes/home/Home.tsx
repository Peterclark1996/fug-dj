import { useNavigate } from "react-router-dom"
import { useClerk } from "@clerk/clerk-react"
import Button from "../../library/Button"
import useApiQuery from "../../hooks/useApiQuery"
import UserDataDto from "../../dtos/UserDataDto"
import Loading from "../../library/Loading"
import Input from "../../library/Input"
import { useState } from "react"
import useApiMutation from "../../hooks/useApiMutation"
import InfoIcon from "../../library/InfoIcon"

const Home = () => {
    const userDataRequest = useApiQuery<UserDataDto>("user")

    const { signOut } = useClerk()
    const navigate = useNavigate()

    const navToDefaultRoom = () => {
        navigate("/room/default")
    }

    const [shouldShowFormErrors, setShouldShowFormErrors] = useState<boolean>(false)

    const [displayName, setDisplayName] = useState<string>("")

    const putUserDataRequest = useApiMutation("put", "user")
    const onCreateUserClick = () =>
        putUserDataRequest.execute({ displayName }).then(result => {
            if (result.statusCode === 200) {
                navToDefaultRoom()
            } else if (result.statusCode === 400) {
                setShouldShowFormErrors(true)
            }
        })

    const shouldShowFormAsInvalid = shouldShowFormErrors && displayName.trim().length < 3

    return (
        <div className="flex bg-slate-700 h-screen w-screen text-white items-center justify-center">
            <Loading isLoading={userDataRequest.isLoading}>
                <div className="py-2 rounded bg-slate-600 form-emboss outline outline-1 outline-slate-800">
                    <span className="text-3xl mx-2">Welcome to fug dj</span>
                    {userDataRequest.statusCode === 200 ? (
                        <div className="flex justify-around m-2">
                            <Button
                                icon="fa-arrow-right-from-bracket"
                                colour="bg-slate-400"
                                text="Logout"
                                onClick={signOut}
                            />
                            <Button colour="bg-green-400" text="Join Room" onClick={navToDefaultRoom} />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center mt-2">
                            <div className="flex mb-2">
                                <div className="flex w-10" />
                                <Input
                                    placeholder="Pick a display name"
                                    invalidMessage={
                                        shouldShowFormAsInvalid
                                            ? "Display name must be at least 3 characters"
                                            : undefined
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
                    )}
                </div>
            </Loading>
        </div>
    )
}

export default Home
