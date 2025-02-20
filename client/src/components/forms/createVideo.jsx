import { useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
  Input,
  Select,
  Stack,
  Text,
  Textarea,
  VisuallyHidden,
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { VideoCard } from "../resources/VideoCard";

function CreateVideo() {
  const fileInputRef = useRef(null);

  const [videoData, setVideoData] = useState({
    title: "",
    s3_url: "",
    description: "",
    media_url: "",
    class_id: "",
  });

  const [errors, setErrors] = useState({
    title: false,
    description: false,
    media_url: false,
    class_id: false,
    s3_url: false,
  });

  const { backend } = useBackendContext();

  const [activeButton, setActiveButton] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [classes, setClasses] = useState([]);

  const validateForm = () => {
    const newErrors = {
      title: videoData.title.trim() === "",
      description: videoData.description.trim() === "",
      media_url: videoData.media_url.trim() === "",
      class_id: videoData.class_id.trim() === "",
      s3_url: videoData.s3_url.trim() === "",
    };
    setErrors(newErrors);

    // Returns true if there are no errors
    return (
      !newErrors.title &&
      !newErrors.description &&
      !newErrors.media_url &&
      !newErrors.class_id &&
      !newErrors.s3_url
    );
  };

  const fetchClasses = async () => {
    try {
      const classesResponse = await backend.get("/classes");
      setClasses(classesResponse.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const toggleButton = (buttonName) => {
    setActiveButton((currentActive) =>
      currentActive === buttonName ? null : buttonName
    );
  };

  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setVideoData({
        ...videoData,
        s3_url: `/${file?.name}`,
      });

      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
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

  const handleSubmit = async () => {

    const s3Url = await fetchS3URL();

    const uploadResponse = await fetch(s3Url, {
      method: "PUT",
      body: selectedFile,
      headers: {
        "Content-Type": selectedFile.type,
      },
    });

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload file");
    } 


    setVideoData({...videoData, s3_url: s3Url});

    console.log("valid", videoData);
    if (validateForm()) {
      const res = await backend.post("/classes-videos", {
        title: videoData.title ?? "",
        s3Url: s3Url ?? "",
        description: videoData.description ?? "",
        mediaUrl: videoData.media_url ?? "",
        classId: videoData.class_id ?? "",
      });
      window.location.reload(); // hold on i need to set up a proper form lol
    }
  };

  useEffect(() => {
    fetchClasses();
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Stack
        spacing={4}
        maxWidth="100%"
      >
        <FormControl isInvalid={!!errors.s3_url}>
          <FormLabel>Upload Image</FormLabel>
          <VisuallyHidden>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </VisuallyHidden>
          <Button
            onClick={handleFileUploadClick}
            colorScheme="teal"
          >
            Choose File
          </Button>
          <Input
            value={selectedFile?.name ?? ""}
            placeholder="No file chosen"
            isReadOnly
            width="200px"
            fontSize={12}
          />
          {errors.s3_url && (
            <FormErrorMessage>Image is Required</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isInvalid={!!errors.media_url}>
          <FormLabel>Upload Video Embed URL</FormLabel>
          <Textarea
            onChange={(e) =>
              setVideoData({ ...videoData, media_url: e.target.value })
            }
          />
          {errors.media_url && (
            <FormErrorMessage>Video Is Required</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isInvalid={!!errors.title}>
          <FormLabel>Video Title</FormLabel>
          <Input
            onChange={(e) =>
              setVideoData({ ...videoData, title: e.target.value })
            }
          />
          {errors.title && (
            <FormErrorMessage>Title is Required</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isInvalid={!!errors.description}>
          <FormLabel>Description</FormLabel>
          <Textarea
            onChange={(e) =>
              setVideoData({ ...videoData, description: e.target.value })
            }
          />
          {errors.description && (
            <FormErrorMessage>Description is Required</FormErrorMessage>
          )}
        </FormControl>
        // these don't do anything lol
        <FormControl>
          <FormLabel>Tag</FormLabel>
          <Stack
            direction="row"
            spacing={1}
          >
            <Button
              onClick={() => toggleButton("ballet")}
              colorScheme={activeButton === "ballet" ? "teal" : "gray"}
            >
              Ballet
            </Button>
            <Button
              onClick={() => toggleButton("classical")}
              colorScheme={activeButton === "classical" ? "teal" : "gray"}
            >
              Classical
            </Button>
            <Button
              onClick={() => toggleButton("custom")}
              colorScheme={activeButton === "custom" ? "teal" : "gray"}
            >
              Custom
            </Button>
          </Stack>
        </FormControl>
        <FormControl isInvalid={!!errors.class_id}>
          <FormLabel>Select Class</FormLabel>
          <Select
            placeholder="Select a class"
            onChange={(e) =>
              setVideoData({ ...videoData, class_id: e.target.value })
            }
          >
            {classes.map((classItem) => (
              <option
                key={classItem.id}
                value={classItem.id}
              >
                {classItem.title}
              </option>
            ))}
          </Select>
          {errors.class_id && (
            <FormErrorMessage>Class is Required</FormErrorMessage>
          )}
        </FormControl>
        <Box overflowX="hidden">
          <Text>Preview</Text>
          <VideoCard
            title={videoData.title}
            description={videoData.description}
            S3Url={videoData.s3_url}
            classId={videoData.class_id}
            mediaUrl={videoData.media_url}
          />
        </Box>
        <Button
          colorScheme="teal"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Stack>
    </Box>
  );
}

export default CreateVideo;
