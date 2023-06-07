import { Outlet, useLoaderData } from "react-router-dom"

function App() {
  const data = useLoaderData()
  return (
    <>
      {data && (
        <div className="w-screen">
          <h1 className="font-bold text-5xl">WYD</h1>
        </div>
      )}
      <Outlet />
    </>
  )
}

export default App
