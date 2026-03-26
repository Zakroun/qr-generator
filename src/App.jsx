import React from 'react'
import Home from './pages/Home/Home.jsx'
import { ToastProvider } from './components/Toast/ToastProvider.jsx'

export default function App() {
  return (
    <ToastProvider>
      <Home />
    </ToastProvider>
  )
}
