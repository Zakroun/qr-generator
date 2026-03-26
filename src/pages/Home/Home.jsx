import React, { useState } from 'react'
import { useToast } from '../../components/Toast/ToastProvider.jsx'
import { useQRGenerator } from '../../hooks/useQRGenerator.js'
import ModeTabs from '../../components/ModeTabs/ModeTabs.jsx'
import QRControls from '../../components/QRControls/QRControls.jsx'
import QRPreview from '../../components/QRPreview/QRPreview.jsx'
import Templates from '../../components/Templates/Templates.jsx'
import LabelControls from '../../components/LabelControls/LabelControls.jsx'
import LogoUpload from '../../components/LogoUpload/LogoUpload.jsx'
import styles from './Home.module.css'

const SECTIONS = [
  { id: 'style', label: 'Style' },
  { id: 'label', label: 'Label & Arrow' },
  { id: 'logo', label: 'Logo' },
]

export default function Home() {
  const toast = useToast()
  const [activeSection, setActiveSection] = useState('style')

  const {
    state,
    canvasRef,
    update,
    updateContact,
    getQRData,
    handleDownload,
    handleCopy,
    handleReset,
    handleLogoUpload,
    applyTemplate,
  } = useQRGenerator(toast)

  const hasData = Boolean(getQRData())

  return (
    <div className={styles.page}>
      {/* Background Effects */}
      <div className={styles.bgOrb1} />
      <div className={styles.bgOrb2} />
      <div className={styles.bgGrid} />

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          {/* <div className={styles.logoMark}>
            <span>QR</span>
          </div> */}
          <div className={styles.logoText}>
            <span className={styles.logoName}>QR Studio</span>
            <span className={styles.logoBadge}>Pro</span>
          </div>
        </div>
        <p className={styles.tagline}>Generate beautiful, customizable QR codes</p>
      </header>

      {/* Main layout */}
      <main className={styles.main}>
        {/* Left: Controls */}
        <div className={styles.panel}>
          <div className={styles.card}>
            <ModeTabs mode={state.mode} onChange={mode => update({ mode })} />
            <div className={styles.divider} />
            <QRControls state={state} update={update} updateContact={updateContact} />
          </div>

          {/* Advanced sections */}
          <div className={styles.card}>
            <div className={styles.sectionTabs}>
              {SECTIONS.map(s => (
                <button
                  key={s.id}
                  className={`${styles.sectionTab} ${activeSection === s.id ? styles.sectionTabActive : ''}`}
                  onClick={() => setActiveSection(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className={styles.sectionContent}>
              {activeSection === 'style' && (
                <Templates
                  currentStyle={state.style}
                  currentFg={state.fgColor}
                  onApply={applyTemplate}
                />
              )}
              {activeSection === 'label' && (
                <LabelControls state={state} update={update} />
              )}
              {activeSection === 'logo' && (
                <LogoUpload state={state} update={update} onUpload={handleLogoUpload} />
              )}
            </div>
          </div>
        </div>

        {/* Right: Preview */}
        <div className={styles.previewPanel}>
          <div className={`${styles.card} ${styles.previewCard}`}>
            <div className={styles.previewHeader}>
              <span className={styles.previewLabel}>Preview</span>
              {hasData && (
                <span className={styles.liveIndicator}>
                  <span className={styles.liveDot} />
                  Live
                </span>
              )}
            </div>

            <QRPreview
              canvasRef={canvasRef}
              hasData={hasData}
              onDownload={handleDownload}
              onCopy={handleCopy}
              onReset={handleReset}
            />

            {hasData && (
              <div className={styles.dataPreview}>
                <span className={styles.dataLabel}>Data</span>
                <span className={styles.dataValue}>
                  {getQRData().length > 60 ? getQRData().slice(0, 60) + '…' : getQRData()}
                </span>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <span>Built with QR Studio</span>
        <span className={styles.footerDot}>·</span>
        <span>High-quality QR generation</span>
      </footer>
    </div>
  )
}
