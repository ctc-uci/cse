import {
    Box,
    Step,
    StepDescription,
    StepIcon,
    StepIndicator,
    StepNumber,
    StepSeparator,
    StepStatus,
    StepTitle,
    Stepper,
    useSteps,
    Progress
} from '@chakra-ui/react'


export const ProgressBar = ({currStep}) => {
    const steps = [
        { title: '1st', description: 'Select Class' },
        { title: '2nd', description: 'Form' },
        { title: '3rd', description: 'Tags' },
        { title: '4th', description: 'Photo' },
        { title: '5th', description: 'Card' },
      ]
      
    const { activeStep, setActiveStep } = useSteps({
      index: currStep,
      count: steps.length,
    })
  
    // const activeStepText = steps[activeStep].description
  
    const max = steps.length - 1
    const progressPercent = (activeStep / max) * 100
  
    return (
      <Box position='relative'>
        <Stepper size='sm' index={activeStep} gap='0'>
          {steps.map((step, index) => (
            <Step key={index} gap='0'>
              <StepIndicator bg='white'>
                <StepStatus complete={<StepIcon />} />
              </StepIndicator>
            </Step>
          ))}
        </Stepper>
        <Progress
          value={progressPercent}
          position='absolute'
          height='3px'
          width='full'
          top='10px'
          zIndex={-1}
        />
      </Box>
    )
}
  

