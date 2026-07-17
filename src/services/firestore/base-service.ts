import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from "firebase/firestore"
import { db } from "@/services/firebase/firebase"
import { BaseDocument } from "@/types/firestore"

/**
 * Generic Firestore CRUD Service.
 * Manages database reads, writes, and timestamping dynamically.
 */
export class BaseFirestoreService<T extends BaseDocument> {
  protected collectionName: string

  constructor(collectionName: string) {
    this.collectionName = collectionName
  }

  /**
   * Helper to retrieve the active Firestore collection reference.
   */
  protected getCollectionRef() {
    return collection(db, this.collectionName)
  }

  /**
   * Helper to retrieve a document reference.
   */
  protected getDocRef(id: string) {
    return doc(db, this.collectionName, id)
  }

  /**
   * Creates a new document. Automatically sets createdAt/updatedAt using serverTimestamp().
   *
   * @param data Payload parameters (omitting metadata coordinates).
   * @param customId Optional designated document ID.
   * @returns The generated or custom document ID string.
   */
  async create(
    data: Omit<T, "id" | "createdAt" | "updatedAt">, 
    customId?: string
  ): Promise<string> {
    try {
      const payload = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      if (customId) {
        const docRef = this.getDocRef(customId)
        await setDoc(docRef, payload)
        return customId
      } else {
        const colRef = this.getCollectionRef()
        const docRef = await addDoc(colRef, payload)
        return docRef.id
      }
    } catch (error) {
      console.error(`Error creating document in "${this.collectionName}":`, error)
      throw error
    }
  }

  /**
   * Retrieves a document by its ID.
   */
  async getById(id: string): Promise<T | null> {
    try {
      const docRef = this.getDocRef(id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T
      }
      return null
    } catch (error) {
      console.error(`Error fetching document "${id}" in "${this.collectionName}":`, error)
      throw error
    }
  }

  /**
   * Retrieves all documents in the collection.
   */
  async getAll(): Promise<T[]> {
    try {
      const colRef = this.getCollectionRef()
      const querySnap = await getDocs(colRef)
      return querySnap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as T[]
    } catch (error) {
      console.error(`Error listing all documents in "${this.collectionName}":`, error)
      throw error
    }
  }

  /**
   * Updates an existing document's properties.
   */
  async update(
    id: string, 
    data: Partial<Omit<T, "id" | "createdAt" | "updatedAt">>
  ): Promise<void> {
    try {
      const docRef = this.getDocRef(id)
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error(`Error updating document "${id}" in "${this.collectionName}":`, error)
      throw error
    }
  }

  /**
   * Deletes a document by its ID.
   */
  async delete(id: string): Promise<void> {
    try {
      const docRef = this.getDocRef(id)
      await deleteDoc(docRef)
    } catch (error) {
      console.error(`Error deleting document "${id}" in "${this.collectionName}":`, error)
      throw error
    }
  }
}
export default BaseFirestoreService
