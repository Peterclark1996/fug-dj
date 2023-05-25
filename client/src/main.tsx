import React, { StrictMode } from "react"
import { render } from "react-dom"
import App from "./routes/App"
import "./index.css"
import "@fortawesome/fontawesome-free/css/all.min.css"
import "./global.scss"

const rootElement = document.getElementById("root")
render(
    <StrictMode>
        <App />
    </StrictMode>,
    rootElement
)
