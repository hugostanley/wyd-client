import { FormEvent, useEffect, useRef, useState } from "react"
import { globals } from "../config/globals"
import { useFetch } from "../hooks/useFetch"

interface TodoItem {
  _id: string;
  status: string;
  title: string;
  description: string;
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
  const { data: newTodoData, fetch: newTodo, error: newTodoError } = useFetch("post")
  const { data: editData, fetch: editFetch, error: editError } = useFetch("post")
  const { data: deleteData, fetch: deleteFetch, error: deleteError } = useFetch("post")

  useEffect(() => {
    if (newTodoData) console.log(newTodoData)
    if (newTodoError) console.log(newTodoError)
    if (editData) console.log(editData)
    if (editError) console.log(editError)
    if (deleteError) console.log(deleteError)
    if (deleteData) console.log(deleteData)
  }, [newTodoData, newTodoError, editData, editError, deleteData, deleteError])

  async function handleNewSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await newTodo(globals.BE_ENDPOINTS.NEW_TODO, newTodoState)
    socket.emit('get_feed', user._id)
    setNewTodoState({
      title: "",
      description: "",
      status: "inprogress"
    })
  }

  function feedUpdater(list: TodoItem[]) {
    setTodoList(list)
  }

  useEffect(() => {
    socket.connect()
    socket.on('feed_updated', feedUpdater)
    socket.emit('get_feed', user._id)

    return () => {
      socket.off('feed_updated', feedUpdater)
      socket.disconnect()
    }
  }, [])

  async function handleEditSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (isEditing) {
      await editFetch(globals.BE_ENDPOINTS.EDIT_TODO, isEditing)
      socket.emit('get_feed', user._id)
      setIsEditing(null)
    }
  }

  async function handleDelete(item: TodoItem) {
    await deleteFetch(globals.BE_ENDPOINTS.DELETE_TODO, item)
    socket.emit('get_feed', user._id)
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
      {todoList && todoList.map((item, idx) => {
        return (
          <>
            <div key={idx} className="m-5 p-2 border-[1px] border-gray-500">
              {isEditing !== null && isEditing._id === item._id ? (
                <>
                  <form onSubmit={(e) => handleEditSubmit(e)} className="flex flex-col">
                    <input value={isEditing.title} className="font-bold text-xl" onChange={e => setIsEditing(state => ({ ...state, title: e.target.value }))} />
                    <textarea value={isEditing.description} onChange={(e) => setIsEditing(state => ({ ...state, description: e.target.value }))} />
                    <button type="submit">update</button>
                  </form>
                </>
              ) : (
                <>
                  <h1 className="font-bold text-xl">{item.title}</h1>
                  <h1>{item.description}</h1>
                  <div>
                    <button onClick={() => setIsEditing(item)}>edit</button>
                  </div>
                  <button onClick={() => handleDelete(item)}>Delete</button>
                </>
              )}
            </div>
          </>
        )
      })}
    </div>
  )
}
