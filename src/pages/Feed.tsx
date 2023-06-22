import { FormEvent, useEffect, useRef, useState } from "react"
import { globals } from "../config/globals"
import { useFetch } from "../hooks/useFetch"
import { Dot, MoreHorizontal, UserCircle } from "lucide-react";
import { checkTimeDifference } from "../utils/checkTimeDifference";

interface TodoItem {
  _id: string;
  status: string;
  title: string;
  description: string;
  createdByUser: {
    _id: string;
    username: string;
    email: string;
  },
  updatedAt: string;
}

export default function Feed({ socket }: { socket: any }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [toolTip, setTooltip] = useState<null | number>(null)
  const toolTipRef = useRef(null)
  const [todoList, setTodoList] = useState<TodoItem[]>([])
  const [isEditing, setIsEditing] = useState<TodoItem | null>(null)
  const [newTodoState, setNewTodoState] = useState({
    title: "",
    description: "",
    status: "inprogress"
  })
  const { data: newTodoData, fetch: newTodo, error: newTodoError } = useFetch<{ newTodo: TodoItem }>("post")
  const { data: editData, fetch: editFetch, error: editError } = useFetch<{ updatedTodo: TodoItem }>("post")
  const { data: deleteData, fetch: deleteFetch, error: deleteError } = useFetch<{ deletedTodo: TodoItem }>("post")
  const { data: feedData, fetch: getFeed } = useFetch<{ friendIdArr: string[], list: TodoItem[] }>("get")

  useEffect(() => {
    if (feedData && feedData.status === 200) {
      if (newTodoData && newTodoData.status === 200) {
        socket.emit("get_feed", { todo: newTodoData.data.newTodo, id: user._id, feedIds: feedData.data.friendIdArr, type: 'new' })
      }

      if (editData && editData.status === 200) {
        socket.emit("get_feed", { todo: editData.data.updatedTodo, id: user._id, feedIds: feedData.data.friendIdArr, type: 'edit' })
      }

      if (deleteData && deleteData.status === 200) {
        socket.emit("get_feed", { todo: deleteData.data.deletedTodo, id: user._id, feedIds: feedData.data.friendIdArr, type: 'delete' })
      }
    }
    if (newTodoError) console.log(newTodoError)
    if (editData) console.log(editData)
    if (editError) console.log(editError)
    if (deleteError) console.log(deleteError)
    if (deleteData) console.log(deleteData)
    if (feedData) {
      setTodoList(feedData.data.list)
    }
  }, [newTodoData, newTodoError, editData, editError, deleteData, deleteError, feedData])

  async function handleNewSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await newTodo(globals.BE_ENDPOINTS.NEW_TODO, newTodoState)
    setNewTodoState({
      title: "",
      description: "",
      status: "inprogress"
    })
  }

  async function feedUpdater({ type, todo }: { type: string, todo: TodoItem }) {
    if (type === "new") {
      setTodoList(state => [...state, todo])
    }

    if (type === "edit") {
      setTodoList(state => {
        return state.map(item => {
          if (item._id === todo._id) {
            return todo
          } else {
            return item

          }
        })
      })
    }

    if (type === "delete") {
      setTodoList(state => {
        return state.filter(item => item._id !== todo._id)
      })
    }
  }

  useEffect(() => {
    getFeed(globals.BE_ENDPOINTS.GET_FEED)

    socket.connect()
    socket.emit('join_room', user._id)
    socket.on('feed_updated', feedUpdater)

    return () => {
      socket.off('feed_updated', feedUpdater)
      socket.disconnect()
    }
  }, [])

  async function handleEditSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (isEditing) {
      await editFetch(globals.BE_ENDPOINTS.EDIT_TODO, isEditing)
      setIsEditing(null)
    }
  }

  async function handleDelete(item: TodoItem) {
    await deleteFetch(globals.BE_ENDPOINTS.DELETE_TODO, item)
    setTooltip(null)
  }

  function disableToolTip(e: MouseEvent) {

    // @ts-ignore
    if (e.target.id !== toolTipRef.current.id) {
      setTooltip(null)
    }
  }

  useEffect(() => {
    window.addEventListener('click', disableToolTip)
    return () => {
      window.removeEventListener('click', disableToolTip)
    }

  }, [])

  return (
    <div>
      <div>
        <form onSubmit={handleNewSubmit} className="">
          <div className="p-3 flex gap-2">
            <UserCircle className="text-gray-900" size={30} />
            <div className="flex flex-col grow">
              <input value={newTodoState.title} onChange={e => setNewTodoState(state => ({ ...state, title: e.target.value }))} className="outline-none text-lg font-semibold" placeholder="What are you doing?" />
              <textarea value={newTodoState.description} onChange={e => setNewTodoState(state => ({ ...state, description: e.target.value }))} placeholder="Tell us more" className="text-md outline-none resize-none"></textarea>
              <button className="self-end px-4 py-1 text-white font-semibold shadow-lg rounded-full bg-indigo-500" type="submit">Post</button>
            </div>
          </div>
        </form>
      </div>
      <div className="flex flex-col">
        {todoList && todoList.sort((a, b) => Number(new Date(b.updatedAt)) - Number(new Date(a.updatedAt))).map((item, idx) => {
          return (
            <>
              <div key={idx} className="p-3 pb-5 border-t border-slate-300 shadow-sm">
                {isEditing !== null && isEditing._id === item._id ? (
                  <>
                    <form onSubmit={(e) => handleEditSubmit(e)} className="flex flex-col">
                      {/* @ts-ignore */}
                      <input value={isEditing.title} className="font-bold text-xl" onChange={e => setIsEditing(state => ({ ...state, title: e.target.value }))} />
                      {/* @ts-ignore */}
                      <textarea value={isEditing.description} onChange={(e) => setIsEditing(state => ({ ...state, description: e.target.value }))} />
                      <button type="submit">update</button>
                    </form>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center relative">
                      <div className="flex items-center gap-2">
                        {user._id === item.createdByUser._id ? (
                          <div className="bg-[url('src/assets/newremove.png')] bg-cover bg-center bg-no-repeat h-12 w-12 rounded-full border border-slate-300">
                          </div>
                        ) : (
                          <div className="bg-[url('src/assets/810438.jpeg')] bg-cover bg-center bg-no-repeat h-12 w-12 rounded-full border border-slate-300">
                          </div>
                        )}
                        <div className="">
                          <p className="font-bold text-sm">{item.createdByUser.username}</p>
                          <div className="flex items-center text-slate-400">
                            <p className="text-xs">{item.createdByUser.email}</p>
                            <Dot size={15} />
                            <p className="text-xs">{checkTimeDifference(item.updatedAt)}</p>
                          </div>
                        </div>
                      </div>
                      {user._id === item.createdByUser._id && (
                        <div ref={toolTipRef} id="tooltipButton" className="cursor-pointer" onClick={() => setTooltip(idx)} >
                          <MoreHorizontal size={15} className="pointer-events-none" />
                        </div>
                      )}
                      {toolTip === idx && (
                        <div className="absolute w-40 h-fit top-0 shadow-md bg-white right-0 rounded-md border border-slate-300 flex flex-col">
                          <div onClick={() => setIsEditing(item)} className="px-2 cursor-pointer hover:bg-gray-100">
                            <p>Edit</p>
                          </div>
                          <div onClick={() => handleDelete(item)} className="px-2 cursor-pointer hover:bg-gray-100">
                            <p>Delete</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-2 leading-2">
                      <h1 className="font-semibold text-lg">{item.title}</h1>
                      <p className="text-sm text-gray-700 italic">{item.description}</p>
                    </div>
                  </>
                )}
              </div >
            </>
          )
        })}
      </div>
    </div >
  )
}
