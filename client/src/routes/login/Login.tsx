import { useNavigate } from "react-router-dom"

type LoginProps = {
    username: string
    setUsername: (username: string) => void
}

const Login = ({ username, setUsername }: LoginProps) => {
    const navigate = useNavigate()

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)

    const onLoginClick = () => {
        if (username === "") return
        navigate("/room/default")
    }

    return (
        <div className="rounded p-2 text-white select-none bg-slate-500 form-emboss">
            <span className="text-4xl">Fug DJ</span>
            <div className="flex mt-2">
                <input
                    className="rounded border-0 px-2 outline-none text-slate-800 form-deboss"
                    value={username}
                    onChange={onInputChange}
                />
                <div role="button" className="ms-2 py-1 px-2 rounded bg-green-400 form-emboss" onClick={onLoginClick}>
                    Login
                </div>
            </div>
        </div>
    )
}

export default Login
