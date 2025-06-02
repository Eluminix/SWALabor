import { useMap } from "react-leaflet";
import { useEffect } from "react";
import type { Bundesland } from "./Map"; 

const MapZoomToSelection = ({ selected }: { selected: Bundesland | null }) => {
  const map = useMap();

  useEffect(() => {
    if (selected) {
      map.flyTo(selected.position, 7, {
        duration: 0.75,
      });
    }
  }, [selected, map]);

  return null;
};

export default MapZoomToSelection;
