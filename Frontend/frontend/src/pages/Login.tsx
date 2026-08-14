import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const {user, token, login} = useAuth()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const validateLogin = ()=>{
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let valid = true

        if(!email.trim()){
            setEmailError('Login error email required')
            valid = false
        }
        else if (!emailRegex.test(email.trim())){
            setEmailError('Login error invalid email')
            valid = false
        }

        if(!password){
            setPasswordError('Login error password required')
            valid = false
        }
        return valid
    }

    const handleLogin = async ()=>{
        if(!validateLogin()) return
        setLoading(true)
        try {
            const payload = {
                email: email.trim().toLowerCase(),
                password: password
            }
            const response = await api.post('auth/login', payload)
            login(response.data.user, response.data.access_token)
            navigate('/')
        }
        catch(error: any){
            setPasswordError(error.response?.data?.message || 'Login failed')
        }
        finally {
            setLoading(false)
        }
    }
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-300 to-sky-500">
            <div className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl shadow-xl p-8 w-full max-w-sm">
                <h1 className="text-2xl font-bold text-white text-center mb-6">Welcome Back</h1>

                <div className="mb-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-white/40 placeholder-gray-700 text-gray-900 outline-none focus:ring-2 focus:ring-white"
                    />
                    {emailError && <p className="text-red-100 text-sm mt-1">{emailError}</p>}
                </div>

                <div className="mb-6">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-white/40 placeholder-gray-700 text-gray-900 outline-none focus:ring-2 focus:ring-white"
                    />
                    {passwordError && <p className="text-red-100 text-sm mt-1">{passwordError}</p>}
                </div>

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full bg-white/80 hover:bg-white text-sky-700 font-semibold py-2 rounded-lg transition disabled:opacity-50"
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </div>
        </div>
    </>
  )
}

export default Login