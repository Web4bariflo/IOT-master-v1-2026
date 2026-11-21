import React, { useState, useMemo } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
const INITIAL_ASSETS = [
{
id: "AST-00124",
name: "FEEDER-01",
pond: "POND 1",
category: "AUTO FEEDER",
model: "BF-FD-200",
installDate: "14 APR 2025",
status: "IN PROGRESS",
lastHeartbeat: "14 APR 2025, 09:15 AM",
},
{
id: "AST-00123",
name: "FEEDER-02",
pond: "POND 2",
category: "AUTO FEEDER",
model: "BF-FD-200",
installDate: "14 APR 2025",
status: "COMPLETED",
lastHeartbeat: "14 APR 2025, 08:30 AM",
},
{
id: "AST-00122",
name: "AERATOR-01",
pond: "POND 1",
category: "AERATOR",
model: "BF-AR-150",
installDate: "13 APR 2025",
status: "COMPLETED",
lastHeartbeat: "13 APR 2025, 07:45 PM",
},
{
id: "AST-00121",
name: "POWERMON-01",
pond: "POND 3",
category: "POWER MONITORING",
model: "BF-PM-100",
installDate: "13 APR 2025",
status: "IN PROGRESS",
lastHeartbeat: "13 APR 2025, 06:00 PM",
},
{
id: "AST-00120",
name: "FEEDER-03",
pond: "POND 2",
category: "AUTO FEEDER",
model: "BF-FD-200",
installDate: "13 APR 2025",
status: "FAILED",
lastHeartbeat: "13 APR 2025, 05:15 PM",
},
{
id: "AST-00119",
name: "AERATOR-02",
pond: "POND 2",
category: "AERATOR",
model: "BF-AR-150",
installDate: "12 APR 2025",
status: "COMPLETED",
lastHeartbeat: "13 APR 2025, 02:40 PM",
},
{
id: "AST-00118",
name: "POWERMON-02",
pond: "POND 1",
category: "POWER MONITORING",
model: "BF-PM-100",
installDate: "11 APR 2025",
status: "COMPLETED",
lastHeartbeat: "13 APR 2025, 11:35 AM",
},
{
id: "AST-00117",
name: "FEEDER-04",
pond: "POND 3",
category: "AUTO FEEDER",
model: "BF-FD-200",
installDate: "10 APR 2025",
status: "COMPLETED",
lastHeartbeat: "13 APR 2025, 09:30 AM",
},
];
const Assets = () => {
const [activeTab, setActiveTab] = useState("ALL ASSETS");
const [searchQuery, setSearchQuery] = useState("");
const [statusFilter, setStatusFilter] = useState("ALL STATUS");
const [selectedAsset, setSelectedAsset] = useState(INITIAL_ASSETS[0]);
const [currentPage, setCurrentPage] = useState(1);
const pageSize = 5;
const tabs = [
{
id: "ALL ASSETS",
label: "ALL ASSETS",
icon: <i className="bi bi-grid-fill text-sm" />,
},
{
id: "AUTO FEEDER",
label: "AUTO FEEDER",
icon: (
<svg
className="w-4 h-4 fill-current"
viewBox="0 0 24 24"
xmlns="http://www.w3.org/2000/svg"
>
<path d="M12 2a1 1 0 0 1 1 1v1.07A7.002 7.002 0 0 1 19 11v1h1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-1.14a7.001 7.001 0 0 1-5.86 5.86V23a1 1 0 1 1-2 0v-1.14A7.001 7.001 0 0 1 5.14 16H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h1v-1a7.002 7.002 0 0 1 6-6.93V3a1 1 0 0 1 1-1zm0 4a5 5 0 0 0-5 5v2h10v-2a5 5 0 0 0-5-5zm-3 9a5.002 5.002 0 0 0 6 0H9z" />
</svg>
),
},
{
id: "AERATOR",
label: "AERATOR",
icon: <i className="bi bi-fan text-sm" />,
},
{
id: "POWER MONITORING",
label: "POWER MONITORING",
icon: <i className="bi bi-lightning-charge-fill text-sm" />,
},
];
// Filtered assets
const filteredAssets = useMemo(() => {
return INITIAL_ASSETS.filter((asset) => {
const matchesTab =
activeTab === "ALL ASSETS" || asset.category === activeTab;
const matchesSearch =
asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
asset.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
asset.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
asset.pond.toLowerCase().includes(searchQuery.toLowerCase());
const matchesStatus =
statusFilter === "ALL STATUS" ||
(statusFilter === "IN PROGRESS"
? ["in progress", "processing", "pending"].includes(asset.status.toLowerCase())
: statusFilter === "COMPLETED"
? ["completed", "active"].includes(asset.status.toLowerCase())
: statusFilter === "FAILED"
? ["failed", "offline"].includes(asset.status.toLowerCase())
: asset.status.toLowerCase() === statusFilter.toLowerCase());
return matchesTab && matchesSearch && matchesStatus;
});
}, [activeTab, searchQuery, statusFilter]);
const totalRecords = 24;
const paginatedAssets = filteredAssets.slice(
(currentPage - 1) * pageSize,
currentPage * pageSize
);
const getStatusBadge = (status) => {
const s = String(status || "").toUpperCase();
switch (s) {
case "IN PROGRESS":
case "PROCESSING":
case "PENDING":
return (
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-100 uppercase">
<span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
IN PROGRESS
</span>
);
case "COMPLETED":
case "ACTIVE":
return (
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase">
<span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
COMPLETED
</span>
);
case "FAILED":
case "OFFLINE":
return (
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-600 border border-rose-100 uppercase">
<span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
FAILED
</span>
);
default:
return (
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100 uppercase">
<span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
{s}
</span>
);
}
};
return (
<div className="min-h-screen bg-[#f4f7fb] px-6 pt-4 pb-6 lg:px-8 lg:pt-4 lg:pb-8 uppercase">
{/* Header /}
<div className="flex items-start gap-4 mb-6">
<div className="text-blue-600 mt-1">
<i className="bi bi-box-seam-fill text-3xl"></i>
</div>
<div>
<h1 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">
ASSETS
</h1>
<p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-normal uppercase">
MONITOR EQUIPMENT STATUS, DEPLOYMENT, AND OPERATIONAL RECORDS ACROSS AQUA FARMING PONDS
</p>
</div>
</div>
{/* Tabs /}
<div className="flex items-center gap-3 mb-5 overflow-x-auto pb-1">
{tabs.map((tab) => {
const isActive = activeTab === tab.id;
return (
<button
key={tab.id}
onClick={() => {
setActiveTab(tab.id);
setCurrentPage(1);
}}
className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer uppercase ${
isActive
? "bg-blue-600 text-white shadow-sm shadow-blue-500/25 border border-blue-600"
: "bg-white text-slate-700 border border-slate-300 shadow-sm hover:bg-slate-50 hover:border-slate-400 hover:text-slate-900"
}`}
>
<div
className={`w-6 h-6 rounded-md flex items-center justify-center ${
isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600 border border-slate-200/60"
} flex-shrink-0`}
>
{tab.icon}
</div>
<span className="uppercase">{tab.label}</span>
</button>
);
})}
</div>
{/* KPI Summary Cards /}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
{/* Total Tasks /}
<div
onClick={() => {
setStatusFilter("ALL STATUS");
setCurrentPage(1);
}}
className={`bg-white rounded-2xl border p-4 shadow-sm flex items-center gap-3.5 cursor-pointer transition-all hover:shadow-md hover:scale-[1.01] ${
statusFilter === "ALL STATUS"
? "border-blue-400 ring-2 ring-blue-500/20"
: "border-blue-100/80 hover:border-blue-200"
}`}
>
<div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg shadow-sm flex-shrink-0">
<i className="bi bi-play-fill ml-0.5"></i>
</div>
<div>
<p className="text-xs font-medium text-slate-500 mb-0.5 uppercase">
TOTAL TASKS
</p>
<p className="text-2xl font-bold text-slate-900 leading-tight">24</p>
</div>
</div>
{/* In Progress /}
<div
onClick={() => {
setStatusFilter("IN PROGRESS");
setCurrentPage(1);
}}
className={`bg-white rounded-2xl border p-4 shadow-sm flex items-center gap-3.5 cursor-pointer transition-all hover:shadow-md hover:scale-[1.01] ${
statusFilter === "IN PROGRESS"
? "border-amber-400 ring-2 ring-amber-500/20"
: "border-blue-100/80 hover:border-amber-200"
}`}
>
<div className="w-11 h-11 rounded-full bg-amber-500 text-white flex items-center justify-center text-xl shadow-sm flex-shrink-0">
<i className="bi bi-arrow-repeat"></i>
</div>
<div>
<p className="text-xs font-medium text-slate-500 mb-0.5 uppercase">
IN PROGRESS
</p>
<p className="text-2xl font-bold text-slate-900 leading-tight">6</p>
</div>
</div>
{/* Completed /}
<div
onClick={() => {
setStatusFilter("COMPLETED");
setCurrentPage(1);
}}
className={`bg-white rounded-2xl border p-4 shadow-sm flex items-center gap-3.5 cursor-pointer transition-all hover:shadow-md hover:scale-[1.01] ${
statusFilter === "COMPLETED"
? "border-emerald-400 ring-2 ring-emerald-500/20"
: "border-blue-100/80 hover:border-emerald-200"
}`}
>
<div className="w-11 h-11 rounded-full bg-emerald-500 text-white flex items-center justify-center text-lg shadow-sm flex-shrink-0">
<i className="bi bi-check-lg"></i>
</div>
<div>
<p className="text-xs font-medium text-slate-500 mb-0.5 uppercase">
COMPLETED
</p>
<p className="text-2xl font-bold text-slate-900 leading-tight">16</p>
</div>
</div>
{/* Failed /}
<div
onClick={() => {
setStatusFilter("FAILED");
setCurrentPage(1);
}}
className={`bg-white rounded-2xl border p-4 shadow-sm flex items-center gap-3.5 cursor-pointer transition-all hover:shadow-md hover:scale-[1.01] ${
statusFilter === "FAILED"
? "border-rose-400 ring-2 ring-rose-500/20"
: "border-blue-100/80 hover:border-rose-200"
}`}
>
<div className="w-11 h-11 rounded-full bg-rose-500 text-white flex items-center justify-center text-lg shadow-sm flex-shrink-0">
<i className="bi bi-x-lg"></i>
</div>
<div>
<p className="text-xs font-medium text-slate-500 mb-0.5 uppercase">
FAILED
</p>
<p className="text-2xl font-bold text-slate-900 leading-tight">2</p>
</div>
</div>
</div>
{/* Assets Table Card /}
<div className="bg-white rounded-2xl border border-blue-100/80 shadow-sm p-5 mb-5">
{/* Card Header with Search and Status Filter /}
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
<div className="flex items-center gap-2">
<i className="bi bi-list-task text-slate-700 text-lg"></i>
<h2 className="text-base font-bold text-slate-800 uppercase">ASSET INVENTORY</h2>
</div>
<div className="flex items-center gap-3">
{/* Search Input /}
<div className="relative">
<i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
<input
type="text"
placeholder="SEARCH BY ASSET ID OR DEVICE..."
value={searchQuery}
onChange={(e) => {
setSearchQuery(e.target.value);
setCurrentPage(1);
}}
className="pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500 w-52 sm:w-64 transition uppercase"
/>
</div>
{/* Status Dropdown /}
<div className="relative">
<select
value={statusFilter}
onChange={(e) => {
setStatusFilter(e.target.value);
setCurrentPage(1);
}}
className="appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border border-slate-200 text-slate-700 bg-white font-medium focus:outline-none focus:border-blue-500 cursor-pointer uppercase"
>
<option value="ALL STATUS">ALL STATUS</option>
<option value="IN PROGRESS">IN PROGRESS</option>
<option value="COMPLETED">COMPLETED</option>
<option value="FAILED">FAILED</option>
</select>
<i className="bi bi-chevron-down absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none"></i>
</div>
</div>
</div>
{/* Table /}
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse uppercase">
<thead>
<tr className="border-b border-slate-200">
<th className="py-2.5 px-3.5 text-black font-semibold text-sm uppercase">ASSET ID</th>
<th className="py-2.5 px-3.5 text-black font-semibold text-sm uppercase">DEVICE NAME</th>
<th className="py-2.5 px-3.5 text-black font-semibold text-sm uppercase">POND</th>
<th className="py-2.5 px-3.5 text-black font-semibold text-sm uppercase">CATEGORY</th>
<th className="py-2.5 px-3.5 text-black font-semibold text-sm uppercase">MODEL</th>
<th className="py-2.5 px-3.5 text-black font-semibold text-sm uppercase">INSTALL DATE</th>
<th className="py-2.5 px-3.5 text-black font-semibold text-sm uppercase">STATUS</th>
<th className="py-2.5 px-3.5 text-center text-black font-semibold text-sm uppercase">ACTIONS</th>
</tr>
</thead>
<tbody className="divide-y divide-slate-100 text-sm text-slate-700">
{paginatedAssets.length > 0 ? (
paginatedAssets.map((asset) => (
<tr
key={asset.id}
onClick={() => setSelectedAsset(asset)}
className={`hover:bg-blue-50/40 transition-colors cursor-pointer ${
selectedAsset?.id === asset.id ? "bg-blue-50/30" : ""
}`}
>
<td className="py-2.5 px-3.5 font-semibold text-slate-900 uppercase">
{asset.id}
</td>
<td className="py-2.5 px-3.5 uppercase">{asset.name}</td>
<td className="py-2.5 px-3.5 uppercase">{asset.pond}</td>
<td className="py-2.5 px-3.5 uppercase">{asset.category}</td>
<td className="py-2.5 px-3.5 uppercase">{asset.model}</td>
<td className="py-2.5 px-3.5 uppercase">{asset.installDate}</td>
<td className="py-2.5 px-3.5 uppercase">{getStatusBadge(asset.status)}</td>
<td className="py-2.5 px-3.5 text-center">
<button
onClick={(e) => {
e.stopPropagation();
setSelectedAsset(asset);
}}
className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-500 hover:text-blue-700 transition"
title="VIEW DETAILS"
>
<i className="bi bi-eye text-xs"></i>
</button>
</td>
</tr>
))
) : (
<tr>
<td colSpan="8" className="text-center py-8 text-slate-400 text-sm uppercase">
NO ASSETS FOUND
</td>
</tr>
)}
</tbody>
</table>
</div>
{/* Table Footer / Pagination /}
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3.5 border-t border-slate-100 mt-2">
<p className="text-sm text-slate-500 uppercase">
SHOWING 1–{paginatedAssets.length} OF {totalRecords} RECORDS
</p>
<div className="flex items-center gap-1.5">
<button
onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
disabled={currentPage === 1}
className="w-7 h-7 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 flex items-center justify-center text-xs disabled:opacity-40 transition"
title="PREVIOUS PAGE"
>
<i className="bi bi-chevron-left text-[10px]"></i>
</button>
<button
onClick={() => setCurrentPage(1)}
className={`w-7 h-7 rounded-md text-xs font-medium flex items-center justify-center transition ${
currentPage === 1
? "bg-blue-600 text-white shadow-sm"
: "border border-slate-200 text-slate-700 hover:bg-slate-50"
}`}
>
1
</button>
<button
onClick={() => setCurrentPage(2)}
className={`w-7 h-7 rounded-md text-xs font-medium flex items-center justify-center transition ${
currentPage === 2
? "bg-blue-600 text-white shadow-sm"
: "border border-slate-200 text-slate-700 hover:bg-slate-50"
}`}
>
2
</button>
<button
onClick={() => setCurrentPage(3)}
className={`w-7 h-7 rounded-md text-xs font-medium flex items-center justify-center transition ${
currentPage === 3
? "bg-blue-600 text-white shadow-sm"
: "border border-slate-200 text-slate-700 hover:bg-slate-50"
}`}
>
3
</button>
<button
onClick={() => setCurrentPage((p) => Math.min(p + 1, 3))}
disabled={currentPage === 3}
className="w-7 h-7 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 flex items-center justify-center text-xs disabled:opacity-40 transition"
title="NEXT PAGE"
>
<i className="bi bi-chevron-right text-[10px]"></i>
</button>
</div>
</div>
</div>
{/* Asset Details Card /}
{selectedAsset && (
<div className="bg-[#f0f6ff]/70 border border-blue-100 rounded-2xl p-5 shadow-sm uppercase">
<div className="flex items-center gap-2 mb-3">
<i className="bi bi-info-circle-fill text-blue-600 text-lg"></i>
<h3 className="font-bold text-slate-800 text-base uppercase">ASSET DETAILS</h3>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
{/* Column 1 /}
<div className="space-y-3">
<div className="flex items-center justify-between text-sm">
<span className="text-slate-500 uppercase">ASSET ID</span>
<span className="font-semibold text-slate-900 uppercase">
{selectedAsset.id}
</span>
</div>
<div className="flex items-center justify-between text-sm">
<span className="text-slate-500 uppercase">DEVICE NAME</span>
<span className="font-semibold text-slate-900 uppercase">
{selectedAsset.name}
</span>
</div>
<div className="flex items-center justify-between text-sm">
<span className="text-slate-500 uppercase">POND</span>
<span className="font-semibold text-slate-900 uppercase">
{selectedAsset.pond}
</span>
</div>
</div>
{/* Column 2 /}
<div className="space-y-3 md:border-l md:border-slate-200/80 md:pl-6">
<div className="flex items-center justify-between text-sm">
<span className="text-slate-500 uppercase">CATEGORY</span>
<span className="font-semibold text-slate-900 uppercase">
{selectedAsset.category}
</span>
</div>
<div className="flex items-center justify-between text-sm">
<span className="text-slate-500 uppercase">MODEL</span>
<span className="font-semibold text-slate-900 uppercase">
{selectedAsset.model}
</span>
</div>
<div className="flex items-center justify-between text-sm">
<span className="text-slate-500 uppercase">INSTALL DATE</span>
<span className="font-semibold text-slate-900 uppercase">
{selectedAsset.installDate}
</span>
</div>
</div>
{/* Column 3 /}
<div className="space-y-3 md:border-l md:border-slate-200/80 md:pl-6">
<div className="flex items-center justify-between text-sm">
<span className="text-slate-500 uppercase">STATUS</span>
<span className="uppercase">{getStatusBadge(selectedAsset.status)}</span>
</div>
<div className="flex items-center justify-between text-sm">
<span className="text-slate-500 uppercase">LAST HEARTBEAT</span>
<span className="font-semibold text-slate-900 uppercase">
{selectedAsset.lastHeartbeat}
</span>
</div>
</div>
</div>
</div>
)}
</div>
);
};
export default Assets;