import React, { Fragment } from 'react'

import type { Page, Project } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
// Import project-specific blocks
import { ProjectHeroBlock } from '@/blocks/ProjectHero/Component'
import { TechnicalSpecsBlock } from '@/blocks/TechnicalSpecs/Component'
import { CodeBlock } from '@/blocks/Code/Component'
import { MermaidDiagramBlock } from '@/blocks/MermaidDiagram/Component'
import { MediaGalleryBlock } from '@/blocks/MediaGallery/Component'
import { ProjectMetricsBlock } from '@/blocks/ProjectMetrics/Component'
import { ProjectArchiveBlock } from '@/blocks/ProjectArchive/Component'

// Create a union type for all possible blocks
type AllBlocks = Page['layout'][0] | NonNullable<Project['layout']>[0]

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  // Project-specific blocks
  projectHero: ProjectHeroBlock,
  technicalSpecs: TechnicalSpecsBlock,
  code: CodeBlock,
  mermaidDiagram: MermaidDiagramBlock,
  mediaGallery: MediaGalleryBlock,
  projectMetrics: ProjectMetricsBlock,
  projectArchive: ProjectArchiveBlock,
}

export const RenderBlocks: React.FC<{
  blocks: AllBlocks[]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
