import { motion } from 'framer-motion'
import {
  FileText,
  Clock,
  CheckCircle,
  TrendUp,
  Plus,
  ArrowRight,
  Sparkle,
} from 'phosphor-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const stats = [
  {
    icon: FileText,
    label: 'Total Reports',
    value: '24',
    change: '+12%',
    trend: 'up',
    color: 'from-teal-500 to-teal-600',
  },
  {
    icon: Clock,
    label: 'In Progress',
    value: '8',
    change: '+3',
    trend: 'up',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: CheckCircle,
    label: 'Completed',
    value: '16',
    change: '+9',
    trend: 'up',
    color: 'from-success to-green-600',
  },
  {
    icon: TrendUp,
    label: 'This Month',
    value: '12',
    change: '+25%',
    trend: 'up',
    color: 'from-purple-500 to-purple-600',
  },
]

const recentReports = [
  {
    id: 1,
    title: 'Perjalanan Dinas ke Jakarta',
    date: '2025-12-20',
    status: 'completed',
    progress: 100,
  },
  {
    id: 2,
    title: 'Workshop Pelatihan SDM',
    date: '2025-12-18',
    status: 'processing',
    progress: 65,
  },
  {
    id: 3,
    title: 'Rapat Koordinasi Regional',
    date: '2025-12-15',
    status: 'draft',
    progress: 30,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-5xl font-light tracking-tighter text-sapphire-900 mb-2">
              Welcome back, <span className="text-gradient-teal">Admin</span>
            </h1>
            <p className="text-lg text-sapphire-500">
              Seamless reporting at your fingertips
            </p>
          </div>
          
          <Button
            variant="teal"
            size="lg"
            icon={<Plus size={24} weight="bold" />}
            className="shadow-lift"
          >
            New Report
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {stats.map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="relative overflow-hidden">
              {/* Background Gradient */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-3xl`} />
              
              <div className="relative">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                  <stat.icon size={24} weight="bold" className="text-white" />
                </div>
                
                <p className="text-sm text-sapphire-500 mb-1">{stat.label}</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-4xl font-light tracking-tighter text-sapphire-900">
                    {stat.value}
                  </h3>
                  <span className="text-sm text-success font-medium">
                    {stat.change}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Reports */}
        <motion.div
          className="lg:col-span-2"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-light tracking-tighter text-sapphire-900">
                Recent Reports
              </h2>
              <Button variant="ghost" size="sm" icon={<ArrowRight size={18} weight="bold" />} iconPosition="right">
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {recentReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  className="p-4 rounded-xl bg-vapor/50 hover:bg-vapor transition-colors cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-sapphire-900">{report.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      report.status === 'completed' ? 'bg-success/10 text-success' :
                      report.status === 'processing' ? 'bg-teal/10 text-teal' :
                      'bg-sapphire-100 text-sapphire-600'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-sapphire-500">
                    <span>{report.date}</span>
                    <div className="flex-1">
                      <div className="h-2 bg-sapphire-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-teal to-teal-600"
                          initial={{ width: 0 }}
                          animate={{ width: `${report.progress}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </div>
                    </div>
                    <span className="font-medium">{report.progress}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* AI Assistant Card */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="relative overflow-hidden h-full">
            {/* Animated Background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-teal/20 via-transparent to-sapphire/20"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
            
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal to-teal-600 flex items-center justify-center mb-4">
                <Sparkle size={32} weight="fill" className="text-white" />
              </div>
              
              <h2 className="text-2xl font-light tracking-tighter text-sapphire-900 mb-2">
                AI Assistant
              </h2>
              <p className="text-sapphire-600 mb-6">
                Let AI help you create perfect reports in seconds
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal mt-2" />
                  <p className="text-sm text-sapphire-700">
                    Automatic document extraction
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal mt-2" />
                  <p className="text-sm text-sapphire-700">
                    Smart content generation
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal mt-2" />
                  <p className="text-sm text-sapphire-700">
                    One-click compliance
                  </p>
                </div>
              </div>
              
              <Button variant="teal" fullWidth>
                Try AI Assistant
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
