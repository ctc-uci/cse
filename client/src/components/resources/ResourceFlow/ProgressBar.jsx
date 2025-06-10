import {
  Box,
  Progress,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  useSteps,
} from "@chakra-ui/react";

export const ProgressBar = ({ currStep }) => {
  const steps = [
    { title: "1st", description: "Select Class" },
    { title: "2nd", description: "Form" },
    { title: "3rd", description: "Tags" },
    { title: "4th", description: "Photo" },
    { title: "5th", description: "Card" },
  ];

  const { activeStep, setActiveStep } = useSteps({
    index: currStep,
    count: steps.length,
  });

  // const activeStepText = steps[activeStep].description

  const max = steps.length - 1;
  const progressPercent = (activeStep / max) * 100;

  return (
    <Box
      position="relative"
      width="full"
      display="flex"
      justifyContent="center"
    >
      <Box
        w="90%"
        p="5px"
      >
        <Progress
          value={progressPercent}
          height="8px"
          width="100%"
          top="10px"
          zIndex={-1}
          colorScheme="purple"
          sx={{ "--chakra-colors-purple-500": "purple.600" }}
        />
      </Box>
    </Box>
  );
};
