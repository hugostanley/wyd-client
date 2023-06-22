import { InputHTMLAttributes } from 'react'

export default function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...props} className={`border-[1px] border-slate-300 rounded-md py-1 px-2 outline-slate-400 ${props.className}`} />
  )
}
