'use client'

import { useEffect, useState } from 'react'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { auth } from '../lib/firebase'
import { db } from '../lib/firebase'

interface Transcription {
  id: string
  text: string
  audioURL: string
  createdAt?: any
}

export default function TranscriptionList() {
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([])

  useEffect(() => {
    const uid = auth.currentUser?.uid
    if (!uid) return

    const q = query(
      collection(db, 'transcriptions'),
      where('uid', '==', uid),
      orderBy('createdAt', 'desc')
    )

    const unsub = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Transcription[]
      setTranscriptions(items)
    })

    return () => unsub()
  }, [])

  if (transcriptions.length === 0) {
    return (
      <div className="border rounded-md p-4 bg-gray-50 text-gray-600">
        No transcriptions yet.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {transcriptions.map((t) => (
        <div
          key={t.id}
          className="border p-4 rounded-xl bg-white shadow-sm space-y-2"
        >
          <audio src={t.audioURL} controls className="w-full" />
          <p className="text-sm text-gray-700">{t.text}</p>
          {t.createdAt?.toDate && (
            <p className="text-xs text-gray-400">
              {t.createdAt.toDate().toLocaleString()}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
