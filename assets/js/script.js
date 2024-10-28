const moviesData = {
  "Red Room": [
    {
      title: "Vikings",
      time: "12:00 AM",
      seats: Array(80).fill(false),
      image: "assets/images/eighth-image.jpg",
    },
    {
      title: "Tropic Thunder",
      time: "02:30 PM",
      seats: Array(80).fill(false),
      image: "assets/images/second-movie.jpg",
    },
    {
      title: "Ted Lasso",
      time: "02:30 PM",
      seats: Array(80).fill(false),
      image: "assets/images/seventh-image.jpg",
    },
    {
      title: "Movie 2",
      time: "02:30 PM",
      seats: Array(80).fill(false),
      image: "assets/images/second-movie.jpg",
    },
  ],
  "Blue Room": [
    {
      title: "Hang on to you nuggets",
      time: "04:30 PM",
      seats: Array(80).fill(false),
      image: "assets/images/third-movie.jpg",
    },
    {
      title: "Terrifier",
      time: "04:30 PM",
      seats: Array(80).fill(false),
      image: "assets/images/sixth-image.jpg",
    },
    {
      title: "Movie 3",
      time: "04:30 PM",
      seats: Array(80).fill(false),
      image: "assets/images/third-movie.jpg",
    },
    {
      title: "Movie 4",
      time: "07:00 PM",
      seats: Array(80).fill(false),
      image: "assets/images/fourth-image.jpeg",
    },
  ],
  "Green Room": [
    {
      title: "Movie 5",
      time: "05:30 PM",
      seats: Array(80).fill(false),
      image: "assets/images/fourth-image.jpeg",
    },
    {
      title: "Movie 6",
      time: "08:00 PM",
      seats: Array(80).fill(false),
      image: "assets/images/first-movie.jpeg",
    },
    {
      title: "Movie 6",
      time: "08:00 PM",
      seats: Array(80).fill(false),
      image: "assets/images/first-movie.jpeg",
    },
    {
      title: "Movie 6",
      time: "08:00 PM",
      seats: Array(80).fill(false),
      image: "assets/images/first-movie.jpeg",
    },
  ],
};

let selectedRoom = null;
let selectedMovieIndex = null;

// Load initial state
function loadState() {
  const savedData = localStorage.getItem("cinemaBookingApp");
  if (savedData) Object.assign(moviesData, JSON.parse(savedData));
  
  renderRooms();

  // Automatically select the first room
  const firstRoom = Object.keys(moviesData)[0];
  if (firstRoom) {
    selectRoom(firstRoom);
  }
}

// Save state
function saveState() {
  localStorage.setItem("cinemaBookingApp", JSON.stringify(moviesData));
}

// Add Room
function addRoom() {
  const roomName = document.getElementById("newRoomName").value.trim();
  if (roomName && !moviesData[roomName]) {
    moviesData[roomName] = [];
    saveState();
    renderRooms();
  }
  document.getElementById("newRoomName").value = "";
}

// Render Rooms
function renderRooms() {
  const roomSelection = document.getElementById("roomSelection");
  roomSelection.innerHTML = "";

  Object.keys(moviesData).forEach((room) => {
    const roomButton = document.createElement("button");
    roomButton.className = `room-btn px-4 py-2 rounded mb-2 ${
      room === selectedRoom ? "bg-blue-500" : "bg-gray-500"
    } text-white`;
    roomButton.textContent = room;
    roomButton.onclick = () => selectRoom(room);
    roomSelection.appendChild(roomButton);
  });
}

// Select Room
function selectRoom(room) {
  selectedRoom = room;
  document.getElementById("movieManagement").classList.remove("hidden");
  document.getElementById("seatMap").classList.add("hidden"); // Hide seat map when room is selected
  renderRooms(); // Re-render rooms to apply the selected style
  renderMovies();
}


// Add Movie
function addMovie() {
  const title = document.getElementById("movieTitle").value.trim();
  const time = document.getElementById("movieTime").value.trim();
  const image = document.getElementById("movieImage").value.trim();

  if (title && time && image && selectedRoom) {
    moviesData[selectedRoom].push({
      title,
      time,
      seats: Array(80).fill(false),
      image,
    });
    saveState();
    renderMovies();
  }

  document.getElementById("movieTitle").value = "";
  document.getElementById("movieTime").value = "";
  document.getElementById("movieImage").value = "";
}

// Render Movies
function renderMovies() {
  const moviesDiv = document.getElementById("movies");
  moviesDiv.innerHTML = "";

  moviesData[selectedRoom].forEach((movie, index) => {
    const movieCard = document.createElement("div");
    movieCard.className = "relative bg-gray-800 text-white p-4 rounded cursor-pointer hover:bg-gray-600 flex flex-col";

    const movieImage = document.createElement("img");
    movieImage.src = movie.image;
    movieImage.alt = movie.title;
    movieImage.className = "w-16 h-24 object-cover mb-2 rounded";

    const totalSeats = movie.seats.length;
    const bookedSeats = movie.seats.filter((seat) => seat).length;
    const freeSeats = totalSeats - bookedSeats;

    const movieInfo = document.createElement("div");
    movieInfo.innerHTML = `
      <strong>${movie.title}</strong><br>
      ${movie.time}<br>
      Total Seats: ${totalSeats}<br>
      Booked Seats: <span class="text-red-500">${bookedSeats}</span><br>
      Free Seats: <span class="text-green-500">${freeSeats}</span>
    `;

    const deleteButton = document.createElement("button");
    deleteButton.className = "ml-auto bg-red-500 px-2 py-1 rounded text-white z-10";
    deleteButton.innerText = "Delete";
    deleteButton.onclick = (event) => {
      event.stopPropagation();
      deleteMovie(index);
    };

    // Hover message
    const hoverMessage = document.createElement("div");
    hoverMessage.className = "absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white text-sm font-bold opacity-0 hover:opacity-100 transition-opacity duration-200 rounded";
    hoverMessage.innerText = "Click to book a chair";

    movieCard.onclick = () => selectMovie(index);
    movieCard.appendChild(movieImage);
    movieCard.appendChild(movieInfo);
    movieCard.appendChild(deleteButton);
    movieCard.appendChild(hoverMessage); // Add the hover message
    moviesDiv.appendChild(movieCard);
  });
}


// Delete Movie
function deleteMovie(index) {
  moviesData[selectedRoom].splice(index, 1);
  saveState();
  renderMovies();
}

// Select Movie and Render Seats
function selectMovie(movieIndex) {
  selectedMovieIndex = movieIndex;
  const movie = moviesData[selectedRoom][movieIndex];
  document.getElementById("movieManagement").classList.add("hidden");
  document.getElementById("seatMap").classList.remove("hidden"); // Show seat map when movie is selected
  document.getElementById("seatInfo").innerHTML = `
    <strong>${movie.title}</strong><br>
    ${movie.time}
  `;
  renderSeats(movie.seats);
}



// Render Seats
function renderSeats(seats) {
  const seatsGrid = document.getElementById("seatsGrid");
  seatsGrid.innerHTML = "";

  seats.forEach((seat, index) => {
    const seatButton = document.createElement("button");
    seatButton.className = `seat ${seat ? "bg-red-500" : "bg-green-500"} text-white w-[10px] h-[10px] rounded`;
    seatButton.innerText = index + 1;

    seatButton.onclick = () => {
      if (!seat) {
        seats[index] = true; // Book the seat
      } else {
        seats[index] = false; // Unbook the seat if clicked again
      }
      saveState();
      renderSeats(seats); // Refresh seat rendering
    };

    seatsGrid.appendChild(seatButton);
  });

  // Update seat information
  updateSeatInfo(seats);
}

// Update Seat Information
function updateSeatInfo(seats) {
  const totalSeats = seats.length;
  const bookedSeats = seats.filter(seat => seat).length;
  const freeSeats = totalSeats - bookedSeats;

  document.getElementById("seatInfo").innerHTML = `
    <strong>${moviesData[selectedRoom][selectedMovieIndex].title}</strong><br>
    Time: ${moviesData[selectedRoom][selectedMovieIndex].time}<br>
    Total Seats: ${totalSeats}<br>
    Booked Seats: <span class="text-red-500">${bookedSeats}</span><br>
    Free Seats: <span class="text-green-500">${freeSeats}</span>
  `;
}



// Go Back
function goBack() {
  selectedMovieIndex = null;
  document.getElementById("seatMap").classList.add("hidden");
  document.getElementById("movieManagement").classList.remove("hidden");
  renderMovies();
}

// Load initial state
loadState();
