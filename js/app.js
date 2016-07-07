//array of locations objects
var locations = [
    {
        name: 'Marina Bay Sands',
        lat: 1.283218,
        lng: 103.860286,
        url: 'https://www.marinabaysands.com/'
        },
    {
        name: 'Art Science Museum',
        lat: 1.286275,
        lng: 103.859299,
        url: 'http://www.marinabaysands.com/museum.html'
        },
    {
        name: 'Singapore Flyer',
        lat: 1.289311,
        lng: 103.863140,
        url: 'http://www.singaporeflyer.com/'
        },
    {
        name: 'Marina Barrage',
        lat: 1.280239,
        lng: 103.870878,
        url: 'www.pub.gov.sg/marinabarrage/aboutmarinabarrage'
        },
    {
        name: 'Gardens By The Bay',
        lat: 1.281520,
        lng: 103.863643,
        url: 'www.gardensbythebay.com.sg'
        },
    {
        name: 'Resort World Sentosa',
        lat: 1.255513,
        lng: 103.821832,
        url: 'https://www.rwsentosa.com'
        },
    {
        name: 'Merlion',
        lat: 1.286898,
        lng: 103.854514,
        url: 'http://www.yoursingapore.com/see-do-singapore/recreation-leisure/viewpoints/merlion-park.html'
        },
    {
        name: 'Esplanade',
        lat: 1.289601,
        lng: 103.855307,
        url: 'https://www.esplanade.com'
        },
    {
        name: 'The Fullerton Hotel Singapore',
        lat: 1.286318,
        lng: 103.853054,
        url: 'http://www.fullertonhotel.com'
        },
    {
        name: 'Universal Studios Singapore',
        lat: 1.254033,
        lng: 103.823835,
        url: 'https://www.rwsentosa.com/Homepage/Attractions/UniversalStudiosSingapore'
        }
    ];

var infowindow;

var ViewModel = function () {
    var self = this;

    //Links location data to an observable
    self.allLocations = ko.observableArray(locations); 

    //for each of the elements inside self.allLocations
    //in the following fucntion, markers, infoWindow for all the locations will be created
    self.allLocations().forEach(function (location) { 
        //Creates new markers for each object
        marker = new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(location.lat, location.lng),
            title: location.name,
            animation: google.maps.Animation.DROP
        });

        //assigns the marker object to the respective array
        location.marker = marker;

        //Function that is used to bounce the marker when it is clicked
        //More info on the following link
        //https://developers.google.com/maps/documentation/javascript/examples/marker-animations
        function toggleBounce() { 
            if (location.marker.getAnimation() !== null) {
                location.marker.setAnimation(null);
            } else {
                location.marker.setAnimation(google.maps.Animation.BOUNCE);
                //without the following setTimeout, the marker will keep bouncing.
                //hence the set timeout is needed to 
                setTimeout(function () {
                    location.marker.setAnimation(null);
                }, 1000);
            }
        }

        //When the icon is clicked, bounce the icon
        location.marker.addListener('click', toggleBounce);

        //Event listener on the marker
        //more info on the following link
        //https://developers.google.com/maps/documentation/javascript/examples/infowindow-simple
        google.maps.event.addListener(location.marker, 'click', function () { 
            if (!infowindow) {
                infowindow = new google.maps.InfoWindow();
            }

            //Wikipedia API START
            var content;
            var infoNames = location.name;
            var infoURL = location.url;
            var urlNames = encodeURI(location.name);
            var wikiUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=" + urlNames + "&limit=1&redirects=return&format=json";

            self.apiTimeout = setTimeout(function () {
                alert('ERROR: Failed to load data');
            }, 5000);

            self.apiTimeout;
            $.ajax({
                url: wikiUrl,
                dataType: "jsonp",
                success: function (response) {
                    //upon success,clear the timeout so that it will not show error from the setTimeout
                    clearTimeout(self.apiTimeout);
                    var articleList = response[1];
                    console.log(response);
                    //if there are articles in wikipedia 
                    if (articleList.length > 0) {
                        //put the information into the infoWindow
                        for (var i = 0; i < articleList.length; i++) {
                            var articleStr = articleList[i];
                            var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                            content = '<div class="info">' + '<h3 class="text-center" id="infoTitle">' + infoNames + '</h3>' + '<p>' + response[2] + '</p>' + '<a href="' + infoURL + '" target="_blank">' + infoURL + '</a>' + '</div>';
                            infowindow.setContent(content);
                        }
                    } else {
                        //apologize that there are no article regarding this location in wikipedia
                        content = '<div class="info">' + '<h3 class="text-center" id="infoTitle">' + infoNames + '</h3>' + '<p>' + "Sorry, No Articles Found on Wikipedia" + '</p>' + '</div>';
                        infowindow.setContent(content);
                    }
                    //opens the infoWindow
                    infowindow.open(map, location.marker);
                    setTimeout(function () { //Closes infowindow after 9 seconds.
                        infowindow.close();
                    }, 9000);
                },
                //when there is error in wiki API, show the following error message in the infoWindow
                error: (function () {
                    content = '<div class="info">' + '<h3 class="text-center" id="infoTitle">' + infoNames + '</h3>' + '<p>' + "Failed to reach Wikipedia Servers, please try again" + '</p>' + '</div>';
                    infowindow.setContent(content);
                })
            });//end of Wiki API
        });//End of eventlistener on marker
    }); //End ForEach

    self.list = function (location, marker) {
        //Links list to allLocation marker information, so both of them have the same content.
        google.maps.event.trigger(location.marker, 'click'); 
    };

    // Search functionality based on the locations' name

    //Creates an observable for the search bar
    //BINDED TO INPUT
    self.query = ko.observable(''); 

    //filtering through the array
    //More information on the following link
    //http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
    //BINDED TO UL
    self.searchResults = ko.computed(function () {
        //returns the result of the arrayFilter utility
        return ko.utils.arrayFilter(self.allLocations(), function (list) {
            //converts the date to lowercase and see if it matches by each index
            var searchFilter = list.name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
            if (searchFilter) { 
                //if the input matches the name of any of the locations, show only the ones that matches.
                list.marker.setVisible(true);
            } else {
                //hide markers and list items that does not match the input from the user
                list.marker.setVisible(false); 
            }
            //returns the filtered list
            return searchFilter;
        });
    });
}; //ViewModel END

//Alert the user when there is an error with Google Map
function googleErr() {
    alert("There has been an error with google. Please try again later");
}

//Initializes map, marker, and infowindow data
function initializeMap() {
    //Map Data
    map = new google.maps.Map(document.getElementById('map'), {
        //set the starting view of the map
        center: {
            lat: 1.269056,
            lng: 103.840553
        },
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    //apply the bindings from knockout.js
    ko.applyBindings(new ViewModel());
}


