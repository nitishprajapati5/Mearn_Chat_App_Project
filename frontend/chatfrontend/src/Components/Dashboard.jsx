import React, { useState } from "react";

const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");

  const createRoom = () => {
    if (roomName.trim()) {
      setRooms([...rooms, roomName]);
      setRoomName("");
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-screen flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Dashboard</h2>
        
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
        
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Available Rooms</h3>
        <ul>
          {rooms.length > 0 ? (
            rooms.map((room, index) => (
              <li
                key={index}
                className="p-2 bg-gray-100 rounded-lg mb-2 flex justify-between items-center"
              >
                {room}
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
