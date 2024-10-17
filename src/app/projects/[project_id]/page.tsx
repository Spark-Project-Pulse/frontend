'use client'

import { LoadingSpinner } from '@/components/ui/loading'
import { useEffect, useState } from 'react'
import { type Project } from '@/types/Projects'
import { Badge } from '@/components/ui/badge'
import { getProjectById } from '@/api/projects'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ProjectPage({
  params,
}: {
  params: { project_id: string }
}) {
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true)

      try {
        const { errorMessage, data } = await getProjectById(params.project_id)

        if (!errorMessage && data) {
          setProject(data)
        } else {
          console.error('Error:', errorMessage)
        }
      } catch (error) {
        console.error('Unexpected error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchProject()
  }, [params.project_id])

  // Conditional rendering for loading state
  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <section className="min-h-screen bg-gray-100 py-24">
      <div className="mx-auto max-w-4xl px-4">
        {project ? (
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h1 className="mb-4 text-3xl font-bold text-gray-800">
                {project.title}
              </h1>
              {project.public ? (
                <Badge>Public</Badge>
              ) : (
                <Badge variant="secondary">Private</Badge>
              )}
            </div>
            <p className="text-lg text-gray-600">{project.description}</p>
            <p className="mt-4 text-gray-500">
              Author:{' '}
              {project.owner_info?.username
                ? project.owner_info?.username
                : 'Anonymous User'}
            </p>

            {project.repo_full_name && (
              <div className="mt-4 flex justify-end">
                <Link href={`/projects/${project.project_id}/browse-files`}>
                  <Button variant="secondary">Browse Files</Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-red-400 bg-red-100 p-4 text-red-700">
            <h2 className="text-lg font-bold">Project not found</h2>
          </div>
        )}
      </div>
    </section>
  )
}
