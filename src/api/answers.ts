'use server'

import { type ApiResponse } from '@/types/Api'
import { type Answer } from '@/types/Answers'
import { getUser } from '@/utils/supabase/server'

/**
 * Submits an answer to a question.
 *
 * Args:
 *   answerData: The response and question ID for the answer.
 *
 * Returns:
 *   Promise<ApiResponse<Answer>>: The created answer on success, or an error message on failure.
 */
export const createAnswer = async (answerData: {
  response: string
  question: string
}): Promise<ApiResponse<Answer>> => {
  try {
    // TODO: DE ROCCO Please replace this with the user id from context
    const user = await getUser()

    const vals = { expert: user?.id, ...answerData }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/answers/create/`,
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

    const createdAnswer = (await response.json()) as Answer
    return { errorMessage: null, data: createdAnswer }
  } catch (error) {
    console.error('Error submitting answer:', error)
    return { errorMessage: 'Error submitting answer' }
  }
}

/**
 * Fetches answers by question ID from the backend.
 *
 * Args:
 *   question_id (string): The ID of the question whose answers to retrieve.
 *
 * Returns:
 *   Promise<ApiResponse<Answer[]>>: The list of answers on success, or an error message on failure.
 */
export const getAnswersByQuestionId = async (
  question_id: string
): Promise<ApiResponse<Answer[]>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/answers/getAnswersByQuestionId/${question_id}`,
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

    const answersData = (await response.json()) as Answer[]
    return { errorMessage: null, data: answersData }
  } catch (error) {
    console.error('Error fetching answers: ', error)
    return { errorMessage: 'Error fetching answers' }
  }
}
