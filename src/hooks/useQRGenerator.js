import { useState, useRef, useCallback, useEffect } from 'react'
import { renderQRToCanvas, downloadCanvas, copyCanvasToClipboard } from '../features/qrGenerator/qrService.js'
import { buildVCard } from '../utils/vcardBuilder.js'

const DEFAULT_STATE = {
  mode: 'url',
  url: '',
  text: '',
  contact: {
    name: '',
    phone: '',
    email: '',
    org: '',
    url: '',
    address: '',
  },
  size: 300,
  fgColor: '#000000',
  bgColor: '#ffffff',
  style: 'square',
  labelEnabled: false,
  labelText: 'Scan Me',
  labelPosition: 'bottom',
  labelFontSize: 14,
  labelColor: '#000000',
  arrowEnabled: false,
  arrowDirection: 'right',
  logo: null,
  logoSize: 0.25,
  logoPosition: 'center',
}

export function useQRGenerator(toastFn) {
  const [state, setState] = useState(DEFAULT_STATE)
  const canvasRef = useRef(null)

  const update = useCallback((patch) => {
    setState(prev => ({ ...prev, ...patch }))
  }, [])

  const updateContact = useCallback((patch) => {
    setState(prev => ({ ...prev, contact: { ...prev.contact, ...patch } }))
  }, [])

  const getQRData = useCallback(() => {
    const { mode, url, text, contact } = state
    if (mode === 'url') {
      if (!url.trim()) return ''
      if (url.startsWith('http://') || url.startsWith('https://')) return url
      return 'https://' + url
    }
    if (mode === 'text') return text
    if (mode === 'contact') return buildVCard(contact)
    return ''
  }, [state])

  const render = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const data = getQRData()
    if (!data) return

    await renderQRToCanvas(canvas, {
      data,
      size: state.size,
      fgColor: state.fgColor,
      bgColor: state.bgColor,
      style: state.style,
      logo: state.logo,
      logoSize: state.logoSize,
      logoPosition: state.logoPosition,
      label: state.labelEnabled ? state.labelText : null,
      labelPosition: state.labelPosition,
      labelFontSize: state.labelFontSize,
      labelColor: state.labelColor,
      arrow: state.arrowEnabled,
      arrowDirection: state.arrowDirection,
    })
  }, [state, getQRData])

  useEffect(() => {
    render()
  }, [render])

  const handleDownload = useCallback(() => {
    if (!canvasRef.current) return
    downloadCanvas(canvasRef.current, 'qr-studio.png')
    toastFn?.('QR code downloaded!', 'success')
  }, [toastFn])

  const handleCopy = useCallback(async () => {
    if (!canvasRef.current) return
    try {
      await copyCanvasToClipboard(canvasRef.current)
      toastFn?.('Copied to clipboard!', 'success')
    } catch {
      toastFn?.('Copy failed — try downloading instead', 'error')
    }
  }, [toastFn])

  const handleReset = useCallback(() => {
    setState(DEFAULT_STATE)
    toastFn?.('Reset to defaults', 'info')
  }, [toastFn])

  const handleLogoUpload = useCallback((file) => {
    if (!file) {
      update({ logo: null })
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => update({ logo: e.target.result })
    reader.readAsDataURL(file)
  }, [update])

  const applyTemplate = useCallback((template) => {
    const templates = {
      minimal: { fgColor: '#000000', bgColor: '#ffffff', style: 'square' },
      dots: { fgColor: '#1a1a2e', bgColor: '#ffffff', style: 'dots' },
      rounded: { fgColor: '#2d2d2d', bgColor: '#f8f8f8', style: 'rounded' },
      gradient: { fgColor: '#6c63ff', bgColor: '#ffffff', style: 'gradient' },
      frame: { fgColor: '#0f172a', bgColor: '#ffffff', style: 'frame' },
      neon: { fgColor: '#00d4ff', bgColor: '#0a0a0f', style: 'dots' },
      rose: { fgColor: '#ff6b8a', bgColor: '#fff5f7', style: 'rounded' },
      forest: { fgColor: '#2d6a4f', bgColor: '#f0faf4', style: 'square' },
    }
    if (templates[template]) {
      update(templates[template])
    }
  }, [update])

  return {
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
  }
}
