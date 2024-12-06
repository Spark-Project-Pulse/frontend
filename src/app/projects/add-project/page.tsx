'use client'

import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { type Repo, type AddProject } from '@/types/Projects'
import ProjectForm from '@/components/pages/projects/add-project/ProjectForm'
import { createProject } from '@/api/projects'
import { useEffect, useState } from 'react'
import { useUser } from '@/app/contexts/UserContext'

// Main page for adding a project
export default function AddProject() {
  const { user, loading } = useUser()
  const { toast } = useToast()
  const router = useRouter()

  const [isLoadingRepos, setIsLoadingRepos] = useState(true)
  const [repos, setRepos] = useState<Repo[]>([])

  useEffect(() => {
    const fetchUser = async () => {
      // safely return if user not loaded yet
      if (!user) return

      try {

        // Fetch GitHub repositories using the user's GitHub username
        const githubUsername = user.username
        if (githubUsername) {
          const reposResponse = await fetch(
            `https://api.github.com/users/${githubUsername}/repos`
          )
          const reposData = await reposResponse.json() as Repo[]
          setRepos(reposData)
        }

      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setIsLoadingRepos(false)
      }
    }

    void fetchUser()
  }, [user, loading])


  // Function to handle form submission and perform API call
  async function handleFormSubmit(values: {
    public: boolean
    title: string
    description: string,
    repoFullName: string,
  }) {
    try {
      // Map the form values to the expected backend names (in models.py)
      const projectData = {
        public: values.public,
        title: values.title,
        description: values.description,
        repo_full_name: values.repoFullName,
      }

      const response = await createProject(projectData)
      const { errorMessage, data } = response

      if (!errorMessage && data?.project_id) {
        // Navigate to the new question page using project_id
        router.push(`/projects/${data.project_id}`)
      } else {
        // Show error toast if an error occurs
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'There was an error creating your project.',
        })
      }
    } catch (error) {
      console.error('Unexpected error:', error)
    }
  }

  return (

    <div className="mb-10 relative -top-20">
      <h1 className="text-center text-h4 font-heading -mb-20 relative top-28">
        Add a Project
      </h1>
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-gradient-to-b from-primary to-tertiary p-[2px] rounded-md">
          <div className="bg-background w-[600px] px-4 py-12 sm:px-6 lg:px-8 border rounded-md">
            <ProjectForm
              repos={repos}
              onSubmit={handleFormSubmit}
              isLoading={isLoadingRepos}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
