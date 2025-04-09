'use client'

import { useEffect, useRef, useState } from 'react'
import { auth } from '../lib/firebase'
import { db, storage } from '../lib/firebase'
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export default function Recorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null)
  const [duration, setDuration] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const chunks = useRef<Blob[]>([])

  useEffect(() => {
    const setup = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' })
        chunks.current = []

        setRecordingBlob(blob)
        setAudioURL(URL.createObjectURL(blob))
        clearInterval(intervalRef.current!)
      }

      setMediaRecorder(recorder)
    }

    setup()
  }, [])

  const startRecording = () => {
    if (!mediaRecorder) return
    chunks.current = []
    mediaRecorder.start()
    setIsRecording(true)
    setDuration(0)
    intervalRef.current = setInterval(() => {
      setDuration((prev) => prev + 1)
    }, 1000)
  }

  const stopRecording = () => {
    mediaRecorder?.stop()
    setIsRecording(false)
  }

  const uploadRecording = async () => {
    if (!recordingBlob) return
    const uid = auth.currentUser?.uid
    if (!uid) return alert('Not signed in')

    const timestamp = Date.now()
    const filename = `voice_${timestamp}.webm`
    const storageRef = ref(storage, `recordings/${uid}/${filename}`)

    await uploadBytes(storageRef, recordingBlob)
    const url = await getDownloadURL(storageRef)

    // Save recording metadata
    await addDoc(collection(db, 'recordings'), {
      uid,
      filename,
      url,
      createdAt: serverTimestamp(),
    })

    // Update user's usage data
    const userRef = doc(db, 'users', uid)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      await updateDoc(userRef, {
        recordingCount: increment(1),
        lastUpload: serverTimestamp(),
      })
    } else {
      await setDoc(userRef, {
        uid,
        email: auth.currentUser?.email || '',
        createdAt: serverTimestamp(),
        recordingCount: 1,
        lastUpload: serverTimestamp(),
      })
    }

    alert('Recording uploaded')
    setRecordingBlob(null)
    setAudioURL(null)
    setDuration(0)
  }

  const discardRecording = () => {
    setRecordingBlob(null)
    setAudioURL(null)
    setDuration(0)
  }

  return (
    <div className="p-8 flex flex-col items-center gap-6">
      {!recordingBlob ? (
        <>
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`${
              isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            } text-white text-xl font-bold py-4 px-8 rounded-2xl shadow-lg transition-all cursor-pointer`}
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
          {isRecording && <p className="text-lg font-mono">Duration: {duration}s</p>}
        </>
      ) : (
        <>
          <audio src={audioURL!} controls className="w-full max-w-md" />
          <div className="flex gap-4">
            <button
              onClick={uploadRecording}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-3 px-6 rounded-lg shadow-md cursor-pointer"
            >
              Upload
            </button>
            <button
              onClick={discardRecording}
              className="bg-gray-400 hover:bg-gray-500 text-white text-xl font-bold py-3 px-6 rounded-lg cursor-pointer"
            >
              Discard
            </button>
          </div>
        </>
      )}
    </div>
  )
}
