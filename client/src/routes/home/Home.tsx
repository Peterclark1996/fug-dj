import useApiQuery from "../../hooks/useApiQuery"
import UserDataDto from "../../dtos/UserDataDto"
import Loading from "../../library/Loading"
import CreateUserForm from "./CreateUserForm"
import RoomSelection from "./RoomSelection"

const Home = () => {
    const userDataRequest = useApiQuery<UserDataDto>("user")

    return (
        <div className="flex bg-slate-700 h-screen w-screen text-white items-center justify-center">
            <Loading isLoading={userDataRequest.isLoading}>
                {userDataRequest.hasErrored ? (
                    <span className="text-3xl">{"Failed to connect to Fug DJ :("}</span>
                ) : (
                    <div className="py-2 rounded bg-slate-600 form-emboss outline outline-1 outline-slate-800">
                        <span className="text-3xl mx-2">Welcome to fug dj</span>
                        {userDataRequest.statusCode === 200 ? <RoomSelection /> : <CreateUserForm />}
                    </div>
                )}
            </Loading>
        </div>
    )
}

export default Home
