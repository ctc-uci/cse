import { useCallback, useEffect, useState } from "react";

import { Button } from "@chakra-ui/react";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import ClassInfoModal from "./ClassInfoModal";
import CoReqWarningModal from "./CoReqWarningModal";
import EventInfoModal from "./EventInfoModal";

/*
infoProps: title, location, description, level, date, id, capacity, costume
*/
function SignUpController({
  user,
  openRootModal,
  setOpenRootModal,
  class_id = null,
  event_id = null,
  tags = [],
  ...infoProps
}) {
  const { backend } = useBackendContext();
  const { currentUser } = useAuthContext();
  const [openCoreqModal, setOpenCoreqModal] = useState(false);
  const [corequisites, setCorequisites] = useState([]);
  // Is null as a initial state in this case okay? Semantically it makes sense to me.
  const [modalIdentity, setModalIdentity] = useState(null);
  const [coReqResponse, setCoreqResponse] = useState(null);
  const [filteredCorequisites, setFilteredCorequisites] = useState([]);
  const [tag, setTags] = useState([]);
  const [teacherName, setTeacherName] = useState("");

  const fetchCorequirements = useCallback(async () => {
    const id = class_id ?? event_id;
    const userId = user.data[0].id;

    if (class_id !== null) {
      // For classes, get associated event corequisite (max 1 per class)
      const classCoReqResponse = await backend.get(
        `/classes/corequisites/${id}/${userId}`
      );
      setCoreqResponse(classCoReqResponse.data);
    } else {
      const response = await backend.get(
        `/events/corequisites/${id}/${userId}`
      );
      setCoreqResponse(response.data);
    }
  }, [backend, class_id, event_id, currentUser.uid]);

  const toggleRootModal = () => {
    setOpenRootModal(!openRootModal);
  };
  const toggleCoreqModal = () => {
    toggleRootModal();
    setOpenCoreqModal(true);
  };

  useEffect(() => {
    if (coReqResponse) {
      // is this check to see an event okay? Will classes get call times in the future?
      // console.log("CoReqResponse: ", coReqResponse);
      const coreqs = coReqResponse.map((coreq) => {
        const userId = user.data[0].id;
        // No need to check userId anymore, coreq response will only return the rows for studentId
        if (userId === coreq.studentId) {
          return {
            ...coreq,
            isEvent: coreq.callTime ? true : false,
          };
        } else {
          return {
            ...coreq,
            isEvent: coreq.callTime ? true : false,
          };
        }
      });

      // filter out the class associated with the card the user is currently on.
      const postProcessedCoreqs = coreqs.filter((coreq) => {
        if (class_id) {
          return class_id !== coreq.id;
        }

        if (event_id) {
          return event_id !== coreq.id;
        }
      });
      // console.log("Filtered Coreqs: ", postProcessedCoreqs);
      setCorequisites(coreqs);
      setFilteredCorequisites(postProcessedCoreqs);
    }
  }, [coReqResponse]);

  useEffect(() => {
    if (openRootModal) {
      fetchCorequirements();
    }
  }, [fetchCorequirements, openRootModal]);

  useEffect(() => {
    // console.log(modalIdentity);
  }, [modalIdentity]);

  if (class_id !== null && event_id !== null) {
    throw new Error("Cannot have both class_id and event_id");
  }

  // console.log("SignUpController Rendered:", infoProps.title, class_id, event_id);
  return (
    <>
      {class_id ? (
        <ClassInfoModal
          isOpenProp={openRootModal}
          id={class_id}
          {...infoProps}
          corequisites={filteredCorequisites}
          filteredCorequisites={filteredCorequisites}
          isCorequisiteSignUp={false}
          handleClose={toggleRootModal}
          handleResolveCoreq={toggleCoreqModal}
          user={user}
          modalIdentity={modalIdentity}
          setModalIdentity={setModalIdentity}
          tags={tags}
        />
      ) : (
        <EventInfoModal
          isOpenProp={openRootModal}
          id={event_id}
          {...infoProps}
          corequisites={filteredCorequisites}
          isCorequisiteSignUp={false}
          handleClose={toggleRootModal}
          handleResolveCoreq={toggleCoreqModal}
          user={user}
          modalIdentity={modalIdentity}
          setModalIdentity={setModalIdentity}
          tags={tags}
        />
      )}

      <CoReqWarningModal
        user={user}
        origin={class_id ? "CLASS" : "EVENT"}
        title={infoProps.title}
        isOpenProp={openCoreqModal}
        class_id={class_id}
        event_id={event_id}
        {...infoProps}
        lstCorequisites={corequisites}
        handleClose={toggleCoreqModal}
        killModal={() => setOpenCoreqModal(false)}
        modalIdentity={modalIdentity}
        setModalIdentity={setModalIdentity}
        filteredCorequisites={filteredCorequisites}
      />

      {/* <Button onClick={() => setOpenRootModal(true)}>View Details</Button> */}
    </>
  );
}

export default SignUpController;
