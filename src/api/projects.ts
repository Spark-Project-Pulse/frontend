'use server'

import { type ApiResponse } from '@/types/Api'
import { type Suggestion, type Project } from '@/types/Projects'
import { getSupaUser } from '@/utils/supabase/server'

/**
 * Creates a new project by sending a POST request to the backend.
 *
 * @param {Object} values - An object containing `public`, `title`, and `description` for the project.
 * @returns {Promise<ApiResponse<{ project_id: string }>>} The created project's ID on success, or an error message on failure.
 *
 */
export const createProject = async (values: {
  public: boolean
  title: string
  description: string
}): Promise<ApiResponse<{ project_id: string }>> => {
  try {
    const user = await getSupaUser()

    const vals = { owner: user?.id, ...values }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/projects/create/`,
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

    const responseData = (await response.json()) as Project
    return {
      errorMessage: null,
      data: { project_id: responseData.project_id },
    }
  } catch (error) {
    console.error('Error creating project:', error)
    return { errorMessage: 'Error creating project' }
  }
}

/**
 * Performs a code review on the provided file and returns suggestions.
 *
 * @param {string} projectTitle - Title of the project.
 * @param {string} projectDescription - Description of the project.
 * @param {string} fileName - Name of the file to review.
 * @param {string} fileContent - Content of the file to review.
 * @returns {Promise<ApiResponse<{ suggestions: Array<{ line_number: number, suggestion: string }> }>>} A list of code review suggestions on success, or an error message on failure.
 *
 */
export const codeReview = async (
  projectTitle: string,
  projectDescription: string,
  fileName: string,
  fileContent: string
): Promise<ApiResponse<{ suggestions: Array<Suggestion> }>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/projects/codeReview/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_title: projectTitle,
          project_description: projectDescription,
          file_name: fileName,
          file_content: fileContent,
        }),
      }
    )

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const responseData = (await response.json()) as {
      suggestions?: Suggestion[]
    }
    return {
      errorMessage: null,
      data: { suggestions: responseData.suggestions ?? [] },
    }
  } catch (error) {
    console.error('Error performing code review:', error)
    return { errorMessage: 'Error performing code review' }
  }
}

/**
 * Fetches all the projects associated with a user by their ID from the backend.
 *
 * @param {string} user_id - The ID of the user.
 * @returns {Promise<ApiResponse<Project[]>>} The projects data on success, or an error message on failure.
 *
 */
export const getProjectsByUserId = async (
  user_id: string
): Promise<ApiResponse<Project[]>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/projects/getByUserId/${user_id}`,
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

    const projectData = (await response.json()) as Project[]
    return { errorMessage: null, data: projectData }
  } catch (error) {
    console.error('Error fetching projects: ', error)
    return { errorMessage: 'Error fetching projects' }
  }
}

/**
 * Fetches a project by its ID from the backend.
 *
 * @param {string} project_id - The ID of the project to retrieve.
 * @returns {Promise<ApiResponse<Project>>} The project data on success, or an error message on failure.
 *
 */
export const getProjectById = async (
  project_id: string
): Promise<ApiResponse<Project>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/projects/getById/${project_id}`,
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

    const projectData = (await response.json()) as Project
    return { errorMessage: null, data: projectData }
  } catch (error) {
    console.error('Error fetching project:', error)
    return { errorMessage: 'Error fetching project' }
  }
}
