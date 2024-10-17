'use client'

import { LoadingSpinner } from '@/components/ui/loading'
import { type Question } from '@/types/Questions'
import { useEffect, useState } from 'react'
import AnswerForm from '@/components/pages/questions/[question_id]/AnswerForm'
import CommentForm from '@/components/pages/questions/[question_id]/CommentForm'
import { useToast } from '@/components/ui/use-toast'
import { type Answer } from '@/types/Answers'
import { type Comment } from '@/types/Comments'
import { getQuestionById } from '@/api/questions'
import { createAnswer, getAnswersByQuestionId } from '@/api/answers'
import { createComment, getCommentsByAnswerId } from '@/api/comments'
import { ButtonWithLoading } from '@/components/universal/ButtonWithLoading'
import { type UUID } from 'crypto'

export default function QuestionPage({
  params,
}: {
  params: { question_id: string }
}) {
  const { toast } = useToast()
  const [question, setQuestion] = useState<Question | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [openCommentFormId, setOpenCommentFormId] = useState<string | null>(
    null
  )
  const [comments, setComments] = useState<Record<UUID, Comment[]>>({}) // Each answer_id is mapped to a list of comments

  useEffect(() => {
    const fetchQuestion = async () => {
      setIsLoading(true)

      try {
        const { errorMessage, data } = await getQuestionById(params.question_id)

        if (!errorMessage && data) {
          setQuestion(data)
        } else {
          console.error('Error:', errorMessage)
        }
      } catch (error) {
        console.error('Unexpected error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const fetchAnswers = async () => {
      //TODO: A seperate loading spinner below the question for loading answers
      try {
        const { errorMessage, data } = await getAnswersByQuestionId(
          params.question_id
        )

        if (!errorMessage && data) {
          setAnswers(data)

          // Fetches comments for each answer
          data.forEach((answer: Answer) => {
            void fetchComments(answer.answer_id)
          })
        } else {
          console.error('Error:', errorMessage)
        }
      } catch (error) {
        console.error('Unexpected error:', error)
      } finally {
        // End answer loading state
      }
    }

    // Fetches the comments of an answer
    const fetchComments = async (answer_id: UUID) => {
      try {
        const { errorMessage, data } = await getCommentsByAnswerId(answer_id)

        if (!errorMessage && data) {
          setComments((prevComments) => ({
            ...prevComments,
            [answer_id]: data,
          }))
        } else {
          console.error('Error fetching comments:', errorMessage)
        }
      } catch (error) {
        console.error('Unexpected error fetching comments:', error)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchQuestion()
    void fetchAnswers()
  }, [params.question_id])

  // Function to handle answer form submission and perform API call
  async function handleAnswerSubmit(values: { response: string }) {
    // Append question_id to the values object
    const requestData = {
      ...values,
      question: params.question_id,
    }

    try {
      const response = await createAnswer(requestData)
      const { errorMessage, data } = response

      if (!errorMessage && data) {
        // Update the answers state to include the new answer
        setAnswers((prevAnswers) => [...prevAnswers, data])
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: errorMessage,
        })
      }
    } catch (error) {
      console.error('Unexpected error:', error)
    }
  }

  // Function to handle add comment button
  function handleAddComment(answerId: UUID): Promise<void> {
    return new Promise((resolve) => {
      if (openCommentFormId === answerId) {
        // Close the form if it's already open for an answer
        setOpenCommentFormId(null)
      } else {
        // Open the form for the clicked answer (also closes any opened commentform)
        setOpenCommentFormId(answerId)
      }
      resolve()
    })
  }

  // Function to handle submitting a comment
  async function handleCommentSubmit(values: { response: string }) {
    if (openCommentFormId == null) {
      console.log('Error: CommentFormId empty?')
    } else {
      const requestData = {
        ...values,
        answer: openCommentFormId,
      }
      try {
        const response = await createComment(requestData)
        const { errorMessage, data } = response

        if (!errorMessage && data) {
          // Update the comments state to include new comment
          setComments((prevComments) => ({
            ...prevComments,
            [data.answer]: [...(prevComments[data.answer] || []), data],
          }))
        } else {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: errorMessage,
          })
        }

        // Close comment form upon submit
        setOpenCommentFormId(null)
      } catch (error) {
        console.error('Unexpected error:', error)
      }
    }
  }

  // Conditional rendering for loading state
  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <section className="min-h-screen bg-gray-100 py-24">
      <div className="mx-auto max-w-4xl px-4">
        {question ? (
          <div>
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h1 className="mb-4 text-3xl font-bold text-gray-800">
                {question.title}
              </h1>
              <p className="text-lg text-gray-600">{question.description}</p>
              <p className="mt-4 text-gray-500">
                Asked by:{' '}
                {question.asker_info?.username
                  ? question.asker_info?.username
                  : 'Anonymous User'}
              </p>
            </div>
            {/* Show all current answers below question, if answers exists */}
            {answers.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-bold">Current Answers:</h2>
                <div className="list-disc pl-5">
                  {answers.map((answer) => (
                    <div
                      key={answer.answer_id}
                      className="mb-6 mt-6 rounded-lg bg-white p-6 shadow-lg"
                    >
                      Answer: {answer.response}
                      <p className="mt-4 text-gray-500">
                        Answered by:{' '}
                        {answer.expert_info?.username
                          ? answer.expert_info?.username
                          : 'Anonymous User'}
                      </p>
                      {/* Show all current comments below answer, if comments exists */}
                      <div className="bg-slate-300">
                        {comments[answer.answer_id] &&
                          comments[answer.answer_id].length > 0 && (
                            <div className="mt-8">
                              <h2 className="text-lg font-bold">Comments:</h2>
                              <div className="list-disc pl-5">
                                {comments[answer.answer_id].map((comment) => (
                                  <div
                                    key={comment.comment_id}
                                    className="mb-6 mt-6 rounded-lg bg-white p-6 shadow-lg"
                                  >
                                    {`"${comment.response}" - ${comment.expert_info?.username ?? 'Anonymous User'}`}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        {/* Add comment option */}
                        <div className="bg-slate-300">
                          <ButtonWithLoading
                            buttonType="button"
                            buttonText="Add a comment"
                            onClick={() => handleAddComment(answer.answer_id)}
                          ></ButtonWithLoading>
                          {/* Only show comment form if the answer_id is in openCommentFormId state */}
                          {openCommentFormId === answer.answer_id && (
                            <CommentForm onSubmit={handleCommentSubmit} />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Answer button */}
            <div className="items-center px-4 py-12 sm:px-6 lg:px-8">
              <h1 className="text-center text-2xl font-bold text-gray-900">
                Answer Question
              </h1>
              <AnswerForm onSubmit={handleAnswerSubmit} />
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-red-400 bg-red-100 p-4 text-red-700">
            <h2 className="text-lg font-bold">Question not found</h2>
          </div>
        )}
      </div>
    </section>
  )
}
