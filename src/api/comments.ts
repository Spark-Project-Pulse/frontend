'use server'

import { type ApiResponse } from '@/types/Api'
import { type Comment } from '@/types/Comments'
import { getUser } from '@/utils/supabase/server'

/**
 * Submits a comment to an answer.
 *
 * Args:
 *   commentData: The response and answer ID for the comment.
 *
 * Returns:
 *   Promise<ApiResponse<Comment>>: The created comment on success, or an error message on failure.
 */
export const createComment = async (commentData: {
  response: string
  answer: string
}): Promise<ApiResponse<Comment>> => {
  try {
    // TODO: DE ROCCO Please replace this with the user id from context
    const user = await getUser()

    const vals = { expert: user?.id, ...commentData }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments/create/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vals),
      }
    )

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const createdComment = (await response.json()) as Comment
    return { errorMessage: null, data: createdComment }
  } catch (error) {
    console.error('Error submitting comment:', error)
    return { errorMessage: 'Error submitting comment' }
  }
}

/**
 * Fetches comments by answer ID from the backend.
 *
 * Args:
 *   answer_id (string): The ID of the answer whose comments to retrieve.
 *
 * Returns:
 *   Promise<ApiResponse<Comment[]>>: The list of comments on success, or an error message on failure.
 */
export const getCommentsByAnswerId = async (
  answer_id: string
): Promise<ApiResponse<Comment[]>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments/getCommentsByAnswerId/${answer_id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const commentsData = (await response.json()) as Comment[]
    return { errorMessage: null, data: commentsData }
  } catch (error) {
    console.error('Error fetching comments: ', error)
    return { errorMessage: 'Error fetching comments' }
  }
}
