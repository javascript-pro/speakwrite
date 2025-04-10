'use client'

import { useState } from 'react'
import {
  TranscriptionRecorder,
  TranscriptionList,
} from './'
import { auth } from '../lib/firebase'
import { db, storage } from '../lib/firebase'
import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
} from 'firebase/firestore'
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage'

export default function Dashboard() {
  const [showRecorder, setShowRecorder] = useState(false)

  const handleTranscribe = async (blob: Blob) => {
    setShowRecorder(false)

    const formData = new FormData()
    formData.append('file', blob, 'recording.webm')

    try {
      const res = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Transcription failed')
      }

      const uid = auth.currentUser?.uid
      const email = auth.currentUser?.email
      if (!uid) throw new Error('User not authenticated')

      // Save audio clip to Storage
      const timestamp = Date.now()
      const filename = `transcription_${timestamp}.webm`
      const storageRef = ref(storage, `transcriptions/${uid}/${filename}`)
      await uploadBytes(storageRef, blob)
      const audioURL = await getDownloadURL(storageRef)

      // Save transcript to Firestore
      const docRef = doc(collection(db, 'transcriptions'))
      await setDoc(docRef, {
        uid,
        email,
        text: data.text,
        audioURL,
        createdAt: serverTimestamp(),
        model: 'whisper-1',
        status: 'completed',
      })

      alert(`Transcription saved:\n\n"${data.text}"`)
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    }
  }

  return (
    <div className="p-8 space-y-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Welcome back</h1>

      <button
        onClick={() => setShowRecorder(true)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-bold py-4 px-6 rounded-xl shadow-md cursor-pointer"
      >
        New Transcription
      </button>

      <div className="border rounded-md p-4 bg-gray-50 text-gray-600">
        No transcriptions yet.
      </div>

      <TranscriptionList />

      {showRecorder && (
        <TranscriptionRecorder
          onClose={() => setShowRecorder(false)}
          onTranscribe={handleTranscribe}
        />
      )}
    </div>
  )
}
