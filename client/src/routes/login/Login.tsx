import { useNavigate } from "react-router-dom"
import Input from "../../library/Input"

type LoginProps = {
    username: string
    setUsername: (username: string) => void
}

const Login = ({ username, setUsername }: LoginProps) => {
    const navigate = useNavigate()

    const onLoginClick = () => {
        if (username === "") return
        navigate("/room/default")
    }

    return (
        <div className="flex items-center h-screen w-screen bg-slate-700">
            <div className="rounded p-2 mx-auto text-white select-none bg-slate-500 form-emboss">
                <span className="text-4xl">Fug DJ</span>
                <div className="flex mt-2">
                    <Input value={username} onChange={setUsername} />
                    <div
                        role="button"
                        className="ms-2 py-1 px-2 rounded bg-green-400 form-emboss"
                        onClick={onLoginClick}
                    >
                        Login
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
