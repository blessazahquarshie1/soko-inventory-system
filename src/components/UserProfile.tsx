import { useEffect, useRef, useState } from 'react'
import type { UserProfile as UserProfileType } from '../types/inventory'
import './UserProfile.css'

interface UserProfileProps {
  currentUser: UserProfileType | null
  users: UserProfileType[]
  onSelectUser: (user: UserProfileType | null) => void
  variant?: 'sidebar' | 'header'
}

export function UserProfile({
  currentUser,
  users,
  onSelectUser,
  variant = 'sidebar',
}: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div className={`user-profile-wrapper variant-${variant}`} ref={menuRef}>
      {isOpen && (
        <div className={`user-dropdown-menu ${variant === 'header' ? 'opens-down' : ''}`}>
          <div className="dropdown-header">
            <span className="dropdown-heading">Switch Demo Profile</span>
            <span className="dropdown-sub">Choose the active lab member</span>
          </div>
          <div className="dropdown-user-list">
            {users.map((user) => (
              <button
                key={user.id}
                type="button"
                className={`dropdown-user-item ${currentUser?.id === user.id ? 'selected' : ''}`}
                onClick={() => {
                  onSelectUser(user)
                  setIsOpen(false)
                }}
              >
                <div className="dropdown-avatar">{user.avatarInitials}</div>
                <div className="dropdown-info">
                  <span className="dropdown-name">{user.name}</span>
                  <span className="dropdown-role">{user.role}</span>
                </div>
                {currentUser?.id === user.id && <span className="checkmark">✓</span>}
              </button>
            ))}
          </div>
          {currentUser && (
            <div className="dropdown-footer">
              <button
                type="button"
                className="btn-signout"
                onClick={() => {
                  onSelectUser(null)
                  setIsOpen(false)
                }}
              >
                Sign Out (Guest Mode)
              </button>
            </div>
          )}
        </div>
      )}

      {variant === 'header' ? (
        <button
          type="button"
          className="header-user-trigger"
          onClick={() => setIsOpen((previous) => !previous)}
          aria-label="Switch user profile"
        >
          <div className="header-avatar-wrapper">
            <div className={`user-avatar ${!currentUser ? 'guest' : ''}`}>
              {currentUser?.avatarInitials ?? '?'}
            </div>
            <span className={`status-indicator ${currentUser ? 'online' : 'offline'}`} />
          </div>
          <div className="header-user-info">
            <span className="header-user-name">{currentUser?.name ?? 'Guest User'}</span>
            <span className="header-user-role">{currentUser?.role ?? 'Click to sign in'}</span>
          </div>
          <span className="chevron-icon">▾</span>
        </button>
      ) : (
        <button
          type="button"
          className="user-profile-bar"
          onClick={() => setIsOpen((previous) => !previous)}
          aria-label="User profile menu"
        >
          <div className="avatar-wrapper">
            <div className={`user-avatar ${!currentUser ? 'guest' : ''}`}>
              {currentUser?.avatarInitials ?? '?'}
            </div>
            <span className={`status-indicator ${currentUser ? 'online' : 'offline'}`} />
          </div>
          <div className="user-text-info">
            <span className="user-name">{currentUser?.name ?? 'Guest User'}</span>
            <span className={`user-role ${!currentUser ? 'text-sky' : ''}`}>
              {currentUser?.role ?? 'Click to Sign In'}
            </span>
          </div>
          <span className="switch-icon">{currentUser ? '⇅' : '→'}</span>
        </button>
      )}
    </div>
  )
}
