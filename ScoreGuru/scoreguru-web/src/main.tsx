import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App'
import { store } from './app/store'
import { ThemeRootSync } from './app/ThemeRootSync'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeRootSync />
      <App />
    </Provider>
  </StrictMode>,
)
