import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { WebSocketProvider } from "../contexts/WebSocketContext"
import Room from "./room/Room"
import { ClerkProvider, RedirectToSignIn, SignIn, SignUp, SignedIn, SignedOut } from "@clerk/clerk-react"
import Home from "./home/Home"

const clerkPubKey = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY

const App = () => {
    return (
        <ClerkProvider publishableKey={clerkPubKey}>
            <BrowserRouter>
                <Routes>
                    <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
                    <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />
                    <Route
                        path="/home"
                        element={
                            <>
                                <SignedIn>
                                    <Home />
                                </SignedIn>
                                <SignedOut>
                                    <RedirectToSignIn />
                                </SignedOut>
                            </>
                        }
                    />
                    <Route
                        path="/room/:roomId"
                        element={
                            <>
                                <SignedIn>
                                    <WebSocketProvider>
                                        <Room />
                                    </WebSocketProvider>
                                </SignedIn>
                                <SignedOut>
                                    <RedirectToSignIn />
                                </SignedOut>
                            </>
                        }
                    />
                    <Route path="*" element={<Navigate to="/home" />} />
                </Routes>
            </BrowserRouter>
        </ClerkProvider>
    )
}

export default App
