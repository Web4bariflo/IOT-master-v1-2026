import PowerMonImg from "../../../assets/Images/PowerMon.png"
export default function Header() {
  return(
    <div className="flex justify-between bg-[#FFF7E6] p-4 rounded items-ceneter">
      <div className="flex gap-7 items-center">
        <img src={PowerMonImg} alt="" className="w-10 h-10"/>
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold text-gray-900">Powermon Paused</h2>
          <p className="text-sm font-semibold text-gray-900">Powermon Window: 6:00 AM - 6:34 AM</p>
        </div>
      </div>
      <div className="flex gap-3">
        <button className="bg-blue-500 text-white rounded-lg w-18 h-9 px-4 py-2 text-sm font-semibold">Start Schedule</button>
        <button className="bg-red-500 text-white rounded-lg w-18 h-9 px-4 py-2 text-sm font-semibold">Abort</button>
      </div>
    </div>
  );
}