import React from 'react'
import styles from './Templates.module.css'

const TEMPLATES = [
  { id: 'minimal', label: 'Minimal', fg: '#000000', bg: '#ffffff', desc: 'Classic' },
  { id: 'dots', label: 'Dots', fg: '#1a1a2e', bg: '#ffffff', desc: 'Circular' },
  { id: 'rounded', label: 'Rounded', fg: '#2d2d2d', bg: '#f8f8f8', desc: 'Soft edges' },
  { id: 'frame', label: 'Frame', fg: '#0f172a', bg: '#ffffff', desc: 'Bold corners' },
  { id: 'neon', label: 'Neon', fg: '#00d4ff', bg: '#0a0a0f', desc: 'Cyberpunk' },
  { id: 'rose', label: 'Rose', fg: '#ff6b8a', bg: '#fff5f7', desc: 'Soft pink' },
  { id: 'forest', label: 'Forest', fg: '#2d6a4f', bg: '#f0faf4', desc: 'Natural' },
]

export default function Templates({ currentStyle, currentFg, onApply }) {
  return (
    <div className={styles.wrapper}>
      <label className={styles.sectionLabel}>Style Templates</label>
      <div className={styles.grid}>
        {TEMPLATES.map(tpl => (
          <button
            key={tpl.id}
            className={`${styles.card} ${currentFg === tpl.fg ? styles.active : ''}`}
            onClick={() => onApply(tpl.id)}
            title={tpl.desc}
          >
            <div className={styles.preview} style={{ background: tpl.bg }}>
              <div className={styles.qrMock}>
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className={styles.dot}
                    style={{
                      background: tpl.fg,
                      borderRadius: tpl.id === 'dots' || tpl.id === 'rose' ? '50%' :
                                    tpl.id === 'rounded' ? '2px' : '0',
                      opacity: [0,2,3,5,6,8].includes(i) ? 0 : 1,
                    }}
                  />
                ))}
              </div>
            </div>
            <span className={styles.label}>{tpl.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
