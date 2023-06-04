import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { WebSocketProvider } from "../contexts/socket/WebSocketContext"
import Room from "./room/Room"
import { UserMediaProvider } from "../contexts/UserMediaContext"
import { ClerkProvider, RedirectToSignIn, SignIn, SignUp, SignedIn, SignedOut } from "@clerk/clerk-react"

const clerkPubKey = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY

const App = () => {
    const username = "Pete" // TODO: get username from api

    return (
        <ClerkProvider publishableKey={clerkPubKey}>
            <BrowserRouter>
                <Routes>
                    <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
                    <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />
                    <Route
                        path="/room/:roomId"
                        element={
                            <>
                                <SignedIn>
                                    <UserMediaProvider>
                                        <WebSocketProvider>
                                            <Room username={username} />
                                        </WebSocketProvider>
                                    </UserMediaProvider>
                                </SignedIn>
                                <SignedOut>
                                    <RedirectToSignIn />
                                </SignedOut>
                            </>
                        }
                    />
                    <Route
                        path="*"
                        element={
                            <>
                                <SignedIn>
                                    <Navigate to="/room/default" replace />
                                </SignedIn>
                                <SignedOut>
                                    <RedirectToSignIn />
                                </SignedOut>
                            </>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </ClerkProvider>
    )
}

export default App
