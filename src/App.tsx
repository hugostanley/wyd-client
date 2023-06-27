// @ts-nocheck
import { FormEvent, createContext, useContext, useState } from "react"
import { Link, Outlet, useLoaderData, useLocation, useNavigate } from "react-router-dom"
import { globals } from "./config/globals"
import { Home, Plus, Squirrel, User, UserCircle, UserPlus, UserPlus2 } from "lucide-react"
import { Users } from "lucide-react"
import { useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import { useFetch } from "./hooks/useFetch"
import { TodoItem } from "./pages/Feed"

export const FeedContext = createContext({})

function App({ socket }) {
  const data = useLoaderData()
  const { data: feedData, fetch: getFeed } = useFetch<{ friendIdArr: string[], list: TodoItem[] }>("get")

  if (!data) {
    return <Outlet />
  }

  useEffect(() => {
    getFeed(globals.BE_ENDPOINTS.GET_FEED)

  }, [])

  return (
    <FeedContext.Provider value={{ feedData }}>
      <Header />
      <Outlet />
      <BottomNavBar socket={socket} />
    </FeedContext.Provider>
  )
}

function NewTodo({ isOpen, onClose, socket }: { isOpen: boolean, onClose: () => void; socket: any; }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const viewH = window.innerHeight
  const { feedData } = useContext(FeedContext)
  const [closed, setClosed] = useState(false)
  const { data: newTodoData, fetch: newTodoFetch, error: newTodoError } = useFetch<{ newTodo: TodoItem }>("post")
  const [newTodoState, setNewTodoState] = useState({
    title: "",
    description: "",
    status: "inprogress"
  })

  function handleClose() {
    onClose()
    setClosed(true)
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await newTodoFetch(globals.BE_ENDPOINTS.NEW_TODO, newTodoState)
    setNewTodoState({
      title: "",
      description: "",
      status: "inprogress"
    })
    handleClose()
  }

  useEffect(() => {
    if (feedData && feedData.status === 200) {
      if (newTodoData && newTodoData.status === 200) {
        socket.emit('get_feed', { todo: newTodoData.data.newTodo, id: user._id, feedIds: feedData.data.friendIdArr, type: 'new' })
      }
    }
  }, [feedData, newTodoData])

  useEffect(() => {
    if (isOpen) setClosed(false)
  }, [isOpen])

  return (
    <>
      <div className={`p-4 opacity-0 h-screen w-screen fixed bg-white -bottom-[${viewH}px] ${isOpen && !closed ? "opacity-100 show-new-todo-form" : "opacity-100"} ${closed ? "hide-todo-form" : ""}`}>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="underline text-md cursor-pointer" onClick={handleClose}>Cancel</span>
              <div className="cursor-pointer px-4 py-1 rounded-full bg-indigo-500 text-white">
                <button className="text-sm font-semibold" type="submit">Post</button>
              </div>
            </div>
            <div className="flex flex-col">
              <input value={newTodoState.title} onChange={e => setNewTodoState(state => ({ ...state, title: e.target.value }))} className="outline-none text-lg font-semibold" placeholder="What are you doing?" />
              <textarea value={newTodoState.description} onChange={e => setNewTodoState(state => ({ ...state, description: e.target.value }))} placeholder="Tell us more" className="text-md outline-none resize-none" />
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

function BottomNavBar({ socket }) {
  const searchParams = useLocation()
  const [newTodoBtnClicked, setNewTodoBtnClicked] = useState(false)
  return (
    <>
      <div className={`fixed bottom-0 w-screen p-2 ${newTodoBtnClicked ? 'hide-nav' : 'show-nav'}`}>
        <div className="text-white items-center w-full py-2 flex justify-evenly rounded-full shadow-xl drop-shadow-xl bg-black">
          <div className={`p-2 cursor-pointer ${searchParams.pathname === globals.FE_ENDPOINTS.FEED ? 'border-b-2 border-b-white' : ''}`}>
            <Link to={globals.FE_ENDPOINTS.FEED}>
              <Home size={18} />
            </Link>
          </div>
          <div className={`p-2 rounded-full cursor-pointer bg-indigo-500`} onClick={() => setNewTodoBtnClicked(true)}>
            <Plus size={18} />
          </div>
          <div className={`p-2 cursor-pointer ${searchParams.pathname === globals.FE_ENDPOINTS.PROFILE ? 'border-b-2 border-b-white' : ''}`}>
            <Link to={globals.FE_ENDPOINTS.PROFILE}>
              <User size={18} />
            </Link>
          </div>
        </div>
      </div>
      <NewTodo socket={socket} onClose={() => setNewTodoBtnClicked(false)} isOpen={newTodoBtnClicked} />
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
    <div className="flex justify-between p-4 sm:px-[6vw] md:px-[11vw] lg:px-[16vw] xl:px-[21vw]">
      {searchParams.pathname === globals.FE_ENDPOINTS.FRIENDS ? (
        <>
          <div className="flex gap-1 cursor-pointer" onClick={() => navigate("/")}>
            <ArrowLeft size={25} />
          </div>
          <UserPlus2 size={25} className="cursor-pointer" />
        </>
      ) : (
        <>
          <div className="flex gap-1 cursor-pointer" onClick={() => navigate("/")}>
            <Squirrel size={25} />
          </div>
          <UserPlus2 size={25} className="cursor-pointer" onClick={() => navigate(globals.FE_ENDPOINTS.FRIENDS)} />
        </>
      )}
    </div>
  )
}

export default App
