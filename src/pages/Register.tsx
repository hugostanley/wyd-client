import { FormEvent, useEffect, useState } from "react"
import { useFetch } from "../hooks/useFetch"
import { globals } from "../config/globals"
import { useNavigate } from "react-router-dom";

interface RegisterReturnType {
  token: string;
}

export default function Register() {
  const [registerDetails, setRegisterDetails] = useState({ password: "", email: "", username: "" })
  const { data: registerData, error: registerError, fetch: register } = useFetch<RegisterReturnType>("post")
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await register(globals.BE_ENDPOINTS.NEW_USER, registerDetails)
  }

  useEffect(() => {
    if (registerData && registerData.status === 200) {
      navigate(globals.FE_ENDPOINTS.LOGIN)
    }
    if (registerError) console.log(registerError)

  }, [registerData, registerError])

  return (
    <>
      <div className="w-screen">
        <h1 className="font-bold text-5xl">LOGIN</h1>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <label htmlFor="username">Username</label>
            <input type="username" id="username" value={registerDetails.username} onChange={(e) => setRegisterDetails(state => ({ ...state, username: e.target.value }))} />
          </div>
          <div className="flex gap-2">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={registerDetails.email} onChange={(e) => setRegisterDetails(state => ({ ...state, email: e.target.value }))} />
          </div>
          <div className="flex gap-2">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={registerDetails.password} onChange={e => setRegisterDetails(state => ({ ...state, password: e.target.value }))} />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  )
}

