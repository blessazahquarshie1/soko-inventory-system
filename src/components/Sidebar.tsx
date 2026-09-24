import type { TabType } from '../types/inventory'
import { FiBookOpen, FiBox, FiClock, FiInfo, FiRepeat } from 'react-icons/fi'
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
                  {tab === 'Dashboard' && <FiBookOpen />}
                  {tab === 'Inventory' && <FiBox />}
                  {tab === 'Borrowings' && <FiRepeat />}
                  {tab === 'History' && <FiClock />}
                </span>
                <span className="link-label">{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button type="button" className="guide-terms-btn" onClick={onOpenGuideTerms}>
          <span className="nav-svg-icon" aria-hidden="true"><FiInfo /></span>
          <span className="link-label">Guide &amp; Terms</span>
        </button>
        <div className="footer-version">v1.0 · Inventory workspace</div>
      </div>
    </aside>
  )
}
