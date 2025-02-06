import { useEffect, useState } from "react";
// import { render } from "@react-email/components";
import { renderToPipeableStream } from "react-dom/server";

import {
  Box,
  Button,
  Center,
  Flex,
  Image,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";

import axios from "axios";
import { z } from "zod";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { useRoleContext } from "../../contexts/hooks/useRoleContext";
import ClassInfoModal from "../reviewModals/classInfoModal";
import ReviewFailureModal from "../reviewModals/reviewFailureModal";
import ReviewModal from "../reviewModals/reviewModal";
import ReviewSubmittedModal from "../reviewModals/reviewSubmittedModal";
import { ClassCard } from "../shared/ClassCard";

// import { EmailTemplate } from "../signup/EmailTemplate";

export const Playground = () => {
  const { backend } = useBackendContext();

  const [classes, setClasses] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch and Store Classes Information
      try {
        const response = await backend.get("/classes");
        setClasses(response.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }

      // Fetch and Store Events Information
      try {
        const response = await backend.get("/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchData();
  }, [backend]);

  return (
    <Box>
      <Flex
        align="center"
        justify="center"
        gap={5}
        wrap="wrap"
      >
        {classes.map((classItem, index) => (
          <ClassCard
            key={index}
            title={classItem.title}
            description={classItem.description}
            location={classItem.location}
            capacity={classItem.capacity}
            level={classItem.level}
            costume={classItem.costume}
          />
        ))}

        {events.map((eventItem, index) => (
          // Your event card component and its props!
          <></> // here to avoid errors
        ))}
      </Flex>
    </Box>
  );

  //   <>
  //   <ReviewModal />
  //   <ReviewSubmittedModal />
  //   <ReviewFailureModal />
  //   <ClassInfoModal
  //     title="Yoga for Beginners"
  //     description="A beginner-friendly yoga class that focuses on flexibility and relaxation techniques."
  //     location="Downtown Studio, Room 301"
  //     capacity={20}
  //     level="beginner"
  //     costume="Comfortable clothes, no shoes"
  //   />
  // </>
  // const [formData, setFormData] = useState({
  //   firstName: "",
  //   lastName: "",
  //   role: "",
  //   email: "",
  // });

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: value,
  //   });
  // };

  // // Validation of data before sending it to the server
  // const handleSubmit = async () => {
  //   const schema = z.object({
  //     firstName: z.string().min(1, "First name is required"),
  //     lastName: z.string().min(1, "Last name is required"),
  //     role: z.string().min(1, "Role is required"),
  //     email: z.string().email("Invalid email address"),
  //   });

  //   const validation = schema.safeParse(formData);
  //   if (!validation.success) {
  //     alert(validation.error.errors.map((err) => err.message).join("\n"));
  //     return;
  //   }
  //   try {
  //     // post request to the server
  //     const response = await axios.post(
  //       import.meta.env.VITE_BACKEND_HOSTNAME + "/nodemailer/send",
  //       {
  //         to: import.meta.env.VITE_ADMIN_EMAIL,
  //         // Rendering template and sending it over: https://react.email/docs/integrations/nodemailer#send-email-using-nodemailer
  //         html: await render(EmailTemplate(formData)),
  //       },
  //     );
  //     console.log(response);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // return (
  //   <Box>
  //     <Text>
  //       This is page will be used to test any modal or component that does not
  //       have a specific place for it yet!
  //     </Text>
  //     <Stack spacing={3} mt={4}>
  //       <Input
  //         placeholder="First Name"
  //         name="firstName"
  //         value={formData.firstName}
  //         onChange={handleChange}
  //       />
  //       <Input
  //         placeholder="Last Name"
  //         name="lastName"
  //         value={formData.lastName}
  //         onChange={handleChange}
  //       />
  //       <Input
  //         placeholder="Role"
  //         name="role"
  //         value={formData.role}
  //         onChange={handleChange}
  //       />
  //       <Input
  //         placeholder="Email"
  //         name="email"
  //         value={formData.email}
  //         onChange={handleChange}
  //       />
  //       <Button onClick={handleSubmit}>Send</Button>
  //     </Stack>
  //   </Box>
  // );

  // const { logout, currentUser } = useAuthContext();
  // const { role } = useRoleContext();

  // console.log(currentUser)

  // return (
  //   <Box>
  //     <Center>
  //       <Image
  //         src="https://bit.ly/naruto-sage"
  //         boxSize="250px"
  //         borderRadius="full"
  //         fit="cover"
  //         alt="Naruto Uzumaki"
  //       />
  //     </Center>

  //     <Center>
  //       <br />
  //       <Text>
  //         Signed in as {currentUser?.email} <br />
  //       </Text>
  //     </Center>

  //     <Center>
  //       Your role is: {role === "admin" ? "Admin" : "User"}
  //     </Center>

  //     <Center>
  //       ID: {currentUser?.uid}
  //     </Center>

  //     <br /> <br />

  //     <Center>
  //       <Button>Donation PLS!</Button>
  //     </Center>
  //   </Box>
  // );
};
