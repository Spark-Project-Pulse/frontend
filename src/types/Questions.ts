import { type UUID } from 'crypto'
import { type User } from './Users'

export interface Question {
  question_id: UUID
  title: string
  description: string
  created_at: Date
  asker_id?: UUID
  asker_info?: User,
  tags?: string[],
  related_project_id?: UUID
}
