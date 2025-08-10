"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { FileText } from 'lucide-react';
import App from './App';
import SignUp from './SignUp';
import { API_BASE } from './api';
export default function Login() {
    const [currentPage, setCurrentPage] = useState(localStorage.getItem('token') ? 'app' : 'login');
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, password: formData.password }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data?.message ?? 'Login failed');
            }
            // Example: store token if provided by backend
            if (data?.token)
                localStorage.setItem('token', data.token);
            setCurrentPage('app');
        }
        catch (err) {
            console.error(err);
            alert(err.message);
        }
    };
    const handleSignUpSuccess = () => {
        // If signup returned a token, go straight to the app
        if (localStorage.getItem('token')) {
            setCurrentPage('app');
        }
        else {
            setCurrentPage('login');
        }
    };
    const handleLogout = () => {
        localStorage.removeItem('token');
        setCurrentPage('login');
        setFormData({ email: "", password: "" });
    };
    // Render different pages based on current state
    if (currentPage === 'app') {
        return _jsx(App, { onLogout: handleLogout });
    }
    if (currentPage === 'signup') {
        return _jsx(SignUp, { onSignUpSuccess: handleSignUpSuccess, onBackToLogin: () => setCurrentPage('login') });
    }
    // Default to login page
    return (_jsx("div", { className: "min-h-screen bg-slate-900 text-white flex items-center justify-center", children: _jsxs("div", { className: "bg-slate-800 p-8 rounded-lg w-96 shadow-xl", children: [_jsxs("div", { className: "flex items-center justify-center mb-6", children: [_jsx("div", { className: "bg-blue-600 p-2 rounded mr-3", children: _jsx(FileText, { className: "w-6 h-6" }) }), _jsx("h1", { className: "text-2xl font-bold", children: "Apply Log" })] }), _jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-2", children: "Login" }), _jsx("p", { className: "text-gray-400 text-sm", children: "Welcome back to your job tracker!" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx("div", { children: _jsx("input", { type: "email", name: "email", value: formData.email, onChange: handleInputChange, placeholder: "Email", className: "w-full p-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent", required: true }) }), _jsx("div", { children: _jsx("input", { type: "password", name: "password", value: formData.password, onChange: handleInputChange, placeholder: "Password", className: "w-full p-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent", required: true }) }), _jsx("button", { type: "submit", className: "w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-medium transition-colors duration-200", children: "Submit" })] }), _jsxs("div", { className: "mt-6 text-center", children: [_jsx("span", { className: "text-gray-400 text-sm", children: "Don't have an account? " }), _jsx("button", { onClick: () => setCurrentPage('signup'), className: "text-blue-400 hover:text-blue-300 text-sm font-medium", children: "Sign up" })] })] }) }));
}
