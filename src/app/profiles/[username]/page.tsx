'use client'

import { LoadingSpinner } from '@/components/ui/loading'
import { type User } from '@/types/Users'
import { type Question } from '@/types/Questions'
import { type Project } from '@/types/Projects'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEffect, useState } from 'react'
import { getUserByUsername } from '@/api/users'
import { getQuestionsByUserId } from '@/api/questions'
import { getProjectsByUserId } from '@/api/projects'
import { useRouter } from 'next/navigation'

export default function ProfilePage({
  params,
}: {
  params: { username: string }
}) {
  const [user, setUser] = useState<User | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [projects, setProjects] = useState<Project[]>([])

  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // TODO: Will need to check if the profile is the current user's, and only do this if it is someone else's profile
    // We could also keep track of this to give additional actions (such as update/delete projects or questions) to current user
    const fetchUser = async () => {
      try {
        const response = await getUserByUsername(params.username)

        if (response.errorMessage) {
          console.error('Error fetching user:', response.errorMessage)
          return
        }

        // Set the user state with the fetched data
        setUser(response.data ?? null)
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setIsLoading(false)
      }
    }
    void fetchUser()
  }, [params.username])

  // Fetch questions and projects only after the user is set
  useEffect(() => {
    //TODO: seperate loading for projects/questions

    const fetchProjects = async () => {
      // Check if user id is defined before proceeding
      if (!user?.user) {
        console.error('User ID is undefined.')
        return
      }

      try {
        const response = await getProjectsByUserId(user.user) // Fetch projects for the user

        if (response.errorMessage) {
          console.error('Error fetching projects:', response.errorMessage)
          return
        }

        // Set the projects state with the fetched data
        setProjects(response.data ?? [])
      } catch (error) {
        console.error('Error fetching projects:', error)
      }
    }

    const fetchQuestions = async () => {
      // Check if user id is defined before proceeding
      if (!user?.user) {
        console.error('User ID is undefined.')
        return
      }

      try {
        const response = await getQuestionsByUserId(user.user) // Fetch questions for the user

        if (response.errorMessage) {
          console.error('Error fetching questions:', response.errorMessage)
          return
        }

        // Set the questions state with the fetched data
        setQuestions(response.data ?? [])
      } catch (error) {
        console.error('Error fetching questions:', error)
      }
    }

    // Only fetch questions/projects if user is set
    if (user) {
      void fetchProjects()
      void fetchQuestions()
    }
  }, [user])

  // Handle navigation on click for projects
  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}`)
  }

  // Handle navigation on click for questions
  const handleQuestionClick = (questionId: string) => {
    router.push(`/questions/${questionId}`)
  }

  // Conditional rendering for loading state
  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="md:w-1/3">
          <Card className="profile-card">
            <CardHeader className="flex flex-col items-center">
              <Avatar className="h-32 w-32">
                <AvatarImage
                  src={user?.pfp_url ?? '/anon-user-pfp.jpg'}
                  alt="User profile picture"
                />
              </Avatar>
              <CardTitle className="mt-4 text-2xl">{user?.username}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Badge variant="secondary" className="px-3 py-1 text-lg">
                Reputation: {user?.reputation}
              </Badge>
            </CardContent>
          </Card>
        </div>
        <div className="md:w-2/3">
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
            </TabsList>
            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <CardTitle>Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {projects.map((project, index) => (
                      <li
                        key={index}
                        className="cursor-pointer rounded-md border-b p-4 transition-colors duration-300 last:border-b-0 hover:bg-gray-200"
                        onClick={() => handleProjectClick(project.project_id)}
                      >
                        <h3 className="text-lg font-semibold">
                          {project.title}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {project.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="questions">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {questions.map((question, index) => (
                      <li
                        key={index}
                        className="cursor-pointer rounded-md border-b p-4 transition-colors duration-300 last:border-b-0 hover:bg-gray-200"
                        onClick={() =>
                          handleQuestionClick(question.question_id)
                        }
                      >
                        <h3 className="text-lg font-semibold">
                          {question.title}
                        </h3>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
