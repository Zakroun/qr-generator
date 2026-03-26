export function buildVCard({ name, phone, email, org, url, address }) {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
  ]

  if (name) lines.push(`FN:${name}`)
  if (name) {
    const parts = name.trim().split(' ')
    const last = parts.pop() || ''
    const first = parts.join(' ')
    lines.push(`N:${last};${first};;;`)
  }
  if (org) lines.push(`ORG:${org}`)
  if (phone) lines.push(`TEL;TYPE=CELL:${phone}`)
  if (email) lines.push(`EMAIL:${email}`)
  if (url) lines.push(`URL:${url}`)
  if (address) lines.push(`ADR;TYPE=WORK:;;${address};;;;`)

  lines.push('END:VCARD')
  return lines.join('\n')
}
