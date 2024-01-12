import React, { useState } from 'react';
import { Dialog, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import axios from 'axios';

const FileUploadDialog = ({ open, onClose }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        await axios.post(process.env.REACT_APP_DATA_API_UPLOAD, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-api-key': process.env.REACT_APP_DATA_API_KEY,
          },
        });
        // Handle successful upload
        alert('Upload Successful');
      } catch (error) {
        // Handle upload error
        console.error('Upload failed', error);
        alert('Upload Failed');
      }
    }
    onClose(); // Close the dialog after upload attempt
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <TextField
          type="file"
          onChange={handleFileChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleUpload} color="primary">Upload</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileUploadDialog;
