import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import {
  House,
  FileText,
  FolderOpen,
  ChartLine,
  Gear,
  SignOut,
  CaretLeft,
} from 'phosphor-react'
import { useState } from 'react'
import clsx from 'clsx'
import { useAuth } from '../../hooks/useAuth'

const menuItems = [
  { icon: House, label: 'Dashboard', path: '/' },
  { icon: FileText, label: 'Reports', path: '/reports' },
  { icon: FolderOpen, label: 'Templates', path: '/templates' },
  { icon: ChartLine, label: 'Analytics', path: '/analytics' },
  { icon: Gear, label: 'Settings', path: '/settings' },
]

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { logout } = useAuth()

  return (
    <motion.aside
      className={clsx(
        'fixed left-0 top-0 h-screen glass border-r border-white/40 z-30',
        'transition-all duration-500 ease-out'
      )}
      initial={{ x: -100, opacity: 0 }}
      animate={{
        x: 0,
        opacity: 1,
        width: isCollapsed ? '80px' : '280px',
      }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <div className="flex flex-col h-full p-6">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-3 mb-12"
          layout
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal to-teal-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-xl font-light tracking-tighter text-sapphire-900">
                Sijadin
              </h1>
              <p className="text-xs text-sapphire-500">Seamless Reporting</p>
            </motion.div>
          )}
        </motion.div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300',
                  'hover:bg-vapor hover:shadow-lift',
                  isActive
                    ? 'bg-teal text-white shadow-lift'
                    : 'text-sapphire-600 hover:text-sapphire-900'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={24}
                    weight={isActive ? 'fill' : 'light'}
                    className="flex-shrink-0"
                  />
                  {!isCollapsed && (
                    <motion.span
                      className="font-medium"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Section */}
        <div className="border-t border-sapphire-100 pt-6 space-y-2">
          <button
            onClick={logout}
            className={clsx(
              'flex items-center gap-3 px-4 py-3 rounded-xl w-full',
              'text-sapphire-600 hover:text-sapphire-900',
              'hover:bg-vapor transition-all duration-300'
            )}
          >
            <SignOut size={24} weight="light" className="flex-shrink-0" />
            {!isCollapsed && (
              <motion.span
                className="font-medium"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                Logout
              </motion.span>
            )}
          </button>
        </div>

        {/* Collapse Toggle */}
        <motion.button
          className={clsx(
            'absolute -right-4 top-8 w-8 h-8 rounded-full',
            'glass flex items-center justify-center',
            'hover:shadow-lift-hover transition-all duration-300'
          )}
          onClick={() => setIsCollapsed(!isCollapsed)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <CaretLeft size={16} weight="bold" className="text-sapphire-600" />
          </motion.div>
        </motion.button>
      </div>
    </motion.aside>
  )
}
