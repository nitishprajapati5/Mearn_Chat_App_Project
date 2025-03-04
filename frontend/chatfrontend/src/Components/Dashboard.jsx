import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {toast} from "sonner"

const Dashboard = () => {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [userRoom,setUserRoom] = useState([])
  const [joined,setJoinedUser] = useState([])
  const [socket, setSocket] = useState(null);
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const token = params.get('token')



  useEffect(() => {

   
    const newSocket = io("http://localhost:5000", {
      //withCredentials: true,
      extraHeaders:{
        auth:token
      }
    });


    setSocket(newSocket);

    //socket.on("error");

    newSocket.emit("listAllRooms",rooms);
      console.log(rooms)

    newSocket.on("receiveAllRooms", (fetchedRooms) => {
      console.log(fetchedRooms)
      setRooms(fetchedRooms);
    });

    newSocket.emit("userRooms")

    newSocket.on("sendUserRooms",(userRooms) => {
      //console.log("Send User Rooms",userRooms)
      setUserRoom(userRooms)
    })

    newSocket.on("userRooms",(data) => {
      setUserRoom(data)
    })
    // socket.on("error",(error)=>{
    //   console.log("Socket Error from Frontend",error)
    // })

    newSocket.emit("userJoinedRoomWhereUserJoined")
    newSocket.on("userRecievedJoinedRoomWhereUserJoined",(joined) => {
      console.log("Joined Data",joined)
      setJoinedUser(joined)
    })


  
    
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const fetchAllRooms = () => {
    if (socket) {
      socket.emit("listAllRooms",rooms);
      socket.on("receiveAllRooms", (fetchedRooms) => {
        console.log(fetchAllRooms)
        setRooms(fetchedRooms);
      });

      socket.on("userRooms",(data) => {
        setUserRoom(data)
      })
    
      console.log(rooms)
    }
  };

  useEffect(() => {
    fetchAllRooms();
  }, [socket]);

  const createRoom = () => {
    if (roomName.trim() && socket) {
      console.log(roomName)
      if(socket){
        socket.emit("addRoom",{name:roomName})
        socket.on("roomCreated",(allRoomData) => {
          console.log("All Room Data",allRoomData)
          setUserRoom(allRoomData)
        })
        toast.success("Created Room Successfully")
      }
    }
  };


  const handleChats = (id) => {
    console.log(id)
    navigate(`/Chats?token=${token}&roomId=${id}`)
    //socket.emit("joinRoom",{roomId:id})
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-screen flex items-center justify-center p-6 min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-3/4">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Dashboard
        </h2>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />

          <button
            onClick={createRoom}
            className="w-full mt-2 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Create Room
          </button>
        </div>

        {/* <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Available Rooms
        </h3> */}
        {/* <ul>
          {rooms.length > 0 ? (
            rooms.map((room, index) => (
              <li
                key={index}
                className="p-2 bg-gray-100 rounded-lg mb-2 flex justify-between items-center"
              >
                {room.name}
                <button onClick={() => handeleJoinRoom(room.id)} className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition duration-300">
                  Join
                </button>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No rooms available. Create one!</p>
          )}
        </ul> */}
        <div className="flex flex-row space-x-2 justify-around">
            <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3 mt-2">
          {/* {User room which are not his rooms and Not Which are joined} */}
          Your Rooms
        </h3>
          <ul>
          {userRoom.length > 0 ? (
            userRoom.map((room, index) => (
              <li
                key={index}
                className="p-2 bg-gray-100 rounded-lg mb-2 flex justify-between items-center"
              >
                {room.name}
                <div className="flex justify-center">
                <button disabled className=" mr-2 bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition duration-300 opacity-80">
                  Owned
                </button>
                <button onClick={() => handleChats(room.id)} className="bg-violet-500 text-white px-3 py-1 rounded-lg hover:bg-violet-700 transition duration-300">
                  View Chats
                </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No rooms available. Create one!</p>
          )}
        </ul>
            </div>
            <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3 mt-2">
          {/* {User rooms which are His Own Room} */}
          Other Rooms
        </h3>
        <ul>
          {joined.length > 0 ? (
            joined.map((room, index) => (
              <li
                key={index}
                className="p-2 bg-gray-100 rounded-lg mb-2 flex justify-between items-center"
              >
                {room.name}
                <button onClick={() => handleChats(room.id)} className="bg-orange-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition duration-300 opacity-80">
                  View Chats
                </button>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No rooms available. Create one!</p>
          )}
        </ul>
            </div>
        </div>
       

      
      </div>
    </div>
  );
};

export default Dashboard;
