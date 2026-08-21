import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers:{
        'Cache-Control': 'no-cache',
    }
})

api.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token')
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (response)=> response,
    (error) => {
        const isAuthRoute = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
        if(error.response?.status === 401 && !isAuthRoute){
            localStorage.removeItem('token')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api