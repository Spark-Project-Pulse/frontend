import { type UUID } from 'crypto'
import { type User } from './Users'

export interface Question {
  question_id: UUID
  asker_id?: UUID
  asker_info: User,
  related_project_id?: UUID
  title: string
  description: string
  created_at: Date
}
