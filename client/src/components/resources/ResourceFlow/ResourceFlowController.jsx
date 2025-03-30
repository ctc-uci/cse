import { useState, useEffect } from "react";
import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import { useDisclosure } from "@chakra-ui/react";

import { CardModal } from "./CardModal";
import { SelectMediaModal } from "./SelectMediaModal";
import { SelectTagModal } from "./SelectTagModal";
import { TitleModal } from "./TitleModal";
import { UploadFileModal } from "./UploadFileModal";
import { UploadLinkModal } from "./UploadLinkModal";
import { SelectClassModal } from "./SelectClassModal";
import { FormModal } from "./FormModal";

export const ControllerModal = ({ autoOpen = false }) => {
  const { backend } = useBackendContext();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentModal, setCurrentModal] = useState("select-class");
  const [tags, setTags] = useState([]);
  const [link, setLink] = useState('');
  const [title, setTitle] = useState('');
  const [s3URL, setS3URL] = useState('');
  const [clsId, setClsId] = useState('');
  const [description, setDescription] = useState('');
  console.log("Creating resource with data:", title, description, link, tags, clsId);


  // Effect to automatically open the modal if autoOpen is true
  useEffect(() => {
    if (autoOpen) {
      onOpen();
    }
  }, [autoOpen, onOpen]);

  const onCloseModal = () => {
    setCurrentModal("select-class");
    onClose();
  };

  const ajax = async () => {
    
      const url = new URL(s3URL);
      const urlBeforeQuery = url.origin + url.pathname;
      let resourceId;
      
      if (link.includes("youtube")) {
        // Create video resource
        const videoResponse = await backend.post("/classes-videos", {
          title: title,
          s3Url: urlBeforeQuery,
          description: description,
          mediaUrl: link,
          classId: clsId
        });
        
        console.log("Video Response:", videoResponse);
        console.log("Video Response Data:", videoResponse.data);
        resourceId = videoResponse.data[0].id;
        console.log("Created video with ID:", resourceId);
        console.log("just checking class id", videoResponse.data.classId);
        
        if (tags.length > 0) {
          for (const ids of tags) {

            await backend.post("/video-tags", {
              videoId: resourceId,
              tagId: ids
            });
          }
        }
      } 
      // if is not a youtube video
      else {
        // Create article resource
        const articleResponse = await backend.post("/articles", {
          s3_url: urlBeforeQuery,
          description: title,
          media_url: link
        });
        
        resourceId = articleResponse.data.id;
        console.log("Created article with ID:", resourceId);
        
        if (tags.length > 0) {
          for (const ids of tags) {
            console.log("Tag ID:", ids);
            console.log("Resource ID:", resourceId);
            await backend.post("/article-tags", {
              articleId: resourceId,
              tagId: ids
            });
          }
        }
      }
      
      // Redirect back to resources page
      window.location.href = "/resources";
    
  };

  const renderModal = () => {
    if (currentModal === "select-media") {
      return <SelectMediaModal isOpen={isOpen} onClose={onCloseModal} setCurrentModal={setCurrentModal} />;
    } else if (currentModal === "upload-link") {
      return <UploadLinkModal isOpen={isOpen} onClose={onCloseModal} setCurrentModal={setCurrentModal} link={link} setLink={setLink}/>;
    } else if (currentModal === "select-tag") {
      return <SelectTagModal isOpen={isOpen} onClose={onCloseModal} setCurrentModal={setCurrentModal} tags={tags} setTags={setTags} clsId={clsId}/>;
    } else if (currentModal === "title") {
      return <TitleModal isOpen={isOpen} onClose={onCloseModal} setCurrentModal={setCurrentModal} title={title} setTitle={setTitle}/>;
    } else if (currentModal === "card") {
      const url = new URL(s3URL);
      const urlBeforeQuery = url.origin + url.pathname;
      return <CardModal isOpen={isOpen} onClose={onCloseModal} setCurrentModal={setCurrentModal} title={title} description={description} tags={tags} link={link} s3URL={urlBeforeQuery} ajax={ajax}/>;
    } else if (currentModal === "upload-photo") {
      return <UploadFileModal isOpen={isOpen} onClose={onCloseModal} setCurrentModal={setCurrentModal} s3URL={s3URL} setS3URL={setS3URL} />;
    } else if (currentModal === "select-class") {
      return <SelectClassModal isOpen={isOpen} onClose={onCloseModal} setCurrentModal={setCurrentModal} setClsId={setClsId} />;
    } else if (currentModal === "form") {
      return <FormModal isOpen={isOpen} onClose={onCloseModal} setCurrentModal={setCurrentModal} title={title} setTitle={setTitle} description={description} setDescription={setDescription} link={link} setLink={setLink} />;
    }
    return null;
  };

  return <>{renderModal()}</>;
};