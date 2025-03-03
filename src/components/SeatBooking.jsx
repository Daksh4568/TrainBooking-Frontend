import { useState, useEffect } from "react";
import axios from "axios";
//Seat Booking frontend code
const SeatBooking = () => {
  const [totalSeats, setTotalSeats] = useState(80);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [availableSeats, setAvailableSeats] = useState(80);

  // Fetch seat data from API
  const fetchSeatsData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await axios.get(
        "https://trainbooking-fg34.onrender.com/api/seats",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // console.log("Fetched seats data:", response.data); // Debugging

      if (response.status === 200 && Array.isArray(response.data.seats)) {
        const bookedSeatsList = response.data.seats
          .filter((seat) => seat.isBooked)
          .map((seat) => `${seat.rowNumber}-${seat.seatNo}`); // Create unique identifier

        // console.log("Unique boosked seats list:", bookedSeatsList); // Debugging

        setBookedSeats(bookedSeatsList);
        setTotalSeats(response.data.seats.length);
        setAvailableSeats(response.data.seats.length - bookedSeatsList.length);
      } else {
        console.error("Unexpected API response:", response.data);
      }
    } catch (error) {
      console.error(
        "Error fetching seat data:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchSeatsData();
  }, []);

  const handleBookSeats = async (event) => {
    event.preventDefault();
    const numSeats = parseInt(event.target.seats.value, 10);

    if (isNaN(numSeats) || numSeats < 1 || numSeats > 7) {
      alert("Please enter a valid number of seats (1-7).");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    try {
      const response = await axios.patch(
        "https://trainbooking-fg34.onrender.com/api/seats/book",
        { seats: numSeats },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200 && Array.isArray(response.data)) {
        const newBookedSeats = response.data.map((seat) => Number(seat));

        setBookedSeats((prevBookedSeats) => [
          ...prevBookedSeats,
          ...newBookedSeats,
        ]);
        setAvailableSeats(
          (prevAvailable) => prevAvailable - newBookedSeats.length
        );

        setTimeout(fetchSeatsData, 1000); // Fetch fresh seat data after a delay
      } else {
        console.error("Unexpected API response:", response.data);
      }
    } catch (error) {
      console.error(
        "Error booking seats:",
        error.response?.data || error.message
      );
    }
  };

  const handleResetBookings = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    try {
      const response = await axios.patch(
        "https://trainbooking-fg34.onrender.com/api/seats/reset",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setBookedSeats([]);
        setAvailableSeats(totalSeats);
        fetchSeatsData();
        alert("Seats Reset successfully");
      } else {
        console.error("Unexpected API response:", response.data);
      }
    } catch (error) {
      console.error(
        "Error resetting bookings:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="bg-white p-6 rounded-lg shadow-md w-full flex flex-col md:flex-row">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-center mb-4">Ticket Booking</h2>

          {/* Seat Grid */}
          {/* Seat Grid */}
          <div className="grid grid-cols-7 gap-2">
            {totalSeats &&
              Array.from({ length: totalSeats }, (_, i) => {
                const row = Math.floor(i / 7) + 1; // Calculate row number
                const seat = (i % 7) + 1; // Seat number in that row
                const uniqueId = `${row}-${seat}`; // Unique seat ID

                return (
                  <div
                    key={uniqueId}
                    className={`w-20 h-10 gap-2 flex items-center justify-center rounded-md text-white font-bold transition ${
                      bookedSeats.includes(uniqueId)
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                  >
                    {`Row ${row} - Seat ${seat}`}
                  </div>
                );
              })}
          </div>

          {/* Booking Status */}
          <div className="flex justify-between mt-4 p-2">
            <span className="bg-yellow-500 px-3 py-1 rounded text-white">
              Booked Seats: {bookedSeats.length}
            </span>
            <span className="bg-green-500 px-3 py-1 rounded text-white">
              Available Seats: {availableSeats}
            </span>
          </div>
        </div>

        {/* Booking Form */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <h3 className="text-lg font-bold mb-2">Book Seats</h3>
          <form onSubmit={handleBookSeats} className="grid grid-cols-2 gap-2">
            <input
              type="number"
              name="seats"
              placeholder="Enter number of seats (1-7)"
              min="1"
              max="7"
              className="border rounded px-2 py-1 col-span-2"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-1 rounded col-span-2"
            >
              Book
            </button>
            <button
              type="button"
              onClick={handleResetBookings}
              className="bg-red-500 text-white px-4 py-1 rounded col-span-2"
            >
              Reset Booking
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SeatBooking;
