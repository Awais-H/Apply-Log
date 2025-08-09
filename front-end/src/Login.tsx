"use client"
import type React from "react"
import { useState } from "react"
import { FileText } from 'lucide-react'
import App from './App'
import SignUp from './SignUp'
import { API_BASE } from './api'

export default function Login() {
  const [currentPage, setCurrentPage] = useState<'login' | 'signup' | 'app'>('login')
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.message ?? 'Login failed')
      }
      // Example: store token if provided by backend
      if (data?.token) localStorage.setItem('token', data.token)
      setCurrentPage('app')
    } catch (err) {
      console.error(err)
      alert((err as Error).message)
    }
  }

  const handleSignUpSuccess = () => {
    setCurrentPage('login')
  }

  const handleLogout = () => {
    setCurrentPage('login')
    setFormData({ email: "", password: "" })
  }

  // Render different pages based on current state
  if (currentPage === 'app') {
    return <App onLogout={handleLogout} />
  }

  if (currentPage === 'signup') {
    return <SignUp onSignUpSuccess={handleSignUpSuccess} onBackToLogin={() => setCurrentPage('login')} />
  }

  // Default to login page
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="bg-slate-800 p-8 rounded-lg w-96 shadow-xl">
        {/* Header with logo */}
        <div className="flex items-center justify-center mb-6">
          <div className="bg-blue-600 p-2 rounded mr-3">
            <FileText className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold">Apply Log</h1>
        </div>

        {/* Login form */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Login</h2>
          <p className="text-gray-400 text-sm">Welcome back to your job tracker!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-medium transition-colors duration-200"
          >
            Submit
          </button>
        </form>

        {/* Sign up link */}
        <div className="mt-6 text-center">
          <span className="text-gray-400 text-sm">Don't have an account? </span>
          <button 
            onClick={() => setCurrentPage('signup')}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  )
}
