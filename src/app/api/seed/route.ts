import { NextResponse } from "next/server"
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore"
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth"
import { db, auth } from "@/services/firebase/firebase"

export async function GET() {
  try {
    // 1. Create a default volunteer account in Firebase Authentication if needed
    const defaultEmail = "volunteer@aegis.com"
    const defaultPassword = "password123"

    let authUserCreated = false
    try {
      await createUserWithEmailAndPassword(auth, defaultEmail, defaultPassword)
      authUserCreated = true
    } catch (authError: any) {
      if (authError.code === "auth/email-already-in-use") {
        authUserCreated = true
      } else {
        console.error("Firebase auth user creation error:", authError)
      }
    }

    // 2. Check if Sunil Kumar is already seeded in 'volunteers'
    const volunteersCol = collection(db, "volunteers")
    const volQuery = query(volunteersCol, where("email", "==", defaultEmail))
    const volSnap = await getDocs(volQuery)

    let volunteerId = ""
    if (volSnap.empty) {
      const newVol = await addDoc(volunteersCol, {
        name: "Sunil Kumar",
        email: defaultEmail,
        role: "Lead Ingress Operations Coordinator",
        zone: "East Entrance",
        shift: "16:00 - 22:00",
        language: "English, Hindi",
        status: "active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      volunteerId = newVol.id
    } else {
      volunteerId = volSnap.docs[0].id
    }

    // 3. Check if today's match is already seeded in 'matches'
    const matchesCol = collection(db, "matches")
    const matchSnap = await getDocs(matchesCol)

    let matchId = ""
    if (matchSnap.empty) {
      const newMatch = await addDoc(matchesCol, {
        competition: "FIFA World Cup 2026",
        match: "Argentina vs Brazil",
        venue: "MetLife Stadium",
        kickoff: "18:00",
        attendance: "82,500",
        volunteerZone: "East Entrance",
        role: "Ingress Patrol Lead",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      matchId = newMatch.id
    } else {
      matchId = matchSnap.docs[0].id
    }

    return NextResponse.json({
      success: true,
      message: "Firestore database and Auth credentials seeded successfully!",
      authAccount: defaultEmail,
      authPassword: defaultPassword,
      volunteerId,
      matchId,
    })

  } catch (error: any) {
    console.error("Error during database seeding:", error)
    return NextResponse.json({
      success: false,
      error: error.message || "Seeding failed.",
    }, { status: 500 })
  }
}
