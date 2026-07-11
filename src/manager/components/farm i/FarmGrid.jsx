// import { useState } from "react";
// import FarmCard from "./FarmCard";
// import CheckTrayActive from "../../../assets/Images/checktrayActive.png";
// import { useFarmingData } from "../../hooks/useFarmingData";

// const FarmGrid = ({ applyAll }) => {
//   const [view, setView] = useState("grid");

//    const pondId = Number(localStorage.getItem("activePond"));

//    const { tasks } = useFarmingData(pondId);

//   return (
//     <div className="border rounded-lg p-3 bg-white space-y-3">
//       {/* HEADER */}
//       <div className="flex justify-between items-center">
//         <h3 className="text-sm font-semibold text-gray-800">Feeders</h3>

//         {/* ICON TOGGLE */}
//         <div className="">
//           <button
//             onClick={() => setView("grid")}
//             className={`p-1.5 rounded ${
//               view === "grid" ? "bg-white shadow text-blue-600" : "text-gray-500"
//             }`}
//           >
//             <i className="bi bi-grid-3x3-gap text-sm" />
//           </button>

//           <button
//             onClick={() => setView("list")}
//             className={`p-1.5 rounded ${
//               view === "list" ? "bg-white shadow text-blue-600" : "text-gray-500"
//             }`}
//           >
//             <i className="bi bi-list-ul text-sm" />
//           </button>
//         </div>
//       </div>

//       <div className={`grid ${view === "grid" ? "grid-cols-2" : "grid-cols-1"} gap-4`}>
//         {tasks.map((task) => (
//           <FarmCard
//             key={task.id}
//             task={task}
//             feederImage={CheckTrayActive}
//           />
//         ))}
//       </div>

//     </div>
//   );
// };

// export default FarmGrid;


// import { useState } from "react";
// import FarmCard from "./FarmCard";
// import CheckTrayActive from "../../../assets/Images/checktrayActive.png";
// import { useFarmingData } from "../../hooks/useFarmingData";

// const FarmGrid = ({ applyAll }) => {
//   const [view, setView] = useState("grid");

//    const pondId = Number(localStorage.getItem("activePond"));

//    const { tasks } = useFarmingData(pondId);

//   return (
//     <div className="border rounded-lg p-3 bg-white space-y-3">
//       {/* HEADER */}
//       <div className="flex justify-between items-center">
//         <h3 className="text-sm font-semibold text-gray-800">Feeders</h3>

//         {/* ICON TOGGLE */}
//         <div className="">
//           <button
//             onClick={() => setView("grid")}
//             className={`p-1.5 rounded ${
//               view === "grid" ? "bg-white shadow text-blue-600" : "text-gray-500"
//             }`}
//           >
//             <i className="bi bi-grid-3x3-gap text-sm" />
//           </button>

//           <button
//             onClick={() => setView("list")}
//             className={`p-1.5 rounded ${
//               view === "list" ? "bg-white shadow text-blue-600" : "text-gray-500"
//             }`}
//           >
//             <i className="bi bi-list-ul text-sm" />
//           </button>
//         </div>
//       </div>

//       <div className={`grid ${view === "grid" ? "grid-cols-2" : "grid-cols-1"} gap-4`}>
//         {tasks.map((task) => (
//           <FarmCard
//             key={task.id}
//             task={task}
//             feederImage={CheckTrayActive}
//           />
//         ))}
//       </div>

//     </div>
//   );
// };

// export default FarmGrid;

import { useState ,useEffect} from "react";
import FarmCard from "./FarmCard";
import CheckTrayActive from "../../../assets/Images/checktrayActive.png";
import { useFarmingData } from "../../hooks/useFarmingData";

const FarmGrid = ({ applyAll }) => {
  const [view, setView] = useState("grid");

  // const pondId = Number(localStorage.getItem("activePond"));

  
    const [pondId, setPondId] = useState(
    Number(localStorage.getItem("activePond"))
  );
  
  useEffect(() => {
    const handlePondChange = () => {
      setPondId(Number(localStorage.getItem("activePond")));
    };
  
    window.addEventListener("pondChanged", handlePondChange);
  
    return () =>
      window.removeEventListener("pondChanged", handlePondChange);
  }, []);

  const { tasks, devices, loading } = useFarmingData(pondId);

  if (loading) {
  return (
    <div className="p-4 text-sm text-gray-500">
      Loading checktray...
    </div>
  );
}

  // Ensure `devices` and `tasks` are arrays before using array methods
  const devicesArr = Array.isArray(devices)
    ? devices
    : devices && typeof devices === "object"
    ? Object.values(devices)
    : [];

  const tasksArr = Array.isArray(tasks) ? tasks : [];

  // Use tasks if available, otherwise create placeholder tasks from devices
  const displayTasks = devicesArr.map((device) => {
    const task = tasksArr.find((t) => t.device_id === device.device_id || t.device_id === device.id || t.id === device.device_id);

//     if (loading) {
//   return (
//     <div className="p-4 text-sm text-gray-500">
//       Loading  checktray...
//     </div>
//   );
// }

    return task
      ? task
      : {
          id: device.device_id || device.id,
          device_id: device.device_id || device.id,
          status: "No Task",
          start_time: null,
          stop_time: null,
          water_level: null,
          spray_cycle: "no",
        };
  });

  return (
    <div className="border rounded-lg p-3 bg-white space-y-3">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-800">Farm I</h3>

        {/* ICON TOGGLE */}
        <div className="">
          <button
            onClick={() => setView("grid")}
            className={`p-1.5 rounded ${view === "grid" ? "bg-white shadow text-blue-600" : "text-gray-500"
              }`}
          >
            <i className="bi bi-grid-3x3-gap text-sm" />
          </button>

          <button
            onClick={() => setView("list")}
            className={`p-1.5 rounded ${view === "list" ? "bg-white shadow text-blue-600" : "text-gray-500"
              }`}
          >
            <i className="bi bi-list-ul text-sm" />
          </button>
        </div>
      </div>

      <div className={`grid ${view === "grid" ? "grid-cols-2" : "grid-cols-1"} gap-4`}>
        {displayTasks.map((task) => (
          <FarmCard
            key={task.id}
            task={task}
            feederImage={CheckTrayActive}
          />
        ))}
      </div>

    </div>
  );
};

export default FarmGrid;