import { useState } from "react";
import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import { Box, Text, Input, Button } from "@chakra-ui/react"

export const UploadComponent = (setS3URL) => {

  const { backend } = useBackendContext();

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const fetchS3URL = async () => {
    try {
      const URLResponse = await backend.get('/s3/url');
      console.log(URLResponse);
      return URLResponse.data.url;
    } catch (error) {
      console.error('Error fetching S3 URL:', error);
    }
  };

  const uploadFile = async () => {
    if (!file) {
      setMessage("Please select file to upload");
      return;
    }

    setUploading(true);
    setMessage("Uploading...");

    try {
      // Get S3 URL from server backend
      const url = await fetchS3URL();

      console.log(setS3URL)

      // Upload file to S3 bucket
      const uploadResponse = await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (uploadResponse.ok) {
        setMessage("File uploaded successfully!");
        setS3URL['setS3URL'](url)
      } else {
        throw new Error("Failed to upload file.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Upload failed, please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box mt={4}>
      <Text fontWeight="bold">Upload a File</Text>
      <Input type="file" onChange={handleFileChange} mt={2} accept={["image/png", "image/jpg"]} />
      <Button onClick={uploadFile} isDisabled={uploading} mt={2}>
        {uploading ? "Uploading..." : "Upload"}
      </Button>
      {message && <Text mt={2} color="green.500">{message}</Text>}
    </Box>
  );
};