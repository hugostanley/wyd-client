import { FormEvent, useEffect, useState } from "react"
import { globals } from "../config/globals"
import { useFetch } from "../hooks/useFetch"

export default function Feed({ socket }: { socket: any }) {
  const [todoList, setTodoList] = useState([])
  const [newTodoState, setNewTodoState] = useState({
    title: "",
    description: "",
    status: "inprogress"
  })
  const { data: newTodoData, fetch: newTodo, error: newTodoError } = useFetch("post")

  useEffect(() => {
    if (newTodoData) console.log(newTodoData)
    if (newTodoError) console.log(newTodoError)
  }, [newTodoData, newTodoError])

  async function handleNewSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await newTodo(globals.BE_ENDPOINTS.NEW_TODO, newTodoState)
    socket.emit('get_feed')
    setNewTodoState({
      title: "",
      description: "",
      status: "inprogress"
    })
  }

  function feedUpdater(list) {
    setTodoList(list)
  }

  useEffect(() => {
    socket.connect()
    socket.on('feed_updated', feedUpdater)
    socket.emit('get_feed')

    return () => {
      socket.off('feed_updated', feedUpdater)
      socket.disconnect()
    }
  }, [])


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
          <div key={idx} className="m-5 p-2 border-[1px] border-gray-500">
            <h1 className="font-bold text-xl">{item.title}</h1>
            <h1>{item.description}</h1>
          </div>
        )
      })}
    </div>
  )
}
