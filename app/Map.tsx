"use client";

import { MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Popup,
  Marker,
  useMapEvents,
  LayersControl,
} from "react-leaflet";
import { Icon, LatLngTuple, Map } from "leaflet";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { takePhoto, savePhoto, getPhotosForBreedingSites } from "@/app/photos";
import { addBreedingSite, BreedingSite } from "@/redux/slices/breeding_sites";
import { PhotoId } from "@/app/photos.d";
import { getBreedingSites, getMosquitoTraps } from "@/redux/selectors";
import Image from "next/image";
import { LoggingType } from "@/app/index.d";
import { MosquitoTrap } from "@/redux/slices/mosquito_traps";


interface LayerMarker {
  loggingType: LoggingType;
  location: LatLngTuple;
}

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

  const handleLogTrap = useCallback(() => {}, []);

  if (loggingType === LoggingType.MOSQUITO_TRAP) {
    return (
      <button
        onClick={handleLogTrap}
        className="w-14 cursor-pointer bg-transparent border rounded flex flex-col items-center"
      >
        <Image
          src="/no-mosquito.png"
          alt="An icon of a mosquito with a cross through it, representing a mosquito trap"
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
      className="w-14 cursor-pointer bg-transparent border rounded flex flex-col items-center"
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

const MapLayers = (
  {
    breedingSites,
    breedingSitePhotos,
    mosquitoTraps,
  }: {
    breedingSites: BreedingSite[];
    breedingSitePhotos: {[photoId: PhotoId]: File};
    mosquitoTraps: MosquitoTrap[]|null;
  }
) => {
  const breedingSiteMarkers = breedingSites.map((breedingSite, index) => (
    <Marker
      key={index}
      position={breedingSite.location}
      icon={
        new Icon({
          iconUrl: "camera_map_marker.png",
          iconSize: [40, 40],
        })
      }
    >
      <Popup>
        {
          breedingSitePhotos[breedingSite.photoId] ? (
            <img
              src={URL.createObjectURL(breedingSitePhotos[breedingSite.photoId])}
              alt="Image of submitted breeding ground"
            />
          ) : null
        }
      </Popup>
    </Marker>
  ));

  const mosquitoTrapMarkers = mosquitoTraps?.map((trap, index) => (
    <Marker
      key={index}
      position={trap.location}
    >
    </Marker>
  )) ?? [];

  if (breedingSiteMarkers.length === 0) {
    return null;
  }

  if (!mosquitoTraps) {
    return breedingSiteMarkers;
  }

  return (
    <LayersControl position="topright">
          <LayersControl.Overlay name="Breeding sites" checked>
              {breedingSiteMarkers}
          </LayersControl.Overlay>
          {
            mosquitoTrapMarkers.length > 0 ? (
              <LayersControl.Overlay name="Mosquito traps" checked>
                {mosquitoTrapMarkers}
              </LayersControl.Overlay>
            ) : null
          }
    </LayersControl>
  )
};

const MapComponent = (
  {
    center,
    breedingSites,
    breedingSitePhotos,
    mosquitoTraps,
    loggingType,
    onSetCenter,
  }: {
    center: LatLngTuple|null;
    breedingSites: BreedingSite[];
    breedingSitePhotos: {[photoId: PhotoId]: File};
    mosquitoTraps: MosquitoTrap[]|null;
    loggingType: LoggingType;
    onSetCenter: (center: LatLngTuple, map: Map) => void;
  }
) => {
  const [popupPosition, setPopupPosition] = useState<LatLngTuple | null>(null);

  const layerMarkers: {[type in LoggingType]: LayerMarker[]} = useMemo(() => {
    const markerMap: {[type in LoggingType]: LayerMarker[]} = {
      [LoggingType.BREEDING_SITE]: [],
      [LoggingType.MOSQUITO_TRAP]: [],
    };

    for (const breedingSite of breedingSites) {
      markerMap[LoggingType.BREEDING_SITE].push({
        location: breedingSite.location,
        loggingType: LoggingType.BREEDING_SITE,
      });
    }

    return markerMap;
  }, [
    breedingSites
  ]);

  const map = useMapEvents({
    locationfound(e) {
      const p: LatLngTuple = [e.latlng.lat, e.latlng.lng];
      onSetCenter(p, map);
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
      {
        center ? 
          (
            <Marker
              position={center}
            >
            </Marker>
          ) : null
      }
      {popupPosition ? (
        <Popup position={popupPosition}>
          <LogLocationButton
            location={popupPosition!}
            loggingType={loggingType}
            onFinish={closePopup}
          />
        </Popup>
      ) : null}
    </>
  );
};

export const MapContainerComponent = (
  {
    loggingType,
  }: {
    loggingType: LoggingType;
  }
) => {
  const [center, setCenter] = useState<LatLngTuple>([30, 30]);
  const [breedingSitePhotos, setBreedingSitePhotos] = useState<{[photoId: PhotoId]: File}>({});

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

  return (
    <>
      <MapContainer center={center} zoom={16} scrollWheelZoom={false}>
        <MapComponent
          center={center}
          onSetCenter={handleSetCenter}
          breedingSites={breedingSites}
          breedingSitePhotos={breedingSitePhotos}
          mosquitoTraps={
            loggingType === LoggingType.MOSQUITO_TRAP ?
              mosquitoTraps :
              null
          }
          loggingType={loggingType}
        />
      </MapContainer>
    </>
  );
};

export default MapContainerComponent;
