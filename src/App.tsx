import { Link, Outlet, useLoaderData } from "react-router-dom"
import { globals } from "./config/globals"

function App() {
  const data = useLoaderData()
  return (
    <>
      {data && (
        <div className="w-screen">
          <h1 className="font-bold text-5xl">WYD</h1>
          <Link to={globals.FE_ENDPOINTS.FRIENDS}>Friends</Link>
          <Link to={"/"}>Feed</Link>
        </div>
      )}
      <Outlet />
    </>
  )
}

export default App
