import { useState } from 'react'
import Header from './components/Header'
import ActionGrid from './components/ActionGrid'
import BookingForm from './components/BookingForm'
import CheckInForm from './components/CheckInForm'
import PatientTracker from './components/PatientTracker'

function App() {
  const [view, setView] = useState('home')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-gray-900">
      <Header onNav={setView} current={view} />
      <main className="px-6 md:px-10 pb-16">
        {view === 'home' && (
          <>
            <div className="max-w-5xl mx-auto text-center mt-4">
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">Self-service hospital kiosk</h2>
              <p className="text-gray-600 mt-3">Minimal, fast, and touch-friendly. Book appointments, check in on arrival, and track patients in real-time.</p>
            </div>
            <ActionGrid onNav={setView} />
          </>
        )}
        {view === 'book' && <BookingForm />}
        {view === 'checkin' && <CheckInForm />}
        {view === 'track' && <PatientTracker />}
      </main>
    </div>
  )
}

export default App
