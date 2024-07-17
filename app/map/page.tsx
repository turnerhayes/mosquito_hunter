import dynamic from "next/dynamic"
import Script from "next/script";

const Map = dynamic(() => import("@/app/Map"), { ssr:false });


const MapPage = () => {
    return (
        <>
            <Map>
            </Map>
            <Script
                stylesheets={[
                    "https://unpkg.com/leaflet@1.6.0/dist/leaflet.css",
                ]}
                src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
                // integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew=="
                // crossOrigin=""
            />
        </>
    );
};

export default MapPage;
