import './GuideTerms.css'
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiClipboard,
  FiRefreshCw,
  FiShield,
  FiX,
} from 'react-icons/fi'

interface GuideTermsProps {
  onClose: () => void
}

export function GuideTerms({ onClose }: GuideTermsProps) {
  // Close modal on backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="guide-backdrop" onClick={handleBackdropClick} role="dialog" aria-modal="true">
      <div className="guide-modal">
        {/* Modal Header */}
        <div className="guide-modal-header">
          <div className="guide-title-group">
            <span className="guide-icon"><FiClipboard aria-hidden="true" /></span>
            <div>
              <h2 className="guide-title">Borrowing Guide &amp; Terms of Use</h2>
              <p className="guide-subtitle">Soko Aerial Robotics Inventory System — Equipment Borrowing Policy</p>
            </div>
          </div>
          <button type="button" className="guide-close-btn" onClick={onClose} aria-label="Close">
            <FiX aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="guide-body">
          {/* Section 1 */}
          <section className="guide-section">
            <div className="guide-section-header">
              <span className="guide-section-icon"><FiCheckCircle aria-hidden="true" /></span>
              <h3 className="guide-section-title">Borrowing Rules</h3>
            </div>
            <ul className="guide-list">
              <li>All equipment <strong>must be signed out</strong> using this system before leaving the lab.</li>
              <li>Maximum borrowing period is <strong>7 days</strong> unless explicitly approved by a lab supervisor.</li>
              <li>A maximum of <strong>3 items</strong> may be borrowed per member at any one time.</li>
              <li>High-value items (DJI batteries, Raspberry Pi, GPS modules) may require <strong>supervisor approval</strong>.</li>
              <li>Do not leave borrowed equipment unattended in communal areas.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="guide-section">
            <div className="guide-section-header">
              <span className="guide-section-icon"><FiRefreshCw aria-hidden="true" /></span>
              <h3 className="guide-section-title">Return Policy</h3>
            </div>
            <ul className="guide-list">
              <li>Items must be physically returned to the lab and <strong>marked as "Returned"</strong> in this system.</li>
              <li>Equipment must be returned in <strong>the same condition</strong> it was received in.</li>
              <li>Overdue items must be returned within <strong>24 hours</strong> of the expected return date.</li>
              <li>Early returns are encouraged — mark items returned as soon as they are back in the lab.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="guide-section">
            <div className="guide-section-header">
              <span className="guide-section-icon"><FiShield aria-hidden="true" /></span>
              <h3 className="guide-section-title">Member Responsibilities</h3>
            </div>
            <ul className="guide-list">
              <li>You are fully responsible for all borrowed equipment from checkout until return.</li>
              <li><strong>Do not lend</strong> borrowed equipment to others not registered in this system.</li>
              <li>Handle all electronics with care — observe <strong>ESD precautions</strong> for sensitive components.</li>
              <li>Report any faults or physical damage to the lab supervisor <strong>immediately</strong>, even if you did not cause it.</li>
              <li>Batteries must be stored safely and not left charging unattended outside the lab.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="guide-section">
            <div className="guide-section-header">
              <span className="guide-section-icon"><FiAlertTriangle aria-hidden="true" /></span>
              <h3 className="guide-section-title">Consequences</h3>
            </div>
            <ul className="guide-list consequence-list">
              <li>
                <strong>Lost or irreparably damaged equipment:</strong> The member is liable for the full replacement cost.
              </li>
              <li>
                <strong>3 or more overdue instances:</strong> A 30-day suspension of borrowing privileges will be applied.
              </li>
              <li>
                <strong>Deliberate damage or misuse:</strong> Permanent removal of lab borrowing privileges and escalation to lab management.
              </li>
              <li>
                <strong>Unreported faults:</strong> May be treated as deliberate damage depending on the severity.
              </li>
            </ul>
          </section>

          {/* Note */}
          <p className="guide-footer-note">
            By borrowing any item from the Soko Aerial Robotics Inventory System, you agree to the above terms. 
            Questions? Contact the lab supervisor.
          </p>
        </div>

        {/* Modal Footer */}
        <div className="guide-modal-footer">
          <button type="button" className="btn-understood" onClick={onClose}>
            I Understand — Close
          </button>
        </div>
      </div>
    </div>
  )
}
