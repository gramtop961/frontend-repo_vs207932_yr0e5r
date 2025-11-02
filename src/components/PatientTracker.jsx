import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function PatientTracker() {
  const [dateStr, setDateStr] = useState(() => new Date().toISOString().slice(0,10))
  const [data, setData] = useState({ summary: { total: 0, checked_in: 0, booked: 0 }, patients: [] })

  useEffect(() => {
    const url = `${API_BASE}/patients${dateStr ? `?date=${dateStr}` : ''}`
    fetch(url).then(r => r.json()).then(setData)
  }, [dateStr])

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h2 className="text-3xl font-semibold mb-4">Patient tracker</h2>
      <div className="bg-white border rounded-xl p-4 mb-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">Pick a date to view bookings and check-ins</div>
        <input type="date" value={dateStr} onChange={e=>setDateStr(e.target.value)} className="border rounded-lg px-3 py-2" />
      </div>
      <div className="grid md:grid-cols-3 gap-3 mb-4">
        <div className="p-4 rounded-xl border bg-white">
          <div className="text-gray-500 text-sm">Total bookings</div>
          <div className="text-2xl font-semibold">{data.summary.total}</div>
        </div>
        <div className="p-4 rounded-xl border bg-white">
          <div className="text-gray-500 text-sm">Checked in</div>
          <div className="text-2xl font-semibold text-emerald-600">{data.summary.checked_in}</div>
        </div>
        <div className="p-4 rounded-xl border bg-white">
          <div className="text-gray-500 text-sm">Not yet arrived</div>
          <div className="text-2xl font-semibold text-amber-600">{data.summary.booked}</div>
        </div>
      </div>
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="grid grid-cols-6 gap-0 text-sm font-medium bg-gray-50 border-b">
          <div className="p-3">Name</div>
          <div className="p-3">Phone</div>
          <div className="p-3">Department</div>
          <div className="p-3">Date</div>
          <div className="p-3">Code</div>
          <div className="p-3">Status</div>
        </div>
        {data.patients.map(p => (
          <div key={p.id} className="grid grid-cols-6 gap-0 border-b last:border-b-0">
            <div className="p-3">{p.patient_name}</div>
            <div className="p-3">{p.phone}</div>
            <div className="p-3">{p.department}</div>
            <div className="p-3">{p.date}</div>
            <div className="p-3 font-mono">{p.booking_code}</div>
            <div className="p-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.status==='checked_in'?'bg-emerald-100 text-emerald-700':'bg-amber-100 text-amber-700'}`}>{p.status}</span>
            </div>
          </div>
        ))}
        {data.patients.length === 0 && (
          <div className="p-6 text-center text-gray-500">No records for this date.</div>
        )}
      </div>
    </div>
  )
}
