import { useEffect } from "react"
import { useFetch } from "./hooks/useFetch"
import { globals } from "./config/globals"

function App() {
  const {data, fetch: smthn, error} = useFetch("post")

  async function handleClick(){
    console.log('clicked')
    await smthn(globals.BE_ENDPOINTS.NEW_USER, {username: 'stanley', email: 'stanley@mail.com', password: 'stanleytest'})
  }

  useEffect(()=> {
    if(data) console.log(data)
    if(error) console.log(error)

  },[data, error])

  return (
    <>
      <p className="text-2xl">hello</p>
      <button onClick={handleClick}>click me</button>
    </>
  )
}

export default App
