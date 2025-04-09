'use client'

import { useState } from 'react'
import { login, signup, resetPassword } from '../lib/auth'

export default function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login')
  const [msg, setMsg] = useState('')

  const handleSubmit = async () => {
    try {
      if (mode === 'login') {
        await login(email, password)
        setMsg('Logged in')
      } else if (mode === 'signup') {
        await signup(email, password)
        setMsg('Account created')
      } else if (mode === 'forgot') {
        await resetPassword(email)
        setMsg('Reset email sent')
      }
    } catch (err: any) {
      setMsg(err.message)
    }
  }

  return (
    <div className="p-8 max-w-md mx-auto flex flex-col gap-4">
      <h1 className="text-2xl font-bold capitalize">{mode}</h1>
      <input
        type="email"
        placeholder="Email"
        className="border p-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {mode !== 'forgot' && (
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      )}
      <button
        onClick={handleSubmit}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
      >
        {mode === 'login' ? 'Login' : mode === 'signup' ? 'Create Account' : 'Send Reset Email'}
      </button>
      <p className="text-sm text-gray-600">{msg}</p>
      <div className="flex justify-between text-sm">
        {mode !== 'login' && (
          <button onClick={() => setMode('login')} className="underline text-blue-600">
            Back to Login
          </button>
        )}
        {mode === 'login' && (
          <>
            <button onClick={() => setMode('signup')} className="underline text-blue-600">
              Create account
            </button>
            <button onClick={() => setMode('forgot')} className="underline text-blue-600">
              Forgot password?
            </button>
          </>
        )}
      </div>
    </div>
  )
}
