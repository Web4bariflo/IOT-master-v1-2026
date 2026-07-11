// import React, { useState, useEffect } from "react";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const ManagerSidebar = () => {
//   const [ponds, setPonds] = useState([]);
//   const [search, setSearch] = useState("");
//   const [showFilterPonds, setShowFilterPonds] = useState(false);

//   // ✅ ACTIVE POND STATE
//   const [activePond, setActivePond] = useState(() => {
//     const saved = localStorage.getItem("activePond");
//     return saved ? Number(saved) : null;
//   });

//   const navigate = useNavigate();
//   const BASEURL = process.env.REACT_APP_IP;
//   const clusterId = JSON.parse(localStorage.getItem("auth"))?.cluster
//     ?.clusters?.[0]?.id;
//   // console.log("Cluster ID from localStorage:", clusterId);
//   /* ===== FETCH PONDS ===== */
//   useEffect(() => {
//     if (!clusterId) {
//       console.error("Cluster ID not available");
//       return;
//     }
//     const fetchPonds = async () => {
//       try {
//         const response = await axios.get(`${BASEURL}/userponds/${clusterId}/`);
//         const sortedPonds = (response.data.ponds || []).sort((a, b) =>
//           a.name.localeCompare(b.name, undefined, {
//             numeric: true,
//             sensitivity: "base",
//           }),
//         );
//         setPonds(sortedPonds);
//       } catch (error) {
//         console.error("Failed to fetch ponds", error);
//       }
//     };

//     fetchPonds();
//   }, [BASEURL]);

//   /* ===== FILTER ===== */
//   const filteredPonds = ponds.filter((pond) =>
//     pond.name.toLowerCase().includes(search.toLowerCase()),
//   );

//   /* ===== POND CLICK ===== */
//   const handlePondClick = (pondId) => {
//     setActivePond(pondId); // UI update
//     localStorage.setItem("activePond", pondId); // persist
//   };

//   /* ===== GENERATE ===== */
//   const handleGenerate = () => {
//     if (!activePond) {
//       alert("Please select a pond first");
//       return;
//     }

//     const pond = ponds.find((p) => p.id === activePond);

//     navigate(`/manager/pond-module/${activePond}`, {
//       state: { pondName: pond?.name },
//     });
//   };

//   return (
//     <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
//       {/* ===== SEARCH ===== */}
//       <div className="p-4 border-b">
//         <div className="relative">
//           <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
//           <input
//             type="text"
//             placeholder="Search pond"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//           />
//         </div>
//       </div>

//       {/* ===== POND LIST ===== */}
//       <nav className="flex-1 px-2 py-3 overflow-y-auto">
//         {filteredPonds.map((pond) => (
//           <button
//             key={pond.id}
//             onClick={() => handlePondClick(pond.id)}
//             className={`w-full flex items-center gap-3 px-3 py-2.5 mb-1 rounded-md text-sm font-medium transition
//               ${
//                 activePond === pond.id
//                   ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
//                   : "text-gray-700 hover:bg-gray-50"
//               }
//             `}
//           >
//             <i className="bi bi-water text-base" />
//             <span>{pond.name}</span>
//           </button>
//         ))}

//         {/* ===== FILTER TOGGLE ===== */}
//         <button
//           onClick={() => setShowFilterPonds(!showFilterPonds)}
//           className="w-full flex items-center gap-3 px-3 py-2.5 mt-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
//         >
//           <i className="bi bi-funnel" />
//           Filters
//           <i
//             className={`bi bi-chevron-${showFilterPonds ? "up" : "down"} ml-auto text-xs`}
//           />
//         </button>

//         {/* ===== GENERATE ===== */}
//         <button
//           className="w-full mt-3 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
//           onClick={handleGenerate}
//         >
//           Generate
//         </button>
//       </nav>
//     </aside>
//   );
// };

// export default ManagerSidebar;


// import React, { useState, useEffect } from "react";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const ManagerSidebar = () => {
//   const [ponds, setPonds] = useState([]);
//   const [search, setSearch] = useState("");
//   const [showFilterPonds, setShowFilterPonds] = useState(false);

//   // ✅ ACTIVE POND STATE
//   const [activePond, setActivePond] = useState(() => {
//     const saved = localStorage.getItem("activePond");
//     return saved ? Number(saved) : null;
//   });

//   const navigate = useNavigate();
//   const BASEURL = process.env.REACT_APP_IP;
//   const clusterId = JSON.parse(localStorage.getItem("auth"))?.cluster
//     ?.clusters?.[0]?.id;
//   // console.log("Cluster ID from localStorage:", clusterId);
//   /* ===== FETCH PONDS ===== */
//   useEffect(() => {
//     if (!clusterId) {
//       console.error("Cluster ID not available");
//       return;
//     }
//     const fetchPonds = async () => {
//       try {
//         const response = await axios.get(`${BASEURL}/userponds/${clusterId}/`);
//         const sortedPonds = (response.data.ponds || []).sort((a, b) =>
//           a.name.localeCompare(b.name, undefined, {
//             numeric: true,
//             sensitivity: "base",
//           }),
//         );
//         setPonds(sortedPonds);
        
//         // Ensure map has initial pond location
//         const currentActiveId = Number(localStorage.getItem("activePond"));
//         // const initialPond = sortedPonds.find(p => p.id === currentActiveId) || sortedPonds[0];
//         // if (initialPond && initialPond.location) {
//         //     localStorage.setItem("activePondLocation", JSON.stringify(initialPond.location));
//         //     window.dispatchEvent(new Event("pondChanged"));
//         // }
//         const initialPond = sortedPonds.find(p => p.id === currentActiveId) || sortedPonds[0];

// if (initialPond) {
//     // ✅ store location
//     if (initialPond.location) {
//         localStorage.setItem("activePondLocation", JSON.stringify(initialPond.location));
//     }

//     // ✅ ADD THIS (timezone)
//     if (initialPond.timezone) {
//         localStorage.setItem("activePondTimezone", initialPond.timezone);
//     }

//     window.dispatchEvent(new Event("pondChanged"));
// }
//       } catch (error) {
//         console.error("Failed to fetch ponds", error);
//       }
//     };

//     fetchPonds();
//   }, [BASEURL]);

//   /* ===== FILTER ===== */
//   const filteredPonds = ponds.filter((pond) =>
//     pond.name.toLowerCase().includes(search.toLowerCase()),
//   );

//   /* ===== POND CLICK ===== */
// //  const handlePondClick = (pondId) => {
// //   setActivePond(pondId);

// //   const pond = ponds.find((p) => p.id === pondId); // 👈 get full pond

// //   localStorage.setItem("activePond", pondId);
// //   localStorage.setItem("activePondName", pond?.name); 
  
// //   if (pond && pond.location) {
// //       localStorage.setItem("activePondLocation", JSON.stringify(pond.location));
// //   } else {
// //       localStorage.removeItem("activePondLocation");
// //   }
// //   window.dispatchEvent(new Event("pondChanged"));
// // };

// const handlePondClick = (pondId) => {
//   setActivePond(pondId);

//   const pond = ponds.find((p) => p.id === pondId);

//   localStorage.setItem("activePond", pondId);
//   localStorage.setItem("activePondName", pond?.name);

//   // ✅ STORE LOCATION
//   if (pond && pond.location) {
//     localStorage.setItem("activePondLocation", JSON.stringify(pond.location));
//   } else {
//     localStorage.removeItem("activePondLocation");
//   }

//   // ✅ STORE TIMEZONE (ADD THIS)
//   if (pond && pond.timezone) {
//     localStorage.setItem("activePondTimezone", pond.timezone);
//   } else {
//     localStorage.removeItem("activePondTimezone");
//   }

//   window.dispatchEvent(new Event("pondChanged"));
// };

//   /* ===== GENERATE ===== */
//   const handleGenerate = () => {
//     if (!activePond) {
//       alert("Please select a pond first");
//       return;
//     }

//     const pond = ponds.find((p) => p.id === activePond);

//     navigate(`/manager/pond-module/${activePond}`, {
//       state: { pondName: pond?.name },
//     });
//   };

//   return (
//     <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
//       {/* ===== SEARCH ===== */}
//       <div className="p-4 border-b">
//         <div className="relative">
//           <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
//           <input
//             type="text"
//             placeholder="Search pond"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//           />
//         </div>
//       </div>

//       {/* ===== POND LIST ===== */}
//       <nav className="flex-1 px-2 py-3 overflow-y-auto">
//         {/* {filteredPonds.map((pond) => (
//           <button
//             key={pond.id}
//             onClick={() => handlePondClick(pond.id)}
//             className={`w-full flex items-center gap-3 px-3 py-2.5 mb-1 rounded-md text-sm font-medium transition
//               ${
//                 activePond === pond.id
//                   ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
//                   : "text-gray-700 hover:bg-gray-50"
//               }
//             `}
//           >
//             <i className="bi bi-water text-base" />
//             <span>{pond.name}</span>
//           </button>
//         ))} */}
//         {filteredPonds.map((pond) => (
//   <div key={pond.id}>
    
//     {/* Pond Button */}
//     <button
//       onClick={() => handlePondClick(pond.id)}
//       className={`w-full flex items-center justify-between px-3 py-2.5 mb-1 rounded-md text-sm font-medium transition
//         ${
//           activePond === pond.id
//             ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
//             : "text-gray-700 hover:bg-gray-50"
//         }
//       `}
//     >
//       <div className="flex items-center gap-3">
//         <i className="bi bi-water text-base" />
//         <span>{pond.name}</span>
//       </div>
//     </button>

//     {/* ✅ Show Schedule Button ONLY for selected pond */}
//     {activePond === pond.id && (
//       <button
//         className="w-full mb-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
//         onClick={() => handleGenerate()}
//       >
//         Schedule
//       </button>
//     )}
//   </div>
// ))}

//         {/* ===== FILTER TOGGLE ===== */}
//         <button
//           onClick={() => setShowFilterPonds(!showFilterPonds)}
//           className="w-full flex items-center gap-3 px-3 py-2.5 mt-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
//         >
//           <i className="bi bi-funnel" />
//           Filters
//           <i
//             className={`bi bi-chevron-${showFilterPonds ? "up" : "down"} ml-auto text-xs`}
//           />
//         </button>

//         {/* ===== GENERATE ===== */}
//         {/* <button
//           className="w-full mt-3 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
//           onClick={handleGenerate}
//         >
//           Generate
//         </button> */}
//       </nav>
//     </aside>
//   );
// };

// export default ManagerSidebar;


import React, { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManagerSidebar = () => {
  const [ponds, setPonds] = useState([]);
  const [search, setSearch] = useState("");
  const [showFilterPonds, setShowFilterPonds] = useState(false);

  // ✅ ACTIVE POND STATE
  const [activePond, setActivePond] = useState(() => {
    const saved = localStorage.getItem("activePond");
    return saved ? Number(saved) : null;
  });

  const navigate = useNavigate();
  const BASEURL = process.env.REACT_APP_IP;
  const clusterId = JSON.parse(localStorage.getItem("auth"))?.cluster
    ?.clusters?.[0]?.id;
  // console.log("Cluster ID from localStorage:", clusterId);
  /* ===== FETCH PONDS ===== */
  useEffect(() => {
    if (!clusterId) {
      console.error("Cluster ID not available");
      return;
    }
    const fetchPonds = async () => {
      try {
        const response = await axios.get(`${BASEURL}/userponds/${clusterId}/`);
        const sortedPonds = (response.data.ponds || []).sort((a, b) =>
          a.name.localeCompare(b.name, undefined, {
            numeric: true,
            sensitivity: "base",
          }),
        );
        setPonds(sortedPonds);
        
        // Ensure map has initial pond location
        const currentActiveId = Number(localStorage.getItem("activePond"));
        // const initialPond = sortedPonds.find(p => p.id === currentActiveId) || sortedPonds[0];
        // if (initialPond && initialPond.location) {
        //     localStorage.setItem("activePondLocation", JSON.stringify(initialPond.location));
        //     window.dispatchEvent(new Event("pondChanged"));
        // }
        const initialPond = sortedPonds.find(p => p.id === currentActiveId) || sortedPonds[0];

if (initialPond) {
    // ✅ store location
    if (initialPond.location) {
        localStorage.setItem("activePondLocation", JSON.stringify(initialPond.location));
    }

    // ✅ ADD THIS (timezone)
    if (initialPond.timezone) {
        localStorage.setItem("activePondTimezone", initialPond.timezone);
    }

    window.dispatchEvent(new Event("pondChanged"));
}
      } catch (error) {
        console.error("Failed to fetch ponds", error);
      }
    };

    fetchPonds();
  }, [BASEURL]);

  /* ===== FILTER ===== */
  const filteredPonds = ponds.filter((pond) =>
    pond.name.toLowerCase().includes(search.toLowerCase()),
  );

  /* ===== POND CLICK ===== */
//  const handlePondClick = (pondId) => {
//   setActivePond(pondId);

//   const pond = ponds.find((p) => p.id === pondId); // 👈 get full pond

//   localStorage.setItem("activePond", pondId);
//   localStorage.setItem("activePondName", pond?.name); 
  
//   if (pond && pond.location) {
//       localStorage.setItem("activePondLocation", JSON.stringify(pond.location));
//   } else {
//       localStorage.removeItem("activePondLocation");
//   }
//   window.dispatchEvent(new Event("pondChanged"));
// };

const handlePondClick = (pondId) => {
  setActivePond(pondId);

  const pond = ponds.find((p) => p.id === pondId);

  localStorage.setItem("activePond", pondId);
  localStorage.setItem("activePondName", pond?.name);

  // ✅ STORE LOCATION
  if (pond && pond.location) {
    localStorage.setItem("activePondLocation", JSON.stringify(pond.location));
  } else {
    localStorage.removeItem("activePondLocation");
  }

  // ✅ STORE TIMEZONE (ADD THIS)
  if (pond && pond.timezone) {
    localStorage.setItem("activePondTimezone", pond.timezone);
  } else {
    localStorage.removeItem("activePondTimezone");
  }

  window.dispatchEvent(new Event("pondChanged"));
};

  /* ===== GENERATE ===== */
  const handleGenerate = () => {
    if (!activePond) {
      toast.warn("Please select a pond first"); 
      return;
    }

    const pond = ponds.find((p) => p.id === activePond);

    navigate(`/manager/pond-module/${activePond}`, {
      state: { pondName: pond?.name },
    });
  };

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* ===== SEARCH ===== */}
      <div className="p-4 border-b">
        <div className="relative">
          <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search pond"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* ===== POND LIST ===== */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto">
        {/* {filteredPonds.map((pond) => (
          <button
            key={pond.id}
            onClick={() => handlePondClick(pond.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 mb-1 rounded-md text-sm font-medium transition
              ${
                activePond === pond.id
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }
            `}
          >
            <i className="bi bi-water text-base" />
            <span>{pond.name}</span>
          </button>
        ))} */}
        {filteredPonds.map((pond) => (
  <div key={pond.id}>
    
    {/* Pond Button */}
    <button
      onClick={() => handlePondClick(pond.id)}
      className={`w-full flex items-center justify-between px-3 py-2.5 mb-1 rounded-md text-sm font-medium transition
        ${
          activePond === pond.id
            ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
            : "text-gray-700 hover:bg-gray-50"
        }
      `}
    >
      <div className="flex items-center gap-3">
        <i className="bi bi-water text-base" />
        <span>{pond.name}</span>
      </div>
    </button>

    {/* ✅ Show Schedule Button ONLY for selected pond */}
    {activePond === pond.id && (
      <button
        className="w-full mb-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        onClick={() => handleGenerate()}
      >
        Schedule
      </button>
    )}
  </div>
))}

        {/* ===== FILTER TOGGLE ===== */}
        <button
          onClick={() => setShowFilterPonds(!showFilterPonds)}
          className="w-full flex items-center gap-3 px-3 py-2.5 mt-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <i className="bi bi-funnel" />
          Filters
          <i
            className={`bi bi-chevron-${showFilterPonds ? "up" : "down"} ml-auto text-xs`}
          />
        </button>

        {/* ===== GENERATE ===== */}
        {/* <button
          className="w-full mt-3 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          onClick={handleGenerate}
        >
          Generate
        </button> */}
      </nav>
    </aside>
  );
};

export default ManagerSidebar;
