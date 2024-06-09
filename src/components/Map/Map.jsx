import React from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const libraries = ['places'];
const mapContainerStyle = {
  width: '300px', // width of the map box
  height: '300px', // height of the map box
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
    return <div className="alert alert-error">Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div className="alert alert-info">Loading maps...</div>;
  }

  return (
    <div className="flex justify-center items-center p-4">
      <div className="card shadow-lg rounded-lg">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={10}
          center={center}
        >
          <Marker position={center} />
        </GoogleMap>
      </div>
    </div>
  );
};

export default CreateMap;
