export type TabType = 'Dashboard' | 'Inventory' | 'Borrowings' | 'History'

export interface InventoryItem {
  id: string
  name: string
  category: string
  totalQuantity: number
  availableQuantity: number
}

export type BorrowStatus = 'Borrowed' | 'Overdue' | 'Returned'

export interface BorrowRecord {
  id: string
  itemId: string
  itemName: string
  borrowerName: string
  quantity: number
  takenDate: string
  expectedReturnDate: string
  status: BorrowStatus
  returnedDate?: string
}

export interface DashboardStats {
  totalItems: number
  availableItems: number
  currentlyBorrowed: number
  overdueItems: number
}

export interface UserProfile {
  id: string
  name: string
  role: string
  email: string
  avatarInitials: string
}
