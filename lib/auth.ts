// lib/auth.ts
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    sendEmailVerification,
  } from 'firebase/auth'
  import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
  import { auth, db } from './firebase'
  
  export async function signup(email: string, password: string) {
    const cred = await createUserWithEmailAndPassword(auth, email, password)

    await sendEmailVerification(cred.user)
    
    await setDoc(doc(db, 'users', cred.user.uid), {
      uid: cred.user.uid,
      email,
      createdAt: serverTimestamp(),
    })
    return cred.user
  }
  
  export async function login(email: string, password: string) {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    return cred.user
  }
  
  export async function resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email)
  }
  
  export async function logout() {
    await signOut(auth)
  }
  