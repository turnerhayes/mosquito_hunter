"use client";

import { MouseEvent, useCallback, useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Popup,
  Marker,
  useMapEvents,
} from "react-leaflet";
import { Icon, LatLngTuple, Map } from "leaflet";
import { useAppDispatch } from "@/redux/hooks";
import { takePhoto, savePhoto, getPhotos } from "./photos";
import { addSubmission } from "@/redux/slices/submissions";
import { Photo } from "./photos.d";

const MapComponent = (
  {
    center,
    existingPhotos,
    onSetCenter,
  }: {
    center: LatLngTuple|null;
    existingPhotos?: Photo[];
    onSetCenter: (center: LatLngTuple, map: Map) => void;
  }
) => {
  const [popupPosition, setPopupPosition] = useState<LatLngTuple | null>(null);

  const dispatch = useAppDispatch();

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

  const handleTakePhotoClick = useCallback(
    async (event: MouseEvent) => {
      const location = popupPosition!;
      event.stopPropagation();
      const f = await takePhoto();
      const id = await savePhoto(f, location);
      dispatch(addSubmission({
        location,
        photoId: id,
      }));
      setPopupPosition(null);
    },
    [
      dispatch,
      popupPosition,
      setPopupPosition,
    ]
  );

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
          <header>
            <h4>Log standing water</h4>
          </header>
          <button
            onClick={handleTakePhotoClick}
            style={{
              fontSize: "3.5em",
              background: "none",
              border: "none",
              appearance: "none",
              cursor: "pointer",
            }}
          >
            📷
          </button>
        </Popup>
      ) : null}
      {
        existingPhotos ? (
          existingPhotos.map((photo, index) => (
            <Marker
              key={index}
              position={photo.location}
              icon={
                new Icon({
                  iconUrl: "camera_map_marker.png",
                  iconSize: [40, 40],
                })
              }
            >
              <Popup>
                <img
                  src={URL.createObjectURL(photo.file)}
                  alt="Image of submitted breeding ground"
                />
              </Popup>
            </Marker>
          ))
        ) : null
      }
    </>
  );
};

export const MapContainerComponent = () => {
  const [center, setCenter] = useState<LatLngTuple>([30, 30]);
  const [existingPhotos, setExistingPhotos] = useState<Photo[]|undefined>();

  useEffect(() => {
    getPhotos().then((photos) => {
      setExistingPhotos(photos);
    });
  }, [
    setExistingPhotos,
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
          existingPhotos={existingPhotos}
        />
      </MapContainer>
    </>
  );
};

export default MapContainerComponent;
