'use client'

import { useState } from 'react'

export default function Dashboard() {
  const [showRecorder, setShowRecorder] = useState(false)

  return (
    <div className="p-8 space-y-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Welcome back</h1>

      <button
        onClick={() => setShowRecorder(true)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-bold py-4 px-6 rounded-xl shadow-md cursor-pointer"
      >
        New Transcription
      </button>

      {/* We'll replace this with actual user data later */}
      <div className="border rounded-md p-4 bg-gray-50 text-gray-600">
        No transcriptions yet.
      </div>

      {showRecorder && (
        <div className="border p-8 bg-white rounded-xl shadow-xl">
          <p className="text-center text-lg font-semibold text-gray-700 mb-4">
            [Recorder goes here]
          </p>
          <button
            onClick={() => setShowRecorder(false)}
            className="block mx-auto mt-4 bg-gray-300 hover:bg-gray-400 text-sm px-4 py-2 rounded cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}
