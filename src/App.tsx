import { useState } from 'react'
import type { TabType, InventoryItem, BorrowRecord, UserProfile } from './types/inventory'
import { INITIAL_INVENTORY, INITIAL_BORROWINGS, DEMO_USERS } from './data/mockData'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { Dashboard } from './components/Dashboard'
import { Inventory } from './components/Inventory'
import { Borrowings } from './components/Borrowings'
import { History } from './components/History'
import { GuideTerms } from './components/GuideTerms'
import './App.css'

function formatCurrentDateTime(): string {
  const now = new Date()
  return now.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function formatDisplayDate(dateStr: string, timeStr: string): string {
  if (!dateStr) return '—'
  const parts = dateStr.split('-')
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10) - 1
    const day = parseInt(parts[2], 10)
    const [hours, minutes] = timeStr.split(':').map(Number)
    const date = new Date(year, month, day, hours || 0, minutes || 0)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' +
      date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }
  return dateStr
}

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('Dashboard')
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY)
  const [borrowings, setBorrowings] = useState<BorrowRecord[]>(INITIAL_BORROWINGS)
  const [users, setUsers] = useState<UserProfile[]>(DEMO_USERS)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(DEMO_USERS[0])
  const [preselectedItemId, setPreselectedItemId] = useState<string | undefined>(undefined)
  const [isGuideTermsOpen, setIsGuideTermsOpen] = useState(false)

  // Borrow action: decrements available inventory & registers active borrowing
  const handleBorrow = (
    itemId: string,
    quantity: number,
    expectedReturnDate: string,
    expectedReturnTime: string
  ) => {
    if (!currentUser) return
    const item = inventory.find((i) => i.id === itemId)
    if (!item || item.availableQuantity < quantity) return

    const newRecord: BorrowRecord = {
      id: `borrow-${Date.now()}`,
      itemId,
      itemName: item.name,
      borrowerName: currentUser.name,
      quantity,
      takenDate: formatCurrentDateTime(),
      expectedReturnDate: formatDisplayDate(expectedReturnDate, expectedReturnTime),
      status: 'Borrowed',
    }

    // Decrement item availability
    setInventory((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? { ...i, availableQuantity: Math.max(0, i.availableQuantity - quantity) }
          : i
      )
    )

    // Add to borrowings list
    setBorrowings((prev) => [newRecord, ...prev])
  }

  // Return action: increments available inventory & updates borrowing status
  const handleReturn = (borrowingId: string) => {
    const borrowing = borrowings.find((b) => b.id === borrowingId)
    const canReturn = currentUser?.role === 'Administrator' || borrowing?.borrowerName === currentUser?.name
    if (!borrowing || borrowing.status === 'Returned' || !canReturn) return
    if (!window.confirm(`Mark ${borrowing.itemName} as returned?`)) return

    // Restore item availability in inventory
    setInventory((prev) =>
      prev.map((i) =>
        i.id === borrowing.itemId
          ? {
              ...i,
              availableQuantity: Math.min(i.totalQuantity, i.availableQuantity + borrowing.quantity),
            }
          : i
      )
    )

    // Update borrowing record
    const returnedTimestamp = formatCurrentDateTime()
    setBorrowings((prev) =>
      prev.map((b) =>
        b.id === borrowingId
          ? {
              ...b,
              status: 'Returned',
              returnedDate: returnedTimestamp,
            }
          : b
      )
    )
  }

  // Quick navigation helpers
  const handleNavigateToBorrow = (itemId?: string) => {
    setPreselectedItemId(itemId)
    setActiveTab('Borrowings')
  }

  const handleSelectUser = (user: UserProfile | null) => {
    setCurrentUser(user)
    setActiveTab('Dashboard')
    setPreselectedItemId(undefined)
  }

  const isAdmin = currentUser?.role === 'Administrator'

  const handleAddItem = (item: Omit<InventoryItem, 'id' | 'availableQuantity'>) => {
    if (!isAdmin) return
    setInventory((previous) => [
      ...previous,
      { ...item, id: `item-${Date.now()}`, availableQuantity: item.totalQuantity },
    ])
  }

  const handleUpdateItem = (updatedItem: InventoryItem) => {
    if (!isAdmin) return
    setInventory((previous) => previous.map((item) => item.id === updatedItem.id ? updatedItem : item))
  }

  const handleDeleteItem = (itemId: string) => {
    if (!isAdmin || borrowings.some((borrowing) => borrowing.itemId === itemId && borrowing.status !== 'Returned')) return
    setInventory((previous) => previous.filter((item) => item.id !== itemId))
  }

  const handleDeleteUser = (userId: string) => {
    if (!isAdmin || userId === currentUser?.id) return
    const user = users.find((candidate) => candidate.id === userId)
    if (!user || !window.confirm(`Remove ${user.name} from the lab profiles?`)) return
    setUsers((previous) => previous.filter((user) => user.id !== userId))
  }

  return (
    <div className="app-container">
      {/* Sidebar Navigation & User Profile */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab)
          if (tab !== 'Borrowings') setPreselectedItemId(undefined)
        }}
        onOpenGuideTerms={() => setIsGuideTermsOpen(true)}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Header
          currentUser={currentUser}
          users={users}
          onSelectUser={handleSelectUser}
        />

        <main className="main-content" key={`${activeTab}-${currentUser?.id ?? 'guest'}`}>
          {activeTab === 'Dashboard' && (
            <Dashboard
              inventory={inventory}
              borrowings={borrowings}
              currentUser={currentUser}
              onNavigateToBorrow={() => handleNavigateToBorrow()}
              onReturn={handleReturn}
            />
          )}

          {activeTab === 'Inventory' && (
            <Inventory
              inventory={inventory}
              currentUser={currentUser}
              users={users}
              onAddItem={handleAddItem}
              onUpdateItem={handleUpdateItem}
              onDeleteItem={handleDeleteItem}
              onDeleteUser={handleDeleteUser}
              onBorrowItem={(id) => handleNavigateToBorrow(id)}
            />
          )}

          {activeTab === 'Borrowings' && (
            <Borrowings
              inventory={inventory}
              borrowings={borrowings}
              currentUser={currentUser}
              initialItemId={preselectedItemId}
              onBorrow={handleBorrow}
              onReturn={handleReturn}
            />
          )}

          {activeTab === 'History' && <History borrowings={borrowings} />}
        </main>
      </div>
      {isGuideTermsOpen && <GuideTerms onClose={() => setIsGuideTermsOpen(false)} />}
    </div>
  )
}

export default App
