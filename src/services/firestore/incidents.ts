import { BaseFirestoreService } from "./base-service"
import { IncidentDocument } from "@/types/firestore"

export class IncidentsService extends BaseFirestoreService<IncidentDocument> {
  constructor() {
    super("incidents")
  }
}

export const incidentsService = new IncidentsService()
export default incidentsService
