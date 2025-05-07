import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Text,
  VStack,
  Checkbox,
  Radio,
  RadioGroup,
  Stack,
  Progress,
  useBreakpointValue,
  Grid,
  GridItem,
  Heading,
} from '@chakra-ui/react';

interface QuestionStep {
  question: string;
  options: string[];
  type: 'checkbox' | 'radio';
  isMultiSelect?: boolean;
}

const questions: QuestionStep[] = [
  {
    question: 'What are your main skin concerns?',
    options: [
      'Acne and breakouts',
      'Fine lines and wrinkles',
      'Uneven skin tone',
      'Dryness and dehydration',
      'Large pores',
      'Dark spots',
    ],
    type: 'checkbox',
    isMultiSelect: true,
  },
  {
    question: "What's your primary skincare goal?",
    options: [
      'Clear up acne',
      'Anti-aging',
      'Even skin tone',
      'Hydration',
      'General skin health',
    ],
    type: 'radio',
  },
  {
    question: "What's your age range?",
    options: ['Under 20', '20-30', '31-40', 'over 40', 'Prefer not to say'],
    type: 'radio',
  },
  {
    question: "What's your skin type?",
    options: ['Normal', 'Oily', 'Dry', 'Sensitive', 'Combination', "I'm not sure"],
    type: 'radio',
  },
  {
    question: 'What type of product would you like as part of your skin care routine?',
    options: ['Cleanser', 'Serum', 'Moisturizer', 'Sunscreen', 'N/A'],
    type: 'checkbox',
    isMultiSelect: true,
  },
  {
    question: 'Are you looking for products with specific ingredients?',
    options: ['Hyaluronic acid', 'Retinol', 'Vitamin C'],
    type: 'checkbox',
    isMultiSelect: true,
  },
];

const Questionnaire = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  const handleAnswer = (answer: string | string[]) => {
    setAnswers({
      ...answers,
      [currentStep]: Array.isArray(answer) ? answer : [answer],
    });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/analysis');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <Box className="app-container">
      {/* Header */}
      <Box py={4} className="nav-header">
        <Container maxW="container.xl">
          <Text fontSize="xl" fontWeight="bold">
            <span style={{ color: '#E53E3E' }}>GET</span>
            <span style={{ color: '#000000' }}>SKIN</span>
            <span style={{ color: '#E53E3E' }}>BEAUTY</span>
          </Text>
        </Container>
      </Box>

      <Container maxW="container.xl" className="main-content">
        <Grid
          templateColumns={isDesktop ? 'repeat(2, 1fr)' : '1fr'}
          gap={8}
          alignItems="start"
        >
          {/* Question Section */}
          <GridItem>
            <VStack spacing={6} align="stretch">
              <Box>
                <Text color="gray.600" mb={2}>
                  Step {currentStep + 1} of {questions.length}
                </Text>
                <Progress value={progress} colorScheme="red" borderRadius="full" />
              </Box>

              <Heading size="lg" color="red.500">
                {questions[currentStep].question}
              </Heading>

              <Box className="card">
                {questions[currentStep].type === 'checkbox' && (
                  <VStack align="stretch" spacing={4}>
                    {questions[currentStep].options.map((option) => (
                      <Checkbox
                        key={option}
                        isChecked={answers[currentStep]?.includes(option)}
                        onChange={(e) => {
                          const currentAnswers = answers[currentStep] || [];
                          if (e.target.checked) {
                            handleAnswer([...currentAnswers, option]);
                          } else {
                            handleAnswer(
                              currentAnswers.filter((answer) => answer !== option)
                            );
                          }
                        }}
                        size="lg"
                      >
                        {option}
                      </Checkbox>
                    ))}
                  </VStack>
                )}

                {questions[currentStep].type === 'radio' && (
                  <RadioGroup
                    onChange={(value) => handleAnswer(value)}
                    value={answers[currentStep]?.[0]}
                  >
                    <Stack direction="column" spacing={4}>
                      {questions[currentStep].options.map((option) => (
                        <Radio key={option} value={option} size="lg">
                          {option}
                        </Radio>
                      ))}
                    </Stack>
                  </RadioGroup>
                )}
              </Box>

              <Stack direction={isDesktop ? 'row' : 'column'} spacing={4}>
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    colorScheme="red"
                    size="lg"
                    onClick={handlePrevious}
                  >
                    Previous
                  </Button>
                )}
                <Button
                  colorScheme="red"
                  size="lg"
                  onClick={handleNext}
                  isDisabled={!answers[currentStep]}
                  flex={1}
                >
                  {currentStep === questions.length - 1 ? 'Finish' : 'Continue'}
                </Button>
              </Stack>
            </VStack>
          </GridItem>

          {/* Progress Preview - Desktop Only */}
          {isDesktop && (
            <GridItem className="desktop-sidebar">
              <Box className="card">
                <VStack spacing={6} align="stretch">
                  <Heading size="md">Your Progress</Heading>
                  {questions.map((q, index) => (
                    <Box
                      key={index}
                      p={4}
                      bg={currentStep === index ? 'red.50' : 'gray.50'}
                      borderRadius="md"
                      opacity={currentStep >= index ? 1 : 0.5}
                    >
                      <Text fontWeight="medium" mb={2}>
                        {index + 1}. {q.question}
                      </Text>
                      {answers[index] && (
                        <Text color="gray.600" fontSize="sm">
                          {answers[index].join(', ')}
                        </Text>
                      )}
                    </Box>
                  ))}
                </VStack>
              </Box>
            </GridItem>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default Questionnaire; 