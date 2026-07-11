import axios from "axios";
const BASEURL = process.env.REACT_APP_IP;

export const addWorker = async(workerData) => {
  try{
      const res = await axios.post(`${BASEURL}/add-worker/`, {
        name: workerData.name,
        mobno: workerData.mobno,
        pond_id: workerData.pond_id
    });
    console.log("Worker Added:", res.data);
    return res.data;
  } catch(err) {
    console.log("Add Worker Failed:", err);
    throw err;
  }
}

export const getWorkersByPond = async(pondId) => {
  try{
    const res = await axios.get(`${BASEURL}/workers/?pond_id=${pondId}`);
    return res.data
  } catch(err) {
    console.log("Fetch Worker Failed: ", err);
    throw err;
  }
}