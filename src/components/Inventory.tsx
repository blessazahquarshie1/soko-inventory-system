import { useState } from 'react'
import type { InventoryItem } from '../types/inventory'
import './Inventory.css'

interface InventoryProps {
  inventory: InventoryItem[]
  onBorrowItem?: (itemId: string) => void
}

export function Inventory({ inventory, onBorrowItem }: InventoryProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(inventory.map((item) => item.category)))]

  // Filter items based on search and category
  const filteredItems = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Helper to determine inventory stock status
  const getStockStatus = (item: InventoryItem) => {
    if (item.availableQuantity === 0) {
      return { label: 'All Borrowed', className: 'stock-empty' }
    }
    if (item.availableQuantity < item.totalQuantity) {
      return { label: 'In Use', className: 'stock-partial' }
    }
    return { label: 'Fully Available', className: 'stock-available' }
  }

  return (
    <div className="inventory-container">
      {/* Header and Controls */}
      <div className="inventory-header">
        <div>
          <h2 className="section-title">Equipment Inventory</h2>
          <p className="section-subtitle">
            Complete registry of Soko Aerial Robotics components, tools, and hardware.
          </p>
        </div>

        <div className="inventory-controls">
          <input
            type="text"
            className="search-input"
            placeholder="Search equipment or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="category-filters">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`category-pill ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Equipment Table */}
      <div className="inventory-table-card">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Total Quantity</th>
                <th>Available Quantity</th>
                <th>Status</th>
                {onBorrowItem && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={onBorrowItem ? 6 : 5} className="empty-state">
                    No equipment found matching your filter.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const status = getStockStatus(item)
                  return (
                    <tr key={item.id}>
                      <td className="font-semibold">{item.name}</td>
                      <td>
                        <span className="category-badge">{item.category}</span>
                      </td>
                      <td>{item.totalQuantity} units</td>
                      <td>
                        <span className="font-semibold text-emerald">
                          {item.availableQuantity}
                        </span>{' '}
                        / {item.totalQuantity}
                      </td>
                      <td>
                        <span className={`status-pill ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      {onBorrowItem && (
                        <td>
                          <button
                            type="button"
                            className="btn-table-action"
                            disabled={item.availableQuantity === 0}
                            onClick={() => onBorrowItem(item.id)}
                          >
                            {item.availableQuantity > 0 ? 'Borrow' : 'Unavailable'}
                          </button>
                        </td>
                      )}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

