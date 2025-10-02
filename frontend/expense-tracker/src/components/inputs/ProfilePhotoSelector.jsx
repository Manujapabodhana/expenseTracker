import React, { useRef, useState } from 'react'
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu'

const ProfilePhotoSelector = ({ image, setImage }) => {
    const inputRef = useRef(null);
    const [preview, setPreview] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // update the image state
            setImage(file);

            // generate a preview url from the file 
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreview(null);
    };

    const onChooseFile = () => {
        inputRef.current.click();
    }

  return (
    <div className="flex justify-center mb-6">
        <input 
            type="file"
            accept="image/*"
            className="hidden"
            ref={inputRef}
            onChange={handleImageChange}
        />

        {image && preview ? (
            <div className="relative">
                <img
                    src={preview}
                    alt="Profile Photo"
                    className="w-24 h-24 rounded-full object-cover border-2 border-purple-300"
                />
                <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    onClick={handleRemoveImage}
                >
                    <LuTrash className="w-3 h-3"/>
                </button>
            </div>
        ) : (
            <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-purple-400 cursor-pointer" onClick={onChooseFile}>
                    <LuUser className="w-8 h-8 text-gray-400" />
                </div>
                <button
                    type="button"
                    className="mt-2 flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm"
                    onClick={onChooseFile}
                >
                    <LuUpload className="w-4 h-4"/>
                    Upload Photo
                </button>
            </div>
        )}
    </div>
  )
}

export default ProfilePhotoSelector
