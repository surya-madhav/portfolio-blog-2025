import React from 'react'
import { ProjectArchiveClient } from './Component.client'
import type { Project } from '@/payload-types'

export type ProjectArchiveProps = {
  introContent?: {
    root: {
      type: string
      children: {
        type: string
        version: number
        [k: string]: unknown
      }[]
      direction: ('ltr' | 'rtl') | null
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | ''
      indent: number
      version: number
    }
    [k: string]: unknown
  } | null
  populateBy: 'collection' | 'selection'
  relationTo?: 'projects'
  categories?: number[]
  technologies?: number[]
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
