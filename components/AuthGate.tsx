'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { logout } from '../lib/auth'
import Recorder from './Recorder'
import AuthForm from './AuthForm'
import RecordingsList from './RecordingsList'

export default function AuthGate() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  if (loading) return <div className="p-8 text-lg">Loading...</div>
  if (!user) return <AuthForm />

  if (!user.emailVerified) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-lg">
          Please verify your email before using the app.
          <br />
          A verification link has been sent to: <strong>{user.email}</strong>
        </p>
        <button
          onClick={() => user.sendEmailVerification()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Resend Email
        </button>
        <button
          onClick={() => window.location.reload()}
          className="text-sm underline text-gray-600"
        >
          I’ve verified it, refresh
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-8">
      <div className="flex justify-end">
        <button
          onClick={logout}
          className="bg-gray-600 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded-lg cursor-pointer"
        >
          Logout
        </button>
      </div>
      <Recorder />
      <RecordingsList />
    </div>
  )
}
