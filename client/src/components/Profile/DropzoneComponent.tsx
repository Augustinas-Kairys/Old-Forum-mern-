import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUpload, faTrash } from "@fortawesome/free-solid-svg-icons";
import Notification from "../Notification";

const DropzoneComponent: React.FC<{
  userId: string;
  handleUploadNotification: () => void;
  updateUserInfo: () => void;
}> = ({ userId, handleUploadNotification, updateUserInfo }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [uploadedCount, setUploadedCount] = useState<number>(0);

  useEffect(() => {
    const dropzoneOptions: DropzoneOptions = {
      url: `http://localhost:3001/api/auth/upload-profile-picture/${userId}`,
      acceptedFiles: "image/*",
      dictDefaultMessage: "Vilkite failus čia arba spustelėkite, jei norite įkelti",
      maxFiles: 1,
    };

    const dropzone = new Dropzone("#uploadForm", dropzoneOptions);

    dropzone.on("error", (file, errorMessage) => {
      console.log("Error message:", errorMessage); // Add this line to check the error message
      let customErrorMessage = "Daugiau kaip vieno failo negalime įkelti.";
      if (errorMessage === "Failas yra per didelis") {
        customErrorMessage = "Failo dydis viršija leistiną limitą.";
      } else if (errorMessage === "You can't upload files of this type") {
        customErrorMessage = "Įkelkite vaizdo failą.";
      }
      setErrorMessage(customErrorMessage);
      
      // Stop the upload process
      dropzone.removeAllFiles(true); // true: cancelPendingUploads
      
      // Clear the error message after 3 seconds
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    });

    dropzone.on("success", (file) => {
      setFileUploaded(true);
      setUploadedCount((prevCount) => prevCount + 1);
      handleUploadNotification();
      setNotification("Failas įkeltas sėkmingai");
      updateUserInfo();
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    });

    dropzone.on("sending", function (file, xhr, formData) {
      formData.append("userId", userId);
    });

    return () => {
      dropzone.destroy();
    };
  }, [userId, handleUploadNotification, updateUserInfo]);

  const removePicture = () => {
    setFileUploaded(false);
    setNotification(null);
    setUploadedCount(0);
    setErrorMessage(null);
    const dropzoneInput = document.querySelector<HTMLInputElement>(
      "#uploadForm input[type='file']"
    );
    if (dropzoneInput) {
      dropzoneInput.value = "";
    }
  };

  return (
    <div className="dropzone-container p-2">
      {errorMessage && (
        <Notification message={errorMessage} type="danger" id={1} />
      )}
      {notification && (
        <Notification message={notification} type="success" id={2} />
      )}
      <form id="uploadForm" className="dropzone">
        <div className="fallback">
          <input
            name="file"
            type="file"
            multiple={false}
            placeholder="Vilkite failus čia arba spustelėkite, jei norite įkelti"
          />
        </div>
        {!fileUploaded ? (
          <div className="upload-icon">
            <FontAwesomeIcon icon={faFileUpload} />
          </div>
        ) : (
          <div className="remove-icon" onClick={removePicture}>
            <FontAwesomeIcon icon={faTrash} />
          </div>
        )}
      </form>
    </div>
  );
};

export default DropzoneComponent;
