import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  Gear,
  Key,
  User,
  Bell,
  Shield,
  Eye,
  EyeSlash,
  CheckCircle,
  Warning,
  FloppyDisk,
} from 'phosphor-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import api from '../lib/axios'
import clsx from 'clsx'

type SettingsTab = 'profile' | 'api-keys' | 'notifications' | 'security'

interface ApiKeyConfig {
  chutes_api_key: string
  gemini_api_key: string
  llm_provider: 'chutes' | 'gemini'
}

const tabs = [
  { id: 'profile' as const, label: 'Profile', icon: User },
  { id: 'api-keys' as const, label: 'API Keys', icon: Key },
  { id: 'notifications' as const, label: 'Notifications', icon: Bell },
  { id: 'security' as const, label: 'Security', icon: Shield },
]

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('api-keys')

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Gear size={32} weight="light" className="text-teal" />
          <h1 className="text-5xl font-light tracking-tighter text-sapphire-900">
            Settings
          </h1>
        </div>
        <p className="text-sapphire-500">
          Manage your account settings and preferences
        </p>
      </motion.div>

      {/* Tabs & Content */}
      <div className="grid grid-cols-12 gap-8">
        {/* Sidebar Tabs */}
        <motion.div
          className="col-span-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="sticky top-6">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id

                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={clsx(
                      'w-full text-left px-4 py-3 rounded-xl transition-all duration-300',
                      'flex items-center gap-3 group',
                      isActive
                        ? 'bg-teal text-white shadow-lift'
                        : 'hover:bg-vapor text-sapphire-700 hover:text-sapphire-900'
                    )}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon
                      size={20}
                      weight={isActive ? 'fill' : 'light'}
                      className={isActive ? 'text-white' : 'text-sapphire-500'}
                    />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </motion.button>
                )
              })}
            </nav>
          </Card>
        </motion.div>

        {/* Content Area */}
        <motion.div
          className="col-span-9"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {activeTab === 'api-keys' && <ApiKeysTab />}
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'notifications' && <NotificationsTab />}
          {activeTab === 'security' && <SecurityTab />}
        </motion.div>
      </div>
    </div>
  )
}

function ApiKeysTab() {
  const [showChutesKey, setShowChutesKey] = useState(false)
  const [showGeminiKey, setShowGeminiKey] = useState(false)
  const [chutesKey, setChutesKey] = useState('')
  const [geminiKey, setGeminiKey] = useState('')
  const [provider, setProvider] = useState<'chutes' | 'gemini'>('chutes')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')

  // Fetch current settings
  const { data: settings } = useQuery({
    queryKey: ['settings', 'api-keys'],
    queryFn: async () => {
      try {
        const response = await api.get<ApiKeyConfig & { has_chutes_key: boolean; has_gemini_key: boolean }>('/settings/api-keys')
        return response.data
      } catch {
        return null
      }
    },
  })

  // Update provider when settings load
  useEffect(() => {
    if (settings?.llm_provider) {
      setProvider(settings.llm_provider as 'chutes' | 'gemini')
    }
  }, [settings])

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: Partial<ApiKeyConfig>) => {
      const response = await api.post('/settings/api-keys', data)
      return response.data
    },
    onSuccess: () => {
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 3000)
    },
    onError: () => {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    },
  })

  const handleSave = () => {
    setSaveStatus('saving')
    saveMutation.mutate({
      chutes_api_key: chutesKey || undefined,
      gemini_api_key: geminiKey || undefined,
      llm_provider: provider,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-teal/10 to-transparent rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal to-teal-600 flex items-center justify-center">
              <Key size={24} weight="fill" className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-light tracking-tighter text-sapphire-900">
                API Keys Configuration
              </h2>
              <p className="text-sm text-sapphire-500">
                Configure your LLM provider API keys for AI-powered features
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Provider Selection */}
      <Card>
        <h3 className="text-lg font-medium text-sapphire-900 mb-4">
          Active LLM Provider
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            onClick={() => setProvider('chutes')}
            className={clsx(
              'p-4 rounded-xl border-2 transition-all duration-300 text-left',
              provider === 'chutes'
                ? 'border-teal bg-teal/5 shadow-lift'
                : 'border-sapphire-200 hover:border-sapphire-300'
            )}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sapphire-900">Chutes AI</span>
              {provider === 'chutes' && (
                <CheckCircle size={20} weight="fill" className="text-teal" />
              )}
            </div>
            <p className="text-sm text-sapphire-500">
              Fast and efficient text generation
            </p>
          </motion.button>

          <motion.button
            onClick={() => setProvider('gemini')}
            className={clsx(
              'p-4 rounded-xl border-2 transition-all duration-300 text-left',
              provider === 'gemini'
                ? 'border-teal bg-teal/5 shadow-lift'
                : 'border-sapphire-200 hover:border-sapphire-300'
            )}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sapphire-900">Google Gemini</span>
              {provider === 'gemini' && (
                <CheckCircle size={20} weight="fill" className="text-teal" />
              )}
            </div>
            <p className="text-sm text-sapphire-500">
              Multimodal AI with vision capabilities
            </p>
          </motion.button>
        </div>
      </Card>

      {/* Chutes AI Key */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-sapphire-900">Chutes AI API Key</h3>
            <p className="text-sm text-sapphire-500">
              Get your API key from{' '}
              <a
                href="https://chutes.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal hover:underline"
              >
                chutes.ai
              </a>
            </p>
          </div>
          {provider === 'chutes' && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-teal/10 text-teal">
              Active
            </span>
          )}
        </div>
        <div className="relative">
          <Input
            type={showChutesKey ? 'text' : 'password'}
            value={chutesKey}
            onChange={(e) => setChutesKey(e.target.value)}
            placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
            className="pr-12 font-mono text-sm"
          />
          <button
            type="button"
            onClick={() => setShowChutesKey(!showChutesKey)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sapphire-400 hover:text-sapphire-600 transition-colors"
          >
            {showChutesKey ? <EyeSlash size={20} weight="light" /> : <Eye size={20} weight="light" />}
          </button>
        </div>
      </Card>

      {/* Gemini Key */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-sapphire-900">Google Gemini API Key</h3>
            <p className="text-sm text-sapphire-500">
              Get your API key from{' '}
              <a
                href="https://makersuite.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal hover:underline"
              >
                Google AI Studio
              </a>
            </p>
          </div>
          {provider === 'gemini' && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-teal/10 text-teal">
              Active
            </span>
          )}
        </div>
        <div className="relative">
          <Input
            type={showGeminiKey ? 'text' : 'password'}
            value={geminiKey}
            onChange={(e) => setGeminiKey(e.target.value)}
            placeholder="AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxx"
            className="pr-12 font-mono text-sm"
          />
          <button
            type="button"
            onClick={() => setShowGeminiKey(!showGeminiKey)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sapphire-400 hover:text-sapphire-600 transition-colors"
          >
            {showGeminiKey ? <EyeSlash size={20} weight="light" /> : <Eye size={20} weight="light" />}
          </button>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {saveStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-success"
            >
              <CheckCircle size={20} weight="fill" />
              <span className="text-sm font-medium">Settings saved successfully</span>
            </motion.div>
          )}
          {saveStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-error"
            >
              <Warning size={20} weight="fill" />
              <span className="text-sm font-medium">Failed to save settings</span>
            </motion.div>
          )}
        </div>
        <Button
          variant="teal"
          icon={<FloppyDisk size={20} weight="fill" />}
          onClick={handleSave}
          loading={saveStatus === 'saving'}
        >
          Save API Keys
        </Button>
      </div>

      {/* Info Card */}
      <Card className="bg-vapor/50 border-sapphire-200">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <Shield size={24} weight="light" className="text-sapphire-500" />
          </div>
          <div>
            <h4 className="font-medium text-sapphire-900 mb-1">Security Note</h4>
            <p className="text-sm text-sapphire-600">
              Your API keys are encrypted and stored securely. They are only used to communicate
              with the respective AI providers for document processing and generation.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

function ProfileTab() {
  return (
    <Card>
      <h2 className="text-2xl font-light tracking-tighter text-sapphire-900 mb-4">
        Profile Settings
      </h2>
      <p className="text-sapphire-500">Profile settings coming soon...</p>
    </Card>
  )
}

function NotificationsTab() {
  return (
    <Card>
      <h2 className="text-2xl font-light tracking-tighter text-sapphire-900 mb-4">
        Notification Preferences
      </h2>
      <p className="text-sapphire-500">Notification settings coming soon...</p>
    </Card>
  )
}

function SecurityTab() {
  return (
    <Card>
      <h2 className="text-2xl font-light tracking-tighter text-sapphire-900 mb-4">
        Security Settings
      </h2>
      <p className="text-sapphire-500">Security settings coming soon...</p>
    </Card>
  )
}
