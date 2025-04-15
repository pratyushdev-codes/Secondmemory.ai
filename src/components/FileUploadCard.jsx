import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { FileList } from './FileList';
import { FileTypeIcons } from './FileTypeIcons';
import { AddFileButton } from './AddFileButton';
import { Toaster, toast } from 'react-hot-toast';

export function FileUploadCard() {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  


  const sendFileData = async (fileName) => {
    const options = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName, // Send the file name in the body
      }),
    };
  
    try {
      const res = await fetch(
        'https://secondmemoryai-default-rtdb.firebaseio.com/pdfDocuments.json',  ///Fetches uploaded file's Data from firebase
        options
      );
  
      if (res.ok) {
        console.log("File name successfully saved to DB");
        toast.success("File Uploaded to your Knowledge Base")
      } else {
        console.error("Error occurred while saving file name to DB", res.statusText);
        toast.error("Error occurred while saving file")
      }
    } catch (error) {
      console.error("Network error while saving file name to DB", error);
      toast.error("Network error while saving file")
    }
  };




  const handleFileSelect = async (e) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    // Filter only PDF files
    const pdfFiles = Array.from(selectedFiles).filter(file => 
      file.type === "application/pdf"
    );

    if (pdfFiles.length === 0) {
      toast.error("Please upload PDF files only");
      return;
    }

    setFiles(pdfFiles);
    await uploadFilesToBackend(pdfFiles);
  };

  const uploadFilesToBackend = async (files) => {
    setIsUploading(true);
    const formData = new FormData();
    
    // Append all files to FormData
    files.forEach((file) => {
      formData.append('files', file, file.name);
    });
  
    try {
      const response = await fetch(
        'https://secondmemory-ai-multisourcerag.onrender.com/upload-pdfs/',
        {
          method: 'POST',
          body: formData,
        }
      );
  
      const result = await response.json();
      if (response.ok) {
        toast.success(`Processed ${result.processed_chunks} chunks from ${files.length} PDF(s)`);
        
        // Call sendFileData for each file to save its name to Firebase
        for (const file of files) {
          await sendFileData(file.name);
        }
        
        // Update UI with processed files
        setFiles(prev => prev.map(file => ({
          ...file,
          status: 'processed',
          chunks: result.processed_chunks
        })));
      } else {
        throw new Error(result.detail || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`Upload failed: ${error.message}`);
      setFiles(prev => prev.map(file => ({
        ...file,
        status: 'error'
      })));
    } finally {
      setIsUploading(false);
    }
  };
  


//function to save pdf files to aws s3
// const uploadFiletoAWSs3 = async () => {
//   const S3_BUCKET = "bucket-name";
//   const REGION = "region";

//   AWS.config.update({
//     accessKeyId: "youraccesskeyhere",
//     secretAccessKey: "yoursecretaccesskeyhere",
//   });
//   const s3 = new AWS.S3({
//     params: { Bucket: S3_BUCKET },
//     region: REGION,
//   });

//   const params = {
//     Bucket: S3_BUCKET,
//     Key: file.name,
//     Body: file,
//   };

//   var upload = s3
//     .putObject(params)
//     .on("httpUploadProgress", (evt) => {
//       console.log(
//         "Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%"
//       );
//     })
//     .promise();

//   await upload.then((err, data) => {
//     console.log(err);
//     alert("File uploaded successfully.");
//   });
// };


  return (
    <div className="p-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#D9D9D9"
          >
            <path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
          </svg>
          <h2 className="text-lg font-medium text-white">Upload Files</h2>
        </div>
        <button className="text-gray-400 hover:text-cyan-400 transition-colors">
          <MoreVertical size={18} />
        </button>
      </div>

      <FileList files={files} isUploading={isUploading} />

      <div className="flex items-center justify-between">
        <FileTypeIcons />
        <AddFileButton onFileSelect={handleFileSelect} isUploading={isUploading} />
      </div>

      {/* Add a hidden file input to trigger the upload */}
      <input
  type="file"
  id="file-upload"
  accept=".pdf"
  multiple
  onChange={handleFileSelect}
  style={{ display: 'none' }}
/>

    </div>
  );
}
