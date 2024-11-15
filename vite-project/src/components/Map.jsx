import React, { useState, useEffect } from 'react';

const Map = ( {filtro, centralizacao} ) => {

    // const [latitude, setLatitude] = useState(-21.211870);
    // const [longitude, setLongitude] = useState(-46.019918);

    const apiKey = import.meta.env.VITE_API_KEY;

    // useEffect(() => {
    //     if(centralizacao){
    //         setLongitude(centralizacao[0])
    //         setLatitude(centralizacao[1])
    //     }
    // }, [centralizacao]);

    const loadScript = (url, callback) => {
        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        script.onload = callback;
        document.head.appendChild(script);
    };

    
    const initialize = (mapid, zoomOp = 13, longitude= -46.019918, latitude= -21.211870) => {
        // Get a reference to the placeholder DOM element to contain the map.
        const mapContainerEl = document.getElementById("map-container");

        // Create an interactive map inside the placeholder DOM element.
        const embeddedMap = new google.maps.Map(mapContainerEl, {
            center: { lng: longitude, lat: latitude },
            zoom: zoomOp,
            mapTypeId: google.maps.MapTypeId.TERRAIN ,

            streetViewControl: false,
            
        });

        if(mapid != null){
            const tileSource = new ee.layers.EarthEngineTileSource({
                mapid,
            });
            const overlay = new ee.layers.ImageOverlay(tileSource);
            embeddedMap.overlayMapTypes.push(overlay);
        }
    };

    

    useEffect(() => {
        loadScript(`https://maps.googleapis.com/maps/api/js?key=${apiKey}`, () => {
            loadScript("https://ajax.googleapis.com/ajax/libs/earthengine/0.1.226/earthengine-api.min.js", () => {
                initialize();
            });
        });
    }, []);

    useEffect(() => {
        if (filtro && centralizacao) {
            initialize(filtro, 16, centralizacao[0], centralizacao[1]);
        } else if (filtro){
            initialize(filtro, 12.6);
        }

    }, [filtro]);


    return (
        <div style={{ width: '100%' , display: 'flex', justifyContent: 'center', marginBottom: '30px'}}>
            <div id="map-container" style={{ height: '600px', width: '95%', border: '4px solid #5F6F52', boxShadow: '0px 0px 5px 2px 0.75' }}></div>
        </div>
    );
};

export default Map;
