$(document).ready(function() {
    function onEachFeatureFunctions(feature, layer) {
        if (feature.properties.ID === '123'){
            popupContent =
            "<a data-target='#imageModal123' class='resortName' data-toggle='modal'>" +
            feature.properties.title +
            '</a>';
        }
        else if (feature.properties.ID === '121'){
            popupContent =
            "<a data-target='#imageModal121' class='resortName' data-toggle='modal'>" +
            feature.properties.title +
            '</a>';
        }
        else if (feature.properties.ID === '122'){
            popupContent =
            "<a data-target='#imageModal122' class='resortName' data-toggle='modal'>" +
            feature.properties.title +
            '</a>';
        }
        layer.bindPopup(feature.properties.title);
        /* Tablets and iPads (portrait and landscape) ---------- */
        if ($(window).width() >= 768 && $(window).width() <= 1023) {
            layer.on('click', () => {
                layer.openPopup();
            });
        }
        markersLayer.addLayer(layer);
        layer.bindPopup(popupContent).on('popupopen', () => {
            $('.resortName').on('click', e => {
                e.preventDefault();
                /* Mobile phones (portrait and landscape) ---------- */
                if ($(window).width() <= 767) {
                    getimagedata(
                        feature.properties.maparea,
                        feature.properties.ID,
                        feature.properties.mobile.width,
                        feature.properties.mobile.height,
                        'mobile'
                    );
                }
                /* Low resolution desktops and laptops ---------- */
                /* High resolution desktops and laptops ---------- */
                /* Tablets and iPads (portrait and landscape) ---------- */
                if (
                    $(window).width() >= 1024 ||
                    $(window).width() >= 1280 ||
                    ($(window).width() >= 768 && $(window).width() <= 1023)
                ) {
                    getimagedata(
                        feature.properties.maparea,
                        feature.properties.ID,
                        feature.properties.desktop.width,
                        feature.properties.desktop.height,
                        'desktop'
                    );
                }
            });
        });
    }
    let markersData = getmarkers();

    let map = L.map('map');
    let tileLayer = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
            autoPan: false,
            draggable: false,
        }
    );
    let markersLayer = new L.LayerGroup();
    map.addLayer(markersLayer);

    // add the search bar to the map
    let controlSearch = new L.Control.Search({
        position: 'topleft', // where do you want the search bar?
        layer: markersLayer, // name of the layer
        initial: false,
        zoom: 11, // set zoom to found location when searched
        marker: false,
        textPlaceholder: 'search...', // placeholder while nothing is searched
    });

    map.addControl(controlSearch); // add resort search to the map
    // create clusterGroup
    let cluster = L.markerClusterGroup({
        showCoverageOnHover: false,
    });

    //markers from geojson
    let geoJson = L.geoJson(markersData, {
        onEachFeature: onEachFeatureFunctions,
    });

    cluster.addLayer(geoJson);
    tileLayer.addTo(map);
    map.addLayer(cluster);

    map.fitBounds(geoJson.getBounds());
});

$('#submitCallRequest').on('click', e => {
    $('confirmSuccess').removeClass('invisible');
    $('confirmSuccess').removeClass('visible');
});