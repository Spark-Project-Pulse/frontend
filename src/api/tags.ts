import type { Tag, TagOption } from '@/types/Tags';

/**
 * Fetches tags from the backend.
 *
 * Returns:
 *   Promise<TagOption[]>: An array of tag options on success, or an empty array on failure.
 */
export const fetchTags = async (): Promise<TagOption[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tags/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = (await response.json()) as Tag[];

    const options: TagOption[] = data.map((tag) => ({
      value: tag.tag_id,
      label: tag.name,
    }));

    return options;
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
};
