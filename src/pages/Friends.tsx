// @ts-nocheck
import { useEffect, useState } from "react"
import { useFetch } from "../hooks/useFetch"
import { globals } from "../config/globals"
import { User } from "lucide-react"

export default function Friends({ socket }: { socket: any }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  const { data: allUsers, fetch: getUsers } = useFetch("get")
  const { data: addUserData, fetch: addUserFetch } = useFetch("post")
  const [allFriends, setAllFriends] = useState([])
  const { data: allIncomingData, fetch: incomingFetch } = useFetch("get")
  const { data: allFriendRequests, fetch: friendRequestsFetch } = useFetch("get")
  const { data: acceptRequestData, fetch: acceptRequestFetch } = useFetch("post")
  const [selectedTab, setSelectedTab] = useState<"pending" | "friends" | "requests">("friends")
  const [pendingFriends, setPendingFriends] = useState([])

  useEffect(() => {
    getUsers(globals.BE_ENDPOINTS.ALL_USERS)
    incomingFetch(globals.BE_ENDPOINTS.INCOMING_REQUEST)
    friendRequestsFetch(globals.BE_ENDPOINTS.FRIEND_REQUESTS)
  }, [])

  async function handleAddClick(user) {
    await addUserFetch(globals.BE_ENDPOINTS.ADD_FRIEND, user)
    socket.emit('get_pending_friends', user._id)
  }

  async function handleAcceptRequest(item) {
    await acceptRequestFetch(globals.BE_ENDPOINTS.ACCEPT_REQUEST, { requester: item.requester })
    socket.emit('get_pending_friends', user._id)
    socket.emit('get_friends', user._id)
  }

  async function friendsListUpdater(list) {
    //await allFriendsFetch(globals.BE_ENDPOINTS.ALL_FRIENDS)
    setAllFriends(list)
  }

  async function pendingFriendsUpdater(list) {
    setPendingFriends(list)
  }

  useEffect(() => {
    socket.connect()
    socket.on('friends_updated', friendsListUpdater)
    socket.on('updated_pending_friends', pendingFriendsUpdater)

    socket.emit('get_friends', user._id)
    socket.emit('get_pending_friends', user._id)

    return () => {
      socket.off('friends_updated', friendsListUpdater)
      socket.off('updated_pending_friends', pendingFriendsUpdater)
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    console.log(allFriends)
  }, [allFriends])

  return (
    <div className="sm:px-[6vw] md:px-[11vw] lg:px-[16vw] xl:px-[21vw]">
      <div className="w-full flex flex-col items-center ">
        <div className="justify-self-center font-bold text-2xl">
          <h1>{user.username}</h1>
        </div>
        <div className="flex w-full justify-around">
          <div className={`py-2 flex justify-center cursor-pointer ${selectedTab === "friends" && "border-b-4 border-b-indigo-500"}`} onClick={() => setSelectedTab("friends")}>
            <p>Friends</p>
          </div>
          <div className={`py-2 flex justify-center cursor-pointer ${selectedTab === "pending" && "border-b-4 border-b-indigo-500"}`} onClick={() => setSelectedTab("pending")}>
            <p>Pending</p>
          </div>
          <div className={`py-2 flex justify-center cursor-pointer ${selectedTab === "requests" && "border-b-4 border-b-indigo-500"}`} onClick={() => setSelectedTab("requests")}>
            <p>Requests</p>
          </div>
        </div>
        <div className="border-t border-t-slate-300 w-full">
          {selectedTab === "pending" && (
            <div>
              {pendingFriends && pendingFriends.map(item => {
                if (item.requester._id === user._id) {
                  return (
                    <div className="flex p-4 gap-2">
                      <div className="w-10 h-10 border border-slate-300 rounded-full flex justify-center items-center">
                        <User size={30} />
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="font-bold text-lg leading-[0.8]">{item.recipient.username}</p>
                        <p className="text-sm">{item.recipient.email}</p>
                      </div>
                    </div>
                  )
                }
              })}
            </div>
          )}

          {selectedTab === "requests" && (
            <div>
              {pendingFriends && pendingFriends.map(item => {
                if (item.recipient._id === user._id) {
                  return (
                    <div className="flex p-4 gap-2">
                      <div className="w-10 h-10 border border-slate-300 rounded-full flex justify-center items-center">
                        <User size={30} />
                      </div>
                      <div className="flex flex-col justify-center grow">
                        <p className="font-bold text-lg leading-[0.8]">{item.recipient.username}</p>
                        <p className="text-sm">{item.recipient.email}</p>
                        <div className="mt-2 flex gap-2 grow">
                          <button className="bg-indigo-500 grow rounded-lg px-3 py-2 text-sm text-white" onClick={() => handleAcceptRequest(item)}>Confirm</button>
                          <button className="bg-gray-400 grow rounded-lg px-3 py-2 text-sm text-white" onClick={() => { }}>Delete</button>
                        </div>
                      </div>
                    </div>
                  )
                }
              })}
            </div>
          )}
          {selectedTab === "friends" && (
            <div>
              {allFriends && allFriends.map(item => {
                if (item.recipient.username !== user.username) {
                  return (
                    <div className="flex p-4 gap-2">
                      <div className="w-10 h-10 border border-slate-300 rounded-full flex justify-center items-center">
                        <User size={30} />
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="font-bold text-lg leading-[0.8]">{item.recipient.username}</p>
                        <p className="text-sm">{item.recipient.email}</p>
                      </div>
                    </div>
                  )
                }

                if (item.requester.username !== user.username) {
                  return (
                    <div className="flex p-4 gap-2">
                      <div className="w-10 h-10 border border-slate-300 rounded-full flex justify-center items-center">
                        <User size={30} />
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="font-bold text-lg leading-[0.8]">{item.requester.username}</p>
                        <p className="text-sm">{item.requester.email}</p>
                      </div>
                    </div>
                  )
                }
              })}
            </div>
          )}

        </div>
      </div>
      {user && (
        <>
          <div className="font-bold mt-5">All users</div>
          {allUsers && allUsers.data.users.map(item => {
            return (
              <div className="flex border-[1px] border-gray-500 gap-5">
                <h1>{item.username}</h1>
                <h1>{item.email}</h1>
                <button onClick={() => handleAddClick(item)}>Add friend</button>
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}
