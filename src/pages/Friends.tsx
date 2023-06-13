// @ts-nocheck
import { useEffect, useState } from "react"
import { useFetch } from "../hooks/useFetch"
import { globals } from "../config/globals"

export default function Friends({ socket }: { socket: any }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  const { data: allUsers, fetch: getUsers } = useFetch("get")
  const { data: addUserData, fetch: addUserFetch } = useFetch("post")
  const [allFriends, setAllFriends] = useState([])
  const { data: allIncomingData, fetch: incomingFetch } = useFetch("get")
  const { data: allFriendRequests, fetch: friendRequestsFetch } = useFetch("get")
  const { data: acceptRequestData, fetch: acceptRequestFetch } = useFetch("post")
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
    <>
      {user && (
        <>
          <div className="font-bold">All Friends</div>
          {allFriends && allFriends.map(item => {
            if (item.recipient.username !== user.username) {
              return (
                <div className="flex border-[1px] border-gray-500 gap-5">
                  <h1>{item.recipient.username}</h1>
                </div>
              )
            }

            if (item.requester.username !== user.username) {
              return (
                <div className="flex border-[1px] border-gray-500 gap-5">
                  <h1>{item.requester.username}</h1>
                </div>
              )
            }
          })}
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
          <div className="mt-5 font-bold">incoming request</div>
          {pendingFriends && pendingFriends.map(item => {
            if (item.recipient._id === user._id) {
              return (
                <div className="flex border-[1px] border-gray-500 gap-5">
                  <h1>{item.requester.username}</h1>
                  <h1>{item.requester.email}</h1>
                  <button onClick={() => handleAcceptRequest(item)}>accept</button>
                </div>
              )
            }
          })}
          <div className="mt-5 font-bold">pending requests</div>
          {pendingFriends && pendingFriends.map(item => {
            if (item.requester._id === user._id) {
              return (
                <div className="flex border-[1px] border-gray-500 gap-5">
                  <h1>{item.recipient.username}</h1>
                  <h1>{item.recipient.email}</h1>
                </div>
              )
            }
          })}
        </>
      )}
    </>
  )
}
