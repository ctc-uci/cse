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
  const videoInputRef = useRef(null);

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
  const [videoFile, setVideoFile] = useState(null);
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
  const handleVideoUploadClick = () => {
    videoInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setVideoData({
        ...videoData,
        media_url: `placeholder.bcIdontthinkthiswasinthescopeofthisticket/${file?.name}`,
      });

      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleVideoFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoData({
        ...videoData,
        s3_url: `placeholder.bcIdontthinkthiswasinthescopeofthisticket/${file?.name}`,
      });
      console.log("File selected:", file.name);
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const res = await backend.post("/classes-videos", {
        title: videoData.title ?? "",
        s3Url: videoData.s3_url ?? "",
        description: videoData.description ?? "",
        mediaUrl: videoData.media_url ?? "",
        classId: videoData.class_id ?? "",
      });
    }
  };

  useEffect(() => {
    fetchClasses();
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, classes]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Stack spacing={4}>
        {!previewUrl ? (
          <FormControl isInvalid={!!errors.media_url}>
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
            {errors.media_url && (
              <FormErrorMessage>Image is Required</FormErrorMessage>
            )}
          </FormControl>
        ) : (
          <Box
            mt={4}
            mb={4}
          >
            <Image
              src={previewUrl}
              alt="Preview"
              maxHeight="200px"
              objectFit="contain"
              onDoubleClick={() => setPreviewUrl(null)}
            />
          </Box>
        )}
        <FormControl isInvalid={!!errors.s3_url}>
          <FormLabel>Upload Video</FormLabel>
          <Stack
            direction="row"
            spacing="0"
          >
            <VisuallyHidden>
              <Input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoFileChange}
              />
            </VisuallyHidden>
            <Button
              onClick={handleVideoUploadClick}
              colorScheme="teal"
            >
              Choose File
            </Button>
            <Input
              value={videoFile?.name ?? ""}
              placeholder="No file chosen"
              isReadOnly
              width="200px"
              fontSize={12}
            />
          </Stack>
          {errors.s3_url && (
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
          type="submit"
        >
          Submit
        </Button>
      </Stack>
    </Box>
  );
}

export default CreateVideo;
