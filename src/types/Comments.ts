import { type UUID } from 'crypto'
import { type User } from './Users'

export interface Comment {
  comment_id: UUID
  answer: UUID
  expert_id?: UUID
  expert_info?: User
  response: string
  created_at: Date
}