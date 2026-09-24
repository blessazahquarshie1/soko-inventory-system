import { useEffect, useState } from 'react'
import type { UserProfile as UserProfileType } from '../types/inventory'
import { UserProfile } from './UserProfile'
import './Header.css'

interface HeaderProps {
  currentUser: UserProfileType | null
  users: UserProfileType[]
  onSelectUser: (user: UserProfileType | null) => void
}

export function Header({
  currentUser,
  users,
  onSelectUser,
}: HeaderProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentDate(new Date()), 30000)
    return () => window.clearInterval(timer)
  }, [])

  const currentTime = currentDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
  const currentDateLabel = currentDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  return (
    <header className="header">
      <div className="header-right">
        <div className="header-clock" aria-label={`Current time ${currentTime}`}>
          <span className="header-clock-time">{currentTime}</span>
          <span className="header-clock-date">{currentDateLabel}</span>
        </div>
        <UserProfile
          currentUser={currentUser}
          users={users}
          onSelectUser={onSelectUser}
          variant="header"
        />
      </div>
    </header>
  )
}
