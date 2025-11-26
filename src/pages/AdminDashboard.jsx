import React, { useEffect, useState } from 'react'
import { Users, FileText, Folder, Globe, TrendingUp, LogOut, Trash2, Eye } from 'lucide-react'
import api from '../configs/api'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../app/features/authSlice'

const AdminDashboard = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { token, user } = useSelector(state => state.auth)
    const [stats, setStats] = useState(null)
    const [users, setUsers] = useState([])
    const [resumes, setResumes] = useState([])
    const [activeTab, setActiveTab] = useState('overview')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check if user is admin
        const isAdmin = localStorage.getItem('isAdmin')
        if (!isAdmin || !token) {
            navigate('/admin/login')
            return
        }
        loadStats()
        if (activeTab === 'users') loadUsers()
        if (activeTab === 'resumes') loadResumes()
    }, [activeTab, token, navigate])

    const loadStats = async () => {
        try {
            const { data } = await api.get('/api/admin/stats', {
                headers: { Authorization: token }
            })
            setStats(data.stats)
            setLoading(false)
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
            if (error?.response?.status === 403) {
                navigate('/admin/login')
            }
        }
    }

    const loadUsers = async () => {
        try {
            const { data } = await api.get('/api/admin/users', {
                headers: { Authorization: token }
            })
            setUsers(data.users)
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        }
    }

    const loadResumes = async () => {
        try {
            const { data } = await api.get('/api/admin/resumes', {
                headers: { Authorization: token }
            })
            setResumes(data.resumes)
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        }
    }

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user and all their data?')) return

        try {
            await api.delete(`/api/admin/users/${userId}`, {
                headers: { Authorization: token }
            })
            toast.success('User deleted successfully')
            loadUsers()
            loadStats()
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        }
    }

    const handleDeleteResume = async (resumeId) => {
        if (!window.confirm('Are you sure you want to delete this resume?')) return

        try {
            await api.delete(`/api/admin/resumes/${resumeId}`, {
                headers: { Authorization: token }
            })
            toast.success('Resume deleted successfully')
            loadResumes()
            loadStats()
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('isAdmin')
        dispatch(logout())
        navigate('/admin/login')
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-purple-600 text-lg">Loading...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                                <p className="text-sm text-gray-500">Welcome back, {user?.name}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Navigation Tabs */}
                <div className="flex gap-2 mb-8 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                            activeTab === 'overview'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                            activeTab === 'users'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Users
                    </button>
                    <button
                        onClick={() => setActiveTab('resumes')}
                        className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                            activeTab === 'resumes'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Resumes
                    </button>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <StatCard
                            icon={Users}
                            title="Total Users"
                            value={stats.totalUsers}
                            color="bg-blue-500"
                            recent={`+${stats.recentUsers} this week`}
                        />
                        <StatCard
                            icon={FileText}
                            title="Total Resumes"
                            value={stats.totalResumes}
                            color="bg-green-500"
                            recent={`+${stats.recentResumes} this week`}
                        />
                        <StatCard
                            icon={Globe}
                            title="Public Resumes"
                            value={stats.publicResumes}
                            color="bg-purple-500"
                        />
                        <StatCard
                            icon={Folder}
                            title="Total Annexes"
                            value={stats.totalAnnexes}
                            color="bg-orange-500"
                        />
                        <StatCard
                            icon={TrendingUp}
                            title="New Users (7d)"
                            value={stats.recentUsers}
                            color="bg-cyan-500"
                        />
                        <StatCard
                            icon={TrendingUp}
                            title="New Resumes (7d)"
                            value={stats.recentResumes}
                            color="bg-pink-500"
                        />
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {users.map(user => (
                                        <tr key={user._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {user.role !== 'admin' && (
                                                    <button
                                                        onClick={() => handleDeleteUser(user._id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Resumes Tab */}
                {activeTab === 'resumes' && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {resumes.map(resume => (
                                        <tr key={resume._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{resume.title}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{resume.userId?.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    resume.public ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {resume.public ? 'Public' : 'Private'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(resume.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex gap-2">
                                                    {resume.public && (
                                                        <a
                                                            href={`/view/${resume.slug || resume._id}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteResume(resume._id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

const StatCard = ({ icon: Icon, title, value, color, recent }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                    {recent && (
                        <p className="text-xs text-gray-500 mt-1">{recent}</p>
                    )}
                </div>
                <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
