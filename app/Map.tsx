"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  MapContainer,
  TileLayer,
  Popup,
  Marker,
  useMapEvents,
  LayersControl,
  LayerGroup,
  useMap,
} from "react-leaflet";
import L, { ErrorEvent, Icon, LatLngTuple, Map } from "leaflet";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { takePhoto, getImageDimensions } from "@/app/photos";
import { BreedingSite, MosquitoTrap } from "@/app/index";
import { BASE_PATH } from "@/app/path";
import { useAddBreedingSiteMutation, useRemoveBreedingSiteMutation } from "@/app/api/client/breeding_sites";
import { useAddMosquitoTrapMutation, useRemoveMosquitoTrapMutation } from "./api/client/mosquito_traps";


const MAP_PIN_HEIGHT = 50;
const MAP_PIN_WIDTH = 33;

const createLocateMeButton = () => {
  const LocateMeButton = L.Control.extend({
    onAdd(map: Map) {
      const div =  L.DomUtil.create("div", "leaflet-control")
      const btn = L.DomUtil.create("button", "bg-white leaflet-bar");
      btn.setAttribute("title", "Move the map to your current location");
      const icon = L.DomUtil.create("img", "w-8 h-8");
      btn.appendChild(icon);
      icon.src = `${BASE_PATH}/locate-me.svg`;
      div.appendChild(btn);

      btn.addEventListener("click", (ev: MouseEvent) => {
        ev.stopPropagation();
        map.locate();
      });

      return div;
    }
  });

  return new LocateMeButton({position: "topleft"});
};

const LogBreedingSiteButton = (
  {
    location,
    onFinish,
  }: {
    location: LatLngTuple;
    onFinish?: () => void;
  }
) => {
  const [addBreedingSite] = useAddBreedingSiteMutation();

  const handleTakePhotoClick = useCallback(
    async (event: React.MouseEvent) => {
      event.stopPropagation();
      const f = await takePhoto();
      const photoBuffer = await f.arrayBuffer();
      const {
        width: photo_width,
        height: photo_height,
      } = await getImageDimensions(f);

      try {
        await addBreedingSite({
          location,
          photoBuffer,
          mimeType: f.type,
          photo_width,
          photo_height,
        }).unwrap();
        onFinish?.();
      }
      catch (ex) {

      }
    },
    [
      addBreedingSite,
      location,
      onFinish,
    ]
  );

  return (
    <button
      onClick={handleTakePhotoClick}
      className="w-14 p-2 cursor-pointer bg-transparent border rounded flex flex-col items-center"
    >
      <Image
        src={`${BASE_PATH}/bucket.png`}
        alt="An icon of a bucket, representing a source of standing water"
        width={32}
        height={32}
      />
      <div>
        Log standing water
      </div>
    </button>
  );
};

const LogMosquitoTrapButton = (
  {
    location,
    onFinish,
  }: {
    location: LatLngTuple;
    onFinish?: () => void;
  }
) => {
  const [addMosquitoTrap] = useAddMosquitoTrapMutation();

  const handleLogTrap = useCallback(
    async (event: React.MouseEvent) => {
      event.stopPropagation();
      await addMosquitoTrap({
        location,
      });
      onFinish?.();
    }, [
      location,
      onFinish,
    ]
  );

  return (
    <button
      onClick={handleLogTrap}
      className="w-14 p-2 cursor-pointer bg-transparent border rounded flex flex-col items-center"
    >
      <Image
        src={`${BASE_PATH}/no_mosquito.png`}
        alt="An icon of a mosquito with a slash through it, representing a mosquito trap"
        width={32}
        height={32}
      />
      <div>
        Log a mosquito trap
      </div>
    </button>
  );
}

const BreedingSiteMarker = (
  {
    breedingSite,
  }: {
    breedingSite: BreedingSite;
  }
) => {
  const [removeBreedingSite] = useRemoveBreedingSiteMutation();
  const map = useMap();

  const handleRemoveBreedingGround = useCallback(
    async (event: React.MouseEvent) => {
      event.stopPropagation();
      await removeBreedingSite(breedingSite.id);
      map.closePopup();
    }, [
      removeBreedingSite,
      breedingSite,
    ]
  );

  return (
    <Marker
      position={breedingSite.location}
      icon={
        new Icon({
          iconUrl: `${BASE_PATH}/bucket_map_pin.png`,
          iconSize: [33, MAP_PIN_HEIGHT],
          iconAnchor: [Math.floor(33 / 2), MAP_PIN_HEIGHT],
        })
      }
    >
      <Popup
        className="w-80"
      >
        <header className="flex justify-between">
          <h4>
            Breeding ground
          </h4>
          <button
            title="Remove logged breeding ground"
            onClick={handleRemoveBreedingGround}
          >
            🗑️
          </button>
        </header>
        <Image
          src={`/api/images/${breedingSite.photo_id}`}
          alt="Image of submitted breeding ground"
          width={breedingSite.photo_width}
          height={breedingSite.photo_height}
        />
      </Popup>
    </Marker>
  );
};

const MosquitoTrapMarker = (
  {
    trap,
  }: {
    trap: MosquitoTrap;
  }
) => {
  const map = useMap();
  const [removeMosquitoTrap] = useRemoveMosquitoTrapMutation();

  const handleRemoveTrap = useCallback(
    async (event: React.MouseEvent) => {
      event.stopPropagation();
      await removeMosquitoTrap(trap.id);
      map.closePopup();
    }, [
      removeMosquitoTrap,
      trap,
      map,
    ]
  );

  return (
    <Marker
      position={trap.location}
      icon={new Icon({
        iconUrl: `${BASE_PATH}/mosquito_trap_pin.png`,
        iconSize: [MAP_PIN_WIDTH, MAP_PIN_HEIGHT],
        iconAnchor: [Math.floor(MAP_PIN_WIDTH / 2), MAP_PIN_HEIGHT],
      })}
    >
      <Popup>
        <header className="flex justify-between">
          <h4>
            Mosquito trap
          </h4>
          <button
            title="Remove logged mosquito trap"
            onClick={handleRemoveTrap}
          >
            🗑️
          </button>
        </header>
      </Popup>
    </Marker>
  );
};

const MapLayers = (
  {
    breedingSites,
    mosquitoTraps,
  }: {
    breedingSites: BreedingSite[];
    mosquitoTraps: MosquitoTrap[];
  }
) => {
  const breedingSiteMarkers = breedingSites.map((breedingSite) => (
    <BreedingSiteMarker
      key={breedingSite.id}
      breedingSite={breedingSite}
    />
  ));

  const mosquitoTrapMarkers = mosquitoTraps.map((trap) => (
    <MosquitoTrapMarker
      key={trap.id}
      trap={trap}
    />
  )) ?? [];

  return (
    <LayersControl position="topright">
      <LayersControl.Overlay name="Breeding sites" checked>
        <LayerGroup>
          {breedingSiteMarkers}
        </LayerGroup>
      </LayersControl.Overlay>
      <LayersControl.Overlay name="Mosquito traps" checked>
        <LayerGroup>
          {mosquitoTrapMarkers}
        </LayerGroup>
      </LayersControl.Overlay>
    </LayersControl>
  )
};

const MapComponent = (
  {
    breedingSites,
    mosquitoTraps,
    onSetCenter,
    onLocateError,
  }: {
    breedingSites: BreedingSite[];
    mosquitoTraps: MosquitoTrap[];
    onSetCenter: (center: LatLngTuple, map: Map) => void;
    onLocateError: (error: ErrorEvent) => void;
  }
) => {
  const [popupPosition, setPopupPosition] = useState<LatLngTuple | null>(null);

  const map = useMapEvents({
    locationfound(e) {
      const p: LatLngTuple = [e.latlng.lat, e.latlng.lng];
      onSetCenter(p, map);
    },

    locationerror(err) {
      onLocateError(err);
    },

    click(e) {
      if (popupPosition) {
        setPopupPosition(null);
        return;
      }
      const p: LatLngTuple = [e.latlng.lat, e.latlng.lng];
      setPopupPosition(p);
    },
  });

  useEffect(() => {
    map.locate();
  }, [
    map,
  ]);

  useEffect(() => {
    const control = createLocateMeButton();
    map.addControl(control);

    return () => {
      map.removeControl(control);
    };
  }, [
    map,
  ]);

  const closePopup = useCallback(() => {
    setPopupPosition(null);
  }, [
    setPopupPosition,
  ]);

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapLayers
        breedingSites={breedingSites}
        mosquitoTraps={mosquitoTraps}
      />
      {popupPosition ? (
        <Popup position={popupPosition}>
          <div>
            <header>
              <h3 className="text-lg">Log a site</h3>
            </header>
            <div className="flex gap-x-1">
              <LogBreedingSiteButton
                location={popupPosition!}
                onFinish={closePopup}
              />
              <LogMosquitoTrapButton
                location={popupPosition!}
                onFinish={closePopup}
              />
            </div>
          </div>
        </Popup>
      ) : null}
    </>
  );
};

export const MapContainerComponent = (
  {
    breedingSites,
    mosquitoTraps,
  }: {
    breedingSites: BreedingSite[];
    mosquitoTraps: MosquitoTrap[];
  }
) => {
  const [center, setCenter] = useState<LatLngTuple|null>(null);
  const [locateError, setLocateError] = useState(false);

  const handleSetCenter = useCallback((center: LatLngTuple, map: Map) => {
    setCenter(center);
    map.setView(center);
  }, [
    setCenter,
  ]);

  const locateAndSetCenter = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCenter([position.coords.latitude, position.coords.longitude]);
      },
      (err) => {
        console.error(err);
      }
    );
  }, [
    setCenter,
  ]);

  const handleLocateError = useCallback(async () => {
    setLocateError(true);
    setCenter(null);
    const result = await navigator.permissions.query({
      name: "geolocation",
    });

    if (result.state !== "granted") {
      result.onchange = () => {
        if (result.state !== "denied") {
          locateAndSetCenter();
        }
      };
    }
  }, [
    setLocateError,
    locateAndSetCenter,
  ]);

  return (
    <>
      {
        locateError ? (
          <div className="w-full bg-red-600 p-2">
            <p>
              Could not find where you are to move the map. Please give
              permission to access your location and reload the page.
            </p>
          </div>
        ) : null
      }
      <MapContainer center={center ?? [0, 0]} zoom={16} scrollWheelZoom={false}>
        <MapComponent
          onSetCenter={handleSetCenter}
          onLocateError={handleLocateError}
          breedingSites={breedingSites}
          mosquitoTraps={mosquitoTraps}
        />
      </MapContainer>
    </>
  );
};

export default MapContainerComponent;
