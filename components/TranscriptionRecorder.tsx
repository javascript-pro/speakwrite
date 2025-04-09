'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  onClose: () => void
  onTranscribe: (blob: Blob) => void
}

export default function TranscriptionRecorder({ onClose, onTranscribe }: Props) {
  const [isRecording, setIsRecording] = useState(false)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [blob, setBlob] = useState<Blob | null>(null)
  const [duration, setDuration] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const chunks = useRef<Blob[]>([])
  const recorderRef = useRef<MediaRecorder | null>(null)

  useEffect(() => {
    const setup = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      recorderRef.current = recorder

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data)
      }

      recorder.onstop = () => {
        const finalBlob = new Blob(chunks.current, { type: 'audio/webm' })
        chunks.current = []
        setBlob(finalBlob)
        setAudioURL(URL.createObjectURL(finalBlob))
        clearInterval(intervalRef.current!)
      }
    }

    setup()
  }, [])

  const start = () => {
    if (!recorderRef.current) return
    chunks.current = []
    recorderRef.current.start()
    setIsRecording(true)
    setDuration(0)
    intervalRef.current = setInterval(() => {
      setDuration((prev) => {
        if (prev >= 58) {
          stop()
        }
        return prev + 1
      })
    }, 1000)
  }

  const stop = () => {
    recorderRef.current?.stop()
    setIsRecording(false)
  }

  const discard = () => {
    setBlob(null)
    setAudioURL(null)
    setDuration(0)
  }

  return (
    <div className="bg-white border rounded-xl shadow-xl p-6 space-y-6">
      {!blob ? (
        <>
          <button
            onClick={isRecording ? stop : start}
            className={`${
              isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            } text-white font-bold py-3 px-6 rounded-xl text-lg`}
          >
            {isRecording ? 'Stop' : 'Start'} Recording
          </button>
          {isRecording && <p className="text-sm text-gray-600">Duration: {duration}s</p>}
        </>
      ) : (
        <>
          <audio src={audioURL!} controls className="w-full" />
          <div className="flex gap-4">
            <button
              onClick={() => blob && onTranscribe(blob)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            >
              Transcribe
            </button>
            <button
              onClick={discard}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
            >
              Discard
            </button>
          </div>
        </>
      )}
      <button
        onClick={onClose}
        className="text-sm text-gray-600 underline block mx-auto mt-2"
      >
        Cancel
      </button>
    </div>
  )
}
