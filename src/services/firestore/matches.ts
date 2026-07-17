import { BaseFirestoreService } from "./base-service"
import { MatchDocument } from "@/types/firestore"

export class MatchesService extends BaseFirestoreService<MatchDocument> {
  constructor() {
    super("matches")
  }
}

export const matchesService = new MatchesService()
export default matchesService
