'use client'

import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/loading';
import { type Question } from '@/types/Questions';
import { useRouter } from 'next/navigation';

const QuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/questions/getAll`);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json() as Question[];
        const sortedQuestions = data.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setQuestions(sortedQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchQuestions();
  }, []);

  const handleQuestionClick = (questionId: string) => {
    router.push(`/questions/${questionId}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-primary mb-8 text-balance">Questions</h1>

      {isLoading && (
        <div className="flex flex-col items-center justify-center my-10">
          <LoadingSpinner />
          <p className="mt-4 text-muted">Loading questions...</p>
        </div>
      )}

      {hasError && (
        <div className="text-center my-10 text-destructive">
          <p>Something went wrong while fetching the questions. Please try again later.</p>
        </div>
      )}

      {!isLoading && !hasError && (
        <ul className="space-y-6">
          {questions.map((question) => (
            <li
              key={question.question_id.toString()}
              className="p-6 rounded-lg shadow-md bg-card border border-border cursor-pointer hover:bg-secondary"
              onClick={() => handleQuestionClick(question.question_id.toString())}
            >
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold text-primary mb-2 text-balance">{question.title}</h2>
                <div className="text-right">
                  <p className="text-base text-foreground font-medium">{question.asker_info?.username ?? 'Anonymous'}</p>
                  <p className="text-sm text-foreground font-medium">
                    {new Date(question.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-base text-foreground mt-4">{question.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QuestionsPage;
