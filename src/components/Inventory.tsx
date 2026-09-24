import { useState } from 'react'
import { FiChevronDown, FiFilter } from 'react-icons/fi'
import type { InventoryItem } from '../types/inventory'
import './Inventory.css'

interface InventoryProps {
  inventory: InventoryItem[]
  onBorrowItem?: (itemId: string) => void
}

export function Inventory({ inventory, onBorrowItem }: InventoryProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedStockStatus, setSelectedStockStatus] = useState<string>('All')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(inventory.map((item) => item.category)))]

  // Filter items based on search and category
  const filteredItems = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    const matchesStockStatus =
      selectedStockStatus === 'All' ||
      (selectedStockStatus === 'Available' && item.availableQuantity === item.totalQuantity) ||
      (selectedStockStatus === 'In use' &&
        item.availableQuantity > 0 &&
        item.availableQuantity < item.totalQuantity) ||
      (selectedStockStatus === 'All borrowed' && item.availableQuantity === 0)
    return matchesSearch && matchesCategory && matchesStockStatus
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
          <div className="inventory-filter-wrap">
            <button
              type="button"
              className={`inventory-filter-button ${isFilterOpen ? 'active' : ''}`}
              onClick={() => setIsFilterOpen((open) => !open)}
              aria-expanded={isFilterOpen}
              aria-haspopup="true"
            >
              <FiFilter aria-hidden="true" />
              Filter
              <FiChevronDown aria-hidden="true" />
            </button>
            {isFilterOpen && (
              <div className="inventory-filter-menu">
                <label htmlFor="inventory-category-filter">Category</label>
                <select
                  id="inventory-category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                <label htmlFor="inventory-stock-filter">Stock status</label>
                <select
                  id="inventory-stock-filter"
                  value={selectedStockStatus}
                  onChange={(e) => setSelectedStockStatus(e.target.value)}
                >
                  <option value="All">All statuses</option>
                  <option value="Available">Fully available</option>
                  <option value="In use">In use</option>
                  <option value="All borrowed">All borrowed</option>
                </select>

                <button
                  type="button"
                  className="inventory-filter-clear"
                  onClick={() => {
                    setSelectedCategory('All')
                    setSelectedStockStatus('All')
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
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

