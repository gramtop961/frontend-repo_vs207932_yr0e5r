import { Calendar, UserCheck, ClipboardList } from 'lucide-react'

export default function Header({ onNav, current }) {
  return (
    <header className="w-full py-6 px-6 md:px-10 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-blue-600 text-white grid place-items-center text-lg font-bold">HK</div>
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Hospital Kiosk</h1>
          <p className="text-sm text-gray-500">Fast self-service check-ins & bookings</p>
        </div>
      </div>
      <nav className="hidden md:flex items-center gap-2">
        <button onClick={() => onNav('home')} className={`px-4 py-2 rounded-lg text-sm font-medium ${current==='home'?'bg-gray-900 text-white':'bg-white hover:bg-gray-100 border'}`}>Home</button>
        <button onClick={() => onNav('book')} className={`px-4 py-2 rounded-lg text-sm font-medium ${current==='book'?'bg-gray-900 text-white':'bg-white hover:bg-gray-100 border'}`}><Calendar className="inline mr-2 h-4 w-4"/>Book</button>
        <button onClick={() => onNav('checkin')} className={`px-4 py-2 rounded-lg text-sm font-medium ${current==='checkin'?'bg-gray-900 text-white':'bg-white hover:bg-gray-100 border'}`}><UserCheck className="inline mr-2 h-4 w-4"/>Check-in</button>
        <button onClick={() => onNav('track')} className={`px-4 py-2 rounded-lg text-sm font-medium ${current==='track'?'bg-gray-900 text-white':'bg-white hover:bg-gray-100 border'}`}><ClipboardList className="inline mr-2 h-4 w-4"/>Tracker</button>
      </nav>
    </header>
  )
}
