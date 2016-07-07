# Neighbourhood Map project
-------------
## Objectives:
*To create an App to show at least 5 locations on a map using google maps.
*To have the list of locations by the side of the map on a wide screen and above the map when the viewport gets smaller.
*To have a search function to filter out the listed locations.
-------------
## Step by step process to complete this project:
### 1. General things
*Download the required CDNs and files:
 *[Knockout.js](http://knockoutjs.com/downloads/index.html)
 *[JQuery](http://jquery.com/download/)
*Set up google account to get the API key.

### 2. Setting up HTML document
*Set up the general parts of the HTML document, such as `<!DOCTYPE>`, `<head>`, `<body>`.
*Add the `<script>` and `<link>` styles for all that is required, such as Bootstrap, Knockout, JQuery and Google Maps.

### 3. Getting the datas ready
In this project, I have used variable `locations` as an array that contains objects of the real place locations. The object comprises of:
* name -> location name.
* lat -> location latitude.
* lng -> location longitude.
* url -> the website of the location.

In this project, at least 5 locations are required. Hence, there will be 5 objects in the array.

### 4. Setting up the ViewModel for Knockout.js
In the ViewModel, the first thing to be done is to make an observable array of all the locations.

Upon creating the observable array, a loop that goes through each objects in the array must be formed to add elements to the objects. Such as initial location, markers, markers animations and many more.

In this project, after creating the observable array, I proceed with the following steps:
1. Initalize the position of the marker in the map.
2. Create a function for animation, such as bouncing effect.(becareful of infinite bouncing)
3. Add an event listener to trigger the bounce.
4. Create an infoWindow that appears when it is clicked. The text that is written on infoWindow is gathered using Wikipedia API.
5. Create an error function, just in case the wikipedia API has errors.
6. Links the position icon to the list as they will trigger whenever either is pressed.
7. Create a function that filters the array of list to show the filtered list and icon.

### 5. Google Maps API
1. I am doing this first so that I don't forget, create an error function just in case Google API has an error.
2. Initialize map and set the inital location of the map. If you have any options that you would like to change, such as not scrollable. please do it here.
--------------
## How to use this app?

1. Download the whole project file.

2. Open the index.html file in a browser of your choice on your local machine. If you have a local server running, you can open it by using the port number.

3. There are 2 ways you can navigate in this app:
    * Clicking the icons on the map will show you the details of the location.
    * Clicking on the list that are located on the left(viewport > 1200) or just above the map (viewport < 1200) will also show you the details of the location.

4. To search for a specific name, simply just type in the name of the location.
----------
## Resources
### General:
* Udacity Forums
* Stackoverflow
### Google Maps:
* [MARKER ANIMATIONS](https://developers.google.com/maps/documentation/javascript/examples/marker-animations)
* [INFO WINDOW](https://developers.google.com/maps/documentation/javascript/examples/infowindow-simple)
### Knockout JS:
* [Knockout](http://knockoutjs.com/)
* [Array Filtering using Knockout.js](http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html)
