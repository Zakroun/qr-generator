import React, { useRef } from 'react'
import styles from './LogoUpload.module.css'

export default function LogoUpload({ state, update, onUpload }) {
  const fileRef = useRef(null)
  const { logo, logoSize, logoPosition } = state

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (file) onUpload(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) onUpload(file)
  }

  return (
    <div className={styles.wrapper}>
      <label className={styles.sectionLabel}>Logo / Image</label>

      {!logo ? (
        <div
          className={styles.dropzone}
          onClick={() => fileRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
        >
          <div className={styles.dropIcon}>⬆</div>
          <span className={styles.dropText}>Drop image or click to upload</span>
          <span className={styles.dropHint}>PNG, JPG, SVG — placed in center</span>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className={styles.fileInput}
            onChange={handleFile}
          />
        </div>
      ) : (
        <div className={styles.logoPreview}>
          <img src={logo} alt="Logo" className={styles.logoImg} />
          <div className={styles.logoInfo}>
            <span className={styles.logoName}>Logo uploaded</span>
            <button
              className={styles.removeBtn}
              onClick={() => { onUpload(null); if (fileRef.current) fileRef.current.value = '' }}
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {logo && (
        <div className={styles.fields}>
          <div className={styles.fieldGroup}>
            <div className={styles.labelRow}>
              <span className={styles.fieldLabel}>Size</span>
              <span className={styles.valueTag}>{Math.round(logoSize * 100)}%</span>
            </div>
            <input
              type="range"
              className={styles.slider}
              min={0.1}
              max={0.4}
              step={0.01}
              value={logoSize}
              onChange={e => update({ logoSize: parseFloat(e.target.value) })}
            />
          </div>

          <div className={styles.fieldGroup}>
            <span className={styles.fieldLabel}>Position</span>
            <div className={styles.segmented}>
              {['center', 'top'].map(pos => (
                <button
                  key={pos}
                  className={`${styles.seg} ${logoPosition === pos ? styles.segActive : ''}`}
                  onClick={() => update({ logoPosition: pos })}
                >
                  {pos === 'center' ? '⊕ Center' : '↑ Top'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
