import React from 'react'
import { ProjectArchiveClient } from './Component.client'
import type { Project, ProjectCategory, Technology } from '@/payload-types'

export type ProjectArchiveProps = {
  introContent?: any
  populateBy: 'collection' | 'selection'
  relationTo?: 'projects'
  categories?: ProjectCategory[]
  technologies?: Technology[]
  projectStatus?: 'all' | 'in-progress' | 'completed' | 'archived'
  featuredOnly?: boolean
  limit?: number
  selectedDocs?: Project[]
  displayStyle: 'grid' | 'list' | 'cards'
  columns?: '2' | '3' | '4'
  showFilters: boolean
  showPagination: boolean
  blockType: 'projectArchive'
}

type Props = ProjectArchiveProps & {
  className?: string
}

export const ProjectArchiveBlock: React.FC<Props> = (props) => {
  return <ProjectArchiveClient {...props} />
}
