# SpeakWrite

[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel&style=flat-square)](https://speakwrite.goldlabel.pro)
[![Made with Firebase](https://img.shields.io/badge/Backend-Firebase-ffca28?logo=firebase&logoColor=000&style=flat-square)](https://firebase.google.com/)
[![OpenAI Whisper](https://img.shields.io/badge/AI-Whisper-blue?logo=openai&style=flat-square)](https://platform.openai.com/docs/guides/speech-to-text)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind-38bdf8?logo=tailwindcss&logoColor=white&style=flat-square)](https://tailwindcss.com/)

**SpeakWrite** is a privacy-first voice transcription web app that transforms 1-minute audio clips into a complete, ready-to-post social media campaign.

Built for creators, podcasters, and founders who want to turn speech into shareable, branded assets — instantly.

## ✨ What It Does

From a single audio clip (voice note or podcast segment), SpeakWrite:

1. Transcribes speech using AI (OpenAI Whisper)
2. Lets you edit the transcript for prompt precision
3. Lets you add campaign context (e.g. target URL)
4. Generates a full markdown file with:
   - Title
   - Description
   - Twitter (X) post
   - Facebook/LinkedIn Open Graph fields
5. Creates a DALL·E generated image based on the message
6. Zips all assets, downloads them, and stores them to Firebase

## 🔐 Auth + Access

- Free signup via Firebase Email/Password authentication
- No usage tracking or analytics — just trust and delivery

## 🛠 Tech Stack

- Next.js (App Router)
- Firebase (Auth, Storage, Firestore)
- OpenAI Whisper + DALL·E
- Tailwind CSS

## 🔗 Live Demo

👉 [https://speakwrite.goldlabel.pro](https://speakwrite.goldlabel.pro)

[![SpeakWrite Cover](/public/jpg/SpeakWrite_Cover.jpg)](https://speakwrite.goldlabel.pro)
