import { BaseFirestoreService } from "./base-service"
import { VolunteerDocument } from "@/types/firestore"

export class VolunteersService extends BaseFirestoreService<VolunteerDocument> {
  constructor() {
    super("volunteers")
  }
}

export const volunteersService = new VolunteersService()
export default volunteersService
