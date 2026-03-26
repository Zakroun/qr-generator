import QRCode from 'qrcode'

/**
 * Core QR rendering pipeline:
 * 1. Generate QR matrix
 * 2. Draw base QR with style
 * 3. Draw logo overlay
 * 4. Draw label
 * 5. Draw arrow
 */

export async function renderQRToCanvas(canvas, options) {
  const {
    data,
    size = 300,
    fgColor = '#000000',
    bgColor = '#ffffff',
    style = 'square',
    logo = null,
    logoSize = 0.25,
    logoPosition = 'center',
    label = null,
    labelPosition = 'bottom',
    labelFontSize = 14,
    labelColor = '#000000',
    arrow = false,
    arrowDirection = 'right',
    errorCorrectionLevel = 'H',
  } = options

  if (!data || !data.trim()) return

  const ctx = canvas.getContext('2d')
  const PADDING = label ? 40 : 0
  const totalHeight = size + PADDING
  canvas.width = size
  canvas.height = totalHeight

  // Background
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, size, totalHeight)

  // Generate QR code matrix
  const qrMatrix = await QRCode.create(data, {
    errorCorrectionLevel,
    margin: 1,
  })

  const modules = qrMatrix.modules
  const count = modules.size
  const cellSize = (size * 0.9) / count
  const offsetX = (size - cellSize * count) / 2
  const offsetY = label && labelPosition === 'top' ? PADDING + (size * 0.05) : size * 0.05

  // Draw QR modules
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (!modules.get(row, col)) continue

      const x = offsetX + col * cellSize
      const y = offsetY + row * cellSize

      ctx.fillStyle = fgColor

      switch (style) {
        case 'dots':
          ctx.beginPath()
          ctx.arc(
            x + cellSize / 2,
            y + cellSize / 2,
            (cellSize / 2) * 0.85,
            0, Math.PI * 2
          )
          ctx.fill()
          break

        case 'rounded':
          drawRoundedRect(ctx, x + 0.5, y + 0.5, cellSize - 1, cellSize - 1, cellSize * 0.3)
          ctx.fill()
          break

        case 'frame': {
          // Finder patterns get special treatment
          const isFinder = isFinderPattern(row, col, count)
          if (isFinder) {
            ctx.fillStyle = fgColor
            drawRoundedRect(ctx, x, y, cellSize, cellSize, cellSize * 0.35)
            ctx.fill()
          } else {
            ctx.fillRect(x, y, cellSize, cellSize)
          }
          break
        }

        default: // square / gradient / minimal
          ctx.fillRect(x, y, cellSize, cellSize)
      }
    }
  }

  // Gradient overlay
  if (style === 'gradient') {
    const grad = ctx.createLinearGradient(0, 0, size, size)
    grad.addColorStop(0, fgColor)
    grad.addColorStop(1, adjustColor(fgColor, 60))
    ctx.globalCompositeOperation = 'source-atop'
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, size, size)
    ctx.globalCompositeOperation = 'source-over'
  }

  // Logo
  if (logo) {
    await drawLogo(ctx, logo, size, offsetY, cellSize * count, logoSize, logoPosition)
  }

  // Label
  if (label) {
    drawLabel(ctx, label, size, totalHeight, labelPosition, labelFontSize, labelColor, PADDING)
  }

  // Arrow
  if (arrow) {
    drawArrow(ctx, size, totalHeight, arrowDirection, fgColor)
  }
}

function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function isFinderPattern(row, col, count) {
  const size = 7
  return (
    (row < size && col < size) ||
    (row < size && col >= count - size) ||
    (row >= count - size && col < size)
  )
}

async function drawLogo(ctx, logoSrc, qrSize, qrOffsetY, qrRenderSize, logoSizeRatio, position) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const logoW = qrRenderSize * logoSizeRatio
      const logoH = logoW

      let lx, ly
      if (position === 'center') {
        lx = (qrSize - logoW) / 2
        ly = qrOffsetY + (qrRenderSize - logoH) / 2
      } else {
        lx = (qrSize - logoW) / 2
        ly = qrOffsetY - logoH / 2 + 10
      }

      // White padding
      const pad = 4
      ctx.fillStyle = '#ffffff'
      drawRoundedRect(ctx, lx - pad, ly - pad, logoW + pad * 2, logoH + pad * 2, 8)
      ctx.fill()

      ctx.drawImage(img, lx, ly, logoW, logoH)
      resolve()
    }
    img.onerror = resolve
    img.src = logoSrc
  })
}

function drawLabel(ctx, text, width, totalHeight, position, fontSize, color, padding) {
  ctx.fillStyle = color
  ctx.font = `600 ${fontSize}px 'Syne', sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const y = position === 'top' ? padding / 2 : totalHeight - padding / 2
  ctx.fillText(text, width / 2, y)
}

function drawArrow(ctx, size, totalHeight, direction, color) {
  ctx.fillStyle = color
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.lineCap = 'round'

  if (direction === 'right') {
    const ax = size - 20
    const ay = totalHeight / 2
    ctx.beginPath()
    ctx.moveTo(ax - 16, ay)
    ctx.lineTo(ax, ay)
    ctx.moveTo(ax - 6, ay - 6)
    ctx.lineTo(ax, ay)
    ctx.lineTo(ax - 6, ay + 6)
    ctx.stroke()
  } else {
    const ax = size / 2
    const ay = totalHeight - 10
    ctx.beginPath()
    ctx.moveTo(ax, ay - 16)
    ctx.lineTo(ax, ay)
    ctx.moveTo(ax - 6, ay - 6)
    ctx.lineTo(ax, ay)
    ctx.lineTo(ax + 6, ay - 6)
    ctx.stroke()
  }
}

function adjustColor(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, (num >> 16) + amount)
  const g = Math.min(255, ((num >> 8) & 0xff) + amount)
  const b = Math.min(255, (num & 0xff) + amount)
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

export function downloadCanvas(canvas, filename = 'qr-code.png') {
  const link = document.createElement('a')
  link.download = filename
  link.href = canvas.toDataURL('image/png')
  link.click()
}

export async function copyCanvasToClipboard(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ])
        resolve()
      } catch (err) {
        reject(err)
      }
    })
  })
}
