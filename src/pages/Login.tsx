import { FormEvent, useEffect, useState } from "react"
import { useFetch } from "../hooks/useFetch"
import { globals } from "../config/globals"
import { useNavigate } from "react-router-dom";

interface LoginReturnType {
  token: string;
}

export default function Login() {
  const [loginDetails, setLoginDetails] = useState({ password: "", email: "" })
  const { data: loginData, error: loginError, fetch: login } = useFetch<LoginReturnType>("post")
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await login(globals.BE_ENDPOINTS.SIGNIN_USER, loginDetails)
  }

  useEffect(() => {
    if (loginData && loginData.status === 200) {
      const token = loginData.data.token
      localStorage.setItem("secret_key", token)
      localStorage.setItem("isLoggedIn", "true")
      navigate("/")
    }
    if (loginError) console.log(loginError)

  }, [loginData, loginError])

  return (
    <>
      <div className="w-screen">
        <h1 className="font-bold text-5xl">LOGIN</h1>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={loginDetails.email} onChange={(e) => setLoginDetails(state => ({ ...state, email: e.target.value }))} />
          </div>
          <div className="flex gap-2">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={loginDetails.password} onChange={e => setLoginDetails(state => ({ ...state, password: e.target.value }))} />
          </div>
          <button type="submit">LOGIN</button>
        </form>
        <h1 onClick={() => navigate(globals.FE_ENDPOINTS.REGISTER)}>register</h1>
      </div>
    </>
  )
}
