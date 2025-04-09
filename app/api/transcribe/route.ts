// app/api/transcribe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { Readable } from 'stream'
import { createReadStream } from 'fs'
import { writeFile, unlink } from 'fs/promises'
import path from 'path'
import os from 'os'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file || !file.name.endsWith('.webm')) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
  }

  try {
    // Save the file temporarily to disk
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const tempPath = path.join(os.tmpdir(), file.name)
    await writeFile(tempPath, buffer)

    // Transcribe via Whisper API
    const transcription = await openai.audio.transcriptions.create({
      file: createReadStream(tempPath),
      model: 'whisper-1',
      response_format: 'json',
    })

    // Clean up
    await unlink(tempPath)

    return NextResponse.json({ text: transcription.text })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 })
  }
}
