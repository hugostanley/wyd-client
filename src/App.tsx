import { Outlet, useLoaderData, useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { globals } from "./config/globals"
import { Squirrel, UserPlus } from "lucide-react"
import { Users } from "lucide-react"
import { useEffect } from "react"
import { ArrowLeft } from "lucide-react"

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
  const searchParams = useLocation()
  useEffect(() => {
    console.log(searchParams.pathname)
  }, [searchParams])
  return (
    <div className="flex justify-between p-4">
      {searchParams.pathname === globals.FE_ENDPOINTS.FRIENDS ? (
        <>
          <div className="flex gap-1 cursor-pointer" onClick={() => navigate("/")}>
            <ArrowLeft size={25} />
          </div>
          <UserPlus size={25} className="cursor-pointer" />
        </>
      ) : (
        <>
          <div className="flex gap-1 cursor-pointer" onClick={() => navigate("/")}>
            <Squirrel size={25} />
            <p className="font-extrabold self-end">WYD</p>
          </div>
          <Users size={25} className="cursor-pointer" onClick={() => navigate(globals.FE_ENDPOINTS.FRIENDS)} />
        </>
      )}
    </div>
  )
}

export default App
