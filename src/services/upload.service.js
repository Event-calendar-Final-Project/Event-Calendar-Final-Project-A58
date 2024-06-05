import { getStorage, ref, deleteObject, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export function addUserPhoto(file, handle) {
  const storage = getStorage();
  const storageRef = ref(storage, `users/${handle}/${file.name}`);

  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed',
      (snapshot) => {
        console.log('Upload is done');
      }, 
      (error) => {
        console.log('Upload failed', error);
        reject(error);
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          resolve(downloadURL);
        });
      }
    );
  });
}

export async function updateUserPhoto(file, handle, oldPhotoUrl) {
    const storage = getStorage();
  
    if (oldPhotoUrl) {
        
        console.log('Old photo URL:', oldPhotoUrl);
        const url = new URL(oldPhotoUrl);    
        const path = url.pathname;
        const decodedPath = decodeURIComponent(path);
        console.log('Decoded path:', decodedPath);
        const pathParts = decodedPath.split('/');
        console.log('Path parts:', pathParts)
        const oldPhotoName = pathParts[pathParts.length - 1];
        console.log('Old photo name:', oldPhotoName);
        const oldPhotoRef = ref(storage, `users/${handle}/${oldPhotoName}`);
        await deleteObject(oldPhotoRef);
    }
  
    const newPhotoRef = ref(storage, `users/${handle}/${file.name}`);
    const uploadTask = uploadBytesResumable(newPhotoRef, file);
  
    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        (snapshot) => {
          console.log('Upload is in progress');
        },
        (error) => {
          console.log('Upload failed', error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('File available at', downloadURL);
          resolve({ photoName: file.name, downloadURL });
        }
      );
    });
  }