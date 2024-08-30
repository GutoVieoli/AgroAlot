import React, { useEffect } from 'react';

const Map = (filtro) => {

    const loadScript = (url, callback) => {
        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        script.onload = callback;
        document.head.appendChild(script);
    };

    
    const initialize = (mapid) => {
        // Get a reference to the placeholder DOM element to contain the map.
        const mapContainerEl = document.getElementById("map-container");

        // Create an interactive map inside the placeholder DOM element.
        const embeddedMap = new google.maps.Map(mapContainerEl, {
            // Pan and zoom initial map viewport to Grand Canyon.
            center: { lng: -46.019918, lat: -21.211870 },
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.TERRAIN ,
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
        loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyDb-5LpSRytYHB8SLCHG8MHj6FxljLj1TQ", () => {
            loadScript("https://ajax.googleapis.com/ajax/libs/earthengine/0.1.226/earthengine-api.min.js", () => {
                initialize();
            });
        });
    }, []);

    
    useEffect(() => {
        if (filtro.renderizacao !== '') {
            initialize(filtro.renderizacao);
        }
    }, [filtro.renderizacao]);


    return (
        <div style={{ width: '100%' , display: 'flex', justifyContent: 'center'}}>
            <div id="map-container" style={{ height: '600px', width: '95%', border: '4px solid #5F6F52', boxShadow: '0px 0px 5px 2px 0.75' }}></div>
        </div>
    );
};

export default Map;
