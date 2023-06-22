import { Outlet, useLoaderData, useNavigate } from "react-router-dom"
import { globals } from "./config/globals"
import { Squirrel } from "lucide-react"
import { Users } from "lucide-react"

function App() {
  const data = useLoaderData()

  if (!data) {
    return <Outlet />
  }
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

function Header() {
  const navigate = useNavigate()
  return (
    <div className="flex justify-between p-4">
      <div className="flex gap-1 cursor-pointer" onClick={() => navigate("/")}>
        <Squirrel size={25} />
        <p className="font-extrabold self-end">WYD</p>
      </div>
      <Users size={25} className="cursor-pointer" onClick={() => navigate(globals.FE_ENDPOINTS.FRIENDS)} />
    </div>
  )
}

export default App
