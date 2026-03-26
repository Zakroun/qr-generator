import React from 'react'
import styles from './LabelControls.module.css'

export default function LabelControls({ state, update }) {
  const {
    labelEnabled,
    labelText,
    labelPosition,
    labelFontSize,
    labelColor,
    arrowEnabled,
    arrowDirection,
  } = state

  return (
    <div className={styles.wrapper}>
      {/* Label Section */}
      <div className={styles.sectionHeader}>
        <label className={styles.sectionLabel}>Label</label>
        <button
          className={`${styles.toggle} ${labelEnabled ? styles.on : ''}`}
          onClick={() => update({ labelEnabled: !labelEnabled })}
        >
          <span className={styles.toggleThumb} />
        </button>
      </div>

      {labelEnabled && (
        <div className={styles.fields}>
          <input
            className={styles.input}
            type="text"
            placeholder="Scan Me"
            value={labelText}
            onChange={e => update({ labelText: e.target.value })}
          />

          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <span className={styles.fieldLabel}>Position</span>
              <div className={styles.segmented}>
                {['top', 'bottom'].map(pos => (
                  <button
                    key={pos}
                    className={`${styles.seg} ${labelPosition === pos ? styles.segActive : ''}`}
                    onClick={() => update({ labelPosition: pos })}
                  >
                    {pos === 'top' ? '↑ Top' : '↓ Bottom'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <span className={styles.fieldLabel}>Font Size</span>
                <span className={styles.valueTag}>{labelFontSize}px</span>
              </div>
              <input
                type="range"
                className={styles.slider}
                min={10}
                max={28}
                value={labelFontSize}
                onChange={e => update({ labelFontSize: parseInt(e.target.value) })}
              />
            </div>
            <label className={styles.colorPicker}>
              <span className={styles.fieldLabel}>Color</span>
              <div className={styles.colorSwatch} style={{ background: labelColor }} />
              <input
                type="color"
                className={styles.colorInput}
                value={labelColor}
                onChange={e => update({ labelColor: e.target.value })}
              />
            </label>
          </div>
        </div>
      )}

      {/* Arrow Section */}
      <div className={styles.divider} />

      <div className={styles.sectionHeader}>
        <label className={styles.sectionLabel}>Arrow</label>
        <button
          className={`${styles.toggle} ${arrowEnabled ? styles.on : ''}`}
          onClick={() => update({ arrowEnabled: !arrowEnabled })}
        >
          <span className={styles.toggleThumb} />
        </button>
      </div>

      {arrowEnabled && (
        <div className={styles.fields}>
          <div className={styles.segmented}>
            <button
              className={`${styles.seg} ${arrowDirection === 'right' ? styles.segActive : ''}`}
              onClick={() => update({ arrowDirection: 'right' })}
            >
              → Right
            </button>
            <button
              className={`${styles.seg} ${arrowDirection === 'down' ? styles.segActive : ''}`}
              onClick={() => update({ arrowDirection: 'down' })}
            >
              ↓ Down
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
