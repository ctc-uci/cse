import { useState, useEffect } from "react";
import { VideoCard } from "./VideoCard";
import { NewsCard } from "./NewsCard";
import { UploadComponent } from "./UploadComponent";
import { Button, Flex, Text, Box , IconButton} from "@chakra-ui/react";
import { ControllerModal } from "./ResourceFlow/ResourceFlowController";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { Navbar } from "../navbar/Navbar";
import { useAuthContext } from "../../contexts/hooks/useAuthContext";


export const Resources = () => {

  const { backend } = useBackendContext();
  const [videos, setVideos] = useState([]);
  const [news, setNews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const {role} = useAuthContext();


  const handleVideoButton = () => {
    console.log('Videos button has been pressed!');
    console.log(videos);
  };

  const handleNewsButton = () => {
    console.log('News button has been pressed!');
    console.log(news);
  };
  const handleAddButtonClick = () => {
    console.log('Add button clicked!');

    setShowModal(false);
    setTimeout(() => {
      setShowModal(true);
    }, 0);
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const fetchVideos = async () => {
    try {
      const videoResponse = await backend.get('/classes-videos');
      setVideos(videoResponse.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const fetchNews = async () => {
    try {
      const newsResponse = await backend.get('/articles');
      setNews(newsResponse.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  useEffect(() => {
    fetchVideos(); // Fetch videos initially
    fetchNews();   // Fetch news initially
  }, []);

  return (
    <Box position="relative" pb="70px" minHeight="100vh">
    <Flex direction="column" p={4} gap={4}>
      <Text textStyle="xl" mb={4}>Resources</Text>
      <Flex gap={4}>
        {/* <Button onClick={handleVideoButton}>Videos</Button>
        <Button onClick={handleNewsButton}>News</Button> */}
      </Flex>
      <Box>
        <Text fontWeight="bold" mt={4}>Videos</Text>
        <Flex wrap="wrap" gap={4}>
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              id={video.id}
              description={video.description}
              title={video.title}
              S3Url={video.S3Url}
              classId={video.classId}
              mediaUrl={video.mediaUrl}
            />
          ))}
        </Flex>
      </Box>
      <Box>
        <Text fontWeight="bold" mt={4}>News</Text>
        <Flex wrap="wrap" gap={4}>
          {news.map((newsItem) => (
            <NewsCard
              key={newsItem.id}
              id={newsItem.id}
              S3Url={newsItem.S3Url}
              description={newsItem.description}
              mediaUrl={newsItem.mediaUrl}
            />
          ))}
        </Flex>

      </Box>
      <UploadComponent />
    </Flex>
    {role === "teacher" && <IconButton
        icon={<span style={{ fontSize: "24px" }}>+</span>}
        colorScheme="purple"
        size="lg"
        isRound
        position="fixed"
        bottom="95px"
        right="24px"
        zIndex={5}
        boxShadow="lg"
        aria-label="Add new item"
        onClick={handleAddButtonClick}
      />}
      {showModal && <ControllerModal autoOpen={true}/> }


    <Navbar></Navbar>
    </Box>
  );
};
