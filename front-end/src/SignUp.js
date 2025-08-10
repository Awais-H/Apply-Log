"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { FileText, ArrowLeft } from 'lucide-react';
import { API_BASE } from './api';
export default function SignUp({ onSignUpSuccess, onBackToLogin }) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState([]);
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const validateForm = () => {
        const newErrors = [];
        if (formData.firstName.trim().length < 2) {
            newErrors.push("First name must be at least 2 characters");
        }
        if (formData.lastName.trim().length < 2) {
            newErrors.push("Last name must be at least 2 characters");
        }
        if (!formData.email.includes("@")) {
            newErrors.push("Please enter a valid email address");
        }
        if (formData.password.length < 6) {
            newErrors.push("Password must be at least 6 characters");
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.push("Passwords do not match");
        }
        setErrors(newErrors);
        return newErrors.length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm())
            return;
        try {
            const res = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password,
                    cpassword: formData.confirmPassword,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data?.message ?? 'Registration failed');
            }
            if (data?.token) {
                localStorage.setItem('token', data.token);
            }
            onSignUpSuccess();
        }
        catch (err) {
            console.error(err);
            alert(err.message);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-slate-900 text-white flex items-center justify-center", children: _jsxs("div", { className: "bg-slate-800 p-8 rounded-lg w-96 shadow-xl max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex items-center justify-center mb-6", children: [_jsx("div", { className: "bg-blue-600 p-2 rounded mr-3", children: _jsx(FileText, { className: "w-6 h-6" }) }), _jsx("h1", { className: "text-2xl font-bold", children: "Apply Log" })] }), _jsxs("button", { onClick: onBackToLogin, className: "flex items-center gap-2 text-gray-400 hover:text-white mb-4 text-sm", children: [_jsx(ArrowLeft, { className: "w-4 h-4" }), "Back to Login"] }), _jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-2", children: "Sign Up" }), _jsx("p", { className: "text-gray-400 text-sm", children: "Create your job tracking account!" })] }), errors.length > 0 && (_jsx("div", { className: "mb-4 p-3 bg-red-900/50 border border-red-600 rounded", children: errors.map((error, index) => (_jsx("p", { className: "text-red-300 text-sm", children: error }, index))) })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsx("div", { children: _jsx("input", { type: "text", name: "firstName", value: formData.firstName, onChange: handleInputChange, placeholder: "First Name", className: "w-full p-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent", required: true }) }), _jsx("div", { children: _jsx("input", { type: "text", name: "lastName", value: formData.lastName, onChange: handleInputChange, placeholder: "Last Name", className: "w-full p-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent", required: true }) })] }), _jsx("div", { children: _jsx("input", { type: "email", name: "email", value: formData.email, onChange: handleInputChange, placeholder: "Email", className: "w-full p-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent", required: true }) }), _jsx("div", { children: _jsx("input", { type: "password", name: "password", value: formData.password, onChange: handleInputChange, placeholder: "Password", className: "w-full p-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent", required: true }) }), _jsx("div", { children: _jsx("input", { type: "password", name: "confirmPassword", value: formData.confirmPassword, onChange: handleInputChange, placeholder: "Confirm Password", className: "w-full p-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent", required: true }) }), _jsx("button", { type: "submit", className: "w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-medium transition-colors duration-200", children: "Create Account" })] }), _jsxs("div", { className: "mt-6 text-center", children: [_jsx("span", { className: "text-gray-400 text-sm", children: "Already have an account? " }), _jsx("button", { onClick: onBackToLogin, className: "text-blue-400 hover:text-blue-300 text-sm font-medium", children: "Login" })] })] }) }));
}
