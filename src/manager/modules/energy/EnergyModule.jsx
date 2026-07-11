import React from "react";
import Aeration from "./devices/Aeration";
import EPFC from "./devices/EPFC";
import EnergyDashboard from "./devices/EnergyDashboard";

const EnergyModule = ({ pondname, pondId }) => {
  return (
    <>
      {/* <h2 className="text-lg font-semibold mb-2">{pondname}</h2>
      <Aeration/>
      <div className="my-6 border-t border-gray-200" />
      <EPFC/> */}
      <EnergyDashboard pondname={pondname} pondId={pondId} />
    </>
  );
};

export default EnergyModule;



// import React from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import dayjs from "dayjs";
// import utc from "dayjs/plugin/utc";
// import timezone from "dayjs/plugin/timezone";

// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// import Power from "../../../../assets/Images/PowerMon.png";
// import PondMap from "../../../../manager/components/ponds/PondMap.jsx";
// import WeatherCard from "./WeatherCard";

// import { useEffect, useState } from "react";

// import {
//   generateCycles,
//   createSession,
//   deleteSchedule,
//   getCycleData,
//   getWorkers,
//   abortSession,
//   getDeviceId
// } from "../../../hooks/usePowerMonitoringData.js";

// // ✅ enable plugins
// dayjs.extend(utc);
// dayjs.extend(timezone);

// export default function EnergyDashboard({ pondname, pondId: propPondId }) {

//     const [startTime, setStartTime] = useState(""); // stores selected start time for a cycle input
//     const [endTime, setEndTime] = useState(""); // stores selected end time for a cycle input
//     const [cycle, setCycle] = useState("1"); // stores number of cycles selected from dropdown
//     const [device, setDevice] = useState(
//         localStorage.getItem("selectedDevice") || ""
//     );
//     const [showTable, setShowTable] = useState(false); // controls whether cycle table is visible or not
//     const [generatedCycle, setGeneratedCycle] = useState("0"); // stores generated cycle count (from API or UI)
//     const [cyclesData, setCyclesData] = useState([]); // stores generated cycle list from API
//     const [loading, setLoading] = useState(false); // handles loading state (API call in progress)
//     const [timeData, setTimeData] = useState({}); // stores start & end time for each cycle (key = cycle_number)
//     const [fetchData, setFetchData] = useState([]); // stores session data (status, energy, session_id, etc.)
//     const [workers, setWorkers] = useState([]); // stores worker list for dropdown assignment
//     const [selectedWorker, setSelectedWorker] = useState({}); // stores selected worker for each cycle (key = cycle_number)
//     const [generatedDevice, setGeneratedDevice] = useState(
//         localStorage.getItem("generatedDevice") || ""
//     );
//     const pondTimezone =
//         localStorage.getItem("activePondTimezone") || "Asia/Kolkata";
//         const getNowInPondTZ = () => {
//   return dayjs().tz(pondTimezone).toDate();
// };

// const convertToPondTZ = (date) => {
//   return dayjs(date).tz(pondTimezone).toDate();
// };

// const convertFromPondTZToUTC = (date) => {
//   return dayjs(date).tz(pondTimezone).utc().toISOString();
// };

//     const [devices, setDevices] = useState([]);

//     const cycleCount = Number(generatedCycle);

//     const getDateTimeByTimezone = (timezone) => {
//         const now = new Date();

//         const formatter = new Intl.DateTimeFormat("sv-SE", {
//             timeZone: timezone,
//             year: "numeric",
//             month: "2-digit",
//             day: "2-digit",
//             hour: "2-digit",
//             minute: "2-digit",
//             hour12: false,
//         });

//         const parts = formatter.formatToParts(now);

//         const get = (type) => parts.find(p => p.type === type)?.value;

//         return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
//     };


//     // ✅ DEVICE FETCH FUNCTION ADDED

//     useEffect(() => {
//         const fetchDevices = async () => {
//             try {
//                 const activePondId = propPondId || localStorage.getItem("activePond") || "1";
//                 const data = await getDeviceId(activePondId);
//                 console.log("DEVICES:", data);

//                 setDevices(
//                     Array.isArray(data)
//                         ? data
//                         : data.devices || data.Device || []
//                 );
//             } catch (error) {
//                 console.error("Device Fetch Error:", error);
//                 setDevices([]);
//             }
//         };

//         fetchDevices();
//     }, [propPondId]);



//     // this function formats time for backend API ✅
//     const formatDateTimeWithTZ = (value, timezone) => {
//         if (!value) return null;

//         // value = "2026-05-21T08:30"

//         const [datePart, timePart] = value.split("T");
//         const [year, month, day] = datePart.split("-");
//         const [hour, minute] = timePart.split(":");

//         // Create date in given timezone using Intl
//         const utcDate = new Date(
//             new Date(
//                 `${year}-${month}-${day}T${hour}:${minute}:00`
//             ).toLocaleString("en-US", { timeZone: timezone })
//         );

//         return utcDate.toISOString(); // ✅ send in UTC
//     };

//     // ✅ generate all cycle function
//     const handleGenerate = async () => {
//         try {
//             setLoading(true);

//             const payload = {
//                 device_id: device,
//                 cycle_count: Number(cycle),
//             };

//             const data = await generateCycles(payload);

//             console.log("API RESPONSE:", data);
//             if (data.success) {
//                 setCyclesData(data.cycles);
//                 setShowTable(true);

//                 setGeneratedDevice(device);

//                 localStorage.setItem("generatedDevice", device);

//                 toast.success(
//                     <span className="text-black font-semibold">
//                         Cycle generated successfully
//                     </span>
//                 );
//             } else {
//                 // ❌ API returned false
//                 toast.error("Clear all cycles first");
//             }

//         } catch (error) {
//             console.error("Error:", error);

//             // ❌ API ERROR (like 400, 500)
//             if (error?.message?.includes("clear") || error?.response?.data?.message?.includes("clear")) {
//                 toast.error("Clear all cycles first");
//             }
//             else {

//                 toast.error(
//                     <span className="text-black font-semibold">
//                         Failed to generate cycle
//                     </span>);
//             }

//         } finally {
//             setLoading(false);
//         }
//     };


//     // ✅ add session data function
//     const handleSubmitAll = async () => {

//         try {

//             if (!device) {
//                 toast.error("Please select device");
//                 return;
//             }

//             if (!cyclesData.length) {
//                 toast.error("Generate cycle first");
//                 return;
//             }

//             // const now = new Date();
//             const now = new Date(
//                 new Date().toLocaleString("en-US", { timeZone: pondTimezone })
//             );
//             // ✅ build cycles payload
//             const cycles = cyclesData.map((item, index) => {

//                 const selected = timeData[item.cycle_number];

//                 if (!selected?.start || !selected?.end) {
//                     throw new Error(
//                         `Select start/end time for cycle ${item.cycle_number}`
//                     );
//                 }

//                 // const startTime = new Date(selected.start);
//                 // const endTime = new Date(selected.end);

//                 const startTime = new Date(
//                     formatDateTimeWithTZ(selected.start, pondTimezone)
//                 );

//                 const endTime = new Date(
//                     formatDateTimeWithTZ(selected.end, pondTimezone)
//                 );

//                 // ✅ CONDITION 1
//                 // Start time must be 120 sec greater than current time

//                 const currentDiffSeconds =
//                     (startTime - now) / 1000;

//                 if (currentDiffSeconds < 120) {
//                     throw new Error(
//                         `Cycle ${item.cycle_number}: start time must be at least 2 min greater than current time`
//                     );
//                 }

//                 // ✅ CONDITION 2
//                 // Same cycle start/end duration minimum 2 min

//                 const cycleDuration =
//                     (endTime - startTime) / (1000 * 60);

//                 if (cycleDuration < 2) {
//                     throw new Error(
//                         `Cycle ${item.cycle_number} start time and end time duration must be 2 minutes`
//                     );
//                 }

//                 // ✅ CONDITION 3
//                 // Gap between previous cycle end and current cycle start

//                 if (index > 0) {

//                     const prevCycle = cyclesData[index - 1];

//                     const prevEnd =
//                         timeData[prevCycle.cycle_number]?.end;

//                     const currentStart = selected.start;

//                     const gapMinutes =
//                         (new Date(currentStart) - new Date(prevEnd)) /
//                         (1000 * 60);

//                     if (gapMinutes < 2) {

//                         throw new Error(
//                             `Cycle ${prevCycle.cycle_number} and Cycle ${item.cycle_number} duration gap must be 2 minutes`
//                         );
//                     }
//                 }

//                 return {
//     start_time: convertFromPondTZToUTC(selected.start),
//     end_time: convertFromPondTZToUTC(selected.end),
//     main: 1,
// };
//             });

//             // ✅ final payload
//             const payload = {
//                 device_id: device,
//                 cycles: cycles,
//             };

//             console.log("SUBMIT PAYLOAD:", payload);

//             // ✅ submit api
//             const res = await createSession(payload);

//             console.log("SUBMIT RESPONSE:", res);

//             toast.success("Cycles scheduled successfully");

//             // ✅ refresh
//             await handleGetCycleData(device);

//         } catch (error) {

//             console.error("Submit Error:", error);

//             toast.error(
//                 error.message || "Failed to submit cycles"
//             );
//         }
//     };

//     // ✅ this is showing for clear cycle pop message
//     const showClearConfirm = () => {
//         toast.info(
//             ({ closeToast }) => (
//                 <div className="text-center">
//                     <b className="font-medium text-black mb-3">
//                         Are you sure to clear all cycles?
//                     </b>

//                     <div className="flex justify-center gap-9 mt-4">
//                         {/* Cancel */}
//                         <button
//                             className="bg-gray-400 text-white px-3 py-1 rounded"
//                             onClick={closeToast}
//                         >
//                             Cancel
//                         </button>

//                         {/* Confirm */}
//                         <button
//                             className="bg-red-600 text-white px-3 py-1 rounded"
//                             onClick={() => {
//                                 closeToast();
//                                 handleClear(); // ✅ call actual clear
//                             }}
//                         >
//                             Confirm
//                         </button>
//                     </div>
//                 </div>
//             ),
//             {
//                 position: "top-center",
//                 autoClose: false, // ❗ important (so user can click)
//                 closeOnClick: false,
//                 closeButton: false,
//             }
//         );
//     };


//     // ✅ Clear ALL Cycle function
//     const handleClear = async () => {
//         try {

//             const payload = { device_id: device };

//             const res = await deleteSchedule(payload);

//             console.log("CLEAR RESPONSE:", res);

//             // ✅ clear frontend data
//             setCyclesData([]);
//             setShowTable(false);
//             setTimeData({});
//             setFetchData([]);

//             // ✅ clear saved generated device
//             localStorage.removeItem("generatedDevice");

//             toast.success(
//                 <span className="text-black font-semibold">
//                     All cycles cleared
//                 </span>
//             );

//         } catch (error) {

//             console.error("Clear Error:", error);

//             toast.error("Failed to clear cycles");
//         }
//     };


//     // ✅ FETCH ALL CYCLE FUNCTION
//     const handleGetCycleData = async (device) => {
//         try {
//             const response = await getCycleData(device);
//             console.log("GET DATA:", response);

//             setFetchData(response);
//         } catch (error) {
//             console.error(error);
//         }
//     };


//     // ✅ RESTORE EXISTING CYCLES AFTER REFRESH
//     useEffect(() => {

//         if (!generatedDevice) return;

//         const fetchExistingCycles = async () => {

//             try {

//                 const response = await getCycleData(generatedDevice);

//                 console.log("RESTORE DATA:", response);

//                 if (response && response.length > 0) {

//                     // ✅ store backend data
//                     setFetchData(response);

//                     // ✅ rebuild rows
//                     const formattedCycles = response.map((item, index) => ({
//                         cycle_number: item.cycle_number || index + 1,
//                     }));

//                     setCyclesData(formattedCycles);

//                     // ✅ show table again
//                     setShowTable(true);

//                     // ✅ restore times
//                     const restoredTimeData = {};

//                     response.forEach((item) => {

//                         restoredTimeData[item.cycle_number] = {
//                             start: item.start_time
//                                 ? item.start_time.slice(0, 16)
//                                 : "",

//                             end: item.end_time
//                                 ? item.end_time.slice(0, 16)
//                                 : "",
//                         };
//                     });

//                     setTimeData(restoredTimeData);
//                 }

//             } catch (error) {

//                 console.error("Restore Error:", error);
//             }
//         };

//         fetchExistingCycles();

//     }, [generatedDevice]);


//     useEffect(() => {

//         if (!generatedDevice) return;

//         const interval = setInterval(() => {
//             handleGetCycleData(generatedDevice);
//         }, 1000);

//         return () => clearInterval(interval);

//     }, [generatedDevice]);


//     // ✅ WORKER FETCH FUNCTION ADDED
//     // const fetchWorkers = async () => {
//     // try {
//     // const data = await getWorkers("9327939342");
//     // console.log("WORKERS:", data);

//     // // ✅ FIX HERE
//     // setWorkers(data.Employee || []);

//     // } catch (error) {
//     // console.error("Worker Fetch Error:", error);
//     // setWorkers([]);
//     // }
//     // };

//     // // ✅ CALL WORKER API
//     // useEffect(() => {
//     // fetchWorkers();
//     // }, []);



//     // ✅ clear session function
//     const handleAbort = async (item) => {
//         try {
//             const session = fetchData.find(
//                 d => d.cycle_number === item.cycle_number
//             );

//             const payload = {
//                 session_id: session.id || session.session_id,
//             };

//             console.log("ABORT PAYLOAD:", payload);

//             const res = await abortSession(payload);

//             console.log("ABORT RESPONSE:", res);

//             // ✅ SUCCESS TOAST

//             toast.success(
//                 <span className="text-black font-semibold">
//                     Cycle {item.cycle_number} aborted successfully
//                 </span>);

//             // refresh data
//             handleGetCycleData(device);

//         } catch (error) {
//             console.error("Abort Error:", error.response || error);

//             // ❌ ERROR TOAST
//             toast.error(
//                 <span>Failed to abort cycle</span>
//             );
//         }
//     };


//     useEffect(() => {
//         if (cycle === "0") {
//             setStartTime("");
//             setEndTime("");
//         }
//     }, [cycle]);

//     return (
//         <div className=" min-h-screen flex ml-70">

//             {/* this show popup message on the top*/}

//             <ToastContainer position="top-center" autoClose={2000} />

//             <div className="flex-1 p-6">


//                 <div className="mt-6 border-1 rounded-lg shadow p-4">

//                     <div className="flex justify-between items-center gap-4">
//                         <div className="flex items-center gap-6 mb-4 mt-2 flex-wrap">
//                             <span className="font-semibold text-lg">{pondname || "Unknown Pond"}</span>

//                             <div className="flex items-center gap-2">
//                                 <label className="text-sm text-gray-600">Device Id</label>

//                                 {/* // ✅ DYNAMIC DEVICE SHOW */}
//                                 <select
//                                     className="border rounded px-3 py-1 text-sm"
//                                     value={device}
//                                     onChange={(e) => {
//                                         setDevice(e.target.value);
//                                         localStorage.setItem("selectedDevice", e.target.value);
//                                     }}
//                                 >
//                                     <option value="">Select Device</option>

//                                     {devices.map((dev, i) => (
//                                         <option key={i} value={dev.device_id || dev.id}>
//                                             {dev.device_id || dev.id}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>

//                             <div className="flex items-center gap-2">
//                                 <label className="text-sm text-gray-600">Monitoring Cycle</label>
//                                 <input
//                                     type="number"
//                                     min="0"
//                                     max="20"
//                                     placeholder="Enter cycle"
//                                     className="border rounded px-3 py-1 text-sm w-20"
//                                     value={cycle}
//                                     onChange={(e) => setCycle(e.target.value)}
//                                 />
//                             </div>

//                             {/* ✅ HANDLE THE GENERATE BUTTON*/}

//                             <button
//                                 className="bg-blue-500 text-white px-4 py-1 font-medium rounded text-sm"
//                                 onClick={handleGenerate}
//                             >
//                                 Generate
//                             </button>

//                             {/* ✅ HANDLE THE handleClear button*/}

//                             <button
//                                 className="bg-red-500 text-white px-4 py-1 font-medium rounded text-sm"
//                                 onClick={showClearConfirm}
//                             >
//                                 Clear
//                             </button>
//                         </div>
//                         <button
//                             className="bg-green-600 text-white px-4 py-1 font-medium rounded text-sm"
//                             onClick={handleSubmitAll}
//                         >
//                             Submit All
//                         </button>
//                     </div>

//                     <div className="rounded overflow-hidden flex gap-4 items-start">


//                         {/* ✅ Show the powermonitering image*/}

//                         <div className="flex flex-col items-center">
//                             <img
//                                 src={Power}
//                                 alt="device"
//                                 className="w-[60px] h-[60px] object-contain border rounded"
//                             />
//                             <p className="font-semibold text-xs">PowerMON</p>
//                         </div>

//                         <table className="w-full text-sm">
//                             <thead className="bg-gray-100 text-gray-600">
//                                 <tr>
//                                     <th className="p-2 border">Device ID</th>
//                                     <th className="p-2 border">Cycle No.</th>
//                                     <th className="p-2 border">Start Time</th>
//                                     <th className="p-2 border">End Time</th>
//                                     <th className="p-1 border">Power Consumption (kwh)</th>
//                                     <th className="p-2 border">PF</th>
//                                     <th className="p-2 border">Worker Assign</th>
//                                     <th className="p-2 border">Action</th>
//                                     <th className="p-2 border">Status</th>
//                                 </tr>
//                             </thead>

//                             <tbody>

//                                 {/* ✅ this is show when Cycle is not generate*/}

//                                 {!showTable ? (
//                                     <tr>
//                                         <td colSpan="9" className="text-center p-6 text-gray-500">
//                                             No Cycle Started
//                                         </td>
//                                     </tr>
//                                 ) : cyclesData.length === 0 ? (
//                                     <tr>
//                                         <td colSpan="9" className="text-center p-6 text-gray-500">
//                                             No Cycle started
//                                         </td>

//                                         {/* ✅ this is for give start time and end time */}

//                                     </tr>
//                                 ) : (
//                                     cyclesData.map((item, index) => (
//                                         <tr key={index} className="text-center">
//                                             <td className="border p-2">{generatedDevice}</td>
//                                             <td className="border p-2">{item.cycle_number}</td>

//                                             {/* ✅ this is for give start time and end time */}

//                                             <td className="border p-2">
//                                                 <DatePicker
//   selected={
//     timeData[item.cycle_number]?.start
//       ? new Date(timeData[item.cycle_number].start)
//       : null
//   }
//   onChange={(date) => {
//     setTimeData({
//       ...timeData,
//       [item.cycle_number]: {
//         ...timeData[item.cycle_number],
//         start: convertToPondTZ(date),
//       },
//     });
//   }}
//   showTimeSelect
//   timeIntervals={1}
//   dateFormat="yyyy-MM-dd HH:mm"
//   placeholderText={`Select (${pondTimezone})`}
// />
//                                             </td>

//                                             <td className="border p-2">
//                                                 <DatePicker
//   selected={
//     timeData[item.cycle_number]?.end
//       ? new Date(timeData[item.cycle_number].end)
//       : null
//   }
//   onChange={(date) => {
//     setTimeData({
//       ...timeData,
//       [item.cycle_number]: {
//         ...timeData[item.cycle_number],
//         end: convertToPondTZ(date),
//       },
//     });
//   }}
//   showTimeSelect
//   timeIntervals={1}
//   dateFormat="yyyy-MM-dd HH:mm"
//   placeholderText={`Select (${pondTimezone})`}
// />
//                                             </td>

//                                             {/* ✅ this is show power consumtion */}

//                                             <td className="border p-2">
//                                                 {
//                                                     fetchData.find(d => d.cycle_number === item.cycle_number)?.energy || "-"
//                                                 }
//                                             </td>

//                                             <td className="border p-2">
//                                                 <span>0</span>
//                                             </td>

//                                             {/* ✅ DYNAMIC WORKER DROPDOWN */}

//                                             <td className="border p-2">
//                                                 {
//                                                     fetchData.find(
//                                                         d => d.cycle_number === item.cycle_number
//                                                     )?.worker?.name || "-"
//                                                 }
//                                             </td>

//                                             <td className="border p-2">
//                                                 {(() => {
//                                                     const status = fetchData
//                                                         .find(d => d.cycle_number === item.cycle_number)
//                                                         ?.status?.toUpperCase();

//                                                     // ✅ ONLY show Abort when PROCESSING
//                                                     if (status === "PROCESSING") {
//                                                         return (
//                                                             <button
//                                                                 className="bg-red-600 text-[13px] font-semibold text-white px-2 py-1 rounded-md"
//                                                                 onClick={() => handleAbort(item)}
//                                                             >
//                                                                 Abort
//                                                             </button>
//                                                         );
//                                                     }

//                                                     // ✅ otherwise show nothing
//                                                     return null;
//                                                 })()}
//                                             </td>

//                                             {/* ✅ SHOW DYNAMIC STATUS */}

//                                             <td className="border p-2 text-[14px] font-medium">
//                                                 {(() => {
//                                                     const status = fetchData.find(d => d.cycle_number === item.cycle_number)?.status || "PENDING";

//                                                     let colorClass = "text-gray-500";

//                                                     if (status === "PENDING") colorClass = "text-yellow-600";
//                                                     else if (status === "PROCESSING") colorClass = "text-orange-600";
//                                                     else if (status === "COMPLETED") colorClass = "text-green-600";
//                                                     else if (status === "FAILED") colorClass = "text-red-700";
//                                                     else if (status === "ABORTED") colorClass = "text-red-700";

//                                                     return <span className={colorClass}>{status}</span>;
//                                                 })()}
//                                             </td>
//                                         </tr>
//                                     ))
//                                 )}
//                             </tbody>
//                         </table>

//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
