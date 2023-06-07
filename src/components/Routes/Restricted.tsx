import React from "react"
import { useLoaderData, Navigate } from 'react-router-dom'

interface AuthenticateProps {
  component: React.ReactNode
}

export default function Restrict({ component }: AuthenticateProps) {
  const data = useLoaderData()

  if (data !== false) {
    return <Navigate to={"/"} />
  }

  return <>{component}</>
}


