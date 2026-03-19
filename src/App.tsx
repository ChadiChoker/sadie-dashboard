import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CallLogPage from './pages/CallLogPage'
import CallDetailPage from './pages/CallDetailPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CallLogPage />} />
        <Route path="/calls/:callId" element={<CallDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}
