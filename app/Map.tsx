"use client";

import { MouseEvent, useCallback, useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Popup,
  Marker,
  useMapEvents,
  LayersControl,
  LayerGroup,
} from "react-leaflet";
import { ErrorEvent, Icon, LatLngTuple, Map } from "leaflet";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { takePhoto, savePhoto, getPhotosForBreedingSites } from "@/app/photos";
import { addBreedingSite, BreedingSite, removeBreedingSite } from "@/redux/slices/breeding_sites";
import { PhotoId } from "@/app/photos.d";
import { getBreedingSites, getMosquitoTraps } from "@/redux/selectors";
import Image from "next/image";
import { LoggingType } from "@/app/index.d";
import { addMosquitoTrap, MosquitoTrap, removeMosquitoTrap } from "@/redux/slices/mosquito_traps";


const MAP_PIN_HEIGHT = 50;
const MAP_PIN_WIDTH = 33;

const LogLocationButton = (
  {
    location,
    loggingType,
    onFinish,
  }: {
    location: LatLngTuple;
    loggingType: LoggingType;
    onFinish?: () => void;
  }
) => {
  const dispatch = useAppDispatch();

  const handleTakePhotoClick = useCallback(
    async (event: MouseEvent) => {
      event.stopPropagation();
      const f = await takePhoto();
      const id = await savePhoto(f);
      dispatch(addBreedingSite({
        location,
        photoId: id,
      }));
      onFinish?.();
    },
    [
      dispatch,
      location,
      onFinish,
    ]
  );

  const handleLogTrap = useCallback((event: MouseEvent) => {
    event.stopPropagation();
    dispatch(addMosquitoTrap({
      location,
    }));
    onFinish?.();
  }, [
    dispatch,
    location,
    onFinish,
  ]);

  if (loggingType === LoggingType.MOSQUITO_TRAP) {
    return (
      <button
        onClick={handleLogTrap}
        className="w-14 p-2 cursor-pointer bg-transparent border rounded flex flex-col items-center"
      >
        <Image
          src="/no_mosquito.png"
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

  return (
    <button
      onClick={handleTakePhotoClick}
      className="w-14 p-2 cursor-pointer bg-transparent border rounded flex flex-col items-center"
    >
      <Image
        src="/bucket.png"
        alt="An icon of a bucket, representing a source of standing water"
        width={32}
        height={32}
      />
      <div>
        Log standing water
      </div>
    </button>
  );
}

const BreedingSiteMarker = (
  {
    location,
    photo,
  }: {
    location: LatLngTuple;
    photo?: File | null;
  }
) => {
  const dispatch = useAppDispatch();

  const handleRemoveBreedingGround = useCallback((event: MouseEvent) => {
    event.stopPropagation();
    dispatch(removeBreedingSite(location));
  }, [
    dispatch,
    location,
  ]);

  return (
    <Marker
      position={location}
      icon={
        new Icon({
          iconUrl: "bucket_map_pin.png",
          iconSize: [33, MAP_PIN_HEIGHT],
          iconAnchor: [Math.floor(33 / 2), MAP_PIN_HEIGHT],
        })
      }
    >
      <Popup
        className="w-80"
      >
        <header className="flex">
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
        {
          photo ? (
            <img
              src={URL.createObjectURL(photo)}
              alt="Image of submitted breeding ground"
            />
          ) : null
        }
      </Popup>
    </Marker>
  );
};

const MosquitoTrapMarker = (
  {
    location,
  }: {
    location: LatLngTuple;
  }
) => {
  const dispatch = useAppDispatch();

  const handleRemoveTrap = useCallback((event: MouseEvent) => {
    event.stopPropagation();
    dispatch(removeMosquitoTrap(location));
  }, [
    dispatch,
    location,
  ]);

  return (
    <Marker
      position={location}
      icon={new Icon({
        iconUrl: "/mosquito_trap_pin.png",
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
    breedingSitePhotos,
    mosquitoTraps,
  }: {
    breedingSites: BreedingSite[];
    breedingSitePhotos: { [photoId: PhotoId]: File | null };
    mosquitoTraps: MosquitoTrap[];
  }
) => {
  const breedingSiteMarkers = breedingSites.map((breedingSite, index) => (
    <BreedingSiteMarker
      key={index}
      location={breedingSite.location}
      photo={breedingSitePhotos[breedingSite.photoId]}
    />
  ));

  const mosquitoTrapMarkers = mosquitoTraps.map((trap, index) => (
    <MosquitoTrapMarker
      key={index}
      location={trap.location}
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
    breedingSitePhotos,
    mosquitoTraps,
    onSetCenter,
    onLocateError,
  }: {
    breedingSites: BreedingSite[];
    breedingSitePhotos: { [photoId: PhotoId]: File | null };
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
      const p: LatLngTuple = [e.latlng.lat, e.latlng.lng];
      setPopupPosition(p);
    },
  });

  useEffect(() => {
    map.locate();
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
        breedingSitePhotos={breedingSitePhotos}
        mosquitoTraps={mosquitoTraps}
      />
      {popupPosition ? (
        <Popup position={popupPosition}>
          <div className="flex gap-x-1">
            <LogLocationButton
              location={popupPosition!}
              loggingType={LoggingType.BREEDING_SITE}
              onFinish={closePopup}
            />
            <LogLocationButton
              location={popupPosition!}
              loggingType={LoggingType.MOSQUITO_TRAP}
              onFinish={closePopup}
            />
          </div>
        </Popup>
      ) : null}
    </>
  );
};

export const MapContainerComponent = () => {
  const [center, setCenter] = useState<LatLngTuple|null>(null);
  const [breedingSitePhotos, setBreedingSitePhotos] = useState<{ [photoId: PhotoId]: File | null }>({});
  const [locateError, setLocateError] = useState(false);

  const mosquitoTraps = useAppSelector(getMosquitoTraps);

  const breedingSites = useAppSelector(getBreedingSites);

  useEffect(() => {
    getPhotosForBreedingSites(breedingSites).then((photos) => {
      setBreedingSitePhotos(photos);
    });
  }, [
    breedingSites,
    setBreedingSitePhotos,
  ]);

  const handleSetCenter = useCallback((center: LatLngTuple, map: Map) => {
    setCenter(center);
    map.setView(center);
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
      result.onchange = (event) => {
        if (result.state !== "denied") {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setCenter([position.coords.latitude, position.coords.longitude]);
            },
            (err) => {
              console.error(err);
            }
          );
        }
      };
    }
  }, [
    setLocateError,
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
          breedingSitePhotos={breedingSitePhotos}
          mosquitoTraps={mosquitoTraps}
        />
      </MapContainer>
    </>
  );
};

export default MapContainerComponent;
