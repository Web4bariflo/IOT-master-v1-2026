// import { useEffect, useState } from "react";
// import PowerCard from "./PowerCard";
// import { getSessions, abortSession } from "../../hooks/usePowerMonitoringData";
// import useDashboardData from "../../hooks/useDashboardData"; // 👈 ADD THIS

// export default function PowerGrid() {
//   const [sessionsMap, setSessionsMap] = useState({});

//   // ✅ Get active pond
//   const pondId = Number(localStorage.getItem("activePond"));

//   // ✅ Get devices like Feeder
//   const { devices, loading } = useDashboardData(pondId, "PowerDevice");
//   console.log("POWERGRID DEVICES:", devices);

//   // 🔄 Fetch sessions ONLY if device exists
//   useEffect(() => {
//     if (!devices || devices.length === 0) {
//       setSessionsMap({}); // 👈 no device → no cards
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         const newMap = {};
//         for (const device of devices) {
//           const data = await getSessions(device.device_id);
//           newMap[device.device_id] = (Array.isArray(data) && data.length > 0) 
//             ? data[0] 
//             : { 
//                 id: device.device_id, 
//                 energy: "--", 
//                 status: "N/A", 
//                 cycle_number: "-",
//                 end_time: null
//               };
          
//           if (newMap[device.device_id] && !newMap[device.device_id].id) {
//              newMap[device.device_id].id = device.device_id;
//           }
//         }
//         setSessionsMap(newMap);
//       } catch (err) {
//         console.error(err);
//         setSessionsMap({});
//       }
//     };

//     fetchData();

//     const interval = setInterval(fetchData, 3000);

//     return () => clearInterval(interval);
//   }, [devices]);

//   // 🔥 Abort handler
//   const handleAbort = async (sessionId) => {
//     try {
//       await abortSession(sessionId);
//     } catch (error) {
//       console.error("Abort failed", error);
//     }
//   };

//   // ⏳ Loading
//   if (loading) {
//     return <div className="p-4 text-sm text-gray-500">Loading Power Monitoring...</div>;
//   }

//   // ❌ No device → show nothing (same as Feeder behavior)
//   if (!devices || devices.length === 0) {
//     return null;
//   }

//   // return (
//   //   <div className="grid grid-cols-2 mt-4 border shadow-md gap-2 px-6 py-6 rounded">
//   //     {sessions.map((session) => (
//   //       <div key={session.id}>
//   //         <PowerCard 
//   //           session={session} 
//   //           onAbort={handleAbort}
//   //         />
//   //       </div>
//   //     ))}
//   //   </div>
//   // );

//   return (
//   <div className="grid grid-cols-2 gap-4 p-0">
//     {devices.map((device) => {
//       const session = sessionsMap[device.device_id] || { 
//         id: device.device_id, 
//         energy: "--", 
//         status: "N/A", 
//         cycle_number: "-" 
//       };
//       return (
//         <div key={device.device_id}>
//           <PowerCard session={session} onAbort={handleAbort} />
//         </div>
//       );
//     })}
//   </div>
// );
// }





import { useEffect, useState } from "react";
import PowerCard from "./PowerCard";
import { getSessions, abortSession } from "../../hooks/usePowerMonitoringData";
import useDashboardData from "../../hooks/useDashboardData"; // 👈 ADD THIS

export default function PowerGrid() {
  const [sessionsMap, setSessionsMap] = useState({});

  // ✅ Get active pond
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

  // ✅ Get devices like Feeder
  const { devices, loading } = useDashboardData(pondId, "Power Monitoring");
  console.log("POWERGRID DEVICES:", devices);

  // 🔄 Fetch sessions ONLY if device exists
  useEffect(() => {
    if (!devices || devices.length === 0) {
      setSessionsMap({}); // 👈 no device → no cards
      return;
    }

   const fetchData = async () => {
  try {
    const newMap = {};

    for (const device of devices) {

      const data = await getSessions(device.device_id);

      console.log("API DATA:", data);

      // ✅ FILTER ONLY THIS DEVICE
      const filteredSessions = Array.isArray(data)
        ? data.filter(
            (item) =>
              item.device_id === device.device_id ||
              item.device === device.device_id
          )
        : [];

      // ✅ STORE ONLY THIS DEVICE DATA
      newMap[device.device_id] =
        filteredSessions.length > 0
          ? filteredSessions
          : [
              {
                id: device.device_id,
                device_id: device.device_id,
                energy: "",
                status: "N/A",
                cycle_number: "",
                end_time: null,
              },
            ];
    }

    setSessionsMap(newMap);

  } catch (err) {
    console.error(err);
    setSessionsMap({});
  }
};

    fetchData();

    const interval = setInterval(fetchData, 3000);

    return () => clearInterval(interval);
  }, [devices]);

  // 🔥 Abort handler
  const handleAbort = async (sessionId) => {
    try {
      await abortSession(sessionId);
    } catch (error) {
      console.error("Abort failed", error);
    }
  };

  // ⏳ Loading
  if (loading) {
    return <div className="p-4 text-sm text-gray-500">Loading Power Monitoring...</div>;
  }

  // ❌ No device → show nothing (same as Feeder behavior)
  if (!devices || devices.length === 0) {
    return null;
  }

  // return (
  //   <div className="grid grid-cols-2 mt-4 border shadow-md gap-2 px-6 py-6 rounded">
  //     {sessions.map((session) => (
  //       <div key={session.id}>
  //         <PowerCard 
  //           session={session} 
  //           onAbort={handleAbort}
  //         />
  //       </div>
  //     ))}
  //   </div>
  // );

return (
  <div className="grid grid-cols-2 gap-4 p-0">

    {devices.map((device) => {

      // ✅ Get all sessions for device
      const sessions =
        sessionsMap[device.device_id] || [
          {
            id: device.device_id,
            energy: "",
            status: "N/A",
            cycle_number: "",
            end_time: null,
          },
        ];

      // ✅ Render all cards
      return sessions.map((session, index) => (
        <div
          key={`${device.device_id}-${index}`}
        >
          <PowerCard
            session={{
              ...session,
              id: device.device_id,
            }}
            onAbort={handleAbort}
          />
        </div>
      ));
    })}

  </div>
);
}