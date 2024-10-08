import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { WebSocketProvider } from "../contexts/WebSocketContext"
import Room from "./room/Room"
import { ClerkProvider, RedirectToSignIn, SignIn, SignUp, SignedIn, SignedOut } from "@clerk/clerk-react"
import Home from "./home/Home"
import CreateUserForm from "./createUser/CreateUserForm"

const clerkPubKey = "pk_test_d2VsY29tZS1hcmFjaG5pZC0zMS5jbGVyay5hY2NvdW50cy5kZXYk"

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
                        path="/create-user"
                        element={
                            <>
                                <SignedIn>
                                    <CreateUserForm />
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
