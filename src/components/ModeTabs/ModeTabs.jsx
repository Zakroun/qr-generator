import React from 'react'
import styles from './ModeTabs.module.css'

const TABS = [
  { id: 'url', label: 'URL', icon: '🔗' },
  { id: 'text', label: 'Text', icon: '✏️' },
  { id: 'contact', label: 'Contact', icon: '👤' },
]

export default function ModeTabs({ mode, onChange }) {
  return (
    <div className={styles.tabs}>
      {TABS.map(tab => (
        <button
          key={tab.id}
          className={`${styles.tab} ${mode === tab.id ? styles.active : ''}`}
          onClick={() => onChange(tab.id)}
        >
          <span className={styles.icon}>{tab.icon}</span>
          <span className={styles.label}>{tab.label}</span>
        </button>
      ))}
    </div>
  )
}
