'use server'

import { type ApiResponse } from '@/types/Api'
import { type Question } from '@/types/Questions'
import { getUser } from '@/utils/supabase/server'

/**
 * Creates a new question by sending a POST request to the backend.
 *
 * Args:
 *   values: An object containing `title` and `description` for the question.
 *
 * Returns:
 *   Promise<ApiResponse<{ question_id: string }>>: The created question's ID on success, or an error message on failure.
 */
export const createQuestion = async (values: {
  title: string
  description: string
}): Promise<ApiResponse<{ question_id: string }>> => {
  try {
    // TODO: DE ROCCO Please replace this with the user id from context
    const user = await getUser()

    const vals = { asker: user?.id, ...values }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/questions/create/`,
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

    const responseData = (await response.json()) as Question
    return {
      errorMessage: null,
      data: { question_id: responseData.question_id },
    }
  } catch (error) {
    console.error('Error creating question: ', error)
    return { errorMessage: 'Error creating question' }
  }
}

/**
 * Fetches a question by its ID from the backend.
 *
 * Args:
 *   question_id (string): The ID of the question to retrieve.
 *
 * Returns:
 *   Promise<ApiResponse<Question>>: The question data on success, or an error message on failure.
 */
export const getQuestionById = async (
  question_id: string
): Promise<ApiResponse<Question>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/questions/getById/${question_id}`,
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

    const questionData = (await response.json()) as Question
    return { errorMessage: null, data: questionData }
  } catch (error) {
    console.error('Error fetching question: ', error)
    return { errorMessage: 'Error fetching question' }
  }
}
