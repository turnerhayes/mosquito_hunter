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
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { takePhoto, savePhoto, getPhotosForSubmissions } from "@/app/photos";
import { addSubmission, Submission } from "@/redux/slices/submissions";
import { PhotoId } from "@/app/photos.d";
import { getSubmissions } from "@/redux/selectors";
import Image from "next/image";

const MapComponent = (
  {
    center,
    submissions,
    submissionPhotos,
    onSetCenter,
  }: {
    center: LatLngTuple|null;
    submissions: Submission[];
    submissionPhotos: {[photoId: PhotoId]: File};
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
      const id = await savePhoto(f);
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
        </Popup>
      ) : null}
      {
        submissions.map((submission, index) => (
          <Marker
            key={index}
            position={submission.location}
            icon={
              new Icon({
                iconUrl: "camera_map_marker.png",
                iconSize: [40, 40],
              })
            }
          >
            <Popup>
              {
                submissionPhotos[submission.photoId] ? (
                  <img
                    src={URL.createObjectURL(submissionPhotos[submission.photoId])}
                    alt="Image of submitted breeding ground"
                  />
                ) : null
              }
            </Popup>
          </Marker>
        ))
      }
    </>
  );
};

export const MapContainerComponent = () => {
  const [center, setCenter] = useState<LatLngTuple>([30, 30]);
  const [submissionPhotos, setSubmissionPhotos] = useState<{[photoId: PhotoId]: File}>({});

  const submissions = useAppSelector(getSubmissions);

  useEffect(() => {
    getPhotosForSubmissions(submissions).then((photos) => {
      setSubmissionPhotos(photos);
    });
  }, [
    submissions,
    setSubmissionPhotos,
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
          submissions={submissions}
          submissionPhotos={submissionPhotos}
        />
      </MapContainer>
    </>
  );
};

export default MapContainerComponent;
