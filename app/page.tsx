'use client'

import { useEffect } from 'react'
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../lib/firebase'

export default function HomePage() {
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('Signed in:', user.uid)
      } else {
        signInAnonymously(auth)
      }
    })
    return unsub
  }, [])

  return <main>MP3 Recorder App</main>
}
