import type { BorrowRecord } from '../types/inventory'
import './History.css'

interface HistoryProps {
  borrowings: BorrowRecord[]
}

export function History({ borrowings }: HistoryProps) {
  // Filter returned records
  const returnedRecords = borrowings.filter((b) => b.status === 'Returned')

  return (
    <div className="history-container">
      <div className="history-header">
        <div>
          <h2 className="section-title">Equipment Loan History</h2>
          <p className="section-subtitle">
            Historical log of all checked out items that have been safely returned to the lab.
          </p>
        </div>
        <span className="table-badge">{returnedRecords.length} Completed Returns</span>
      </div>

      <div className="history-table-card">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Borrower</th>
                <th>Quantity</th>
                <th>Taken Date/Time</th>
                <th>Expected Return</th>
                <th>Returned Date/Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {returnedRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-state">
                    No returned equipment records found. Returned items will be archived here.
                  </td>
                </tr>
              ) : (
                returnedRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="font-semibold">{record.itemName}</td>
                    <td>{record.borrowerName}</td>
                    <td>{record.quantity}</td>
                    <td className="text-muted">{record.takenDate}</td>
                    <td className="text-muted">{record.expectedReturnDate}</td>
                    <td className="text-emerald font-semibold">
                      {record.returnedDate || 'Recorded'}
                    </td>
                    <td>
                      <span className="status-pill status-returned">Returned</span>
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

