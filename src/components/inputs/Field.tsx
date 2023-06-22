import { HTMLAttributes } from 'react'

export default function Field(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={`flex flex-col gap-2 mb-3 ${props.className}`}>{props.children}</div>
  )
}
