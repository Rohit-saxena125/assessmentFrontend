import React, { useState, useEffect } from "react";
import "./listing.css";

function Listing() {
  const [users, setUsers] = useState([]); // State to store all users and their videos
  const [expandedUser, setExpandedUser] = useState(null); // State to track which user's videos are fully expanded

  // Fetch all users and their videos
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://3.6.60.175:8001/api/video/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data.msg); // Update to use `data.msg` as per the API response
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Function to handle "See All Videos" click
  const handleSeeAllVideos = (userId) => {
    setExpandedUser(userId); // Set the expanded user ID
  };

  return (
    <div className="listing-container">
      <h1>User Video Listing</h1>
      {users.map((user) => (
        <div key={user._id} className="user-card">
          <div className="user-details">
            <img src={user.profile || "avatar.png"} alt="Profile" className="profile-picture" />
            <div className="user-info">
              <h2>{user.firstName} {user.lastName}</h2>
              <p>{user.email}</p>
              <p>{user.phone}</p>
            </div>
          </div>
          <div className="video-grid">
            {(expandedUser === user._id ? user.videos : user.videos.slice(0, 5)).map((video) => (
              <div key={video._id} className="video-card">
                <video controls className="video-thumbnail">
                  <source src={video.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <h3>{video.title}</h3>
                <p>{video.description}</p>
              </div>
            ))}
          </div>
          {user.videos.length > 5 && expandedUser !== user._id && (
            <button onClick={() => handleSeeAllVideos(user._id)} className="see-all-btn">
              See All Videos
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default Listing;