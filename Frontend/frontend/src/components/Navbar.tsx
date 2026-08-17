import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { LogOut, User } from 'lucide-react'

const Navbar = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="w-full px-6 py-4 flex justify-between items-center backdrop-blur-lg bg-white/10 border-b border-white/20">
            <div className="text-xl font-semibold text-white flex items-center gap-2">
                <User size={22} />
                {user?.name}
            </div>
            <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
            >
                <LogOut size={18} />
                Logout
            </button>
        </nav>
    )
}

export default Navbar