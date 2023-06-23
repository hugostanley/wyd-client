import { FormEvent, useEffect, useState } from "react"
import { useFetch } from "../hooks/useFetch"
import { globals } from "../config/globals"
import { useNavigate } from "react-router-dom";
import Field from "../components/inputs/Field";
import Label from "../components/inputs/Label";
import Input from "../components/inputs/Input";

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
    <div className="w-screen h-screen flex items-center ">
      <div className="grow bg-auth-image bg-cover bg-center bg-no-repeat h-full w-[50%] hidden lg:block">

      </div>
      <div className="flex flex-col gap-2 grow px-[7vw] w-[50%]">
        <h1 className="font-bold text-4xl">Register</h1>
        <div>
          <form onSubmit={handleSubmit}>
            <Field className="flex gap-2">
              <Label htmlFor="username">Username</Label>
              <Input type="username" id="username" value={registerDetails.username} onChange={(e) => setRegisterDetails(state => ({ ...state, username: e.target.value }))} />
            </Field>
            <Field className="flex gap-2">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" value={registerDetails.email} onChange={(e) => setRegisterDetails(state => ({ ...state, email: e.target.value }))} />
            </Field>
            <Field className="flex gap-2">
              <Label htmlFor="password">Password</Label>
              <Input type="password" id="password" value={registerDetails.password} onChange={e => setRegisterDetails(state => ({ ...state, password: e.target.value }))} />
            </Field>
            <button className="w-full bg-gray-900 text-white rounded-md mt-2 p-2 font-bold hover:bg-gray-800 border-none" type="submit">Sign up</button>
          </form>
          <p className="text-xs mt-6">
            Already have an account? <span className="text-indigo-500 underlined cursor-pointer" onClick={() => navigate(globals.FE_ENDPOINTS.LOGIN)}>Login.</span>
          </p>
        </div>
      </div>
    </div>
  )
}

