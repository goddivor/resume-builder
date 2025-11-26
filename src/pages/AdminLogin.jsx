import { Lock, Mail, Shield } from 'lucide-react'
import React, { useState } from 'react'
import api from '../configs/api'
import { useDispatch } from 'react-redux'
import { login } from '../app/features/authSlice'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const AdminLogin = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { data } = await api.post('/api/admin/login', formData)
            dispatch(login(data))
            localStorage.setItem('token', data.token)
            localStorage.setItem('isAdmin', 'true')
            toast.success(data.message)
            navigate('/admin/dashboard')
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50'>
            <form onSubmit={handleSubmit} className="sm:w-[400px] w-full mx-4 text-center border border-purple-200 rounded-2xl px-8 py-10 bg-white shadow-xl">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                </div>

                <h1 className="text-gray-900 text-3xl font-bold">Admin Panel</h1>
                <p className="text-gray-500 text-sm mt-2 mb-8">Sign in to access the admin dashboard</p>

                <div className="flex items-center w-full bg-white border border-gray-300 h-12 rounded-lg overflow-hidden px-4 gap-3 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100 transition-all">
                    <Mail size={18} className="text-gray-400" />
                    <input
                        type="email"
                        name="email"
                        placeholder="Admin Email"
                        className="flex-1 border-none outline-none ring-0 text-sm"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="flex items-center mt-4 w-full bg-white border border-gray-300 h-12 rounded-lg overflow-hidden px-4 gap-3 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100 transition-all">
                    <Lock size={18} className="text-gray-400"/>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="flex-1 border-none outline-none ring-0 text-sm"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="mt-6 w-full h-12 rounded-lg text-white font-medium bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg shadow-purple-500/30"
                >
                    Sign In
                </button>

                <p className="text-gray-400 text-xs mt-6">
                    Admin access only. Unauthorized access is prohibited.
                </p>
            </form>
        </div>
    )
}

export default AdminLogin
