import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import PERatioVisualizer from './pe-ratio-visualizer.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PERatioVisualizer />
  </StrictMode>,
)
