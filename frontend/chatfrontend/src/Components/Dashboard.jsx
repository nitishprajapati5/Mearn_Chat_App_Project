import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import useStore from "../store/Store";
import { useLocation } from "react-router-dom";

const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [socket, setSocket] = useState(null);
  const location = useLocation()


  useEffect(() => {

    const params = new URLSearchParams(location.search)
    const token = params.get('token')

    const newSocket = io("http://localhost:5000", {
      //withCredentials: true,
      extraHeaders:{
        auth:token
      }
    });


    setSocket(newSocket);

    newSocket.emit("listAllRooms",rooms);
      console.log(rooms)

    newSocket.on("receiveAllRooms", (fetchedRooms) => {
      console.log(fetchedRooms)
      setRooms(fetchedRooms);
    });

    // socket.on("error",(error)=>{
    //   console.log("Socket Error from Frontend",error)
    // })


  
    
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
    
      console.log(rooms)
    }
  };

  useEffect(() => {
    fetchAllRooms();
  }, [socket]);

  const createRoom = () => {
    if (roomName.trim() && socket) {
      socket.emit("createRoom", roomName);
      setRoomName("");
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-screen flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
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

        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Available Rooms
        </h3>
        <ul>
          {rooms.length > 0 ? (
            rooms.map((room, index) => (
              <li
                key={index}
                className="p-2 bg-gray-100 rounded-lg mb-2 flex justify-between items-center"
              >
                {room.name}
                <button className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition duration-300">
                  Join
                </button>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No rooms available. Create one!</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
