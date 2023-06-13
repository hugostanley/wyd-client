import { FormEvent, useEffect, useState } from "react"
import { globals } from "../config/globals"
import { useFetch } from "../hooks/useFetch"

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
  }

  return (
    <div>
      <div>
        <form onSubmit={handleNewSubmit} className="p-2 m-5 border-2 border-gray-500">
          <div className="flex">
            <label htmlFor="title">Title</label>
            <input value={newTodoState.title} onChange={e => setNewTodoState(state => ({ ...state, title: e.target.value }))} />
          </div>
          <div className="flex flex-col">
            <label htmlFor="description">Description</label>
            <textarea value={newTodoState.description} onChange={e => setNewTodoState(state => ({ ...state, description: e.target.value }))} />
          </div>
          <button type="submit">submit</button>
        </form>
      </div>
      {todoList && todoList.sort((a, b) => Number(new Date(b.updatedAt)) - Number(new Date(a.updatedAt))).map((item, idx) => {
        return (
          <>
            <div key={idx} className="m-5 p-2 border-[1px] border-gray-500">
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
                  <h1 className="font-bold text-2xl">@{item.createdByUser.username || 'none'}</h1>
                  <p className="text-gray-500 italic">{item.createdByUser.email}</p>
                  <h1 className="font-bold text-xl">title: {item.title}</h1>
                  <h1>description: {item.description}</h1>
                  {user._id === item.createdByUser._id && (
                    <>
                      <div>
                        <button onClick={() => setIsEditing(item)}>edit</button>
                      </div>
                      <button onClick={() => handleDelete(item)}>Delete</button>
                    </>
                  )}
                </>
              )}
            </div>
          </>
        )
      })}
    </div>
  )
}
