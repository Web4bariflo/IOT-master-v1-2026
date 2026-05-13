// import React from "react";
// import { useLocation } from "react-router-dom";
// import Feeding from "./devices/Feeding";
// import FeedI from "./devices/FeedI";

// const FeedingModule = (props) => {
//   const location = useLocation();
  
//   // Priority: props -> location state -> empty
//   // const pondId = props.pondId || location.state?.pondId;
//   const pondName = props.pondName || location.state?.pondName || "Unknown Pond";

//   return (
//     <>
//       <div className=" p-6">
//         <h2 className="text-lg font-semibold mb-4">{pondName}</h2>
//         <div className="flex gap-4 items-center text-sm text-gray-500 p-4">
//           <div className="flex gap-2 items-center">
//             <label>Worker Name:</label>
//             <input type="text" className="border rounded px-1 py-2" placeholder="Enter Worker Name:"/>
//           </div>
//               <div className="flex gap-2 items-center">
//             <label>Mobile no.:</label>
//             <input type="tel" className="border rounded px-1 py-2" placeholder="Enter Mobile no."/>
//           </div>
//              <button
//        className="bg-green-600 px-2 py-1 rounded-md text-white hover:bg-green-700"
//        >
//         Assign
//         </button>
//         </div>

//         {/* FEEDING */}
//         <div className=" mb-6">
//           <Feeding/>
//         </div>

//         {/* FARM I */}
//         <div className="">
//           <FeedI />
//         </div>
//       </div>
//     </>
//   );
// };

// export default FeedingModule;


// import React, { useState } from "react";
// import { useLocation } from "react-router-dom";
// import Feeding from "./devices/Feeding";
// import FeedI from "./devices/FeedI";
// // import { addWorker } from "../api/workerApi"; // ✅ import your API
// import {addWorker} from "../../hooks/useFeedingModuleData"
// import { useParams } from "react-router-dom";

// const FeedingModule = (props) => {
//   const location = useLocation();

//   const pondId = props.pondId || location.state?.pondId;
//   const pondName = props.pondName || location.state?.pondName || "Unknown Pond";

//   // ✅ STATE
//   const [workerName, setWorkerName] = useState("");
//   const [mobileNo, setMobileNo] = useState("");

//   // ✅ HANDLE ASSIGN
//   const handleAssign = async () => {
//     if (!workerName || !mobileNo) {
//       alert("Please enter name and mobile number");
//       return;
//     }

//     try {
//       await addWorker({
//         name: workerName,
//         mobno: mobileNo,
//         pond_id: pondId,
//       });

//       alert("Worker added successfully");

//       // clear inputs
//       setWorkerName("");
//       setMobileNo("");

//     } catch (err) {
//       const msg =
//         err.response?.data?.non_field_errors?.[0] ||
//         "Failed to add worker";

//       alert(msg);
//     }
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-lg font-semibold mb-4">{pondName}</h2>

//       {/* ✅ INPUT SECTION */}
//       <div className="flex gap-4 items-center text-sm text-gray-500 p-4">
        
//         <div className="flex gap-2 items-center">
//           <label>Worker Name:</label>
//           <input
//             type="text"
//             className="border rounded px-2 py-2"
//             placeholder="Enter Worker Name"
//             value={workerName}
//             onChange={(e) => setWorkerName(e.target.value)}
//           />
//         </div>

//         <div className="flex gap-2 items-center">
//           <label>Mobile no.:</label>
//           <input
//             type="tel"
//             className="border rounded px-2 py-2"
//             placeholder="Enter Mobile no."
//             value={mobileNo}
//             onChange={(e) => setMobileNo(e.target.value)}
//           />
//         </div>

//         <button
//           onClick={handleAssign}
//           className="bg-green-600 px-3 py-2 rounded-md text-white hover:bg-green-700"
//         >
//           Assign
//         </button>
//       </div>

//       {/* FEEDING */}
//       <div className="mb-6">
//         <Feeding />
//       </div>

//       {/* FARM I */}
//       <div>
//         <FeedI />
//       </div>
//     </div>
//   );
// };

// export default FeedingModule;

import React, { useState } from "react";
import { useParams } from "react-router-dom"; // ✅ FIX
import Feeding from "./devices/Feeding";
import FeedI from "./devices/FeedI";
import { addWorker } from "../../hooks/useFeedingModuleData";

const FeedingModule = (props) => {
  // ✅ GET pondId FROM URL
  const { pondId } = useParams();

  const pondName = props.pondName || "Unknown Pond";

  // ✅ STATE
  const [workerName, setWorkerName] = useState("");
  const [mobileNo, setMobileNo] = useState("");

  // ✅ HANDLE ASSIGN
  const handleAssign = async () => {
    if (!workerName || !mobileNo) {
      alert("Please enter name and mobile number");
      return;
    }

    try {
      await addWorker({
        name: workerName,
        mobno: mobileNo,
        pond_id: Number(pondId), // ✅ ensure number
      });

      alert("Worker added successfully");

      setWorkerName("");
      setMobileNo("");

    } catch (err) {
      const msg =
        err.response?.data?.non_field_errors?.[0] ||
        "Failed to add worker";

      alert(msg);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">
        {pondName}
      </h2>

      {/* INPUT SECTION */}
      <div className="flex gap-4 items-center text-sm text-gray-500 p-4">
        
        <div className="flex gap-2 items-center">
          <label>Worker Name:</label>
          <input
            type="text"
            className="border rounded px-2 py-2"
            placeholder="Enter Worker Name"
            value={workerName}
            onChange={(e) => setWorkerName(e.target.value)}
          />
        </div>

        <div className="flex gap-2 items-center">
          <label>Mobile no.:</label>
          <input
            type="tel"
            className="border rounded px-2 py-2"
            placeholder="Enter Mobile no."
            value={mobileNo}
            onChange={(e) => setMobileNo(e.target.value)}
          />
        </div>

        <button
          onClick={handleAssign}
          className="bg-green-600 px-3 py-2 rounded-md text-white hover:bg-green-700"
        >
          Assign
        </button>
      </div>

      {/* FEEDING */}
      <div className="mb-6">
        <Feeding />
      </div>

      {/* FARM I */}
      <div>
        <FeedI />
      </div>
    </div>
  );
};

export default FeedingModule;