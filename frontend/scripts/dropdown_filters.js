let markersdata = getmarkers();

//Search by amenities and facilities
let amenities = markersdata.features[0].properties.amenities;
for (let amenity of markersdata.features) {
    amenities = amenities.concat(amenity.properties.amenities);
}
let facilities = markersdata.features[0].properties.OnsiteFacilities;
for (let facility of markersdata.features) {
    facilities = facilities.concat(facility.properties.OnsiteFacilities);
}
// let amenities = markersdata.features[0].properties.amenities.concat(markersdata.features[1].properties.amenities.concat(markersdata.features[2].properties.amenities));
// let facilities = markersdata.features[0].properties.OnsiteFacilities.concat(markersdata.features[1].properties.OnsiteFacilities.concat(markersdata.features[2].properties.OnsiteFacilities));
let amenitySet = new Set();
let facilitySet = new Set();
amenities.forEach(amenity => {
    amenitySet.add(amenity);
});
let amenityIterator = amenitySet.values();
let amenityArray = [];
for (let item of amenityIterator) {
    amenityArray.push(item);
}

facilities.forEach(facility => {
    facilitySet.add(facility);
});
let facilityIterator = facilitySet.values();
let facilityArray = [];
for (let item of facilityIterator) {
    facilityArray.push(item);
}
amenityArray.forEach(amenity => {
    $('#searchByAmenities').append(
        '<a data-toggle="modal" class="dropdown-item text-black amenity-clicked" data-target="#dropdownModal">' +
        amenity +
        '</a>'
    );
});
facilityArray.forEach(facility => {
    $('#searchByFacilities').append(
        '<a data-toggle="modal" class="dropdown-item text-black facility-clicked" data-target="#dropdownModal">' +
        facility +
        '</a>'
    );
});

$('.amenity-clicked').on('click', e => {
    let selectedMitem = e.target.innerText;
    $('#filterdatatitle').text('Resorts having :' + selectedMitem);
    markersdata.features.forEach((item, index) => {
        item.properties.amenities.forEach(amenity => {
            modalId = "#imageModal" + item.properties.ID;
            if (selectedMitem === amenity) {
                $('#filteritems').append(
                    '<li><a data-target=' + modalId + " " + 'data-toggle="modal" id=' +
                    item.properties.ID +
                    '>' +
                    item.properties.title +
                    '</a></li>'
                );
            }
        });
    });
});

$('#filterclose').on('click', function(e) {
    $('#filteritems').html('');
});

$('#filterclosecross').on('click', function(e) {
    $('#filteritems').html('');
});

$('.facility-clicked').on('click', e => {
    let selecteditem = e.target.innerText;
    $('#filterdatatitle').text(selecteditem);
    markersdata.features.forEach((item, index) => {
        item.properties.OnsiteFacilities.forEach(facility => {
            modalId1 = "#imageModal" + item.properties.ID;
            if (selecteditem === facility) {
                $('#filteritems').append(
                    '<li><a data-target=' + modalId1 + " " + 'data-toggle="modal" id=' +
                    item.properties.ID +
                    '>' +
                    item.properties.title +
                    '</a></li>'
                );
            }
        });
    });
});

$('#filteritems').on('click', 'li', function(e) {
    markersdata.features.forEach(feature => {
        let id = e.target.id;
        if (id === feature.properties.ID) {
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
        }
    });
});