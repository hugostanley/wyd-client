import { LabelHTMLAttributes } from 'react'

export default function Label(props: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label {...props} className={`font-medium text-sm ${props.className}`}>{props.children}</label>
  )
}
