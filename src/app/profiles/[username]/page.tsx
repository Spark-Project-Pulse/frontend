'use client'

import ProfileSkeleton from '@/components/pages/profiles/ProfileSkeleton'
import ProjectsSkeleton from '@/components/pages/profiles/ProjectsSkeleton'
import QuestionsSkeleton from '@/components/pages/profiles/QuestionsSkeleton'
import { type User } from '@/types/Users'
import { type Question } from '@/types/Questions'
import { type Project } from '@/types/Projects'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useEffect, useState } from 'react'
import { getUserByUsername, uploadProfileImage } from '@/api/users'
import { getQuestionsByUserId, updateQuestion } from '@/api/questions'
import { getProjectsByUserId } from '@/api/projects'
import { useRouter } from 'next/navigation'
import { useUser } from '@/app/contexts/UserContext'
import { useToast } from '@/components/ui/use-toast'
import { AvatarFallback } from '@radix-ui/react-avatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import UpdateQuestionForm from '@/components/pages/questions/[question_id]/UpdateQuestionForm'
import { DialogDescription } from '@radix-ui/react-dialog'
import { type FormValues } from '@/components/pages/questions/[question_id]/UpdateQuestionForm'

export default function ProfilePage({
  params,
}: {
  params: { username: string }
}) {
  const { user: currentUser } = useUser()
  const [user, setUser] = useState<User | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [showUploadFiles, setShowUploadFiles] = useState<boolean>(false)
  const [isUserLoading, setIsUserLoading] = useState(true)
  const [isProjectsLoading, setIsProjectsLoading] = useState(true)
  const [isQuestionsLoading, setIsQuestionsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()
  const isCurrentUser = user?.user === currentUser?.user

  useEffect(() => {
    const fetchUser = async () => {
      setIsUserLoading(true)
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
        setIsUserLoading(false)
      }
    }
    void fetchUser()
  }, [params.username])

  useEffect(() => {
    const fetchProjects = async () => {
      // Check if user id is defined before proceeding
      if (!user?.user) {
        console.error('User ID is undefined.')
        return
      }
      setIsProjectsLoading(true)

      try {
        const response = await getProjectsByUserId(user.user)
        if (response.errorMessage) {
          console.error('Error fetching projects:', response.errorMessage)
          return
        }
        // Set the projects state with the fetched data
        setProjects(response.data ?? [])
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setIsProjectsLoading(false)
      }
    }

    const fetchQuestions = async () => {
      if (!user?.user) {
        console.error('User ID is undefined.')
        return
      }
      setIsQuestionsLoading(true)

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
      } finally {
        setIsQuestionsLoading(false)
      }
    }

    // Only fetch questions/projects/profileImage if user is set
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

  // Handle show edit profile on click
  function handleShowEditProfileClick() {
    // If the show upload files button is there, then hide it. Else show it
    if (showUploadFiles) {
      setShowUploadFiles(false)
    } else {
      setShowUploadFiles(true)
    }
  }

  async function handlePhotoUpload(photo: React.ChangeEvent<HTMLInputElement>) {
    const file = photo.target.files?.[0]
    if (file && user) {
      try {
        const formData = new FormData()
        formData.append('profile_image', file)
        const { data } = await uploadProfileImage(user.user, formData)
        setShowUploadFiles(false)
        if (data?.profile_image_nsfw) {
          // Show innapropriate content toast if there is innapropriate content
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Innapropriate content detected in your image.',
          })
        }
      } catch (error) {
        console.error('File upload failed:', error)
      }
    } else {
      console.error('File upload error')
    }
  }
  // Conditional rendering for loading state
  if (isUserLoading) {
    return <ProfileSkeleton />
  }

  const handleQuestionUpdate = async (form_data: FormValues) => {
    try {
      // Call the updateQuestion API with the new data
      const { errorMessage, data } = await updateQuestion({
        questionId: form_data.question_id,
        asker: form_data.asker,
        title: form_data.title,
        description: form_data.description,
      })

      if (errorMessage) {
        throw new Error(errorMessage)
      }

      if (data?.toxic === true) {
        throw new Error('Toxic content detected in your question.')
      }

      // Update the question in the local state
      const updatedQuestions = questions.map((question) =>
        question.question_id === form_data.question_id
          ? {
              ...question,
              title: form_data.title,
              description: form_data.description,
            }
          : question
      )

      // Update the state with the modified questions array
      setQuestions(updatedQuestions)

      // Show a success toast
      toast({
        title: 'Question Updated',
        description: 'The question was updated successfully.',
      })
    } catch (error) {
      console.error('Error updating question:', error)

      // Show an error toast
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'An error occurred while updating the question.',
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="md:w-1/3">
          <Card>
            <CardHeader className="flex flex-col items-center">
              <div className="relative h-32 w-32">
                <Avatar className="h-32 w-32 rounded-full bg-muted">
                  <AvatarImage
                    src={`${user?.profile_image_url}?t=${Date.now()}`}
                    alt="User profile picture"
                  />
                  <AvatarFallback className="flex h-full w-full items-center justify-center bg-muted text-2xl font-bold text-muted-foreground">
                    {user?.username?.charAt(0).toUpperCase() ?? 'G'}
                  </AvatarFallback>
                </Avatar>
                {isCurrentUser && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className="edit-icon absolute bottom-2 right-2 h-6 w-6 cursor-pointer border-none bg-transparent p-0"
                        aria-label="Edit Profile"
                      >
                        <img
                          src="/edit_pencil.svg"
                          alt="Edit Profile"
                          className="h-full w-full"
                        />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none">
                            Profile Picture
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            A picture helps people recognize you and lets you
                            know when you signed in to your account
                          </p>
                        </div>
                        <div className="grid gap-2">
                          <div className="grid grid-cols-3 items-center gap-4">
                            <Button
                              variant="outline"
                              onClick={() => handleShowEditProfileClick()}
                              id="width"
                              className="col-span-2 h-10"
                            >
                              {' '}
                              Change Image
                              <img
                                src="/edit_pencil.svg"
                                alt="Edit Profile"
                                className="h-full w-full"
                              />
                            </Button>
                          </div>
                          {showUploadFiles && (
                            <div className="grid grid-cols-3 items-center gap-4">
                              <Input
                                type="file"
                                id="height"
                                className="col-span-2 h-10"
                                onChange={handlePhotoUpload}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
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
                  {isProjectsLoading ? (
                    <ProjectsSkeleton />
                  ) : projects.length === 0 && isCurrentUser ? (
                    <div className="flex items-center justify-center py-8">
                      <Button
                        onClick={() => router.push('/projects/add-project')}
                      >
                        Add your first project
                      </Button>
                    </div>
                  ) : (
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
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="questions">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  {isQuestionsLoading ? (
                    <QuestionsSkeleton />
                  ) : (
                    <ul className="space-y-4">
                      {questions.map((question) => (
                        <div key={question.question_id} className="relative">
                          {/* The clickable card */}
                          <li
                            className="cursor-pointer rounded-md border-b p-4 transition-colors duration-300 last:border-b-0 hover:bg-gray-200"
                            onClick={() =>
                              handleQuestionClick(question.question_id)
                            }
                          >
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold">
                                {question.title}
                              </h3>
                            </div>
                          </li>

                          {/* The "Edit" button, which is outside the clickable card */}
                          {isCurrentUser && (
                            <div className="absolute right-4 top-4">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    Edit
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Question</DialogTitle>
                                    <DialogDescription>
                                      Edit the title or description of your
                                      question!
                                    </DialogDescription>
                                  </DialogHeader>
                                  <UpdateQuestionForm
                                    question={question}
                                    onSubmit={handleQuestionUpdate}
                                  />
                                </DialogContent>
                              </Dialog>
                            </div>
                          )}
                        </div>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
