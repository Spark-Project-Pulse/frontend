'use server'

import { type ApiResponse } from '@/types/Api'
import { type Project } from '@/types/Projects'
import { getUser } from '@/utils/supabase/server';

/**
 * Creates a new project by sending a POST request to the backend.
 *
 * Args:
 *   values: An object containing `public`, `title`, and `description` for the project.
 *
 * Returns:
 *   Promise<ApiResponse<{ project_id: string }>>: The created project's ID on success, or an error message on failure.
 */
export const createProject = async (values: {
    public: boolean;
    title: string;
    description: string;
  }): Promise<ApiResponse<{ project_id: string }>> => {
    try {
    // TODO: DE ROCCO Please replace this with the user id from context
    const user = await getUser()

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
      );
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const responseData = (await response.json()) as Project;
      return {
        errorMessage: null,
        data: { project_id: responseData.project_id },
      };
    } catch (error) {
      console.error('Error creating project:', error);
      return { errorMessage: 'Error creating project' };
    }
  };

/**
 * Fetches a project by its ID from the backend.
 *
 * Args:
 *   project_id (string): The ID of the project to retrieve.
 *
 * Returns:
 *   Promise<ApiResponse<Project>>: The project data on success, or an error message on failure.
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
