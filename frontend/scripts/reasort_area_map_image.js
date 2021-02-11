function getimagedata(imageurl, resortid, width, height, devicetype) {
    let id = resortid;
    let h = height;
    let w = width;
    let wd = width + 'px';
    let ht = height + 'px';

    // opens resort map area image of the resort clicked
    if (id === '123'){
        mapdiv = 'image-map123';
        resortTitle = '#resortareamap123';
    }
    else if (id === '121'){
        mapdiv = 'image-map121';
        resortTitle = '#resortareamap121';
    }
    else if (id === '122'){
        mapdiv = 'image-map122';
        resortTitle = '#resortareamap122';
    }
        
    mapdivCss = '#' + mapdiv;
    $(mapdivCss).css({ width: wd, height: ht });

    let resortmap = L.map(mapdiv, {
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

    // popups
    var iconOnClick = function(e, dataelement) {
        if (dataelement.isBookingAvailable == 'yes') {
            title = dataelement.successTitle;
        } else if (dataelement.isBookingAvailable == 'no') {
            title = dataelement.failureTitle;
        } else title = '';
        let hover_bubble = new L.Rrose({
                offset: new L.Point(0, -10),
                closeButton: false,
                autoPan: false,
            })
            .setContent(title)
            .setLatLng(e.latlng)
            .openOn(resortmap);
    };

    let icons = geticons();
    let desktopmarkers = null;

    //add polygons for rooms
    let featureGroup = new L.FeatureGroup();

    function showRooms(rooms) {
        if (id === '123') {
            rooms.forEach(room => {
                if (room.available === 'yes') {
                    let poly1 = L.polygon(room.bounds, { color: 'green' })
                    .bindPopup()
                    .on('click', function(e){
                        roseSuccess = new L.Rrose({
                            offset: new L.Point(0, -10),
                            closeButton: false,
                            autoPan: false,
                        })
                        .setContent(room.successPopup +
                            '<br><button type="button" class="btn btn-secondary btn-sm" data-toggle="modal" data-target="#roomImages">View Room</button>')
                        .setLatLng(e.latlng)
                        .openOn(resortmap);
                    });
                    featureGroup.addLayer(poly1);
                } else if (room.available === 'no') {
                    let poly2 = L.polygon(room.bounds, { color: 'red' })
                    .bindPopup()
                    .on('click', function(e){
                        roseFailure = new L.Rrose({
                            offset: new L.Point(0, -10),
                            closeButton: false,
                            autoPan: false,
                        })
                        .setContent(room.failurePopup)
                        .setLatLng(e.latlng)
                        .openOn(resortmap);
                    });
                    featureGroup.addLayer(poly2);
                }
            });
            resortmap.addLayer(featureGroup);
            resortmap._onResize();
        }
    }

    function mapResize(){
        resortmap._onResize();
    }

    function removeRooms() {
        resortmap.removeLayer(featureGroup);
        featureGroup._layers = {};
        featureGroup._leaflet_id = null;
    }

    $.when(getimagemapmarkers(id)).done(imagemarkers => {
        // Adding resort Details from JSON
        let details = imagemarkers.resortDetails;
        let check = details.checkInDetails;
        $(resortTitle).html(imagemarkers.Name);
        $('#checkInTime').html(check.checkInTime);
        $('#checkOutTime').html(check.checkOutTime);
        $('#checkInDays').html(check.checkInDays);
        $('#checkInExtra').html(check.checkInExtra);
        $('#au').html(details.au);
        $('#locationShow').html(details.location);
        $('#features').html(details.features);
        $('#addOn').html(details.addOn);
        $('#amenities1').html(details.amenities1);
        $('#amenities2').html(details.amenities2);
        $('#amenities3').html(details.amenities3);
        $('#amenities4').html(details.amenities4);
        $('#amenities5').html(details.amenities5);
        $('#services1').html(details.services1);
        $('#intro').html(details.roomDetails.intro);
        $('#facilities').html(details.roomDetails.facilities);
        $('#modalTitle').html(details.modalTitle);
        $('#resortNameClicked').text(imagemarkers.Name);

        // Laying Out Markers on Image Map
        if (devicetype === 'desktop') {
            desktopmarkers = imagemarkers.desktopareas;
        } else if (devicetype === 'mobile') {
            desktopmarkers = imagemarkers.mobileareas;
        }
        L.polygon(bounds, { color: '#ff7800', weight: 1 }).addTo(resortmap);
        desktopmarkers.forEach(element => {
            if (element.icon === 'park' && element.isBookingAvailable === 'yes')
                L.marker([element.marker[0], element.marker[1]], { icon: icons.park })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (element.icon === 'park' && element.isBookingAvailable === 'no')
                L.marker([element.marker[0], element.marker[1]], { icon: icons.park })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'marker' &&
                element.isBookingAvailable === 'yes'
            )
                L.marker([element.marker[0], element.marker[1]], { icon: icons.marker })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (element.icon === 'marker' && element.isBookingAvailable === 'no')
                L.marker([element.marker[0], element.marker[1]], { icon: icons.marker })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (element.icon === 'hotel' && element.isBookingAvailable === 'yes')
                L.marker([element.marker[0], element.marker[1]], { icon: icons.hotel })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    showRooms(element.rooms);
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (element.icon === 'hotel' && element.isBookingAvailable === 'no')
                L.marker([element.marker[0], element.marker[1]], { icon: icons.hotel })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'forest' &&
                element.isBookingAvailable === 'yes'
            )
                L.marker([element.marker[0], element.marker[1]], { icon: icons.forest })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (element.icon === 'forest' && element.isBookingAvailable === 'no')
                L.marker([element.marker[0], element.marker[1]], { icon: icons.forest })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (element.icon === 'gym' && element.isBookingAvailable === 'yes')
                L.marker([element.marker[0], element.marker[1]], { icon: icons.gym })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (element.icon === 'gym' && element.isBookingAvailable === 'no')
                L.marker([element.marker[0], element.marker[1]], { icon: icons.gym })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'luggage' &&
                element.isBookingAvailable === 'yes'
            )
                L.marker([element.marker[0], element.marker[1]], { icon: icons.luggage })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'luggage' &&
                element.isBookingAvailable === 'no'
            )
                L.marker([element.marker[0], element.marker[1]], { icon: icons.luggage })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'restaurant' &&
                element.isBookingAvailable === 'yes'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.restaurant,
                })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'restaurant' &&
                element.isBookingAvailable === 'no'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.restaurant,
                })
                .bindPopup(element.failureTitle, { autoPan: false }).on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'meeting' &&
                element.isBookingAvailable === 'yes'
            )
                L.marker([element.marker[0], element.marker[1]], { icon: icons.meeting })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'meeting' &&
                element.isBookingAvailable === 'no'
            )
                L.marker([element.marker[0], element.marker[1]], { icon: icons.meeting })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (element.icon === 'bar' && element.isBookingAvailable === 'yes')
                L.marker([element.marker[0], element.marker[1]], { icon: icons.bar })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (element.icon === 'bar' && element.isBookingAvailable === 'no')
                L.marker([element.marker[0], element.marker[1]], { icon: icons.bar })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (element.icon === 'pitch' && element.isBookingAvailable === 'yes')
                L.marker([element.marker[0], element.marker[1]], { icon: icons.pitch })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (element.icon === 'pitch' && element.isBookingAvailable === 'no')
                L.marker([element.marker[0], element.marker[1]], { icon: icons.pitch })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'parking' &&
                element.isBookingAvailable === 'yes'
            )
                L.marker([element.marker[0], element.marker[1]], { icon: icons.parking })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'parking' &&
                element.isBookingAvailable === 'no'
            )
                L.marker([element.marker[0], element.marker[1]], { icon: icons.parking })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (element.icon === 'desk' && element.isBookingAvailable === 'yes')
                L.marker([element.marker[0], element.marker[1]], { icon: icons.desk })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (element.icon === 'desk' && element.isBookingAvailable === 'no')
                L.marker([element.marker[0], element.marker[1]], { icon: icons.desk })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (element.icon === 'piano' && element.isBookingAvailable === 'yes')
                L.marker([element.marker[0], element.marker[1]], { icon: icons.piano })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (element.icon === 'piano' && element.isBookingAvailable === 'no')
                L.marker([element.marker[0], element.marker[1]], { icon: icons.piano })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'tennis' &&
                element.isBookingAvailable === 'yes'
            )
                L.marker([element.marker[0], element.marker[1]], { icon: icons.tennis })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (element.icon === 'tennis' && element.isBookingAvailable === 'no')
                L.marker([element.marker[0], element.marker[1]], { icon: icons.tennis })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (element.icon === 'pin' && element.isBookingAvailable === 'yes')
                L.marker([element.marker[0], element.marker[1]], { icon: icons.pin })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (element.icon === 'pin' && element.isBookingAvailable === 'no')
                L.marker([element.marker[0], element.marker[1]], { icon: icons.pin })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'studio' &&
                element.isBookingAvailable === 'yes'
            )
                L.marker([element.marker[0], element.marker[1]], { icon: icons.studio })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (element.icon === 'studio' && element.isBookingAvailable === 'no')
                L.marker([element.marker[0], element.marker[1]], { icon: icons.studio })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (element.icon === 'pool' && element.isBookingAvailable === 'yes')
                L.marker([element.marker[0], element.marker[1]], { icon: icons.pool })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (element.icon === 'pool' && element.isBookingAvailable === 'no')
                L.marker([element.marker[0], element.marker[1]], { icon: icons.pool })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (element.icon === 'golf' && element.isBookingAvailable === 'yes')
                L.marker([element.marker[0], element.marker[1]], { icon: icons.golf })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (element.icon === 'golf' && element.isBookingAvailable === 'no')
                L.marker([element.marker[0], element.marker[1]], { icon: icons.golf })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'spring' &&
                element.isBookingAvailable === 'yes'
            )
                L.marker([element.marker[0], element.marker[1]], { icon: icons.spring })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (element.icon === 'spring' && element.isBookingAvailable === 'no')
                L.marker([element.marker[0], element.marker[1]], { icon: icons.spring })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'hotelna' &&
                element.isBookingAvailable === 'yes'
            )
                L.marker([element.marker[0], element.marker[1]], { icon: icons.hotelna })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'hotelna' &&
                element.isBookingAvailable === 'no'
            )
                L.marker([element.marker[0], element.marker[1]], { icon: icons.hotelna })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallspring' &&
                element.isBookingAvailable === 'yes'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.smallspring,
                })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallspring' &&
                element.isBookingAvailable === 'no'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.smallspring,
                })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallmarker' &&
                element.isBookingAvailable === 'yes'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.smallmarker,
                })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallmarker' &&
                element.isBookingAvailable === 'no'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.smallmarker,
                })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallpark' &&
                element.isBookingAvailable === 'yes'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.smallpark,
                })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallpark' &&
                element.isBookingAvailable === 'no'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.smallpark,
                })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallpitch' &&
                element.isBookingAvailable === 'yes'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.smallpitch,
                })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallpitch' &&
                element.isBookingAvailable === 'no'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.smallpitch,
                })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallpin' &&
                element.isBookingAvailable === 'yes'
            )
                L.marker([element.marker[0], element.marker[1]], { icon: icons.smallpin })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallpin' &&
                element.isBookingAvailable === 'no'
            )
                L.marker([element.marker[0], element.marker[1]], { icon: icons.smallpin })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallwhiteMarker' &&
                element.isBookingAvailable === 'yes'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.smallwhiteMarker,
                })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallwhiteMarker' &&
                element.isBookingAvailable === 'no'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.smallwhiteMarker,
                })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallredMarker' &&
                element.isBookingAvailable === 'yes'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.smallredMarker,
                })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallredMarker' &&
                element.isBookingAvailable === 'no'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.smallredMarker,
                })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
                else if (element.icon === 'smallhotel' && element.isBookingAvailable === 'yes')
                L.marker([element.marker[0], element.marker[1]], { icon: icons.smallhotel })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    showRooms(element.rooms);
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
                else if (element.icon === 'smallhotel' && element.isBookingAvailable === 'no')
                L.marker([element.marker[0], element.marker[1]], { icon: icons.smallhotel })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    showRooms(element.rooms);
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallpitch' &&
                element.isBookingAvailable === 'yes'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.smallpitch,
                })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallpitch' &&
                element.isBookingAvailable === 'no'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.smallpitch,
                })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallpool' &&
                element.isBookingAvailable === 'yes'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.smallpool,
                })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallpool' &&
                element.isBookingAvailable === 'no'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.smallpool,
                })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallgym' &&
                element.isBookingAvailable === 'yes'
            )
                L.marker([element.marker[0], element.marker[1]], { icon: icons.smallgym })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallgym' &&
                element.isBookingAvailable === 'no'
            )
                L.marker([element.marker[0], element.marker[1]], { icon: icons.smallgym })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallforest' &&
                element.isBookingAvailable === 'yes'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.smallforest,
                })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallforest' &&
                element.isBookingAvailable === 'no'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.smallforest,
                })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallluggage' &&
                element.isBookingAvailable === 'yes'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.smallluggage,
                })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallluggage' &&
                element.isBookingAvailable === 'no'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.smallluggage,
                })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallrestaurant' &&
                element.isBookingAvailable === 'yes'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.smallrestaurant,
                })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallrestaurant' &&
                element.isBookingAvailable === 'no'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.smallrestaurant,
                })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallparking' &&
                element.isBookingAvailable === 'yes'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.smallparking,
                })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallparking' &&
                element.isBookingAvailable === 'no'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.smallparking,
                })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallmeeting' &&
                element.isBookingAvailable === 'yes'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.smallmeeting,
                })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallmeeting' &&
                element.isBookingAvailable === 'no'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.smallmeeting,
                })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smalltennis' &&
                element.isBookingAvailable === 'yes'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.smalltennis,
                })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smalltennis' &&
                element.isBookingAvailable === 'no'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.smalltennis,
                })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallpiano' &&
                element.isBookingAvailable === 'yes'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.smallpiano,
                })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallpiano' &&
                element.isBookingAvailable === 'no'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.smallpiano,
                })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smalldesk' &&
                element.isBookingAvailable === 'yes'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.smalldesk,
                })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smalldesk' &&
                element.isBookingAvailable === 'no'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.smalldesk,
                })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallbar' &&
                element.isBookingAvailable === 'yes'
            )
                L.marker([element.marker[0], element.marker[1]], { icon: icons.smallbar })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallbar' &&
                element.isBookingAvailable === 'no'
            )
                L.marker([element.marker[0], element.marker[1]], { icon: icons.smallbar })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallstudio' &&
                element.isBookingAvailable === 'yes'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.smallstudio,
                })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallstudio' &&
                element.isBookingAvailable === 'no'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.smallstudio,
                })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallgolf' &&
                element.isBookingAvailable === 'yes'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.smallgolf,
                })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallgolf' &&
                element.isBookingAvailable === 'no'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.smallgolf,
                })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallhotelna' &&
                element.isBookingAvailable === 'yes'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.smallhotelna,
                })
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else if (
                element.icon === 'smallhotelna' &&
                element.isBookingAvailable === 'no'
            )
                L.marker([element.marker[0], element.marker[1]], {
                    icon: icons.smallhotelna,
                })
                .bindPopup(element.failureTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
            else
                L.marker(
                    [element.marker[0], element.marker[1]], { icon: icons.whiteMarker }, { bounceOnAdd: element.bounce }
                )
                .bindPopup(element.successTitle, { autoPan: false })
                .on('popupopen', () => {
                    mapResize();
                })
                .addTo(resortmap)
                .on('click', function(e) {
                    iconOnClick(e, element);
                });
        });
    });

    // resortmap.on('click', function (e) {
    //     let popup = L.popup({ autoPan: false });
    //     popup.setLatLng(e.latlng)
    //         .setContent(e.latlng.toString())
    //         .openOn(resortmap);
    // });

    
    resortmap.on('click', function() {
        removeRooms();
    });

    if (id === "123")
        resortmap123 = resortmap;
    else if (id === '122')
        resortmap122 = resortmap;
    else if (id === '121')
        resortmap121 = resortmap;
    $('#closeImageModal123').on('click', function(e){
        resortmap123._onResize();
        resortmap123.closePopup();
        removeRooms();
    });
    $('#closeImageModal121').on('click', function(e){
        resortmap121._onResize();
        resortmap121.closePopup();
        removeRooms();
    });
    $('#closeImageModal122').on('click', function(e){
        resortmap122._onResize();
        resortmap122.closePopup();
        removeRooms();
    });
}