// import React, { useState, useEffect } from "react";
// import { MapContainer, TileLayer, Polygon, LayersControl, Marker, Popup, useMap } from "react-leaflet";
// import L from "leaflet";
// import useDashboardData from "../../hooks/useDashboardData";
// import { POND_TABS } from "../../constants/PondTabs";

// // Icons
// import powerImg from "../../../assets/Images/PowerMon.png";
// import aerationImg from "../../../assets/Images/FeedersActive.png";
// import checkTrayImg from "../../../assets/Images/checktrayActive.png";

// const { BaseLayer } = LayersControl;

// const powerIcon = new L.Icon({
//     iconUrl: powerImg,
//     iconSize: [25, 25],
// });

// const feederIcon = new L.Icon({
//     iconUrl: aerationImg,
//     iconSize: [25, 25],
// });

// const checkTrayIcon = new L.Icon({
//     iconUrl: checkTrayImg,
//     iconSize: [25, 25],
// });

// // Default Leaflet icon fallback
// const defaultIcon = new L.Icon({
//     iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//     iconSize: [25, 41],
//     iconAnchor: [12, 41]
// });

// // Component to dynamically update map center
// const MapUpdater = ({ center }) => {
//   const map = useMap();
//   useEffect(() => {
//     if (center) {
//       map.setView(center, 18);
//     }
//   }, [center, map]);
//   return null;
// };

// const PondMap = ({ fullView = false, activeTab }) => {
//   const [pondLocation, setPondLocation] = useState(null);
//   const [activePondId, setActivePondId] = useState(() => Number(localStorage.getItem("activePond")));
//   const [timezone, setTimezone] = useState(null);

//   const { devices: feeders } = useDashboardData(activePondId, "Feeding");
//   const { devices: checkTrays } = useDashboardData(activePondId, "checktray");
//   const { devices: powerMons } = useDashboardData(activePondId, "Power Monitoring");

//   //   const { devices: feeders } = useDashboardData(activePondId, "AutoFeeder");
//   // const { devices: checkTrays } = useDashboardData(activePondId, "CheckTray");
//   // const { devices: powerMons } = useDashboardData(activePondId, "PowerDevice");

//   // const fetchPondLocation = () => {
//   //   setActivePondId(Number(localStorage.getItem("activePond")));
//   //   const locStr = localStorage.getItem("activePondLocation");
//   //   if (locStr) {
//   //     try {
//   //       const parsed = JSON.parse(locStr);
//   //       // API returns [lng, lat], Leaflet needs [lat, lng]
//   //       if (Array.isArray(parsed) && parsed.length > 0) {
//   //         const latLngArr = parsed.map(p => [p[1], p[0]]);
//   //         setPondLocation(latLngArr);
//   //       }
//   //     } catch (err) {
//   //       console.error("Failed to parse pond location", err);
//   //     }
//   //   } else {
//   //     setPondLocation(null);
//   //   }
//   // };

// //   const fetchPondLocation = () => {
// //   setActivePondId(Number(localStorage.getItem("activePond")));

//   // const locStr = localStorage.getItem("activePondLocation");
//   // const tz = localStorage.getItem("activePondTimezone"); // ✅ GET TIMEZONE

// //   if (tz) {
// //     setTimezone(tz);
// //   }

// //   if (locStr) {
// //     try {
// //       const parsed = JSON.parse(locStr);

// //       if (Array.isArray(parsed) && parsed.length > 0) {
// //         const latLngArr = parsed.map(p => [p[1], p[0]]);
// //         setPondLocation(latLngArr);
// //       }
// //     } catch (err) {
// //       console.error("Failed to parse pond location", err);
// //     }
// //   } else {
// //     setPondLocation(null);
// //   }
// // };

// const fetchPondLocation = async () => {
//   const pondId = Number(localStorage.getItem("activePond"));
//   setActivePondId(pondId);
//     const locStr = localStorage.getItem("activePondLocation");
//   const tz = localStorage.getItem("activePondTimezone"); // ✅ GET TIMEZONE
//   if (tz) {
//   setTimezone(tz);
// }

//   if (!pondId) return;

//   try {
//     const response = await fetch(
//       `https://aquabg.bc-pl.com/pond-layout-detail/?pond_id=${pondId}`
//     );

//     const data = await response.json();

//     console.log("API DATA:", data);

//     // ✅ SET POLYGON
//     if (data?.polygonPoints?.length > 0) {
//       setPondLocation(data.polygonPoints);
//     } else {
//       setPondLocation(null);
//     }

//     // ✅ (OPTIONAL - later use)
//     // setGreenWire(data.greenWirePoints || []);
//     // setRedWire(data.redWirePoints || []);

//   } catch (error) {
//     console.error("Fetch error:", error);
//     setPondLocation(null);
//   }
// };

//   useEffect(() => {
//     fetchPondLocation();
//     // window.addEventListener("pondChanged", fetchPondLocation);
//     return () => window.removeEventListener("pondChanged", fetchPondLocation);
//   }, []);


//   if (!pondLocation || pondLocation.length === 0) {
//     return (
//       <div className={`border rounded flex items-center justify-center text-gray-400 ${fullView ? "h-full" : "h-72"}`}>
//         No valid pond location found. Please configure it in Profile.
//       </div>
//     );
//   }

//   // Calculate Center
//   const centerLat = pondLocation.reduce((acc, p) => acc + p[0], 0) / pondLocation.length;
//   const centerLng = pondLocation.reduce((acc, p) => acc + p[1], 0) / pondLocation.length;
//   const center = [centerLat, centerLng];

//   // Distribute markers loosely around the center
//   const getOffset = (index, total, radius = 0.00015) => {
//     if (!total) return [centerLat, centerLng];
//     const angle = (index / total) * Math.PI * 2;
//     return [
//       centerLat + Math.cos(angle) * radius,
//       centerLng + Math.sin(angle) * radius
//     ];
//   };

//   const feedersMapped = (feeders || []).map((d, i) => ({ ...d, pos: getOffset(i, feeders.length, 0.0001), icon: feederIcon }));
//   const checkTraysMapped = (checkTrays || []).map((d, i) => ({ ...d, pos: getOffset(i, checkTrays.length, 0.0002), icon: checkTrayIcon }));
//   const powerMonsMapped = (powerMons || []).map((d, i) => ({ ...d, pos: getOffset(i, powerMons.length, 0.0003), icon: powerIcon }));

//   let displayedDevices = [];
//   if (activeTab === POND_TABS.FEEDING) {
//       displayedDevices = feedersMapped;
//   } else if (activeTab === POND_TABS.FARM) {
//       displayedDevices = checkTraysMapped;
//   } else if (activeTab === POND_TABS.POWER_MON) {
//       displayedDevices = powerMonsMapped;
//   } else {
//       displayedDevices = [...feedersMapped, ...checkTraysMapped, ...powerMonsMapped];
//   }

//   return (
//     <div className={`border rounded overflow-hidden ${fullView ? "h-full" : "h-72"}`}>
//       <MapContainer center={center} zoom={18} className="h-full w-full">
//         <MapUpdater center={center} />
//         <LayersControl position="topright">
//           <BaseLayer checked name="Street View">
//             <TileLayer
//               attribution="&copy; OpenStreetMap contributors"
//               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             />
//           </BaseLayer>

//           <BaseLayer name="Satellite View">
//             <TileLayer
//               attribution="&copy; Google"
//               url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
//               subdomains={["mt0", "mt1", "mt2", "mt3"]}
//             />
//           </BaseLayer>
//         </LayersControl>

//         <Polygon
//           positions={pondLocation}
//           pathOptions={{
//             color: "red",
//             fillColor: "#f87171",
//             fillOpacity: 0.4,
//             weight: 2,
//           }}
//         />


//         {displayedDevices.map((dev, i) => (
//            <Marker key={`${dev.device_id}-${i}`} position={dev.pos} icon={dev.icon || defaultIcon}>
//              <Popup>
//                <b>{dev.device_id}</b><br/>
//                Type: {dev.device_type}
//              </Popup>
//            </Marker>
//         ))}

//         {displayedDevices.length === 0 && (
//           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-90 px-4 py-2 rounded shadow text-sm font-semibold text-gray-700" style={{ zIndex: 1000 }}>
//              {activeTab === POND_TABS.FEEDING && "No Auto Feeders found for this pond."}
//              {activeTab === POND_TABS.FARM && "No Check Trays found for this pond."}
//              {activeTab === POND_TABS.POWER_MON && "No Power Devices found for this pond."}
//              {!activeTab && "No devices found for this pond."}
//           </div>
//         )}

//         <div className="absolute top-3 right-16 bg-gray-600 px-3 py-1 rounded shadow text-sm font-bold z-[1000] text-white">
//   Timezone: {timezone || "N/A"}
// </div>

//       </MapContainer>
//     </div>
//   );
// };

// export default PondMap;




// import React, { useState, useEffect } from "react";
// import { MapContainer, TileLayer, Polygon, LayersControl, Marker, Popup, useMap, Polyline } from "react-leaflet";
// import L from "leaflet";
// import useDashboardData from "../../hooks/useDashboardData";
// import { POND_TABS } from "../../constants/PondTabs";

// // Icons
// import powerImg from "../../../assets/Images/PowerMon.png";
// import aerationImg from "../../../assets/Images/FeedersActive.png";
// import checkTrayImg from "../../../assets/Images/checktrayActive.png";

// const { BaseLayer } = LayersControl;

// const powerIcon = new L.Icon({
//     iconUrl: powerImg,
//     iconSize: [25, 25],
// });

// const feederIcon = new L.Icon({
//     iconUrl: aerationImg,
//     iconSize: [25, 25],
// });

// const checkTrayIcon = new L.Icon({
//     iconUrl: checkTrayImg,
//     iconSize: [25, 25],
// });

// // Default Leaflet icon fallback
// const defaultIcon = new L.Icon({
//     iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//     iconSize: [25, 41],
//     iconAnchor: [12, 41]
// });

// // Component to dynamically update map center
// const MapUpdater = ({ center }) => {
//   const map = useMap();
//   useEffect(() => {
//     if (center) {
//       map.setView(center, 18);
//     }
//   }, [center, map]);
//   return null;
// };

// const PondMap = ({ fullView = false, activeTab }) => {
//   const [pondLocation, setPondLocation] = useState(null);
//   const [activePondId, setActivePondId] = useState(() => Number(localStorage.getItem("activePond")));
//   const [timezone, setTimezone] = useState(null);
//   const [drawPolygon, setDrawPolygon] = useState([]);
// const [greenWire, setGreenWire] = useState([]);
// const [redWire, setRedWire] = useState([]);
// const [feederPointsLocal, setFeederPointsLocal] = useState([]);
// const [farmEyePointsLocal, setFarmEyePointsLocal] = useState([]);
// const [powerMonPointsLocal, setPowerMonPointsLocal] = useState([]);
// const [dgPoints, setDgPoints] = useState([]);
// const [transformerPoints, setTransformerPoints] = useState([]);

//   const { devices: feeders } = useDashboardData(activePondId, "Feeding");
//   const { devices: checkTrays } = useDashboardData(activePondId, "checktray");
//   const { devices: powerMons } = useDashboardData(activePondId, "Power Monitoring");

//   //   const { devices: feeders } = useDashboardData(activePondId, "AutoFeeder");
//   // const { devices: checkTrays } = useDashboardData(activePondId, "CheckTray");
//   // const { devices: powerMons } = useDashboardData(activePondId, "PowerDevice");

//   // const fetchPondLocation = () => {
//   //   setActivePondId(Number(localStorage.getItem("activePond")));
//   //   const locStr = localStorage.getItem("activePondLocation");
//   //   if (locStr) {
//   //     try {
//   //       const parsed = JSON.parse(locStr);
//   //       // API returns [lng, lat], Leaflet needs [lat, lng]
//   //       if (Array.isArray(parsed) && parsed.length > 0) {
//   //         const latLngArr = parsed.map(p => [p[1], p[0]]);
//   //         setPondLocation(latLngArr);
//   //       }
//   //     } catch (err) {
//   //       console.error("Failed to parse pond location", err);
//   //     }
//   //   } else {
//   //     setPondLocation(null);
//   //   }
//   // };

//   const fetchPondLocation = () => {
//   setActivePondId(Number(localStorage.getItem("activePond")));

//   const locStr = localStorage.getItem("activePondLocation");
//   const tz = localStorage.getItem("activePondTimezone"); // ✅ GET TIMEZONE

//   if (tz) {
//     setTimezone(tz);
//   }

//   if (locStr) {
//     try {
//       const parsed = JSON.parse(locStr);

//       if (Array.isArray(parsed) && parsed.length > 0) {
//         const latLngArr = parsed.map(p => [p[1], p[0]]);
//         setPondLocation(latLngArr);
//       }
//     } catch (err) {
//       console.error("Failed to parse pond location", err);
//     }
//   } else {
//     setPondLocation(null);
//   }
// };
//   useEffect(() => {
//     fetchPondLocation();
//     window.addEventListener("pondChanged", fetchPondLocation);
//     return () => window.removeEventListener("pondChanged", fetchPondLocation);
//   }, []);
// useEffect(() => {
//   const saved = localStorage.getItem("pond_draw_data");

//   if (saved) {
//     const parsed = JSON.parse(saved);

//     // 🔥 FIX: Convert [lng, lat] → [lat, lng]
//     const convert = (arr) =>
//       (arr || []).map(p => [p[1], p[0]]);

//     setDrawPolygon(convert(parsed.polygon));
//     setGreenWire(convert(parsed.greenWire));
//     setRedWire(convert(parsed.redWire));

//     setFeederPointsLocal(convert(parsed.feeders));
//     setFarmEyePointsLocal(convert(parsed.farmEyes));
//     setPowerMonPointsLocal(convert(parsed.powerMons));

//     setDgPoints(convert(parsed.dg));
//     setTransformerPoints(convert(parsed.transformers));
//   }
// }, []);

//   if (!pondLocation || pondLocation.length === 0) {
//     return (
//       <div className={`border rounded flex items-center justify-center text-gray-400 ${fullView ? "h-full" : "h-72"}`}>
//         No valid pond location found. Please configure it in Profile.
//       </div>
//     );
//   }

//   // Calculate Center
//   const centerLat = pondLocation.reduce((acc, p) => acc + p[0], 0) / pondLocation.length;
//   const centerLng = pondLocation.reduce((acc, p) => acc + p[1], 0) / pondLocation.length;
//   const center = [centerLat, centerLng];

//   // Distribute markers loosely around the center
//   const getOffset = (index, total, radius = 0.00015) => {
//     if (!total) return [centerLat, centerLng];
//     const angle = (index / total) * Math.PI * 2;
//     return [
//       centerLat + Math.cos(angle) * radius,
//       centerLng + Math.sin(angle) * radius
//     ];
//   };

//   const feedersMapped = (feeders || []).map((d, i) => ({ ...d, pos: getOffset(i, feeders.length, 0.0001), icon: feederIcon }));
//   const checkTraysMapped = (checkTrays || []).map((d, i) => ({ ...d, pos: getOffset(i, checkTrays.length, 0.0002), icon: checkTrayIcon }));
//   const powerMonsMapped = (powerMons || []).map((d, i) => ({ ...d, pos: getOffset(i, powerMons.length, 0.0003), icon: powerIcon }));

//   let displayedDevices = [];
//   if (activeTab === POND_TABS.FEEDING) {
//       displayedDevices = feedersMapped;
//   } else if (activeTab === POND_TABS.FARM) {
//       displayedDevices = checkTraysMapped;
//   } else if (activeTab === POND_TABS.POWER_MON) {
//       displayedDevices = powerMonsMapped;
//   } else {
//       displayedDevices = [...feedersMapped, ...checkTraysMapped, ...powerMonsMapped];
//   }

//   return (
//     <div className={`border rounded overflow-hidden ${fullView ? "h-full" : "h-72"}`}>
//       <MapContainer center={center} zoom={18} className="h-full w-full">
//         <MapUpdater center={center} />
//         <LayersControl position="topright">
//           <BaseLayer checked name="Street View">
//             <TileLayer
//               attribution="&copy; OpenStreetMap contributors"
//               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             />
//           </BaseLayer>

//           <BaseLayer name="Satellite View">
//             <TileLayer
//               attribution="&copy; Google"
//               url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
//               subdomains={["mt0", "mt1", "mt2", "mt3"]}
//             />
//           </BaseLayer>
//         </LayersControl>

//         <Polygon
//           positions={pondLocation}
//           pathOptions={{
//             color: "red",
//             fillColor: "#f87171",
//             fillOpacity: 0.4,
//             weight: 2,
//           }}
//         />

//         {/* ✅ DRAWN POLYGON */}
// {drawPolygon.length > 0 && (
//   <Polygon
//     positions={drawPolygon}
//     pathOptions={{ color: "yellow", fillOpacity: 0.2 }}
//   />
// )}

// {/* ✅ GREEN WIRE */}
// {greenWire.length > 0 && (
//   <Polyline positions={greenWire} pathOptions={{ color: "green" }} />
// )}

// {/* ✅ RED WIRE */}
// {redWire.length > 0 && (
//   <Polyline positions={redWire} pathOptions={{ color: "red" }} />
// )}


//         {displayedDevices.map((dev, i) => (
//            <Marker key={`${dev.device_id}-${i}`} position={dev.pos} icon={dev.icon || defaultIcon}>
//              <Popup>
//                <b>{dev.device_id}</b><br/>
//                Type: {dev.device_type}
//              </Popup>
//            </Marker>
//         ))}

//         {/* ✅ ADD HERE 👇 LOCAL DRAWN DEVICES */}

// {/* LOCAL FEEDERS */}
// {feederPointsLocal.map((pos, i) => (
//   <Marker key={`local-feeder-${i}`} position={pos} icon={feederIcon} />
// ))}

// {/* LOCAL FARM EYE */}
// {farmEyePointsLocal.map((pos, i) => (
//   <Marker key={`local-farm-${i}`} position={pos} icon={checkTrayIcon} />
// ))}

// {/* LOCAL POWER MON */}
// {powerMonPointsLocal.map((pos, i) => (
//   <Marker key={`local-power-${i}`} position={pos} icon={powerIcon} />
// ))}

//         {displayedDevices.length === 0 && (
//           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-90 px-4 py-2 rounded shadow text-sm font-semibold text-gray-700" style={{ zIndex: 1000 }}>
//              {activeTab === POND_TABS.FEEDING && "No Auto Feeders found for this pond."}
//              {activeTab === POND_TABS.FARM && "No Check Trays found for this pond."}
//              {activeTab === POND_TABS.POWER_MON && "No Power Devices found for this pond."}
//              {!activeTab && "No devices found for this pond."}
//           </div>
//         )}

//         <div className="absolute top-3 right-16 bg-gray-600 px-3 py-1 rounded shadow text-sm font-bold z-[1000] text-white">
//   Timezone: {timezone || "N/A"}
// </div>

//       </MapContainer>
//     </div>
//   );
// };

// export default PondMap;








import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polygon, LayersControl, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import useDashboardData from "../../hooks/useDashboardData";
import { POND_TABS } from "../../constants/PondTabs";

// Icons
import powerImg from "../../../assets/Images/PowerMon.png";
import aerationImg from "../../../assets/Images/FeedersActive.png";
import checkTrayImg from "../../../assets/Images/checktrayActive.png";

const BASEURL = process.env.REACT_APP_IP;

const { BaseLayer } = LayersControl;

const powerIcon = new L.Icon({
    iconUrl: powerImg,
    iconSize: [25, 25],
});

const feederIcon = new L.Icon({
    iconUrl: aerationImg,
    iconSize: [25, 25],
});

const checkTrayIcon = new L.Icon({
    iconUrl: checkTrayImg,
    iconSize: [25, 25],
});

// Default Leaflet icon fallback
const defaultIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

// Component to dynamically update map center
const MapUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, 18);
        }
    }, [center, map]);
    return null;
};

const PondMap = ({ fullView = false, activeTab }) => {
    const [pondLocation, setPondLocation] = useState(null);
    const [activePondId, setActivePondId] = useState(() => Number(localStorage.getItem("activePond")));
    const [timezone, setTimezone] = useState(null);

    const { devices: feeders } = useDashboardData(activePondId, "Feeding");
    const { devices: checkTrays } = useDashboardData(activePondId, "checktray");
    const { devices: powerMons } = useDashboardData(activePondId, "Power Monitoring");

    // const { devices: feeders } = useDashboardData(activePondId, "AutoFeeder");
    // const { devices: checkTrays } = useDashboardData(activePondId, "CheckTray");
    // const { devices: powerMons } = useDashboardData(activePondId, "PowerDevice");

    // const fetchPondLocation = () => {
    // setActivePondId(Number(localStorage.getItem("activePond")));
    // const locStr = localStorage.getItem("activePondLocation");
    // if (locStr) {
    // try {
    // const parsed = JSON.parse(locStr);
    // // API returns [lng, lat], Leaflet needs [lat, lng]
    // if (Array.isArray(parsed) && parsed.length > 0) {
    // const latLngArr = parsed.map(p => [p[1], p[0]]);
    // setPondLocation(latLngArr);
    // }
    // } catch (err) {
    // console.error("Failed to parse pond location", err);
    // }
    // } else {
    // setPondLocation(null);
    // }
    // };

    // const fetchPondLocation = () => {
    // setActivePondId(Number(localStorage.getItem("activePond")));

    // const locStr = localStorage.getItem("activePondLocation");
    // const tz = localStorage.getItem("activePondTimezone"); // ✅ GET TIMEZONE

    // if (tz) {
    // setTimezone(tz);
    // }

    // if (locStr) {
    // try {
    // const parsed = JSON.parse(locStr);

    // if (Array.isArray(parsed) && parsed.length > 0) {
    // const latLngArr = parsed.map(p => [p[1], p[0]]);
    // setPondLocation(latLngArr);
    // }
    // } catch (err) {
    // console.error("Failed to parse pond location", err);
    // }
    // } else {
    // setPondLocation(null);
    // }
    // };

    const fetchPondLocation = async () => {
        const pondId = Number(localStorage.getItem("activePond"));
        setActivePondId(pondId);
        const locStr = localStorage.getItem("activePondLocation");
        const tz = localStorage.getItem("activePondTimezone"); // ✅ GET TIMEZONE
        if (tz) {
            setTimezone(tz);
        }

        if (!pondId) return;

        try {
            const response = await fetch(
                `${BASEURL}/pond-layout-detail/?pond_id=${pondId}`
            );

            const data = await response.json();

            console.log("API DATA:", data);

            // ✅ SET POLYGON
            if (data?.polygonPoints?.length > 0) {
                setPondLocation(data.polygonPoints);
            } else {
                setPondLocation(null);
            }

            // ✅ (OPTIONAL - later use)
            // setGreenWire(data.greenWirePoints || []);
            // setRedWire(data.redWirePoints || []);

        } catch (error) {
            console.error("Fetch error:", error);
            setPondLocation(null);
        }
    };

    useEffect(() => {
        fetchPondLocation();
        // window.addEventListener("pondChanged", fetchPondLocation);
        return () => window.removeEventListener("pondChanged", fetchPondLocation);
    }, []);

    if (!pondLocation || pondLocation.length === 0) {
        return (
            <div className={`border rounded flex items-center justify-center text-gray-400 ${fullView ? "h-full" : "h-72"}`}>
                No valid pond location found. Please configure it in Profile.
            </div>
        );
    }

    // Calculate Center
    const centerLat = pondLocation.reduce((acc, p) => acc + p[0], 0) / pondLocation.length;
    const centerLng = pondLocation.reduce((acc, p) => acc + p[1], 0) / pondLocation.length;
    const center = [centerLat, centerLng];

    // Distribute markers loosely around the center
    const getOffset = (index, total, radius = 0.00015) => {
        if (!total) return [centerLat, centerLng];
        const angle = (index / total) * Math.PI * 2;
        return [
            centerLat + Math.cos(angle) * radius,
            centerLng + Math.sin(angle) * radius
        ];
    };

    const feedersMapped = (feeders || []).map((d, i) => ({ ...d, pos: getOffset(i, feeders.length, 0.0001), icon: feederIcon }));
    const checkTraysMapped = (checkTrays || []).map((d, i) => ({ ...d, pos: getOffset(i, checkTrays.length, 0.0002), icon: checkTrayIcon }));
    const powerMonsMapped = (powerMons || []).map((d, i) => ({ ...d, pos: getOffset(i, powerMons.length, 0.0003), icon: powerIcon }));

    let displayedDevices = [];
    if (activeTab === POND_TABS.FEEDING) {
        displayedDevices = feedersMapped;
    } else if (activeTab === POND_TABS.FARM) {
        displayedDevices = checkTraysMapped;
    } else if (activeTab === POND_TABS.POWER_MON) {
        displayedDevices = powerMonsMapped;
    } else {
        displayedDevices = [...feedersMapped, ...checkTraysMapped, ...powerMonsMapped];
    }

    return (
        <div className={`border rounded overflow-hidden ${fullView ? "h-full" : "h-72"}`}>
            <MapContainer center={center} zoom={18} className="h-full w-full">
                <MapUpdater center={center} />
                <LayersControl position="topright">
                    <BaseLayer checked name="Street View">
                        <TileLayer
                            attribution="&copy; OpenStreetMap contributors"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </BaseLayer>

                    <BaseLayer name="Satellite View">
                        <TileLayer
                            attribution="&copy; Google"
                            url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                            subdomains={["mt0", "mt1", "mt2", "mt3"]}
                        />
                    </BaseLayer>
                </LayersControl>

                <Polygon
                    positions={pondLocation}
                    pathOptions={{
                        color: "red",
                        fillColor: "#f87171",
                        fillOpacity: 0.4,
                        weight: 2,
                    }}
                />

                {displayedDevices.map((dev, i) => (
                    <Marker key={`${dev.device_id}-${i}`} position={dev.pos} icon={dev.icon || defaultIcon}>
                        <Popup>
                            <b>{dev.device_id}</b><br />
                            Type: {dev.device_type}
                        </Popup>
                    </Marker>
                ))}

                {displayedDevices.length === 0 && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-90 px-4 py-2 rounded shadow text-sm font-semibold text-gray-700" style={{ zIndex: 1000 }}>
                        {activeTab === POND_TABS.FEEDING && "No Auto Feeders found for this pond."}
                        {activeTab === POND_TABS.FARM && "No Check Trays found for this pond."}
                        {activeTab === POND_TABS.POWER_MON && "No Power Devices found for this pond."}
                        {!activeTab && "No devices found for this pond."}
                    </div>
                )}

                <div className="absolute top-3 right-16 bg-gray-600 px-3 py-1 rounded shadow text-sm font-bold z-[1000] text-white">
                    Timezone: {timezone || "N/A"}
                </div>

            </MapContainer>
        </div>
    );
};

export default PondMap;


