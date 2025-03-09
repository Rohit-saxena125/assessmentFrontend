import React, { useState, useEffect } from "react";
import "../profile/profile.css";
import Listing from "../listing/listing"; // Import the Listing component

function Profile({ user, onLogout }) {
  const [profilePicture, setProfilePicture] = useState(user?.profile || null);
  const [bio, setBio] = useState(user?.bioData || "");
  const [isUploading, setIsUploading] = useState(false);
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [showBioPopup, setShowBioPopup] = useState(false);
  const [newBio, setNewBio] = useState("");
  const [videos, setVideos] = useState([]);
  const [userData, setUserData] = useState({});
  const [showAllVideos, setShowAllVideos] = useState(false);
  const [showListing, setShowListing] = useState(false); // State to toggle Listing component

  // Reusable function to fetch profile data
  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://3.6.60.175:8001/api/auth/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const { user, videos } = data.data;
        setUserData(user);
        setProfilePicture(user.profile || null);
        setBio(user.bioData || "");
        setVideos(videos || []);
      } else {
        console.error("Failed to fetch profile data");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  // Handle profile picture upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://3.6.60.175:8001/api/upload/profile", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setProfilePicture(data.url);
          alert("Profile picture uploaded successfully!");
          fetchProfileData();
        } else {
          alert("Failed to upload profile picture.");
        }
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        alert("An error occurred while uploading the profile picture.");
      }
    }
  };

  // Handle bio update
  const handleBioUpdate = () => {
    setShowBioPopup(true);
    setNewBio(bio);
  };

  const handleBioSubmit = async (e) => {
    e.preventDefault();
    if (newBio.length <= 500) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://3.6.60.175:8001/api/auth/update", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ bio: newBio }),
        });

        if (response.ok) {
          setBio(newBio);
          setShowBioPopup(false);
          alert("Bio updated successfully!");
          fetchProfileData();
        } else {
          alert("Failed to update bio. Please try again.");
        }
      } catch (error) {
        console.error("Error updating bio:", error);
        alert("An error occurred while updating bio.");
      }
    } else {
      alert("Bio must be 500 characters or less.");
    }
  };

  // Handle video upload
  const handleVideoUpload = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    const file = e.target.thumbnail.files[0];
    if (!file) {
      alert("Please upload a thumbnail.");
      setIsUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", e.target.title.value);
    formData.append("description", e.target.description.value);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://3.6.60.175:8001/api/upload/video", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setVideos((prevVideos) => [...prevVideos, data]);
        setIsUploading(false);
        setShowVideoPopup(false);
        alert("Video uploaded successfully!");
        fetchProfileData();
      } else {
        alert("Failed to upload video.");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("An error occurred while uploading the video.");
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onLogout();
  };

  // Function to filter out unwanted fields
  const filterUserData = (user) => {
    const { _id, createdAt, updatedAt, password, bioData, profile, ...filteredData } = user;
    return filteredData;
  };

  return (
    <div className="profile-container">
      {/* Logout Button */}
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>

      {/* Button to Toggle Listing */}
      <button onClick={() => setShowListing(!showListing)} className="listing-btn">
        {showListing ? "Back to Profile" : "Go to Listing"}
      </button>

      {/* Upload Video Button (Always Visible) */}
      <button onClick={() => setShowVideoPopup(true)} className="upload-video-btn">
        Upload Video
      </button>

      {/* Conditionally Render Listing or Profile */}
      {showListing ? (
        <Listing />
      ) : (
        <>
          {/* Profile Section - Always Visible */}
          <div className="profile-section">
            <div className="profile-picture-section">
              <img src={profilePicture || "avatar.png"} alt="Profile" className="profile-picture" />
              <input type="file" accept="image/*" onChange={handleFileUpload} id="upload-photo" style={{ display: "none" }} />
              <label htmlFor="upload-photo" className="upload-btn">
                {profilePicture ? "Change Photo" : "Upload Photo"}
              </label>
            </div>
            <div className="profile-details">
              <h2>{userData.firstName}'s Profile</h2>
              {Object.entries(filterUserData(userData)).map(([key, value]) => (
                <p key={key}>
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value || "Not provided"}
                </p>
              ))}
              <div className="bio-section">
                <h3>Bio</h3>
                {bio ? <p>{bio}</p> : <button onClick={handleBioUpdate} className="add-bio-btn">Add Bio</button>}
              </div>
            </div>
          </div>

          {/* Main Content - Uploaded Videos */}
          <div className="main-content">
            <h1>Uploaded Videos</h1>
            <div className="video-grid">
              {(showAllVideos ? videos : videos.slice(0, 5)).map((video) => (
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
            {videos.length > 5 && !showAllVideos && (
              <button onClick={() => setShowAllVideos(true)} className="see-all-btn">
                See All Videos
              </button>
            )}
          </div>
        </>
      )}

      {/* Video Upload Popup */}
      {showVideoPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Upload Video</h2>
            <form onSubmit={handleVideoUpload}>
              <input type="text" name="title" placeholder="Title" className="video-input" required />
              <input type="file" name="thumbnail" accept="video/mp4" className="video-input" required />
              <textarea name="description" placeholder="Description" className="video-input" required />
              <div className="popup-buttons">
                <button type="submit" disabled={isUploading}>{isUploading ? "Uploading..." : "Upload"}</button>
                <button type="button" onClick={() => setShowVideoPopup(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bio Update Popup */}
      {showBioPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>{bio ? "Edit Bio" : "Add Bio"}</h2>
            <form onSubmit={handleBioSubmit}>
              <textarea placeholder="Enter your bio (max 500 characters)" value={newBio} onChange={(e) => setNewBio(e.target.value)} maxLength={500} required />
              <div className="popup-buttons">
                <button type="submit">Save</button>
                <button type="button" onClick={() => setShowBioPopup(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;