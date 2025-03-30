import { ControllerModal } from "../resources/ResourceFlow/ResourceFlowController";

export const Playground = () => {
  const userRole = "teacher"
  if (userRole === "teacher") {
    return (
      <ControllerModal />
    )
  } else {
    return (
      <></>
    )
  }
};
