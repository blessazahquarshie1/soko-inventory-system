import { useState } from 'react'
import type { InventoryItem, BorrowRecord } from '../types/inventory'
import './Borrowings.css'

function getTomorrowDate(): string {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().slice(0, 10)
}

interface BorrowingsProps {
  inventory: InventoryItem[]
  borrowings: BorrowRecord[]
  initialItemId?: string
  onBorrow: (borrowerName: string, itemId: string, quantity: number, expectedReturn: string) => void
  onReturn: (borrowingId: string) => void
}

export function Borrowings({
  inventory,
  borrowings,
  initialItemId,
  onBorrow,
  onReturn,
}: BorrowingsProps) {
  // Available items for the dropdown
  const availableInventory = inventory.filter((item) => item.availableQuantity > 0)

  // Form state
  const [borrowerName, setBorrowerName] = useState('')
  const [userSelectedId, setUserSelectedId] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [expectedReturnDate, setExpectedReturnDate] = useState(getTomorrowDate)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Derive the active selected item cleanly
  const isUserSelectionValid =
    userSelectedId && inventory.some((i) => i.id === userSelectedId && i.availableQuantity > 0)
  const isInitialValid =
    initialItemId && inventory.some((i) => i.id === initialItemId && i.availableQuantity > 0)

  const selectedItemId = isUserSelectionValid
    ? (userSelectedId as string)
    : isInitialValid
      ? (initialItemId as string)
      : availableInventory.length > 0
        ? availableInventory[0].id
        : ''

  // Get currently selected item details
  const currentItem = inventory.find((i) => i.id === selectedItemId)
  const maxAvailable = currentItem ? currentItem.availableQuantity : 1

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFeedbackMessage(null)
    setErrorMessage(null)

    const enteredName = borrowerName.trim()

    // Must be explicitly entered by the user
    if (!enteredName) {
      setErrorMessage("Please enter the borrower's name.")
      return
    }

    if (!selectedItemId) {
      setErrorMessage('Please select an equipment item to borrow.')
      return
    }

    if (!currentItem || currentItem.availableQuantity < quantity) {
      setErrorMessage(
        `Only ${maxAvailable} unit(s) available for ${currentItem?.name || 'this item'}.`
      )
      return
    }

    if (!expectedReturnDate) {
      setErrorMessage('Please specify an expected return date.')
      return
    }

    // Process borrowing
    onBorrow(enteredName, selectedItemId, quantity, expectedReturnDate)

    setFeedbackMessage(
      `Success! ${quantity}x "${currentItem.name}" borrowed by ${enteredName}.`
    )
    setBorrowerName('')
    setQuantity(1)
    setUserSelectedId(null)
  }

  // Filter active borrowings (Borrowed & Overdue)
  const activeBorrowings = borrowings.filter(
    (b) => b.status === 'Borrowed' || b.status === 'Overdue'
  )

  return (
    <div className="borrowings-container">
      {/* Top Section: Borrow Equipment Form */}
      <div className="borrow-card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Borrow Equipment</h2>
            <span className="card-hint">Check out lab hardware to an active member</span>
          </div>
        </div>

        {feedbackMessage && <div className="alert alert-success">{feedbackMessage}</div>}
        {errorMessage && <div className="alert alert-error">{errorMessage}</div>}

        <form onSubmit={handleSubmit} className="borrow-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="borrower-name" className="form-label">
                Borrower's Name
              </label>
              <input
                id="borrower-name"
                type="text"
                className="form-input"
                placeholder="e.g. Ama Boateng"
                value={borrowerName}
                onChange={(e) => setBorrowerName(e.target.value)}
                required
              />
              <span className="input-helper">Example: Ama Boateng, Kwame Mensah</span>
            </div>

            <div className="form-group">
              <label htmlFor="select-item" className="form-label">
                Select Item
              </label>
              <select
                id="select-item"
                className="form-select"
                value={selectedItemId}
                onChange={(e) => {
                  setUserSelectedId(e.target.value)
                  setQuantity(1)
                }}
                disabled={availableInventory.length === 0}
              >
                {availableInventory.length === 0 ? (
                  <option value="">No items currently available</option>
                ) : (
                  availableInventory.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.availableQuantity} available)
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="quantity" className="form-label">
                Quantity
              </label>
              <input
                id="quantity"
                type="number"
                min={1}
                max={maxAvailable}
                className="form-input"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                disabled={!currentItem || currentItem.availableQuantity === 0}
                required
              />
              <span className="input-helper">Max available: {maxAvailable}</span>
            </div>

            <div className="form-group">
              <label htmlFor="return-date" className="form-label">
                Expected Return
              </label>
              <input
                id="return-date"
                type="date"
                className="form-input"
                value={expectedReturnDate}
                onChange={(e) => setExpectedReturnDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-confirm"
              disabled={availableInventory.length === 0}
            >
              Confirm Borrowing
            </button>
          </div>
        </form>
      </div>

      {/* Bottom Section: Active Borrowings Table */}
      <div className="active-borrowings-card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Active Borrowings</h2>
            <span className="card-hint">
              Currently borrowed equipment awaiting return to the lab
            </span>
          </div>
          <span className="table-badge">{activeBorrowings.length} Active Loans</span>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Borrower</th>
                <th>Item</th>
                <th>Qty</th>
                <th>Taken</th>
                <th>Expected Return</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {activeBorrowings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-state">
                    No equipment currently borrowed. All items are safely in the lab!
                  </td>
                </tr>
              ) : (
                activeBorrowings.map((b) => (
                  <tr key={b.id}>
                    <td className="font-semibold">{b.borrowerName}</td>
                    <td>{b.itemName}</td>
                    <td>{b.quantity}</td>
                    <td className="text-muted">{b.takenDate}</td>
                    <td className="text-muted">{b.expectedReturnDate}</td>
                    <td>
                      <span className={`status-pill status-${b.status.toLowerCase()}`}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn-return"
                        onClick={() => onReturn(b.id)}
                      >
                        Mark as Returned
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
