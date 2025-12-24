import { motion } from 'framer-motion'
import { useState } from 'react'
import { EnvelopeSimple, Lock, Sparkle, Warning } from 'phosphor-react'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loginLoading, loginError } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    login({ email, password })
  }

  return (
    <div className="min-h-screen bg-snow flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-teal/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-sapphire/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Login Card */}
      <motion.div
        className="glass rounded-3xl p-8 md:p-12 w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Logo */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal to-teal-600 flex items-center justify-center shadow-lift">
            <Sparkle size={40} weight="fill" className="text-white" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1 className="text-4xl font-light tracking-tighter text-sapphire-900 mb-2">
            Welcome to <span className="text-gradient-teal">Sijadin</span>
          </h1>
          <p className="text-sapphire-500">
            Seamless Reporting. Beyond Paperwork.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleLogin}
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {loginError && (
            <motion.div
              className="p-4 rounded-xl bg-error/10 border border-error/20 flex items-start gap-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Warning size={20} weight="fill" className="text-error flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-error">Login Failed</p>
                <p className="text-xs text-error/80 mt-1">
                  {loginError instanceof Error ? loginError.message : 'Invalid email or password'}
                </p>
              </div>
            </motion.div>
          )}

          <Input
            type="email"
            label="Email"
            placeholder="admin@sijadin.id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<EnvelopeSimple size={20} weight="light" />}
            required
          />

          <Input
            type="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock size={20} weight="light" />}
            required
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-sapphire-300 text-teal focus:ring-teal/30"
              />
              <span className="text-sapphire-600">Remember me</span>
            </label>
            <a href="#" className="text-teal hover:text-teal-600 transition-colors">
              Forgot password?
            </a>
          </div>

          <Button
            type="submit"
            variant="teal"
            size="lg"
            fullWidth
            loading={loginLoading}
          >
            Sign In
          </Button>
        </motion.form>

        {/* Footer */}
        <motion.p
          className="text-center text-sm text-sapphire-500 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Don't have an account?{' '}
          <a href="#" className="text-teal hover:text-teal-600 transition-colors font-medium">
            Contact Admin
          </a>
        </motion.p>
      </motion.div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-20 w-4 h-4 rounded-full bg-teal/30"
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-6 h-6 rounded-full bg-sapphire/20"
        animate={{
          y: [0, 20, 0],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}
