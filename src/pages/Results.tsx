import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Text,
  VStack,
  SimpleGrid,
  Circle,
  Button,
  Grid,
  GridItem,
  Heading,
  useBreakpointValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';

const Results = () => {
  const navigate = useNavigate();
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  const metrics = [
    { label: 'Lines', value: 71, status: 'High' },
    { label: 'Wrinkles', value: 20, status: 'Low' },
    { label: 'Texture', value: 10, status: 'Excellent' },
    { label: 'Acne', value: 80, status: 'Critical' },
    { label: 'Pores', value: 30, status: 'Moderate' },
  ];

  const getStatusColor = (value: number) => {
    if (value >= 80) return 'red.500';
    if (value >= 60) return 'orange.500';
    if (value >= 40) return 'yellow.500';
    if (value >= 20) return 'green.500';
    return 'blue.500';
  };

  return (
    <Box className="app-container">
      {/* Header */}
      <Box py={4} className="nav-header">
        <Container maxW="container.xl">
          <Text fontSize="xl" fontWeight="bold">
            GET<span className="text-red-500">SKIN</span>BEAUTY
          </Text>
        </Container>
      </Box>

      <Container maxW="container.xl" className="main-content">
        <Grid
          templateColumns={isDesktop ? 'repeat(2, 1fr)' : '1fr'}
          gap={8}
          alignItems="start"
        >
          {/* Results Section */}
          <GridItem>
            <VStack spacing={8} align="stretch">
              <Heading size="lg">Your Skin Analysis Results</Heading>

              {/* Disclaimer */}
              <Box className="card" bg="blue.50">
                <Text fontSize="sm" color="blue.800">
                  Skinopathy AI is an assessment tool that should be used for
                  information purposes only. It is not a diagnosing tool and it is
                  NOT always 100% accurate. Always speak with a healthcare
                  practitioner to confirm a diagnosis.
                </Text>
              </Box>

              {/* Metrics Grid */}
              <SimpleGrid columns={isDesktop ? 3 : 2} spacing={6}>
                {metrics.map((metric) => (
                  <Box key={metric.label} className="card">
                    <Stat>
                      <StatLabel fontSize="lg">{metric.label}</StatLabel>
                      <StatNumber
                        fontSize="3xl"
                        color={getStatusColor(metric.value)}
                      >
                        {metric.value}
                      </StatNumber>
                      <StatHelpText>{metric.status}</StatHelpText>
                    </Stat>
                  </Box>
                ))}
              </SimpleGrid>

              {/* Analysis Summary */}
              <Box className="card" bg="red.50">
                <VStack spacing={4} align="stretch">
                  <Heading size="md" color="red.700">
                    Key Findings
                  </Heading>
                  <Text>
                    Skinopathy AI has detected elevated levels of Acne and Lines
                    which require attention. We recommend focusing on these areas in
                    your skincare routine.
                  </Text>
                </VStack>
              </Box>

              <Button
                colorScheme="red"
                size="lg"
                onClick={() => navigate('/recommendations')}
                className="button-primary"
              >
                View Personalized Recommendations
              </Button>
            </VStack>
          </GridItem>

          {/* Detailed Analysis - Desktop Only */}
          {isDesktop && (
            <GridItem className="desktop-sidebar">
              <Box className="card">
                <VStack spacing={6} align="stretch">
                  <Heading size="md">Detailed Analysis</Heading>

                  {metrics.map((metric) => (
                    <Box
                      key={metric.label}
                      p={4}
                      borderRadius="md"
                      bg="gray.50"
                    >
                      <Grid templateColumns="1fr auto" gap={4} alignItems="center">
                        <Box>
                          <Text fontWeight="medium">{metric.label}</Text>
                          <Text fontSize="sm" color="gray.600">
                            {metric.value >= 60
                              ? 'Needs immediate attention'
                              : metric.value >= 40
                              ? 'Could use improvement'
                              : 'Within healthy range'}
                          </Text>
                        </Box>
                        <Circle
                          size="50px"
                          bg={getStatusColor(metric.value)}
                          color="white"
                        >
                          {metric.value}
                        </Circle>
                      </Grid>
                    </Box>
                  ))}

                  <Box bg="gray.50" p={4} borderRadius="md">
                    <Text fontSize="sm" color="gray.600">
                      💡 Tip: Focus on addressing the areas with higher scores
                      first. Our recommended products will help target these
                      specific concerns.
                    </Text>
                  </Box>
                </VStack>
              </Box>
            </GridItem>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default Results; 