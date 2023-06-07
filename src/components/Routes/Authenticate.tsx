import React from "react"
import { useLoaderData, Navigate } from 'react-router-dom'
import { globals } from "../../config/globals"
interface AuthenticateProps {
  component: React.ReactNode
}

export default function Authenticate({ component }: AuthenticateProps) {
  const data = useLoaderData()

  if (data === false) {
    return <Navigate to={globals.FE_ENDPOINTS.LOGIN} />
  }

  return <>{component}</>
}

