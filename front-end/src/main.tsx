import React from "react"
import ReactDOM from "react-dom/client"
import Login from "./Login"
import "./index.css"
import { ThemeProvider } from "../components/theme-provider"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <Login />
    </ThemeProvider>
  </React.StrictMode>,
)
