import { type UUID } from 'crypto'

export type Tag = {
  tag_id: UUID;
  name: string;
};

export type TagOption = {
  value: string;
  label: string;
};
