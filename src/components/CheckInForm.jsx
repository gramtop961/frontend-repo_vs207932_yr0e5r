import { useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function CheckInForm() {
  const [mode, setMode] = useState('code')
  const [code, setCode] = useState('')
  const [alt, setAlt] = useState({ name: '', phone: '', date: '', department: '' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    try {
      const body = mode === 'code' ? { booking_code: code } : {
        patient_name: alt.name, phone: alt.phone, date: alt.date, department: alt.department
      }
      const res = await fetch(`${API_BASE}/checkin`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setResult({ ok: true, data })
    } catch (err) {
      setResult({ ok: false, message: String(err).slice(0,200) })
    } finally { setLoading(false) }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-3xl font-semibold mb-4">Check in</h2>
      <div className="bg-white border rounded-xl p-4">
        <div className="flex gap-2 mb-4">
          <button onClick={()=>setMode('code')} className={`px-4 py-2 rounded-lg border ${mode==='code'?'bg-gray-900 text-white':'bg-white'}`}>By code</button>
          <button onClick={()=>setMode('alt')} className={`px-4 py-2 rounded-lg border ${mode==='alt'?'bg-gray-900 text-white':'bg-white'}`}>By details</button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          {mode==='code' ? (
            <div>
              <label className="block text-sm font-medium mb-1">Booking code</label>
              <input className="w-full border rounded-lg px-3 py-2 font-mono" value={code} onChange={e=>setCode(e.target.value)} placeholder="e.g. CAR20251102-003" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Full name</label>
                <input className="w-full border rounded-lg px-3 py-2" value={alt.name} onChange={e=>setAlt(a=>({...a, name:e.target.value}))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input className="w-full border rounded-lg px-3 py-2" value={alt.phone} onChange={e=>setAlt(a=>({...a, phone:e.target.value}))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input type="date" className="w-full border rounded-lg px-3 py-2" value={alt.date} onChange={e=>setAlt(a=>({...a, date:e.target.value}))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Department</label>
                <select className="w-full border rounded-lg px-3 py-2" value={alt.department} onChange={e=>setAlt(a=>({...a, department:e.target.value}))}>
                  <option value="">Select</option>
                  {['General','Cardiology','Pediatrics','Radiology','Orthopedics'].map(d=>(<option key={d} value={d}>{d}</option>))}
                </select>
              </div>
            </div>
          )}
          <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg">Confirm arrival</button>
        </form>
        {result && result.ok && (
          <div className="mt-4 p-3 border rounded-lg bg-emerald-50 text-emerald-800">Checked in successfully.</div>
        )}
        {result && !result.ok && (
          <div className="mt-4 p-3 border rounded-lg bg-red-50 text-red-700">{result.message}</div>
        )}
      </div>
    </div>
  )
}
