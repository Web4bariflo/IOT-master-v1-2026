import axios from "axios";
import React, { useEffect, useState } from "react";

const PondSummaryCard = () => {
  const [pondName, setPondName] = useState(
    localStorage.getItem("activePondName") || "Pond P1"
  );

 const [worker, setWorker] = useState(null);

  const BASEURL = process.env.REACT_APP_IP;


  
  useEffect(() => {
    const handlePondChange = () => {
      setPondName(localStorage.getItem("activePondName") || "Pond P1");
    };

    window.addEventListener("pondChanged", handlePondChange);
    window.addEventListener("storage", handlePondChange);

    handlePondChange();

    return () => {
      window.removeEventListener("pondChanged", handlePondChange);
      window.removeEventListener("storage", handlePondChange);
    };
  }, []);


  useEffect(() => {
    const loadPondData = async () => {
      const pondId = localStorage.getItem("activePond");

      setPondName(
        localStorage.getItem("activePondName") || "Pond P1"
      );

      if (!pondId) return;

      try {
        const res = await axios.get(
          `${BASEURL}/workers/?pond_id=${pondId}`
        );

        console.log("Worker API Response:", res.data);

        // Adjust according to your API response
        if (res.data?.length > 0) {
          setWorker(res.data[0]);
        } else if (res.data?.workers?.length > 0) {
          setWorker(res.data.workers[0]);
        } else {
          setWorker(null);
        }
      } catch (err) {
        console.error("Failed to fetch worker:", err);
        setWorker(null);
      }
    };

    loadPondData();

    window.addEventListener("pondChanged", loadPondData);

    return () => {
      window.removeEventListener("pondChanged", loadPondData);
    };
  }, [BASEURL]);

  return (
    <div className="border rounded-lg p-4 text-sm bg-white space-y-5">
      {/* ===== WEATHER / ENV STATS ===== */}
      <div className="grid grid-cols-2 gap-4 pb-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 text-lg">
            💧
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-lg">41%</p>
            <p className="text-xs text-gray-500">Humidity</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-50 text-green-600 text-lg">
            🌬️
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-lg">2 km/h</p>
            <p className="text-xs text-gray-500">Wind Speed</p>
          </div>
        </div>
      </div>

      {/* ===== WORKER ASSIGNED ===== */}
      <div className="pb-4 border-b space-y-3">
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <p className="font-medium text-gray-700">Worker Assigned</p>
          <h1 className="font-semibold text-gray-800 text-lg">{pondName}</h1>
        </div>

        {/* Worker Info */}
        <div className="flex items-center gap-3">
          <img
            // src="https://i.pravatar.cc/40"
            src={worker?.profile_pic || "https://cdn-icons-png.flaticon.com/512/237/237382.png"}
            alt="worker"
            className="w-10 h-10 rounded-full border"
          />
          <div>
   <p className="font-semibold text-gray-800">
              {worker?.name || "No Worker Assigned"}
            </p>

            <p className="text-xs text-gray-500">
              {worker?.mobno
                ? `+91 ${worker.mobno}`
                : "No Mobile Number"}
            </p>
          </div>
        </div>
      </div>

      {/* ===== WATER DEPTH ===== */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-cyan-50 text-cyan-600 text-lg">
            🌊
          </div>
          <span className="text-gray-600">Water Depth</span>
        </div>
        <span className="font-semibold text-gray-800 text-lg">12.3 m</span>
      </div>
    </div>
  );
};

export default PondSummaryCard;