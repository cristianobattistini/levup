import React, { useState } from 'react';

const FileUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const maxSize = 3 * 1024 * 1024; // 3MB

    if (file && allowedTypes.includes(file.type) && file.size <= maxSize) {
      setSelectedFile(file);
      setErrorMessage('');
    } else {
      setSelectedFile(null);
      setErrorMessage('Please select a valid PDF, JPEG, or PNG file (max 3MB).');
    }
  };

  return (
    <div>
      <div className="input-group mb-3">
        <div className="custom-file">
          <input
            type="file"
            className="custom-file-input"
            id="fileInput"
            onChange={handleFileChange}
          />
          <label className="custom-file-label" htmlFor="fileInput">
            Choose file
          </label>
        </div>
      </div>
      {errorMessage && <div className="text-danger">{errorMessage}</div>}
      {selectedFile && (
        <div>
          <div>Selected File: {selectedFile.name}</div>
          <div>File Size: {selectedFile.size} bytes</div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
