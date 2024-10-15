'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import type { TagOption } from '@/types/Tags';
import { fetchTags } from '@/api/tags';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ButtonWithLoading } from '@/components/universal/ButtonWithLoading';

// Schema is defined for the form which helps with input requirements and error handling
const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Question title cannot be empty.',
  }),
  description: z.string().min(1, {
    message: 'Question description cannot be empty.',
  }),
  tags: z.array(z.string()).optional(), // Validate UUID strings
});

type FormValues = z.infer<typeof formSchema>;

// Function that will render the question form and passes the results to the ask question page on submit
export default function QuestionForm({
  onSubmit,
}: {
  onSubmit: (values: FormValues) => void;
}) {
  // Define the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      tags: [], // Initialize tags as an empty array
    },
  });

  // State to store tag options
  const [tagOptions, setTagOptions] = useState<TagOption[]>([]);

  // Fetch tags from the backend when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tags = await fetchTags();
        setTagOptions(tags);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
  
    fetchData().catch((error) => {
      console.error('Error in fetchData:', error);
    });
  }, []);
  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What would you like to know?</FormLabel>
              <FormControl>
                <Textarea placeholder="Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={() => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Controller
                  control={form.control}
                  name="tags"
                  render={({ field: controllerField }) => (
                    <Select
                      isMulti
                      options={tagOptions}
                      placeholder="Select relevant tags (optional)"
                      value={tagOptions.filter((option) =>
                        controllerField.value?.includes(option.value)
                      )}
                      onChange={(selected) => {
                        controllerField.onChange(
                          selected.map((option) => option.value)
                        );
                      }}
                      className="mt-1"
                    />
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ButtonWithLoading
          onClick={form.handleSubmit(onSubmit)}
          buttonText="Submit"
          buttonType="submit"
        />
      </form>
    </Form>
  );
}
