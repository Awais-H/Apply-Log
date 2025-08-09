import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import Login from "./Login";
import "./index.css";
import { ThemeProvider } from "@/components/theme-provider";
ReactDOM.createRoot(document.getElementById("root")).render(_jsx(React.StrictMode, { children: _jsx(ThemeProvider, { children: _jsx(Login, {}) }) }));
