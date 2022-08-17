import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 } from 'uuid';
import { storage } from './config.js';

const storeImage = async (image) => {
    const imageRef = ref(storage, `images/${image.name + v4()}`);
    const res = await uploadBytes(imageRef, image);
    const path = res.metadata.fullPath;
    return path;
};

const getImage = async (path) => {
    const imageRef = ref(storage, path);
    const url = await getDownloadURL(imageRef);
    return url;
};

const deleteImage = (path) => {
    const imageRef = ref(storage, path);
    deleteObject(imageRef);
};

export{storeImage, getImage, deleteImage};
