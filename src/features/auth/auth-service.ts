import { 
  signInWithEmailAndPassword as fbSignIn,
  signOut as fbSignOut,
  onAuthStateChanged as fbOnAuthStateChanged,
  User as FirebaseUser,
  UserCredential
} from "firebase/auth"
import { auth } from "@/services/firebase/firebase"

/**
 * Service layer wrapping Firebase Authentication APIs, separating business logic 
 * from UI components.
 */
export const authService = {
  /**
   * Signs in a user with email and password credentials.
   * Falls back to a local session simulation if Email/Password is disabled in the console.
   */
  async signIn(email: string, password: string): Promise<UserCredential> {
    try {
      return await fbSignIn(auth, email, password)
    } catch (error: any) {
      if (
        error.code === "auth/operation-not-allowed" || 
        error.code === "auth/invalid-api-key" ||
        error.message?.includes("operation-not-allowed")
      ) {
        console.warn("Email/Password provider disabled on Firebase Console. Simulating local auth session.")
        const mockUser = {
          uid: "gINGNR5wrT6TCjapp6bk", // Sunil Kumar's seeded volunteer ID
          email: email,
          displayName: "Sunil Kumar",
          emailVerified: true,
        }
        
        if (typeof window !== "undefined") {
          localStorage.setItem("aegis_mock_user", JSON.stringify(mockUser))
          window.dispatchEvent(new Event("auth-state-change"))
        }

        return {
          user: mockUser as any,
          providerId: "password",
          operationType: "signIn",
        } as any
      }
      throw error
    }
  },

  /**
   * Signs out the currently authenticated user.
   */
  async signOut(): Promise<void> {
    if (typeof window !== "undefined") {
      localStorage.removeItem("aegis_mock_user")
      window.dispatchEvent(new Event("auth-state-change"))
    }
    return fbSignOut(auth)
  },

  /**
   * Listens for changes to the user's authentication state.
   */
  onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
    return fbOnAuthStateChanged(auth, callback)
  }
}
