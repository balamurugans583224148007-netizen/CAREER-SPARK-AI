import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  PlusSquare, 
  FileText, 
  CheckSquare, 
  History, 
  UserCheck, 
  Settings, 
  User, 
  LogOut, 
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, posts, addToast } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingCount = posts.filter(p => p.status === 'pending_approval').length;

  const handleLogout = () => {
    addToast('info', 'Logged out successfully.');
    navigate('/auth');
  };

  const navItems = [
    { to: '/', icon: <Home size={18} />, label: 'Dashboard' },
    { to: '/create', icon: <PlusSquare size={18} />, label: 'Create Post', highlight: true },
    { to: '/social-feed', icon: <Sparkles size={18} />, label: 'Live Social Feeds', highlight: true },
    { to: '/posts', icon: <FileText size={18} />, label: 'My Posts' },
    { to: '/approvals', icon: <CheckSquare size={18} />, label: 'Approval Centre', badge: pendingCount > 0 ? pendingCount : undefined },
    { to: '/accounts', icon: <UserCheck size={18} />, label: 'Connected Accounts' },
    { to: '/history', icon: <History size={18} />, label: 'Publishing History' },
    { to: '/profile', icon: <User size={18} />, label: 'User Profile' },
    { to: '/settings', icon: <Settings size={18} />, label: 'Settings' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-base text-gray-100 font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-950/80 border-r border-gray-800/80 shrink-0 backdrop-blur-md">
        {/* Brand */}
        <div className="h-20 flex items-center px-6 border-b border-gray-800/80">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-600/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block">CareerSpark AI</span>
              <span className="text-[10px] text-violet-400 font-medium block">Enterprise v1.0</span>
            </div>
          </Link>
        </div>

        {/* Nav list */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1.5">
          {navItems.map(item => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40 shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-gray-900/60'
                } ${item.highlight && !isActive ? 'text-violet-400' : ''}`}
              >
                <div className="flex items-center space-x-3">
                  <span className={isActive ? 'text-violet-400' : 'text-gray-500'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-500 text-white text-[10px] font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-gray-800/80 bg-gray-950/40">
          <div className="flex items-center space-x-3 mb-3">
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt="Avatar"
              className="w-9 h-9 rounded-xl object-cover border border-violet-500/40"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">{user?.full_name || 'Alex Rivera'}</div>
              <div className="text-[10px] text-gray-500 truncate">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full py-2 px-3 text-xs font-semibold text-gray-400 hover:text-rose-400 rounded-lg hover:bg-gray-900 transition-colors gap-2"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-gray-950 border-b border-gray-800 flex items-center justify-between px-4">
          <Link to="/" className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-violet-400" />
            <span className="font-bold text-white text-sm">CareerSpark AI</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-400 hover:text-white"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-950 border-b border-gray-800 px-4 py-3 space-y-2">
            {navItems.map(item => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 py-2 text-xs font-semibold text-gray-300 hover:text-white"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Page Content Scroll Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-base">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
