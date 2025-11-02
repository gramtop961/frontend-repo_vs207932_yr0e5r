export default function ActionGrid({ onNav }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto mt-6">
      <button onClick={() => onNav('book')} className="h-40 rounded-2xl bg-white border shadow-sm hover:shadow-md transition text-left p-6 flex flex-col justify-between">
        <div>
          <div className="text-3xl font-semibold">Book Appointment</div>
          <p className="text-gray-500 mt-2">Reserve a slot by department</p>
        </div>
        <div className="text-sm font-medium text-blue-600">Start booking →</div>
      </button>
      <button onClick={() => onNav('checkin')} className="h-40 rounded-2xl bg-white border shadow-sm hover:shadow-md transition text-left p-6 flex flex-col justify-between">
        <div>
          <div className="text-3xl font-semibold">Check In</div>
          <p className="text-gray-500 mt-2">Use your code to confirm arrival</p>
        </div>
        <div className="text-sm font-medium text-blue-600">Go to check-in →</div>
      </button>
      <button onClick={() => onNav('track')} className="h-40 rounded-2xl bg-white border shadow-sm hover:shadow-md transition text-left p-6 flex flex-col justify-between">
        <div>
          <div className="text-3xl font-semibold">Patient Tracker</div>
          <p className="text-gray-500 mt-2">See today's bookings & status</p>
        </div>
        <div className="text-sm font-medium text-blue-600">Open tracker →</div>
      </button>
    </div>
  )
}
