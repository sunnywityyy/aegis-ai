import { BaseFirestoreService } from "./base-service"
import { RecommendationDocument } from "@/types/firestore"

export class RecommendationsService extends BaseFirestoreService<RecommendationDocument> {
  constructor() {
    super("recommendations")
  }
}

export const recommendationsService = new RecommendationsService()
export default recommendationsService
