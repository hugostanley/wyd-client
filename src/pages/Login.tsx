import { FormEvent, useEffect, useState } from "react"
import { useFetch } from "../hooks/useFetch"
import { globals } from "../config/globals"
import { useNavigate } from "react-router-dom";
import Label from "../components/inputs/Label";
import Input from "../components/inputs/Input";
import Field from "../components/inputs/Field";

interface LoginReturnType {
  token: string;
  user: {
    email: string;
    username: string;
    _id: string;
  };
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
      const user = loginData.data.user
      const token = loginData.data.token
      localStorage.setItem("user", JSON.stringify({ email: user.email, _id: user._id, username: user.username }))
      localStorage.setItem("secret_key", token)
      localStorage.setItem("isLoggedIn", "true")
      navigate("/")
    }
    if (loginError) console.log(loginError)

  }, [loginData, loginError])

  return (
    <div className="w-screen h-screen flex items-center ">
      <div className="grow bg-[url('src/assets/bg.jpg')] bg-cover bg-center bg-no-repeat h-full w-[50%] hidden lg:block">

      </div>
      <div className="flex flex-col gap-2 grow px-[7vw] w-[50%]">
        <h1 className="font-bold text-4xl ">Login</h1>
        <div>
          <form onSubmit={handleSubmit}>
            <Field className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" value={loginDetails.email} onChange={(e) => setLoginDetails(state => ({ ...state, email: e.target.value }))} />
            </Field>
            <Field className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input type="password" id="password" value={loginDetails.password} onChange={e => setLoginDetails(state => ({ ...state, password: e.target.value }))} />
            </Field>
            <button className="w-full bg-gray-900 text-white rounded-md mt-2 p-2 font-bold hover:bg-gray-800 border-none" type="submit">Login</button>
          </form>
          <p className="text-xs mt-6">
            Don't have an account yet? <span className="text-indigo-500 underlined cursor-pointer" onClick={()=> navigate(globals.FE_ENDPOINTS.REGISTER)}>Register.</span>
          </p>
        </div>
      </div>
    </div>
  )
}


