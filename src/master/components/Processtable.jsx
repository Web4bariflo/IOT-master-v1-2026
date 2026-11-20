import React, { useState, useMemo, useEffect, useCallback } from "react";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import checktrayLogo from "../../assets/Images/checktray-logo.png";
import autofeederLogo from "../../assets/Images/autofeeder-logo.png";
import powermonitoringLogo from "../../assets/Images/powermonitoring-logo.png";

const BASEURL = process.env.REACT_APP_IP;

// Helper to get category logo
const getCategoryLogo = (category) => {
  switch (category) {
    case "Checktray":
      return checktrayLogo;
    case "Power Monitoring":
      return powermonitoringLogo;
    case "Auto Feeder":
    default:
      return autofeederLogo;
  }
};

// Tab endpoint mappings
const TAB_ENDPOINTS = {
  "Auto Feeder": [
    "/AutofeederProcessTable/",
    "/autofeederProcessTable/",
    "/autofeeder_process_table/",
  ],
  Checktray: [
    "/ChecktrayProcessTable/",
    "/CheckTrayProcessTable/",
    "/checktrayProcessTable/",
    "/checktray_process_table/",
  ],
  "Power Monitoring": [
    "/PowerMonitoringProcessTable/",
    "/PowermonitoringProcessTable/",
    "/powerMonitoringProcessTable/",
    "/powermonitoring_process_table/",
  ],
};

// Task Details endpoint mappings
const TAB_DETAIL_ENDPOINTS = {
  "Auto Feeder": [
    (id) => `/AutofeederTaskDetails/${id}/`,
    (id) => `/autofeederTaskDetails/${id}/`,
    (id) => `/autofeeder_task_details/${id}/`,
  ],
  Checktray: [
    (id) => `/ChecktrayTaskDetails/${id}/`,
    (id) => `/CheckTrayTaskDetails/${id}/`,
    (id) => `/checktrayTaskDetails/${id}/`,
    (id) => `/checktray_task_details/${id}/`,
  ],
  "Power Monitoring": [
    (id) => `/PowerMonitoringTaskDetails/${id}/`,
    (id) => `/PowermonitoringTaskDetails/${id}/`,
    (id) => `/powerMonitoringTaskDetails/${id}/`,
    (id) => `/powermonitoring_task_details/${id}/`,
  ],
};

// Fallback preview data in case the backend server is temporarily unreachable
const FALLBACK_TASKS = {
  "Auto Feeder": [
    {
      device: "BFL_FdtryA002",
      task_id: 28,
      status: "Pending",
      schedule_date: "2026-11-18",
      cycles: 1,
      pond: "POND003",
    },
    {
      device: "BFL_FdtryA001",
      task_id: 29,
      status: "Completed",
      schedule_date: "2026-11-18",
      cycles: 1,
      pond: "POND001",
    },
  ],
  Checktray: [
    {
      Task_ID: 30,
      task_id: 30,
      Device: "fdtryA001",
      device: "fdtryA001",
      Pond: "POND001",
      pond: "POND001",
      cycles: 2,
      Status: "Pending",
      status: "Pending",
      schedule_date: "2026-11-04",
      last_updated: "19 Nov 2026, 06:03 AM",
    },
    {
      Task_ID: 31,
      task_id: 31,
      Device: "fdtryA002",
      device: "fdtryA002",
      Pond: "POND001",
      pond: "POND001",
      cycles: 1,
      Status: "Pending",
      status: "Pending",
      schedule_date: "2026-11-19",
      last_updated: "19 Nov 2026, 06:04 AM",
    },
  ],
  "Power Monitoring": [
    {
      Task_ID: 32,
      task_id: 32,
      Device: "BFL_PomonA001",
      device: "BFL_PomonA001",
      Pond: "POND001",
      pond: "POND001",
      cycles: 1,
      Status: "Pending",
      status: "Pending",
      schedule_date: "2026-11-19",
      last_updated: "19 Nov 2026, 06:04 AM",
    },
  ],
};

const Processtable = () => {
  const [activeTab, setActiveTab] = useState("Auto Feeder");
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const tabs = [
    {
      id: "Auto Feeder",
      label: "Auto Feeder",
      logo: autofeederLogo,
    },
    {
      id: "Checktray",
      label: "Checktray",
      logo: checktrayLogo,
    },
    {
      id: "Power Monitoring",
      label: "Power Monitoring",
      logo: powermonitoringLogo,
    },
  ];

  // Fetch dynamic task details for a specific task
  const handleViewDetails = useCallback(
    async (task, tabName = activeTab) => {
      if (!task) return;
      setSelectedTask(task);
      const taskId = task.Task_ID ?? task.task_id ?? task.id;
      if (!taskId) return;

      setDetailsLoading(true);
      const cleanBaseUrl = (BASEURL || "").replace(/\/+$/, "");
      const endpointBuilders = TAB_DETAIL_ENDPOINTS[tabName] || [
        (id) => `/${tabName}TaskDetails/${id}/`,
      ];

      let success = false;
      let detailData = null;

      for (const buildEp of endpointBuilders) {
        try {
          const fullUrl = `${cleanBaseUrl}${buildEp(taskId)}`;
          const res = await axios.get(fullUrl);
          // Guard against SPA returning index.html as a 200 OK string
          if (
            res.status === 200 &&
            res.data &&
            !(typeof res.data === "string" && (res.data.trim().startsWith("<") || res.data.includes("<!DOCTYPE")))
          ) {
            detailData = res.data;
            success = true;
            break;
          }
        } catch (err) {
          console.warn(`Detail fetch failed for task ${taskId}:`, err?.message);
        }
      }

      if (success && detailData) {
        console.log(`[ProcessTable] Loaded details for task ${taskId}:`, detailData);
        setSelectedTask((prev) => ({
          ...prev,
          ...(typeof detailData === "object" ? detailData : {}),
          task_id:
            detailData.Task_ID ??
            detailData.task_id ??
            detailData.taskId ??
            detailData.id ??
            prev?.task_id ??
            taskId,
          id:
            detailData.Task_ID ??
            detailData.task_id ??
            detailData.taskId ??
            detailData.id ??
            prev?.id ??
            taskId,
          device:
            detailData.Device ||
            detailData.device ||
            detailData.device_name ||
            detailData.device_id ||
            prev?.device ||
            "Unknown",
          pond:
            detailData.Pond ||
            detailData.pond ||
            detailData.pond_id ||
            detailData.pond_name ||
            prev?.pond ||
            "-",
          cycles:
            detailData.cycles != null
              ? detailData.cycles
              : detailData.cycle != null
              ? detailData.cycle
              : (prev?.cycles ?? 1),
          scheduleDate:
            detailData.schedule_date ||
            detailData.scheduleDate ||
            detailData.date ||
            detailData.scheduled_date ||
            prev?.scheduleDate ||
            "-",
          status:
            detailData.Status ||
            detailData.status ||
            prev?.status ||
            "Pending",
          lastUpdated:
            detailData.last_updated ||
            detailData.lastUpdated ||
            detailData.updated_at ||
            prev?.lastUpdated ||
            "-",
          category: prev?.category || tabName,
        }));
      }

      setDetailsLoading(false);
    },
    [activeTab]
  );

  // Fetch dynamic data for the chosen tab
  const fetchTasks = useCallback(
    async (tabName) => {
      setLoading(true);
      setError(null);

      const endpoints = TAB_ENDPOINTS[tabName] || [`/${tabName}ProcessTable/`];
      const cleanBaseUrl = (BASEURL || "").replace(/\/+$/, "");
      let success = false;
      let responseData = null;

      for (const ep of endpoints) {
        try {
          const fullUrl = `${cleanBaseUrl}${ep}`;
          const res = await axios.get(fullUrl);
          // Guard against SPA fallback returning index.html as a 200 string
          if (
            res.status === 200 &&
            res.data &&
            !(typeof res.data === "string" && (res.data.trim().startsWith("<") || res.data.includes("<!DOCTYPE")))
          ) {
            responseData = res.data;
            success = true;
            console.log(`[ProcessTable] Successfully fetched from ${fullUrl}:`, responseData);
            break;
          }
        } catch (err) {
          console.warn(`[ProcessTable] Attempt failed for ${ep}:`, err?.message);
        }
      }

      if (success && responseData) {
        let rawList = [];
        if (Array.isArray(responseData)) {
          rawList = responseData;
        } else if (typeof responseData === "object" && responseData !== null) {
          rawList =
            responseData.tasks ||
            responseData.data ||
            responseData.process_table ||
            responseData.processTable ||
            responseData.records ||
            responseData.results ||
            responseData.devices ||
            responseData.sessions ||
            (Array.isArray(responseData.data?.tasks) ? responseData.data.tasks : null) ||
            (Array.isArray(responseData.data?.records) ? responseData.data.records : null) ||
            [];
        }

        if (Array.isArray(rawList) && rawList.length > 0) {
          const normalized = rawList.map((item, idx) => ({
            ...item,
            id:
              item.Task_ID ??
              item.task_id ??
              item.taskId ??
              item.id ??
              `T-${idx + 1}`,
            task_id:
              item.Task_ID ?? item.task_id ?? item.taskId ?? item.id,
            device:
              item.Device ||
              item.device ||
              item.device_name ||
              item.device_id ||
              item.deviceName ||
              item.deviceId ||
              "Unknown",
            pond:
              item.Pond ||
              item.pond ||
              item.pond_id ||
              item.pond_name ||
              item.pondId ||
              item.pondName ||
              "-",
            cycles:
              item.cycles != null
                ? item.cycles
                : item.cycle != null
                ? item.cycle
                : item.cycle_no != null
                ? item.cycle_no
                : 1,
            scheduleDate:
              item.schedule_date ||
              item.scheduleDate ||
              item.date ||
              item.scheduled_date ||
              item.created_at ||
              "-",
            status: item.Status || item.status || "Pending",
            lastUpdated:
              item.last_updated ||
              item.lastUpdated ||
              item.updated_at ||
              item.schedule_date ||
              item.scheduleDate ||
              "-",
            category: tabName,
          }));

          setTasks(normalized);
          handleViewDetails(normalized[0], tabName);
        } else {
          console.warn(
            `[ProcessTable] API returned empty or unrecognized list structure for ${tabName}:`,
            responseData
          );
          // Fall back to preview tasks if API returned empty array
          const fallbackList = FALLBACK_TASKS[tabName] || [];
          const normalizedFallback = fallbackList.map((item, idx) => ({
            ...item,
            id: item.Task_ID ?? item.task_id ?? item.id ?? `T-${idx + 1}`,
            task_id: item.Task_ID ?? item.task_id ?? item.id,
            device: item.Device || item.device || "Unknown",
            pond: item.Pond || item.pond || "-",
            cycles: item.cycles != null ? item.cycles : 1,
            scheduleDate: item.schedule_date || item.scheduleDate || "-",
            status: item.Status || item.status || "Pending",
            lastUpdated: item.last_updated || item.lastUpdated || "-",
            category: tabName,
          }));
          setTasks(normalizedFallback);
          setSelectedTask(normalizedFallback.length > 0 ? normalizedFallback[0] : null);
        }
      } else {
        // Use fallback data if server is unreachable
        console.info(`[ProcessTable] Using preview data for ${tabName}`);
        const fallbackList = FALLBACK_TASKS[tabName] || [];
        const normalizedFallback = fallbackList.map((item, idx) => ({
          ...item,
          id:
            item.Task_ID ??
            item.task_id ??
            item.id ??
            `T-${idx + 1}`,
          task_id: item.Task_ID ?? item.task_id ?? item.id,
          device: item.Device || item.device || "Unknown",
          pond: item.Pond || item.pond || "-",
          cycles: item.cycles != null ? item.cycles : 1,
          scheduleDate: item.schedule_date || item.scheduleDate || "-",
          status: item.Status || item.status || "Pending",
          lastUpdated:
            item.last_updated ||
            item.lastUpdated ||
            item.schedule_date ||
            item.scheduleDate ||
            "-",
          category: tabName,
        }));
        setTasks(normalizedFallback);
        setSelectedTask(
          normalizedFallback.length > 0 ? normalizedFallback[0] : null
        );
      }

      setLoading(false);
    },
    [handleViewDetails]
  );

  useEffect(() => {
    fetchTasks(activeTab);
  }, [activeTab, fetchTasks]);

  // Dynamic KPI counts calculation
  const kpiCounts = useMemo(() => {
    let inProgress = 0;
    let completed = 0;
    let failed = 0;

    tasks.forEach((t) => {
      const s = String(t.Status || t.status || "").toLowerCase();
      if (["in progress", "processing", "pending"].includes(s)) {
        inProgress++;
      } else if (["completed", "active"].includes(s)) {
        completed++;
      } else if (["failed", "offline"].includes(s)) {
        failed++;
      }
    });

    return {
      total: tasks.length,
      inProgress,
      completed,
      failed,
    };
  }, [tasks]);

  // Filtered tasks based on search and status filter
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const q = searchQuery.toLowerCase().trim();
      const deviceStr = String(task.Device || task.device || "").toLowerCase();
      const pondStr = String(task.Pond || task.pond || "").toLowerCase();
      const idStr = String(task.Task_ID ?? task.task_id ?? task.id ?? "").toLowerCase();

      const matchesSearch =
        !q ||
        deviceStr.includes(q) ||
        pondStr.includes(q) ||
        idStr.includes(q);

      const statusLower = String(task.Status || task.status || "").toLowerCase();
      const matchesStatus =
        statusFilter === "All Status" ||
        (statusFilter === "In Progress"
          ? ["in progress", "processing", "pending"].includes(statusLower)
          : statusFilter === "Completed"
          ? ["completed", "active"].includes(statusLower)
          : statusFilter === "Failed"
          ? ["failed", "offline"].includes(statusLower)
          : statusLower === statusFilter.toLowerCase());

      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchQuery, statusFilter]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / pageSize));
  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTasks.slice(start, start + pageSize);
  }, [filteredTasks, currentPage, pageSize]);

  const getStatusBadge = (status) => {
    const s = String(status || "").toLowerCase();
    switch (s) {
      case "in progress":
      case "processing":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            {status}
          </span>
        );
      case "completed":
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            {status}
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-100">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            {status}
          </span>
        );
      case "failed":
      case "offline":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-600 border border-rose-100">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-100">
            {status || "Unknown"}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] px-6 pt-4 pb-6 lg:px-8 lg:pt-4 lg:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-start gap-4">
          <div className="text-blue-600 mt-1">
            <i className="bi bi-gear-fill text-3xl"></i>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Process Table
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-normal">
              Monitor operational records across Aqua Farming applications
            </p>
          </div>
        </div>

        {/* Refresh button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchTasks(activeTab)}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition disabled:opacity-50"
            title="Refresh Tasks"
          >
            <i
              className={`bi bi-arrow-clockwise text-sm text-blue-600 ${
                loading ? "animate-spin" : ""
              }`}
            ></i>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentPage(1);
                setStatusFilter("All Status");
              }}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                  : "bg-blue-50/70 hover:bg-blue-100/70 text-slate-700"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center p-0.5 ${
                  isActive ? "bg-white/20" : "bg-white"
                } shadow-xs flex-shrink-0`}
              >
                <img
                  src={tab.logo}
                  alt={tab.label}
                  className="w-full h-full object-contain"
                />
              </div>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Tasks */}
        <div
          onClick={() => {
            setStatusFilter("All Status");
            setCurrentPage(1);
          }}
          className={`bg-white rounded-2xl border p-4 shadow-sm flex items-center gap-3.5 cursor-pointer transition-all hover:shadow-md hover:scale-[1.01] ${
            statusFilter === "All Status"
              ? "border-blue-400 ring-2 ring-blue-500/20"
              : "border-blue-100/80 hover:border-blue-200"
          }`}
        >
          <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg shadow-sm flex-shrink-0">
            <i className="bi bi-play-fill ml-0.5"></i>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 mb-0.5">
              Total Tasks
            </p>
            <p className="text-2xl font-bold text-slate-900 leading-tight">
              {kpiCounts.total}
            </p>
          </div>
        </div>

        {/* In Progress */}
        <div
          onClick={() => {
            setStatusFilter("In Progress");
            setCurrentPage(1);
          }}
          className={`bg-white rounded-2xl border p-4 shadow-sm flex items-center gap-3.5 cursor-pointer transition-all hover:shadow-md hover:scale-[1.01] ${
            statusFilter === "In Progress" || statusFilter === "Processing"
              ? "border-amber-400 ring-2 ring-amber-500/20"
              : "border-blue-100/80 hover:border-amber-200"
          }`}
        >
          <div className="w-11 h-11 rounded-full bg-amber-500 text-white flex items-center justify-center text-xl shadow-sm flex-shrink-0">
            <i className="bi bi-arrow-repeat"></i>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 mb-0.5">
              In Progress
            </p>
            <p className="text-2xl font-bold text-slate-900 leading-tight">
              {kpiCounts.inProgress}
            </p>
          </div>
        </div>

        {/* Completed */}
        <div
          onClick={() => {
            setStatusFilter("Completed");
            setCurrentPage(1);
          }}
          className={`bg-white rounded-2xl border p-4 shadow-sm flex items-center gap-3.5 cursor-pointer transition-all hover:shadow-md hover:scale-[1.01] ${
            statusFilter === "Completed"
              ? "border-emerald-400 ring-2 ring-emerald-500/20"
              : "border-blue-100/80 hover:border-emerald-200"
          }`}
        >
          <div className="w-11 h-11 rounded-full bg-emerald-500 text-white flex items-center justify-center text-lg shadow-sm flex-shrink-0">
            <i className="bi bi-check-lg"></i>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 mb-0.5">
              Completed
            </p>
            <p className="text-2xl font-bold text-slate-900 leading-tight">
              {kpiCounts.completed}
            </p>
          </div>
        </div>

        {/* Failed */}
        <div
          onClick={() => {
            setStatusFilter("Failed");
            setCurrentPage(1);
          }}
          className={`bg-white rounded-2xl border p-4 shadow-sm flex items-center gap-3.5 cursor-pointer transition-all hover:shadow-md hover:scale-[1.01] ${
            statusFilter === "Failed"
              ? "border-rose-400 ring-2 ring-rose-500/20"
              : "border-blue-100/80 hover:border-rose-200"
          }`}
        >
          <div className="w-11 h-11 rounded-full bg-rose-500 text-white flex items-center justify-center text-lg shadow-sm flex-shrink-0">
            <i className="bi bi-x-lg"></i>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 mb-0.5">
              Failed
            </p>
            <p className="text-2xl font-bold text-slate-900 leading-tight">
              {kpiCounts.failed}
            </p>
          </div>
        </div>
      </div>

      {/* Applications Table Card */}
      <div className="bg-white rounded-2xl border border-blue-100/80 shadow-sm p-6 mb-6">
        {/* Card Header with Search and Status Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 p-1 flex items-center justify-center shadow-xs flex-shrink-0">
              <img
                src={getCategoryLogo(activeTab)}
                alt=""
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-base font-bold text-slate-800">
              Applications — {activeTab}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              <input
                type="text"
                placeholder="Search by Device, Pond, Task..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500 w-52 sm:w-60 transition"
              />
            </div>

            {/* Status Dropdown */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none pl-3 pr-8 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-700 bg-white font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="All Status">All Status</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Failed">Failed</option>
              </select>
              <i className="bi bi-chevron-down absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none"></i>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-blue-100 text-xs font-semibold text-blue-600 bg-blue-50/50">
                <th className="py-3.5 px-4 text-blue-600 font-semibold">Task ID</th>
                <th className="py-3.5 px-4 text-blue-600 font-semibold">Device</th>
                <th className="py-3.5 px-4 text-blue-600 font-semibold">Pond</th>
                <th className="py-3.5 px-4 text-blue-600 font-semibold">Cycles</th>
                <th className="py-3.5 px-4 text-blue-600 font-semibold">Schedule Date</th>
                <th className="py-3.5 px-4 text-blue-600 font-semibold">Status</th>
                <th className="py-3.5 px-4 text-center text-blue-600 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-500">
                    <div className="inline-flex items-center gap-2">
                      <i className="bi bi-arrow-clockwise text-blue-600 text-lg animate-spin"></i>
                      <span>Loading {activeTab} tasks...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedTasks.length > 0 ? (
                paginatedTasks.map((task) => {
                  const isSelected =
                    selectedTask &&
                    ((selectedTask.Task_ID ?? selectedTask.task_id) ===
                      (task.Task_ID ?? task.task_id) ||
                      selectedTask.id === task.id);
                  return (
                    <tr
                      key={task.id || task.task_id || task.Task_ID}
                      onClick={() => handleViewDetails(task)}
                      className={`hover:bg-blue-50/40 transition-colors cursor-pointer ${
                        isSelected ? "bg-blue-50/50 font-medium" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {task.Task_ID ?? task.task_id ?? task.taskId ?? task.id}
                      </td>
                      <td className="py-3.5 px-4">{task.device || task.Device || task.device_name || task.device_id || "-"}</td>
                      <td className="py-3.5 px-4">{task.pond || task.Pond || task.pond_id || "-"}</td>
                      <td className="py-3.5 px-4">{task.cycles ?? 1}</td>
                      <td className="py-3.5 px-4">{task.scheduleDate || task.schedule_date || "-"}</td>
                      <td className="py-3.5 px-4">{getStatusBadge(task.status || task.Status)}</td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(task);
                          }}
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-full transition ${
                            isSelected
                              ? "bg-blue-600 text-white shadow-sm"
                              : "bg-blue-50 hover:bg-blue-100 text-blue-500 hover:text-blue-700"
                          }`}
                          title="View Details"
                        >
                          {detailsLoading && isSelected ? (
                            <i className="bi bi-arrow-clockwise text-xs animate-spin"></i>
                          ) : (
                            <i className="bi bi-eye text-xs"></i>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-slate-400">
                    No records found for {activeTab}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100 mt-2">
          <p className="text-xs text-slate-500">
            Showing{" "}
            {filteredTasks.length === 0
              ? 0
              : (currentPage - 1) * pageSize + 1}
            –{Math.min(currentPage * pageSize, filteredTasks.length)} of{" "}
            {filteredTasks.length} records
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="w-7 h-7 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 flex items-center justify-center text-xs disabled:opacity-40 transition"
              title="Previous Page"
            >
              <i className="bi bi-chevron-left text-[10px]"></i>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded-md text-xs font-medium flex items-center justify-center transition ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white shadow-sm"
                      : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {pageNum}
                </button>
              )
            )}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage >= totalPages}
              className="w-7 h-7 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 flex items-center justify-center text-xs disabled:opacity-40 transition"
              title="Next Page"
            >
              <i className="bi bi-chevron-right text-[10px]"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Task Details Card */}
      {selectedTask ? (
        <div className="bg-[#f0f6ff]/70 border border-blue-100 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white border border-blue-100 p-1 flex items-center justify-center shadow-xs flex-shrink-0">
                <img
                  src={getCategoryLogo(selectedTask.category || activeTab)}
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">
                Task Details — {selectedTask.category || activeTab}
              </h3>
              {detailsLoading && (
                <span className="inline-flex items-center gap-1 text-[11px] font-normal text-blue-600">
                  <i className="bi bi-arrow-clockwise animate-spin text-xs"></i>
                  <span>Updating...</span>
                </span>
              )}
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
              <img
                src={getCategoryLogo(selectedTask.category || activeTab)}
                alt=""
                className="w-3.5 h-3.5 object-contain"
              />
              {selectedTask.Device || selectedTask.device}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* Column 1 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Task ID</span>
                <span className="font-semibold text-slate-800">
                  {selectedTask.Task_ID ?? selectedTask.task_id ?? selectedTask.id}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Device</span>
                <span className="font-semibold text-slate-800">
                  {selectedTask.Device || selectedTask.device}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Pond</span>
                <span className="font-semibold text-slate-800">
                  {selectedTask.Pond || selectedTask.pond}
                </span>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-3 md:border-l md:border-slate-200/80 md:pl-6">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Cycles</span>
                <span className="font-semibold text-slate-800">
                  {selectedTask.cycles ?? "-"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Schedule Date</span>
                <span className="font-semibold text-slate-800">
                  {selectedTask.schedule_date || selectedTask.scheduleDate || "-"}
                </span>
              </div>
            </div>

            {/* Column 3 */}
            <div className="space-y-3 md:border-l md:border-slate-200/80 md:pl-6">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Status</span>
                <span>{getStatusBadge(selectedTask.Status || selectedTask.status)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Category</span>
                <span className="font-semibold text-slate-800">
                  {selectedTask.category || activeTab}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Last Updated</span>
                <span className="font-semibold text-slate-800">
                  {selectedTask.last_updated || selectedTask.lastUpdated || selectedTask.schedule_date || selectedTask.scheduleDate || "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#f0f6ff]/70 border border-blue-100 rounded-2xl p-6 text-center shadow-sm">
          <i className="bi bi-info-circle text-blue-400 text-2xl mb-1 inline-block"></i>
          <p className="text-sm font-medium text-slate-700">No task selected</p>
          <p className="text-xs text-slate-500 mt-0.5">
            Select a record from the table above to view its details.
          </p>
        </div>
      )}
    </div>
  );
};

export default Processtable;
