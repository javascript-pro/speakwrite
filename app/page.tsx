'use client'

import { useEffect, useState } from 'react'
import { auth, db, storage } from '../lib/firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export default function UploadTest() {
  const [uid, setUid] = useState<string | null>(null)

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) setUid(user.uid)
    })
    return unsub
  }, [])

  const uploadTestMp3 = async () => {
    if (!uid) return alert('Not signed in.')

    const res = await fetch('/mp3/sample.mp3')
    const blob = await res.blob()

    const timestamp = Date.now()
    const filename = `sample-${timestamp}.mp3`
    const storageRef = ref(storage, `recordings/${uid}/${filename}`)

    await uploadBytes(storageRef, blob)
    const url = await getDownloadURL(storageRef)

    await addDoc(collection(db, 'recordings'), {
      uid,
      filename,
      url,
      createdAt: serverTimestamp(),
    })

    alert('Upload successful.')
  }

  return (
    <main className="p-8">
      <button
        onClick={uploadTestMp3}
        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-bold py-4 px-8 rounded-2xl shadow-lg transition-all cursor-pointer"
      >
        Upload Sample MP3
      </button>
    </main>
  )
}

