import { motion } from 'framer-motion'
import { MagnifyingGlass, Bell, User } from 'phosphor-react'
import Input from '../ui/Input'

export default function Header() {
  return (
    <motion.header
      className="sticky top-0 z-20 glass border-b border-white/40 px-8 py-4"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="w-96">
          <Input
            placeholder="Search reports, templates..."
            icon={<MagnifyingGlass size={20} weight="light" />}
            className="!py-2"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <motion.button
            className="relative p-2 rounded-xl hover:bg-vapor transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell size={24} weight="light" className="text-sapphire-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
          </motion.button>

          {/* User Profile */}
          <motion.button
            className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-vapor transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal to-teal-600 flex items-center justify-center">
              <User size={18} weight="bold" className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-sapphire-900">Admin User</p>
              <p className="text-xs text-sapphire-500">admin@sijadin.id</p>
            </div>
          </motion.button>
        </div>
      </div>
    </motion.header>
  )
}
