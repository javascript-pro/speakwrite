'use client'

import { useEffect, useState } from 'react'
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { auth } from '../lib/firebase'

interface Recording {
  id: string
  filename: string
  url: string
  createdAt?: any
}

export default function RecordingsList() {
  const [recordings, setRecordings] = useState<Recording[]>([])

  useEffect(() => {
    const uid = auth.currentUser?.uid
    if (!uid) return

    const q = query(
      collection(db, 'recordings'),
      where('uid', '==', uid),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Recording[]
      setRecordings(items)
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className="p-4 max-w-xl mx-auto space-y-6">
      <h2 className="text-xl font-bold">Your Recordings</h2>
      {recordings.length === 0 ? (
        <p className="text-gray-500">No recordings yet.</p>
      ) : (
        recordings.map((rec) => (
          <div key={rec.id} className="border rounded-lg p-4 shadow-sm">
            <p className="font-semibold mb-2">{rec.filename}</p>
            <audio src={rec.url} controls className="w-full" />
            {rec.createdAt?.toDate && (
              <p className="text-xs text-gray-400 mt-1">
                Uploaded: {rec.createdAt.toDate().toLocaleString()}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  )
}
