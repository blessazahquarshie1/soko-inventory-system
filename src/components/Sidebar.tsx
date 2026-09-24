import type { TabType } from '../types/inventory'
import './Sidebar.css'

interface SidebarProps {
  activeTab: TabType
  onSelectTab: (tab: TabType) => void
  onOpenGuideTerms: () => void
}

export function Sidebar({
  activeTab,
  onSelectTab,
  onOpenGuideTerms,
}: SidebarProps) {
  const navigation: { tab: TabType; label: string }[] = [
    { tab: 'Dashboard', label: 'Dashboard' },
    { tab: 'Inventory', label: 'Inventory' },
    { tab: 'Borrowings', label: 'Borrowings' },
    { tab: 'History', label: 'History' },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo-container">
          <img
            className="brand-logo"
            src="/soko-drone-mark.png"
            alt="Soko Aerial drone"
          />
        </div>
        <div className="brand-info">
          <h2 className="brand-name">Soko Aerial Robotics Inventory System</h2>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        <ul className="sidebar-menu">
          {navigation.map(({ tab, label }) => (
            <li className="sidebar-menu-item" key={tab}>
              <button
                type="button"
                className={`sidebar-link ${activeTab === tab ? 'active' : ''}`}
                onClick={() => onSelectTab(tab)}
              >
                <span className="nav-svg-icon" aria-hidden="true">
                  {tab === 'Dashboard' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5Z" />
                      <path d="M6 6h10M6 10h10" />
                    </svg>
                  )}
                  {tab === 'Inventory' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                      <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
                    </svg>
                  )}
                  {tab === 'Borrowings' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m16 3 4 4-4 4M20 7H4M8 21l-4-4 4-4M4 17h16" />
                    </svg>
                  )}
                  {tab === 'History' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  )}
                </span>
                <span className="link-label">{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button type="button" className="guide-terms-btn" onClick={onOpenGuideTerms}>
          <span className="nav-svg-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          </span>
          <span className="link-label">Guide &amp; Terms</span>
        </button>
        <div className="footer-version">v1.0 · Inventory workspace</div>
      </div>
    </aside>
  )
}
