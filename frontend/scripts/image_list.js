markersdata = getmarkers();
$('#image-btn').on('click', function() {
    markersdata.features.forEach(item => {
        $('#imageList-div').append(
            '<li><a data-toggle="modal" data-target="#imageMapModal" id=' +
            item.properties.ID +
            '>' +
            item.properties.title +
            '</a></li>'
        );
    });
});

$('#closeImageList').on('click', function() {
    $('#imageList-div').html('');
});

$('#closeImageListBtn').on('click', function() {
    $('#imageList-div').html('');
});

$('#imageList-div').on('click', 'li', function(e) {
    markersdata.features.forEach(feature => {
        let id = e.target.id;
        if (id === feature.properties.ID) {
            $('#imagelistname').html(feature.properties.title);
            if ($(window).width() <= 767)
                createImageMap(
                    feature.properties.maparea,
                    feature.properties.ID,
                    feature.properties.mobile.width,
                    feature.properties.mobile.height
                );
            else
                createImageMap(
                    feature.properties.maparea,
                    feature.properties.ID,
                    feature.properties.desktop.width,
                    feature.properties.desktop.height
                );
        }
    });
});

function createImageMap(imageurl, resortid, width, height) {
    let id = resortid;
    let h = height;
    let w = width;
    let wd = width + 'px';
    let ht = height + 'px';

    $('#imageMap').css({ width: wd, height: ht });

    // clear previously rendered leaflet image instance to render image area map of currently clicked resort marker
    let container = L.DomUtil.get('imageMap');
    if (container != null) {
        container._leaflet_id = null;
    }

    // opens resort map area image of the resort clicked
    let resortmap = L.map('imageMap', {
        minZoom: 3,
        maxZoom: 4,
        center: [0, -h],
        zoom: 3,
        crs: L.CRS.Simple,
        zoomControl: true,
    });

    url = imageurl;
    // projecting pixel coordinates into latlang
    let southWest = resortmap.unproject([0, h], resortmap.getMaxZoom() - 1);
    let northEast = resortmap.unproject([w, 0], resortmap.getMaxZoom() - 1);
    // setting bounds
    let bounds = new L.LatLngBounds(southWest, northEast);

    //adding image overlay
    L.imageOverlay(url, bounds).addTo(resortmap);
    resortmap.setMaxBounds(bounds);

    // let bound = [
    //     [-28.5, 36.875],
    //     [-30.125, 60.375],
    //     [-53.5, 53.25],
    // ];
    // let poly = L.polygon(bound);
    // resortmap.addLayer(poly);
    // let polyLayer = new L.FeatureGroup();
    // resortmap.addLayer(polyLayer);
    // polyLayer.addLayer(poly);

    // let baseLayer = { 'image': imageLayer };
    // let overlay = { 'polygon': polyLayer };

    // L.control.layers(baseLayer, overlay).addTo(resortmap);

    // resortmap.on('click', function(e) {
    //     onMapClick(e);
    // });

    // function onMapClick(e) {
    //     let popup = L.popup({ autoPan: false });
    //     popup.setLatLng(e.latlng).setContent(e.latlng.toString()).openOn(resortmap);
    // }
}