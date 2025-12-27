import { motion } from 'framer-motion'
import clsx from 'clsx'
import { Section } from '../../types'
import { CheckCircle, Circle } from 'phosphor-react'

interface SectionNavProps {
  sections: Section[]
  activeSection: string
  onSectionChange: (key: string) => void
  completedSections?: Set<string>
}

export default function SectionNav({
  sections,
  activeSection,
  onSectionChange,
  completedSections = new Set(),
}: SectionNavProps) {
  return (
    <nav className="space-y-1">
      {sections.map((section, index) => {
        const isActive = activeSection === section.key
        const isCompleted = completedSections.has(section.key)

        return (
          <motion.button
            key={section.key}
            onClick={() => onSectionChange(section.key)}
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
            <div className="flex-shrink-0">
              {isCompleted ? (
                <CheckCircle
                  size={20}
                  weight="fill"
                  className={isActive ? 'text-white' : 'text-teal'}
                />
              ) : (
                <Circle
                  size={20}
                  weight={isActive ? 'fill' : 'regular'}
                  className={isActive ? 'text-white' : 'text-sapphire-400'}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium opacity-70">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-sm font-medium truncate">{section.title}</span>
              </div>
            </div>
          </motion.button>
        )
      })}
    </nav>
  )
}
