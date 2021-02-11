let markers;
let imagemapmarkers;

jQuery.ajax({
    url: 'http://localhost:8080/getmapmarker',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    async: false,
    success: function(resultData) {
        // do stuff with json (in this case an array)
        markers = resultData;
    },
    error: function(e) {
        alert('Error');
    },
});

function getmarkers() {
    return markers;
}

// Ajax call to get resort area image map markers
let getimagemapmarkers = function(resortid) {
    let imagemarkers = [];
    $.ajax({
        async: false,
        url: 'http://localhost:8080/' + resortid + '/getimagemapareas',
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        success: function(resultdata) {
            imagemarkers = resultdata;
        },
    });
    return imagemarkers;
};