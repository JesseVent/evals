import type { ReactElement } from "react"

import { CopyButton } from "../CopyButton"
import { DetailsViewJsonOutput } from "./DetailsViewJsonOutput"

export type DetailsViewContentViewMode = "json" | "plain"

export interface DetailsViewContentViewerProps {
  content: string
  parsedContent: string | null
  mode: DetailsViewContentViewMode
  label: string
  id: string
  className?: string
}

export const DetailsViewContentViewer = ({
  content,
  parsedContent,
  mode,
  label,
  id,
  className = "",
}: DetailsViewContentViewerProps): ReactElement => {
  if (!content) {
    return (
      <p className="p-3 text-sm text-agentprism-muted-foreground italic">
        No data available
      </p>
    )
  }

  return (
    <div
      className={`relative rounded-lg border border-agentprism-border ${className}`}
    >
      <div className="absolute top-1.5 right-1.5 z-10">
        <CopyButton label={label} content={content} />
      </div>
      {mode === "json" && parsedContent ? (
        <DetailsViewJsonOutput content={parsedContent} id={id} />
      ) : (
        <div className="rounded-lg bg-agentprism-background p-4">
          <pre className="overflow-x-auto text-left font-mono text-sm whitespace-pre-wrap text-agentprism-foreground">
            {content}
          </pre>
        </div>
      )}
    </div>
  )
}
