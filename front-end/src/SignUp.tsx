"use client"
import type React from "react"
import { useState } from "react"
import { FileText, ArrowLeft } from 'lucide-react'

interface SignUpProps {
  onSignUpSuccess: () => void
  onBackToLogin: () => void
}

export default function SignUp({ onSignUpSuccess, onBackToLogin }: SignUpProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState<string[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const validateForm = () => {
    const newErrors: string[] = []

    if (formData.firstName.trim().length < 2) {
      newErrors.push("First name must be at least 2 characters")
    }

    if (formData.lastName.trim().length < 2) {
      newErrors.push("Last name must be at least 2 characters")
    }

    if (!formData.email.includes("@")) {
      newErrors.push("Please enter a valid email address")
    }

    if (formData.password.length < 6) {
      newErrors.push("Password must be at least 6 characters")
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.push("Passwords do not match")
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      // Handle sign up logic here
      console.log("Sign up attempt:", formData)
      // Navigate back to login after successful signup
      onSignUpSuccess()
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="bg-slate-800 p-8 rounded-lg w-96 shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header with logo */}
        <div className="flex items-center justify-center mb-6">
          <div className="bg-blue-600 p-2 rounded mr-3">
            <FileText className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold">Apply Log</h1>
        </div>

        {/* Back to login button */}
        <button
          onClick={onBackToLogin}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </button>

        {/* Sign up form */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Sign Up</h2>
          <p className="text-gray-400 text-sm">Create your job tracking account!</p>
        </div>

        {/* Error messages */}
        {errors.length > 0 && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-600 rounded">
            {errors.map((error, index) => (
              <p key={index} className="text-red-300 text-sm">{error}</p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

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

          <div>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-medium transition-colors duration-200"
          >
            Create Account
          </button>
        </form>

        {/* Login link */}
        <div className="mt-6 text-center">
          <span className="text-gray-400 text-sm">Already have an account? </span>
          <button 
            onClick={onBackToLogin}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  )
}
