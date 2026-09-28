import { useState } from 'react'
import { FiChevronDown, FiFilter } from 'react-icons/fi'
import type { InventoryItem, UserProfile } from '../types/inventory'
import './Inventory.css'

interface InventoryProps {
  inventory: InventoryItem[]
  currentUser: UserProfile | null
  users: UserProfile[]
  onAddItem: (item: Omit<InventoryItem, 'id' | 'availableQuantity'>) => void
  onUpdateItem: (item: InventoryItem) => void
  onDeleteItem: (itemId: string) => void
  onDeleteUser: (userId: string) => void
  onBorrowItem?: (itemId: string) => void
}

export function Inventory({
  inventory,
  currentUser,
  users,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onDeleteUser,
  onBorrowItem,
}: InventoryProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedStockStatus, setSelectedStockStatus] = useState<string>('All')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [newItemName, setNewItemName] = useState('')
  const [newItemCategory, setNewItemCategory] = useState('')
  const [newItemQuantity, setNewItemQuantity] = useState(1)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [editTotal, setEditTotal] = useState(1)

  const isAdmin = currentUser?.role === 'Administrator'

  const handleAddItem = (event: React.FormEvent) => {
    event.preventDefault()
    if (!newItemName.trim() || !newItemCategory.trim() || newItemQuantity < 1) return
    onAddItem({
      name: newItemName.trim(),
      category: newItemCategory.trim(),
      totalQuantity: newItemQuantity,
    })
    setNewItemName('')
    setNewItemCategory('')
    setNewItemQuantity(1)
  }

  const startEditing = (item: InventoryItem) => {
    setEditingItemId(item.id)
    setEditName(item.name)
    setEditCategory(item.category)
    setEditTotal(item.totalQuantity)
  }

  const saveEditing = (item: InventoryItem) => {
    const borrowedQuantity = item.totalQuantity - item.availableQuantity
    const totalQuantity = Math.max(borrowedQuantity, editTotal)
    onUpdateItem({
      ...item,
      name: editName.trim() || item.name,
      category: editCategory.trim() || item.category,
      totalQuantity,
      availableQuantity: totalQuantity - borrowedQuantity,
    })
    setEditingItemId(null)
  }

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
      (selectedStockStatus === 'Available' && item.availableQuantity > 0) ||
      (selectedStockStatus === 'All borrowed' && item.availableQuantity === 0)
    return matchesSearch && matchesCategory && matchesStockStatus
  })

  // Helper to determine inventory stock status
  const getStockStatus = (item: InventoryItem) => {
    if (item.availableQuantity === 0) {
      return { label: 'All Borrowed', className: 'stock-empty' }
    }
    return { label: 'Available', className: 'stock-available' }
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
                  <option value="Available">Available</option>
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

      {isAdmin && (
        <section className="admin-panel" aria-labelledby="admin-panel-title">
          <div className="admin-panel-heading">
            <div>
              <h3 id="admin-panel-title">Administrator controls</h3>
              <p>Add or update equipment and manage lab profiles.</p>
            </div>
            <span className="admin-badge">Admin access</span>
          </div>
          <form className="admin-add-form" onSubmit={handleAddItem}>
            <input
              className="form-input"
              placeholder="Item name"
              value={newItemName}
              onChange={(event) => setNewItemName(event.target.value)}
              aria-label="New item name"
            />
            <select
              className="form-select"
              value={newItemCategory}
              onChange={(event) => setNewItemCategory(event.target.value)}
              aria-label="New item category"
            >
              <option value="">Select category</option>
              {categories.filter((category) => category !== 'All').map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <input
              className="form-input quantity-input"
              type="number"
              min={1}
              value={newItemQuantity}
              onChange={(event) => setNewItemQuantity(Math.max(1, Number(event.target.value) || 1))}
              aria-label="New item quantity"
            />
            <button type="submit" className="btn-admin">Add item</button>
          </form>
          <div className="admin-users">
            <strong>Lab profiles</strong>
            {users.map((user) => (
              <div className="admin-user-row" key={user.id}>
                <span>{user.name} <small>{user.role}</small></span>
                <button
                  type="button"
                  className="btn-danger"
                  disabled={user.id === currentUser?.id}
                  onClick={() => onDeleteUser(user.id)}
                >
                  Remove user
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

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
                {(onBorrowItem || isAdmin) && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={onBorrowItem || isAdmin ? 6 : 5} className="empty-state">
                    No equipment found matching your filter.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const status = getStockStatus(item)
                  const isEditing = editingItemId === item.id
                  return (
                    <tr key={item.id}>
                      <td className="font-semibold">
                        {isEditing ? <input className="table-edit-input" value={editName} onChange={(event) => setEditName(event.target.value)} /> : item.name}
                      </td>
                      <td>{isEditing ? <input className="table-edit-input" value={editCategory} onChange={(event) => setEditCategory(event.target.value)} /> : <span className="category-badge">{item.category}</span>}</td>
                      <td>{isEditing ? <input className="table-edit-input quantity-input" type="number" min={item.totalQuantity - item.availableQuantity} value={editTotal} onChange={(event) => setEditTotal(Math.max(1, Number(event.target.value) || 1))} /> : `${item.totalQuantity} units`}</td>
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
                      {(onBorrowItem || isAdmin) && (
                        <td>
                          {isAdmin && (isEditing ? (
                            <>
                              <button type="button" className="btn-table-action" onClick={() => saveEditing(item)}>Save</button>
                              <button type="button" className="btn-table-action" onClick={() => setEditingItemId(null)}>Cancel</button>
                            </>
                          ) : (
                            <>
                              <button type="button" className="btn-table-action" onClick={() => startEditing(item)}>Edit</button>
                              <button type="button" className="btn-danger" disabled={item.availableQuantity !== item.totalQuantity} onClick={() => onDeleteItem(item.id)}>Delete</button>
                            </>
                          ))}
                          {onBorrowItem && !isEditing && <button type="button" className="btn-table-action" disabled={item.availableQuantity === 0} onClick={() => onBorrowItem(item.id)}>{item.availableQuantity > 0 ? 'Borrow' : 'Unavailable'}</button>}
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

