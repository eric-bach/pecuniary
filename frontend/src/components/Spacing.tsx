import { useTheme } from '@material-ui/core'
import React from 'react'

export type SpacingProps = {
  /**
   * Elements rendered inside the component.
   */
  children?: React.ReactNode
  /**
   * Spacing scale to be applied.
   */
  scale: number
}


export function InsetSpacing(props: SpacingProps) {
  const { children, scale } = props
  const theme = useTheme()

  return <div style={{ padding: theme.spacing(scale) }}>{children}</div>
}

