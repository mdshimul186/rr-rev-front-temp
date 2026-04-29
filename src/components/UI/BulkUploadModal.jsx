import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FaCloudUploadAlt } from "react-icons/fa";
import { uploadCsvFile } from "../../services/customer";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";

/**
 * BulkUploadModal component for uploading CSV files.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {Function} props.onRequestClose - Function to close the modal.
 * @param {string} props.businessId - The business ID associated with the upload.
 * @returns {JSX.Element} The rendered bulk upload modal.
 */
export const BulkUploadModal = ({ isOpen, onRequestClose, businessId }) => {
  const { t } = useOutletContext();
  const [file, setFile] = useState(null);
  const language = localStorage.getItem("language");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const {
    file_upload,
    excel_upload,
    attachments,
    attachfile,
    browseFile,
    acceptFile,
    upload,
  } = t("customerComponent");

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("business_id", businessId);
      formData.append("File", file);
      const payload = {
        business_id: businessId,
        file,
      };
      try {
        const response = await uploadCsvFile(payload);
        if (response.success) {
          toast.success(response.message);
          setFile("");
          onRequestClose();
        }
      } catch (error) {
        toast.error(error.response.data.data.message[language]);
      }
    } else {
      toast.error(file_upload);
    }
  };

  const handleClose = () => {
    setFile(null);
    onRequestClose();
  };

  return (
    <Modal
      show={isOpen}
      onHide={onRequestClose}
      animation={true}
      className="bulk-upload--box"
      size="md"
      centered
    >
      <Modal.Header>
        <h5 className="modal-title">{excel_upload}</h5>
        <button
          type="button"
          className="btn-close"
          onClick={handleClose}
          aria-label="Close"
        ></button>
      </Modal.Header>
      <Modal.Body>
        <div className="modal-body text-center">
          <div>
            <p className="attachment-head">{attachments}</p>
            <div className="text-center attachment-box">
              <FaCloudUploadAlt />
              <p>{attachfile}</p>
              <span>Or</span>
              <div>
                <label htmlFor="attachFile" className="form-label">
                  {browseFile}
                </label>
                {file?.name && (
                  <p className="uploaded-file-name text-primary">
                    {file?.name}
                  </p>
                )}
                <input
                  className="d-none"
                  type="file"
                  id="attachFile"
                  accept=".csv"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <p className="accept-para">{acceptFile}</p>
          </div>
          <div className="modal-btns mt-4 mb-0">
            <button
              type="button"
              title={upload}
              className="button modal-btn-bg"
              onClick={handleUpload}
            >
              {upload}
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
