import React from 'react'
import styles from './QRPreview.module.css'

export default function QRPreview({ canvasRef, onDownload, onCopy, onReset, hasData }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.canvasContainer}>
        <div className={`${styles.canvasFrame} ${hasData ? styles.hasData : ''}`}>
          {!hasData && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <rect x="4" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <rect x="26" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <rect x="4" y="26" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <rect x="8" y="8" width="10" height="10" rx="1" fill="currentColor" opacity="0.3"/>
                  <rect x="30" y="8" width="10" height="10" rx="1" fill="currentColor" opacity="0.3"/>
                  <rect x="8" y="30" width="10" height="10" rx="1" fill="currentColor" opacity="0.3"/>
                  <rect x="30" y="26" width="4" height="4" fill="currentColor" opacity="0.3"/>
                  <rect x="38" y="26" width="4" height="4" fill="currentColor" opacity="0.3"/>
                  <rect x="30" y="34" width="4" height="4" fill="currentColor" opacity="0.3"/>
                  <rect x="38" y="34" width="4" height="4" fill="currentColor" opacity="0.3"/>
                  <rect x="34" y="30" width="4" height="4" fill="currentColor" opacity="0.3"/>
                  <rect x="30" y="42" width="4" height="4" fill="currentColor" opacity="0.3"/>
                  <rect x="38" y="42" width="4" height="4" fill="currentColor" opacity="0.3"/>
                </svg>
              </div>
              <p className={styles.emptyTitle}>Enter content to generate</p>
              <p className={styles.emptyHint}>Type a URL, text, or contact info</p>
            </div>
          )}
          <canvas
            ref={canvasRef}
            className={`${styles.canvas} ${hasData ? styles.canvasVisible : ''}`}
          />
        </div>

        {hasData && (
          <div className={styles.glowRing} />
        )}
      </div>

      <div className={styles.actions}>
        <button className={`${styles.btn} ${styles.primary}`} onClick={onDownload} disabled={!hasData}>
          <span className={styles.btnIcon}>⬇</span>
          Download PNG
        </button>
        <button className={`${styles.btn} ${styles.secondary}`} onClick={onCopy} disabled={!hasData}>
          <span className={styles.btnIcon}>⧉</span>
          Copy
        </button>
        <button className={`${styles.btn} ${styles.ghost}`} onClick={onReset}>
          <span className={styles.btnIcon}>↺</span>
          Reset
        </button>
      </div>
    </div>
  )
}
