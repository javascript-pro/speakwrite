'use client'

import { useEffect, useRef, useState } from 'react'
import { auth, db, storage } from '../lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export default function Recorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const chunks = useRef<Blob[]>([])

  useEffect(() => {
    const setup = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data)
      }

      recorder.onstop = async () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' })
        chunks.current = []

        const uid = auth.currentUser?.uid
        if (!uid) return alert('Not signed in')

        const timestamp = Date.now()
        const filename = `voice_${timestamp}.webm`
        const storageRef = ref(storage, `recordings/${uid}/${filename}`)

        await uploadBytes(storageRef, blob)
        const url = await getDownloadURL(storageRef)

        await addDoc(collection(db, 'recordings'), {
          uid,
          filename,
          url,
          createdAt: serverTimestamp(),
        })

        alert('Recording uploaded')
      }

      setMediaRecorder(recorder)
    }

    setup()
  }, [])

  const handleToggle = () => {
    if (!mediaRecorder) return

    if (isRecording) {
      mediaRecorder.stop()
      setIsRecording(false)
    } else {
      chunks.current = []
      mediaRecorder.start()
      setIsRecording(true)
    }
  }

  return (
    <div className="p-8">
      <button
        onClick={handleToggle}
        className={`${
          isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
        } text-white text-xl font-bold py-4 px-8 rounded-2xl shadow-lg transition-all cursor-pointer`}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
    </div>
  )
}
