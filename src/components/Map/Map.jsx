import React from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const libraries = ['places'];
const mapContainerStyle = {
    width: '300px', // width of the map box
    height: '300px', // height of the map box
    position: 'absolute', // make it an absolute element
    bottom: '20px', // position from the bottom of the screen
    left: '50px', // position from the left of the screen
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', // add a slight shadow for better visibility
    borderRadius: '10px', // optional: make the corners rounded
  };

const center = {
    lat: 42.6977, // latitude of Sofia, Bulgaria
    lng: 23.3219, // longitude of Sofia, Bulgaria
  };

const CreateMap = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyATClWZDU3n6cWWzZYr3XUQdk-oWl110Mw',
    libraries,
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={center}
      >
        <Marker position={center} />
      </GoogleMap>
    </div>
  );
};

export default CreateMap;