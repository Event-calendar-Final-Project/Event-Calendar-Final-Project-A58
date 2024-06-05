import { useState, useEffect } from "react";

export default function PhotoPreview({ photo }) {
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    if (photo instanceof File) {
      const blobUrl = URL.createObjectURL(photo);
      setPhotoPreview(blobUrl);
    } else if (typeof photo === 'string') {
      setPhotoPreview(photo);
    }
  }, [photo]);

  return (
    photoPreview && <img src={photoPreview} alt="Preview" className="mt-2 w-64 h-64 object-cover" />
  );
}