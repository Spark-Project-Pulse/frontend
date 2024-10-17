import { type UUID } from 'crypto'
import { type User } from './Users'

export interface Project {
  project_id: UUID
  public: boolean
  title: string
  description: string
  created_at: Date
  owner?: UUID
  owner_info?: User
  repo_full_name?: string
}

export interface AddProject {
  project_id: UUID
}

export interface Repo {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  // Add more fields as necessary (see docs for details https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-repositories-for-a-user)
}

export interface RepoContent {
  name: string
  path: string
  type: 'file' | 'dir'
  download_url: string | null
  // Same as above (see docs for details https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#get-repository-content)
}