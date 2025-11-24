import { Lock, Mail, User2Icon } from 'lucide-react'
import React from 'react'
import api from '../configs/api'
import { useDispatch } from 'react-redux'
import { login } from '../app/features/authSlice'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../components/LanguageSwitcher'

const Login = () => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
  const query = new URLSearchParams(window.location.search)
  const urlState = query.get('state')
  const [state, setState] = React.useState(urlState || "login")

    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        password: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { data } = await api.post(`/api/users/${state}`, formData)
            dispatch(login(data))
            localStorage.setItem('token', data.token)
            toast.success(data.message)
        } catch (error) {
            toast(error?.response?.data?.message || error.message)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <form onSubmit={handleSubmit} className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white">
                <h1 className="text-gray-900 text-3xl mt-10 font-medium">{state === "login" ? t('auth.login') : t('auth.signup')}</h1>
                <p className="text-gray-500 text-sm mt-2">{state === "login" ? t('auth.loginSubtitle') : t('auth.signupSubtitle')}</p>
                {state !== "login" && (
                    <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                        <User2Icon size={16} color='#6B7280'/>
                        <input type="text" name="name" placeholder={t('auth.namePlaceholder')} className="border-none outline-none ring-0" value={formData.name} onChange={handleChange} required />
                    </div>
                )}
                <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                    <Mail size={13} color="#6B7280" />
                    <input type="email" name="email" placeholder={t('auth.emailPlaceholder')} className="border-none outline-none ring-0" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                    <Lock size={13} color="#6B7280"/>
                    <input type="password" name="password" placeholder={t('auth.passwordPlaceholder')} className="border-none outline-none ring-0" value={formData.password} onChange={handleChange} required />
                </div>
                <div className="mt-4 text-left text-green-500">
                    <button className="text-sm" type="reset">{t('auth.forgotPassword')}</button>
                </div>
                <button type="submit" className="mt-2 w-full h-11 rounded-full text-white bg-green-500 hover:opacity-90 transition-opacity">
                    {state === "login" ? t('auth.loginButton') : t('auth.signupButton')}
                </button>
                <p onClick={() => setState(prev => prev === "login" ? "register" : "login")} className="text-gray-500 text-sm mt-3 mb-11 cursor-pointer">{state === "login" ? t('auth.noAccount') : t('auth.hasAccount')} <a href="#" className="text-green-500 hover:underline">{t('auth.clickHere')}</a></p>
            </form>
    </div>
  )
}

export default Login
