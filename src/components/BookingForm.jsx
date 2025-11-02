import { useEffect, useMemo, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function AvailabilityPill({ used }) {
  const color = used >= 80 ? 'bg-red-100 text-red-700' : used >= 40 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{used}% used</span>
}

function MonthCalendar({ department, selectedDate, onSelectDate }) {
  const [yearMonth, setYearMonth] = useState(() => {
    const d = selectedDate ? new Date(selectedDate) : new Date()
    return { year: d.getFullYear(), month: d.getMonth() + 1 }
  })
  const [days, setDays] = useState({})

  useEffect(() => {
    if (!department) return
    fetch(`${API_BASE}/calendar-availability?department=${encodeURIComponent(department)}&year=${yearMonth.year}&month=${yearMonth.month}`)
      .then(r => r.json())
      .then(data => setDays(data.days || {}))
      .catch(() => setDays({}))
  }, [department, yearMonth])

  const firstDay = useMemo(() => new Date(yearMonth.year, yearMonth.month - 1, 1), [yearMonth])
  const lastDay = useMemo(() => new Date(yearMonth.year, yearMonth.month, 0), [yearMonth])

  const grid = []
  for (let i = 0; i < firstDay.getDay(); i++) grid.push(null)
  for (let d = 1; d <= lastDay.getDate(); d++) grid.push(new Date(yearMonth.year, yearMonth.month - 1, d))

  const monthLabel = new Date(yearMonth.year, yearMonth.month - 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })

  return (
    <div className="bg-white border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <button className="px-3 py-1 rounded-lg border" onClick={() => setYearMonth(m => ({ year: m.month === 1 ? m.year - 1 : m.year, month: m.month === 1 ? 12 : m.month - 1 }))}>{'←'}</button>
        <div className="font-semibold">{monthLabel}</div>
        <button className="px-3 py-1 rounded-lg border" onClick={() => setYearMonth(m => ({ year: m.month === 12 ? m.year + 1 : m.year, month: m.month === 12 ? 1 : m.month + 1 }))}>{'→'}</button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-xs text-gray-500 mb-2">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d} className="text-center">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {grid.map((d, idx) => {
          if (!d) return <div key={idx} />
          const iso = d.toISOString().slice(0,10)
          const info = days[iso]
          const used = info?.used_pct || 0
          const color = used >= 80 ? 'bg-red-50 border-red-200' : used >= 40 ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'
          const isSelected = selectedDate && iso === selectedDate
          return (
            <button key={iso} onClick={() => onSelectDate(iso)} className={`aspect-square rounded-lg border text-sm flex flex-col items-center justify-center ${color} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
              <div className="font-medium">{d.getDate()}</div>
              <div className="text-[10px] mt-1">{used}%</div>
            </button>
          )
        })}
      </div>
      <div className="flex items-center gap-3 text-xs text-gray-500 mt-3">
        <div className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-emerald-200 inline-block"/> Low</div>
        <div className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-amber-200 inline-block"/> Medium</div>
        <div className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-red-200 inline-block"/> High</div>
      </div>
    </div>
  )
}

export default function BookingForm() {
  const [departments, setDepartments] = useState([])
  const [department, setDepartment] = useState('')
  const [dateStr, setDateStr] = useState('')
  const [availability, setAvailability] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', email: '' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`${API_BASE}/departments`).then(r => r.json()).then(setDepartments)
  }, [])

  useEffect(() => {
    if (!department || !dateStr) return setAvailability(null)
    fetch(`${API_BASE}/availability?department=${encodeURIComponent(department)}&date=${dateStr}`)
      .then(r => r.json())
      .then(setAvailability)
  }, [department, dateStr])

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch(`${API_BASE}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_name: form.name,
          phone: form.phone,
          email: form.email || null,
          department,
          date: dateStr,
        })
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setResult({ ok: true, data })
    } catch (err) {
      setResult({ ok: false, message: String(err).slice(0,200) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h2 className="text-3xl font-semibold mb-4">Book an appointment</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <select value={department} onChange={e=>setDepartment(e.target.value)} className="w-full border rounded-lg px-3 py-2">
              <option value="">Select a department</option>
              {departments.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Choose date</label>
            <input type="date" value={dateStr} onChange={e=>setDateStr(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
          </div>
          {availability && (
            <div className="bg-white border rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">Availability</div>
                <div className="text-sm text-gray-500">{availability.remaining} of {availability.capacity} remaining</div>
              </div>
              <AvailabilityPill used={availability.used_pct} />
            </div>
          )}
          <form onSubmit={onSubmit} className="bg-white border rounded-xl p-4 space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Full name</label>
                <input required value={form.name} onChange={e=>setForm(f=>({...f, name:e.target.value}))} className="w-full border rounded-lg px-3 py-2" placeholder="Jane Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input required value={form.phone} onChange={e=>setForm(f=>({...f, phone:e.target.value}))} className="w-full border rounded-lg px-3 py-2" placeholder="(555) 123-4567" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Email (optional)</label>
                <input type="email" value={form.email} onChange={e=>setForm(f=>({...f, email:e.target.value}))} className="w-full border rounded-lg px-3 py-2" placeholder="jane@example.com" />
              </div>
            </div>
            <button disabled={!department || !dateStr || loading} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-lg">
              {loading ? 'Booking...' : 'Confirm booking'}
            </button>
            {result && result.ok && (
              <div className="mt-3 p-3 border rounded-lg bg-emerald-50 text-emerald-800">
                Booking confirmed. Your code is <span className="font-mono font-semibold">{result.data.booking_code}</span>
              </div>
            )}
            {result && !result.ok && (
              <div className="mt-3 p-3 border rounded-lg bg-red-50 text-red-700">
                {result.message}
              </div>
            )}
          </form>
        </div>
        <div>
          <div className="mb-2 text-sm text-gray-600">Calendar availability by day</div>
          <MonthCalendar department={department} selectedDate={dateStr} onSelectDate={setDateStr} />
        </div>
      </div>
    </div>
  )
}
