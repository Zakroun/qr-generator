import React from 'react'
import styles from './QRControls.module.css'

export default function QRControls({ state, update, updateContact }) {
  const { mode, url, text, contact, size, fgColor, bgColor } = state

  return (
    <div className={styles.controls}>
      {/* Content Input */}
      <section className={styles.section}>
        <label className={styles.sectionLabel}>Content</label>

        {mode === 'url' && (
          <div className={styles.inputWrapper}>
            <span className={styles.inputPrefix}>https://</span>
            <input
              className={styles.input}
              style={{ paddingLeft: '76px' }}
              type="text"
              placeholder="example.com"
              value={url.replace(/^https?:\/\//, '')}
              onChange={e => update({ url: e.target.value })}
            />
          </div>
        )}

        {mode === 'text' && (
          <textarea
            className={styles.textarea}
            placeholder="Enter your text..."
            value={text}
            onChange={e => update({ text: e.target.value })}
            rows={4}
          />
        )}

        {mode === 'contact' && (
          <div className={styles.contactGrid}>
            <input
              className={styles.input}
              placeholder="Full Name *"
              value={contact.name}
              onChange={e => updateContact({ name: e.target.value })}
            />
            <input
              className={styles.input}
              placeholder="Phone"
              value={contact.phone}
              onChange={e => updateContact({ phone: e.target.value })}
            />
            <input
              className={styles.input}
              placeholder="Email"
              value={contact.email}
              onChange={e => updateContact({ email: e.target.value })}
            />
            <input
              className={styles.input}
              placeholder="Organization"
              value={contact.org}
              onChange={e => updateContact({ org: e.target.value })}
            />
            <input
              className={styles.input}
              placeholder="Website"
              value={contact.url}
              onChange={e => updateContact({ url: e.target.value })}
            />
            <input
              className={styles.input}
              placeholder="Address"
              value={contact.address}
              onChange={e => updateContact({ address: e.target.value })}
            />
          </div>
        )}
      </section>

      {/* Size */}
      <section className={styles.section}>
        <div className={styles.labelRow}>
          <label className={styles.sectionLabel}>Size</label>
          <span className={styles.valueTag}>{size}px</span>
        </div>
        <input
          type="range"
          className={styles.slider}
          min={150}
          max={600}
          step={10}
          value={size}
          onChange={e => update({ size: parseInt(e.target.value) })}
        />
        <div className={styles.sliderMarks}>
          <span>150</span>
          <span>300</span>
          <span>600</span>
        </div>
      </section>

      {/* Colors */}
      <section className={styles.section}>
        <label className={styles.sectionLabel}>Colors</label>
        <div className={styles.colorRow}>
          <label className={styles.colorItem}>
            <div className={styles.colorPreview} style={{ background: fgColor }} />
            <div className={styles.colorInfo}>
              <span className={styles.colorLabel}>Foreground</span>
              <span className={styles.colorHex}>{fgColor}</span>
            </div>
            <input
              type="color"
              className={styles.colorInput}
              value={fgColor}
              onChange={e => update({ fgColor: e.target.value })}
            />
          </label>
          <label className={styles.colorItem}>
            <div
              className={styles.colorPreview}
              style={{ background: bgColor, border: '1px solid var(--border-default)' }}
            />
            <div className={styles.colorInfo}>
              <span className={styles.colorLabel}>Background</span>
              <span className={styles.colorHex}>{bgColor}</span>
            </div>
            <input
              type="color"
              className={styles.colorInput}
              value={bgColor}
              onChange={e => update({ bgColor: e.target.value })}
            />
          </label>
        </div>
      </section>
    </div>
  )
}
