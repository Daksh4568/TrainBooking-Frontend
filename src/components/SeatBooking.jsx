// import { useState, useEffect } from "react";
// import axios from "axios";

// const SeatBooking = () => {
//   const totalSeats = 80;
//   const [bookedSeats, setBookedSeats] = useState([]);

//   // Fetch booked seats from API
//   useEffect(() => {
//     const fetchBookedSeats = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.error("No token found");
//         return;
//       }

//       try {
//         const response = await axios.get("http://localhost:5000/api/seats/", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (
//           response.status === 200 &&
//           Array.isArray(response.data.bookedSeats)
//         ) {
//           setBookedSeats(response.data.bookedSeats); // Store seat names directly
//         } else {
//           console.error("Unexpected API response:", response.data);
//         }
//       } catch (error) {
//         console.error(
//           "Error fetching booked seats:",
//           error.response?.data || error.message
//         );
//       }
//     };

//     fetchBookedSeats();
//   }, []);

//   // Handle seat booking request
//   const handleBookSeats = async (event) => {
//     event.preventDefault();
//     const numSeats = parseInt(event.target.seats.value, 10);
//     if (isNaN(numSeats) || numSeats < 1 || numSeats > 7) return;

//     const token = localStorage.getItem("token");
//     if (!token) {
//       console.error("No token found. Please log in.");
//       return;
//     }

//     try {
//       const response = await axios.patch(
//         "http://localhost:5000/api/seats/book",
//         { seats: numSeats },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (response.status === 200 && Array.isArray(response.data)) {
//         setBookedSeats(response.data); // Store seat names directly
//       } else {
//         console.error("Unexpected API response:", response.data);
//       }
//     } catch (error) {
//       console.error(
//         "Error booking seats:",
//         error.response?.data || error.message
//       );
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-200">
//       <div className="bg-white p-6 rounded-lg shadow-md w-2/3 flex flex-col md:flex-row">
//         <div className="flex-1">
//           <h2 className="text-xl font-bold text-center mb-4">Ticket Booking</h2>
//           <div className="grid grid-cols-7 gap-2">
//             {Array.from(
//               { length: totalSeats },
//               (_, i) => `Row ${Math.floor(i / 7) + 1} Seat ${(i % 7) + 1}`
//             ).map((seat) => (
//               <div
//                 key={seat}
//                 className={`w-20 h-10 flex items-center justify-center rounded-md text-white font-bold transition ${
//                   bookedSeats.includes(seat) ? "bg-red-500" : "bg-green-500"
//                 }`}
//               >
//                 {seat}
//               </div>
//             ))}
//           </div>
//           <div className="flex justify-between mt-4 p-2">
//             <span className="bg-yellow-500 px-3 py-1 rounded text-white">
//               Booked Seats: {bookedSeats.length}
//             </span>
//             <span className="bg-green-500 px-3 py-1 rounded text-white">
//               Available Seats: {totalSeats - bookedSeats.length}
//             </span>
//           </div>
//         </div>
//         <div className="flex-1 flex flex-col items-center justify-center">
//           <h3 className="text-lg font-bold mb-2">Book Seats</h3>
//           <form onSubmit={handleBookSeats} className="flex space-x-2">
//             <input
//               type="number"
//               name="seats"
//               placeholder="Enter number of seats (1-7)"
//               min="1"
//               max="7"
//               className="border rounded px-2 py-1"
//             />
//             <button
//               type="submit"
//               className="bg-blue-500 text-white px-4 py-1 rounded"
//             >
//               Book
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SeatBooking;
import { useState, useEffect } from "react";
import axios from "axios";

const SeatBooking = () => {
  const [totalSeats, setTotalSeats] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [availableSeats, setAvailableSeats] = useState(null);

  // Fetch seats data from API
  const fetchSeatsData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/api/seats/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (
        response.status === 200 &&
        typeof response.data.totalAvailableSeats === "number" &&
        Array.isArray(response.data.seats)
      ) {
        const totalSeats = response.data.seats.length; // Total seats from API
        const bookedSeats = response.data.seats.slice(
          0,
          totalSeats - response.data.totalAvailableSeats
        ); // First N seats are booked

        setTotalSeats(totalSeats);
        setBookedSeats(bookedSeats);
        setAvailableSeats(response.data.totalAvailableSeats);
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

  // Handle seat booking request
  const handleBookSeats = async (event) => {
    event.preventDefault();
    const numSeats = parseInt(event.target.seats.value, 10);
    if (isNaN(numSeats) || numSeats < 1 || numSeats > 7) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    try {
      const response = await axios.patch(
        "http://localhost:5000/api/seats/book",
        { seats: numSeats },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200 && Array.isArray(response.data)) {
        setBookedSeats(response.data); // Update booked seats list
        setAvailableSeats(totalSeats - response.data.length); // Update available seats
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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="bg-white p-6 rounded-lg shadow-md w-2/3 flex flex-col md:flex-row">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-center mb-4">Ticket Booking</h2>

          {/* Seat Grid */}
          <div className="grid grid-cols-7 gap-2">
            {totalSeats &&
              bookedSeats &&
              Array.from(
                { length: totalSeats },
                (_, i) => `Row ${Math.floor(i / 7) + 1} Seat ${(i % 7) + 1}`
              ).map((seat) => (
                <div
                  key={seat}
                  className={`w-20 h-10 flex items-center justify-center rounded-md text-white font-bold transition ${
                    bookedSeats.includes(seat) ? "bg-red-500" : "bg-green-500"
                  }`}
                >
                  {seat}
                </div>
              ))}
          </div>

          {/* Booking Status */}
          <div className="flex justify-between mt-4 p-2">
            <span className="bg-yellow-500 px-3 py-1 rounded text-white">
              Booked Seats: {bookedSeats.length}
            </span>
            <span className="bg-green-500 px-3 py-1 rounded text-white">
              Available Seats:{" "}
              {availableSeats !== null ? availableSeats : "Loading..."}
            </span>
          </div>
        </div>

        {/* Booking Form */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <h3 className="text-lg font-bold mb-2">Book Seats</h3>
          <form onSubmit={handleBookSeats} className="flex space-x-2">
            <input
              type="number"
              name="seats"
              placeholder="Enter number of seats (1-7)"
              min="1"
              max="7"
              className="border rounded px-2 py-1"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-1 rounded"
            >
              Book
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SeatBooking;
