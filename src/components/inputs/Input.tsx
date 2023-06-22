import { InputHTMLAttributes } from 'react'

export default function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...props} className={`border-[1px] border-slate-300 rounded-md py-2 px-3 outline-slate-400 ${props.className}`} />
  )
}
