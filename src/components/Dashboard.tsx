import type { BorrowRecord, InventoryItem, UserProfile } from '../types/inventory'
import {
  FiAlertTriangle,
  FiCalendar,
  FiCheckCircle,
  FiPackage,
  FiPlus,
  FiRefreshCw,
} from 'react-icons/fi'
import './Dashboard.css'

interface DashboardProps {
  inventory: InventoryItem[]
  borrowings: BorrowRecord[]
  currentUser: UserProfile | null
  onNavigateToBorrow?: () => void
  onReturn?: (borrowingId: string) => void
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'Good morning'
  if (hour >= 12 && hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function Dashboard({
  inventory,
  borrowings,
  currentUser,
  onNavigateToBorrow,
  onReturn,
}: DashboardProps) {
  const myActiveLoans = currentUser
    ? borrowings.filter(
        (borrowing) =>
          (borrowing.status === 'Borrowed' || borrowing.status === 'Overdue') &&
          borrowing.borrowerName === currentUser.name
      )
    : []
  const myOverdueLoans = myActiveLoans.filter((loan) => loan.status === 'Overdue')
  const totalItems = inventory.reduce((total, item) => total + item.totalQuantity, 0)
  const availableItems = inventory.reduce((total, item) => total + item.availableQuantity, 0)
  const activeBorrowings = borrowings.filter(
    (borrowing) => borrowing.status === 'Borrowed' || borrowing.status === 'Overdue'
  )
  const currentlyBorrowed = activeBorrowings.reduce((total, borrowing) => total + borrowing.quantity, 0)
  const overdueItems = borrowings
    .filter((borrowing) => borrowing.status === 'Overdue')
    .reduce((total, borrowing) => total + borrowing.quantity, 0)

  const activeBorrowingRows = activeBorrowings.map((borrowing) => ({
    id: borrowing.id,
    item: borrowing.itemName,
    borrower: borrowing.borrowerName,
    taken: borrowing.takenDate,
    expectedReturn: borrowing.expectedReturnDate,
    status: borrowing.status,
  }))
  const availableRows = inventory
    .filter((item) => item.availableQuantity > 0)
    .map((item) => ({
      id: `available-${item.id}`,
      item: item.name,
      borrower: '—',
      taken: '—',
      expectedReturn: '—',
      status: 'Available' as const,
    }))
  const overviewRows = [...activeBorrowingRows, ...availableRows]
  const greetingVariant = myOverdueLoans.length > 0
    ? 'danger'
    : myActiveLoans.length > 0
      ? 'warning'
      : 'success'

  return (
    <div className="dashboard-container">
      <div className={`greeting-banner banner-${greetingVariant}`}>
        <div className="greeting-left">
          <div className="greeting-avatar">{currentUser?.avatarInitials ?? '?'}</div>
          <div className="greeting-text">
            <h2 className="greeting-headline">
              {getGreeting()}, <span className="greeting-name">
                {currentUser?.name.split(' ')[0] ?? 'guest'}!
              </span>
            </h2>
            <p className="greeting-role">
              {currentUser?.role ?? 'Sign in to see your borrowed items and due dates.'}
            </p>
          </div>
        </div>
        <div className="greeting-alert">
          {myOverdueLoans.length > 0 && (
            <div className="alert-chip chip-danger">
              <FiAlertTriangle aria-hidden="true" /> {myOverdueLoans.length} overdue item{myOverdueLoans.length === 1 ? '' : 's'} — return soon
            </div>
          )}
          {myOverdueLoans.length === 0 && myActiveLoans.length > 0 && (
            <div className="alert-chip chip-warning">
              <FiCalendar aria-hidden="true" /> {myActiveLoans.length} active loan{myActiveLoans.length === 1 ? '' : 's'}
            </div>
          )}
          {currentUser && myActiveLoans.length === 0 && (
            <div className="alert-chip chip-success"><FiCheckCircle aria-hidden="true" /> No active loans — all clear!</div>
          )}
        </div>
      </div>

      {currentUser && myActiveLoans.length > 0 && (
        <div className="my-loans-card">
          <div className="my-loans-header">
            <div>
              <h3 className="my-loans-title">Items in your possession</h3>
              <p className="my-loans-subtitle">Keep an eye on these items and their return dates.</p>
            </div>
            <span className="my-loans-badge">
              {myActiveLoans.length} item{myActiveLoans.length === 1 ? '' : 's'}
            </span>
          </div>
          <div className="my-loans-list">
            {myActiveLoans.map((loan) => (
              <div key={loan.id} className={`my-loan-row ${loan.status === 'Overdue' ? 'loan-overdue' : ''}`}>
                <div className="loan-item-info">
                  <span className="loan-item-name">{loan.itemName}</span>
                  <span className="loan-item-qty">×{loan.quantity}</span>
                </div>
                <div className="loan-due-info">
                  <span className="loan-due-label">Due:</span>
                  <span className={`loan-due-date ${loan.status === 'Overdue' ? 'due-overdue' : ''}`}>
                    {loan.expectedReturnDate}
                  </span>
                  {loan.status === 'Overdue' && <span className="loan-overdue-chip">OVERDUE</span>}
                  {onReturn && (
                    <button
                      type="button"
                      className="loan-return-button"
                      onClick={() => onReturn(loan.id)}
                    >
                      Return item
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="dashboard-welcome">
        <div>
          <h2 className="section-title">Inventory overview</h2>
          <p className="section-subtitle">
            Real-time status of lab hardware and active equipment loans.
          </p>
        </div>
        {onNavigateToBorrow && (
          <button type="button" className="btn-primary" onClick={onNavigateToBorrow}>
            <FiPlus aria-hidden="true" /> Borrow equipment
          </button>
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header"><span className="stat-title">Total items</span><span className="stat-icon"><FiPackage aria-hidden="true" /></span></div>
          <div className="stat-value">{totalItems}</div>
          <div className="stat-description">Hardware units in lab</div>
        </div>
        <div className="stat-card stat-card-available">
          <div className="stat-header"><span className="stat-title">Available</span><span className="stat-icon"><FiCheckCircle aria-hidden="true" /></span></div>
          <div className="stat-value text-emerald">{availableItems}</div>
          <div className="stat-description">Ready for deployment</div>
        </div>
        <div className="stat-card stat-card-borrowed">
          <div className="stat-header"><span className="stat-title">Currently borrowed</span><span className="stat-icon"><FiRefreshCw aria-hidden="true" /></span></div>
          <div className="stat-value text-sky">{currentlyBorrowed}</div>
          <div className="stat-description">Checked out by members</div>
        </div>
        <div className="stat-card stat-card-overdue">
          <div className="stat-header"><span className="stat-title">Overdue</span><span className="stat-icon"><FiAlertTriangle aria-hidden="true" /></span></div>
          <div className="stat-value text-rose">{overdueItems}</div>
          <div className="stat-description">Action required</div>
        </div>
      </div>

      <div className="dashboard-table-card">
        <div className="table-card-header">
          <h3 className="card-title">Recent equipment &amp; loan status</h3>
          <span className="table-badge">{overviewRows.length} entries</span>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Borrower</th>
                <th>Taken</th>
                <th>Expected return</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {overviewRows.map((row) => (
                <tr key={row.id}>
                  <td className="font-semibold">{row.item}</td>
                  <td className={row.borrower === '—' ? 'text-muted' : ''}>{row.borrower}</td>
                  <td className={row.taken === '—' ? 'text-muted' : ''}>{row.taken}</td>
                  <td className={row.expectedReturn === '—' ? 'text-muted' : ''}>{row.expectedReturn}</td>
                  <td>
                    <span className={`status-pill status-${row.status.toLowerCase()}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
