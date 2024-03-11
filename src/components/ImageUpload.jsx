import React, { useState, useRef, useEffect } from 'react';
import DefaultImage from '../assets/default.png';
import UploadingAnimation from '../assets/uploading.gif';

const ImageUpload = () => {

    const [avatarURL, setAvatarURL] = useState(DefaultImage);
    const [errorMessage, setErrorMessage] = useState("");
    const fileUploadRef = useRef();
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 480);
        };

        // Écoute les changements de taille de l'écran
        window.addEventListener('resize', handleResize);

        // Nettoie l'écouteur lors du démontage du composant
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleImageUpload = (event) => {
        event.preventDefault();
        fileUploadRef.current.click();
    }

    const uploadImageDisplay = async () => {
        try {

            const uploadedFile = fileUploadRef.current.files[0];

            // Vérifier le type de fichier
            const supportedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!uploadedFile || !supportedFormats.includes(uploadedFile.type)) {
                setErrorMessage("Veuillez sélectionner une image valide (jpeg, png, gif, webp).");
                setAvatarURL(DefaultImage);
                return;
            }

            setAvatarURL(UploadingAnimation);

            const formData = new FormData();
            formData.append("file", uploadedFile);

            const response = await fetch("https://api.escuelajs.co/api/v1/files/upload", {
                method: "post",
                body: formData
            });
            if (response.status === 201) {
                const data = await response.json();
                setAvatarURL(data?.location);
                setErrorMessage("");
            }
        } catch (error) {
            console.log(error);
            setAvatarURL(DefaultImage);
        }
    }

    const handleImageClick = () => {
        fileUploadRef.current.click();
    }

    return (
        <div className={`relative w-full max-w-xs m-10 ${isSmallScreen ? 'flex items-center justify-center' : ''}`}>
            {errorMessage && (
                <p className="text-red-500">{errorMessage}</p>
            )}
            <img
                src={avatarURL}
                alt="Avatar"
                className={`rounded-full object-cover cursor-pointer ${isSmallScreen ? 'w-48 h-48' : 'w-80 h-80'}`}
                onClick={handleImageClick}
            />
            <form id="form" encType='multipart/form-data'>
                {!isSmallScreen && (
                    <button
                        type="submit"
                        onClick={handleImageUpload}
                        className='flex-center absolute bottom-12 right-10 h-9 w-9 rounded-full'
                    >
                    </button>
                )}
                <input
                    type="file"
                    id="file"
                    ref={fileUploadRef}
                    onChange={uploadImageDisplay}
                    accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
                    hidden
                />
            </form>
        </div>
    )
}

export default ImageUpload



