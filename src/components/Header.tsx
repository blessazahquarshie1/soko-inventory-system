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
  return (
    <header className="header">
      <div className="header-right">
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
