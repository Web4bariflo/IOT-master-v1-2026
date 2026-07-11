import React from 'react'
import PondMap from "../../components/ponds/PondMap";


import { POND_TABS } from "../../constants/PondTabs";

const MapTab = () => {
  return (
    <div className="h-[calc(100vh-140px)]">
      <PondMap fullView activeTab={POND_TABS.MAP} />
    </div>
  );
};

export default MapTab