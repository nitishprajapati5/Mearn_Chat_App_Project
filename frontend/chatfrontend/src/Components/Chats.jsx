import { useEffect, useState } from "react";
import { Input } from "./Inner Components/Input";
import { Button } from "./Inner Components/Button";
import { useNavigate,useLocation, data } from "react-router-dom";
import { io } from "socket.io-client";
import { useForm } from "react-hook-form";

export default function ChatPage() {
  const navigate = useNavigate()
  const [users, setUsers] = useState(["Alice", "Bob", "Charlie", "David"]);
  const [activeUser, setActiveUser] = useState("Alice");
  const location = useLocation()
  const [socket,setSocket] = useState(null)
  const [roomName,setRoomName] = useState("")
  const [avatar,setAvatar] = useState([])
  const params = new URLSearchParams(location.search)
  const token = params.get('token')
  const roomId = params.get('roomId')
  const [messages,setMessages] = useState({})
  //const [message,setMessage] = useState("")


  const {
    handleSubmit,
    register,
    formState:{errors},
  } = useForm();

  //console.log('Token',token)
  //console.log("room Id",roomId)
//   const [messages, setMessages] = useState({
//     Alice: ["Hello!"],
//     Bob: ["Hey there!"],
//     Charlie: ["Hi!"]
//   });
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    // if (!newMessage.trim()) return;
    // setMessages({
    //   ...messages,
    //   [activeUser]: [...(messages[activeUser] || []), newMessage],
    // });
    // setNewMessage("");
  };

  useEffect(() => {
        const newSocket = io("http://localhost:5000",
            {
                extraHeaders:{
                    auth:token
                }
            }
        )

        setSocket(newSocket)

        newSocket.emit('getRoomName',({roomId:roomId}))
        newSocket.on("receiveRoomName",(receiveRoomDetails) =>{
            // console.log(receiveRoomDetails.name)
            setRoomName(receiveRoomDetails.name)
        })


        newSocket.emit("getUserfromRooom",({roomId:roomId}))
        newSocket.on("receiveUserfromRoom",(receiveData) => {
            console.log(receiveData)
            
            setAvatar(receiveData)
        })

        newSocket.emit("onGetAllMessages",({roomId}))
        newSocket.on("receiveAllMessage",(fetchedData) => {
            console.log(fetchedData.allMessages)
            setMessages(fetchedData)
        })

        return () => {
            newSocket.disconnect();
        }
  },[])

  const onSubmit = (data) =>{
    console.log(data.message)
    if(socket){
        socket.emit("message",{content:data.message,roomId:roomId})
        socket.on("getAllMessages",(fetchMessages) => {
            console.log(fetchMessages)
        })
    }

  }

  return (
    <div className="flex justify-center p-6 bg-gradient-to-r from-blue-100 to-indigo-200">
      {/* <div className="w-1/4 bg-white p-4 rounded-2xl shadow-xl overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Users</h2>
        <ul>
          {users.map((user) => (
            <li
              key={user}
              className={`p-3 cursor-pointer rounded-lg text-lg font-medium transition-all ${
                activeUser === user ? "bg-blue-500 text-white" : "hover:bg-gray-300 text-gray-700"
              }`}
              onClick={() => setActiveUser(user)}
            >
              {user}
            </li>
          ))}
        </ul>
      </div> */}
      <div className="sm:w-full lg:w-1/2 h-screen bg-white p-6 rounded-2xl shadow-xl flex flex-col ml-2">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">{roomName}</h2>
        <div className="flex flex-row">{avatar.map((avt,index) => (
            <h1 key={avt.id} className="rounded-xl px-2 scale-125 bg-red-300 m-1 font-bold text-red-700">{avt.user.name[0]}</h1>
        ))}</div>
        <div className="flex-1 flex-col overflow-y-auto p-4 border rounded-lg bg-gray-50 shadow-inner m-2">
        {messages.allMessages?.map((msg, index) => (
             msg.user?.id === messages.user?.id ? (
                <div className="flex justify-end">
                    <p key={msg.id} className="flex flex-row justify-end rounded-xl mt-1 w-1/2"><span className="bg-slate-400 p-2 rounded-lg">{msg.content}</span><span className="bg-red-200 p-2 m-1 rounded-2xl">{msg.user.name[0]}</span></p>
                </div>
            ) : (
             <p key={msg.id} className="flex flex-row mt-1 rounded-xl w-1/2"><span className="bg-red-200 p-2 m-1 rounded-2xl">{msg.user.name[0]}</span><span className="bg-gray-100 p-2 rounded-lg">{msg.content}</span></p>
            )
        ))}

        </div>
        <div>
          <form className="mt-4 flex  gap-2" onSubmit={handleSubmit(onSubmit)}>
          {/* <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
          /> */}
        <div className="flex w-full">
        <div className="w-full">
        <input 
            type="text"
            id="message"
            name="content"
            placeholder="Enter your message"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            {...register("message",{required:"Please enter the message"})}
            />
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}

        </div>
        </div>
         <div>
         <Button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition">
            Send
          </Button>
         </div>
          </form>
        </div>
      </div>
    </div>
  );
}
