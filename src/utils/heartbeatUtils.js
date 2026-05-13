// ===================================
// 🔥 HEARTBEAT UTILITIES
// ===================================

/**
* Heartbeat timeout configuration (in milliseconds)
* Default: 15 seconds (heartbeat published every 5 seconds, so 3 missed heartbeats = offline)
*/
const HEARTBEAT_TIMEOUT = 15000;

/**
* Check if a device is alive based on the last heartbeat
* @param {number} lastHeartbeatTime - Timestamp of the last heartbeat
* @param {number} timeout - Timeout threshold in milliseconds (default: 15s)
* @returns {boolean} - True if device is alive, false if offline
*/
export const isDeviceAlive = (lastHeartbeatTime, timeout = HEARTBEAT_TIMEOUT) => {
    if (!lastHeartbeatTime) return false;
    const timeSinceLastHeartbeat = Date.now() - lastHeartbeatTime;
    return timeSinceLastHeartbeat <= timeout;
};

/**
* Get device health status with detailed information
* @param {object} deviceStatus - Device status object
* @param {object} deviceHeartbeats - Device heartbeats tracking object
* @param {string} deviceId - Device ID
* @param {number} timeout - Timeout threshold in milliseconds
* @returns {object} - Device health status object
*/
export const getDeviceHealth = (deviceStatus, deviceHeartbeats, deviceId, timeout = HEARTBEAT_TIMEOUT) => {
    const status = deviceStatus[deviceId] || {};
    const heartbeat = deviceHeartbeats[deviceId] || {};
    const lastHeartbeatTime = status.lastHeartbeat || heartbeat.timestamp;

    const isAlive = isDeviceAlive(lastHeartbeatTime, timeout);
    const timeSinceHeartbeat = lastHeartbeatTime ? Date.now() - lastHeartbeatTime : null;

    return {
        deviceId,
        online: isAlive,
        lastHeartbeatTime,
        timeSinceHeartbeat,
        status: isAlive ? "ALIVE" : "OFFLINE",
        heartbeatReceived: !!heartbeat.received,
        battery: status.battery || null,
        alert: status.alert || null,
    };
};

/**
* Get time since last heartbeat in human-readable format
* @param {number} timeSinceHeartbeat - Time in milliseconds
* @returns {string} - Formatted string
*/
export const formatHeartbeatTime = (timeSinceHeartbeat) => {
    if (!timeSinceHeartbeat) return "Never";

    const seconds = Math.floor(timeSinceHeartbeat / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ${minutes % 60}m ago`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s ago`;
    return `${seconds}s ago`;
};

/**
* Filter devices by health status
* @param {array} devices - Array of device IDs
* @param {object} deviceStatus - Device status object
* @param {object} deviceHeartbeats - Device heartbeats tracking object
* @param {string} filterStatus - Filter by status: "ALIVE", "OFFLINE", "ALL"
* @param {number} timeout - Timeout threshold in milliseconds
* @returns {array} - Filtered device IDs
*/
export const filterDevicesByHealth = (
    devices,
    deviceStatus,
    deviceHeartbeats,
    filterStatus = "ALL",
    timeout = HEARTBEAT_TIMEOUT
) => {
    if (!Array.isArray(devices)) return [];

    return devices.filter((deviceId) => {
        const health = getDeviceHealth(deviceStatus, deviceHeartbeats, deviceId, timeout);

        if (filterStatus === "ALIVE") return health.online;
        if (filterStatus === "OFFLINE") return !health.online;
        return true;
    });
};

/**
* Get heartbeat statistics for a group of devices
* @param {array} devices - Array of device IDs
* @param {object} deviceStatus - Device status object
* @param {object} deviceHeartbeats - Device heartbeats tracking object
* @param {number} timeout - Timeout threshold in milliseconds
* @returns {object} - Statistics object
*/
export const getHeartbeatStats = (devices, deviceStatus, deviceHeartbeats, timeout = HEARTBEAT_TIMEOUT) => {
    if (!Array.isArray(devices) || devices.length === 0) {
        return {
            total: 0,
            alive: 0,
            offline: 0,
            alivePercentage: 0,
        };
    }

    let alive = 0;
    let offline = 0;

    devices.forEach((deviceId) => {
        const health = getDeviceHealth(deviceStatus, deviceHeartbeats, deviceId, timeout);
        if (health.online) {
            alive++;
        } else {
            offline++;
        }
    });

    return {
        total: devices.length,
        alive,
        offline,
        alivePercentage: Math.round((alive / devices.length) * 100),
    };
};

export default {
    isDeviceAlive,
    getDeviceHealth,
    formatHeartbeatTime,
    filterDevicesByHealth,
    getHeartbeatStats,
    HEARTBEAT_TIMEOUT,
};