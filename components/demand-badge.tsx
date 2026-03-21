import { cn } from '@/lib/utils'
import { DemandLevel } from '@/lib/types'
import { Flame, TrendingUp, Snowflake } from 'lucide-react'

interface DemandBadgeProps {
  level: DemandLevel
  className?: string
  showLabel?: boolean
}

export function DemandBadge({ level, className, showLabel = true }: DemandBadgeProps) {
  const config = {
    high: {
      label: 'Alta demanda',
      icon: Flame,
      className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
    },
    medium: {
      label: 'Interés medio',
      icon: TrendingUp,
      className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    },
    low: {
      label: 'Bajo interés',
      icon: Snowflake,
      className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    }
  }

  const { label, icon: Icon, className: badgeClass } = config[level]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        badgeClass,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {showLabel && label}
    </span>
  )
}
