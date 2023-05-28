import Login from "./login/Login"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useState } from "react"
import { WebSocketProvider } from "../contexts/socket/WebSocketContext"
import Room from "./room/Room"
import { UserMediaProvider } from "../contexts/UserMediaContext"

const App = () => {
    const [username, setUsername] = useState<string>("")

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login username={username} setUsername={setUsername} />} />
                <Route
                    path="/room/:roomId"
                    element={
                        <UserMediaProvider>
                            <WebSocketProvider>
                                <Room username={username} />
                            </WebSocketProvider>
                        </UserMediaProvider>
                    }
                />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
