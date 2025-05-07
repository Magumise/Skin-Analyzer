import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  Image, 
  useBreakpointValue,
  SimpleGrid,
  Icon,
  Flex,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
} from '@chakra-ui/react';
import { FaCamera, FaUpload, FaChartBar, FaShoppingCart } from 'react-icons/fa';
import homeImage from '../assets/home-page.jpg';
import ConsentPopup from '../components/ConsentPopup';
import Navigation from '../components/Navigation';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const [isConsentOpen, setIsConsentOpen] = useState(false);

  const handleStartAnalysis = () => {
    setIsConsentOpen(true);
  };

  const handleConsentAccept = () => {
    setIsConsentOpen(false);
    navigate('/analysis');
  };

  const handleConsentDecline = () => {
    setIsConsentOpen(false);
  };

  return (
    <Box className="app-container">
      <Navigation />
      
      {/* Main Content */}
      <Box className="main-content">
        <Container maxW="container.xl">
          <Box className={isDesktop ? 'desktop-grid' : ''}>
            {/* Left Column - Text Content */}
            <VStack 
              spacing={6} 
              align={isDesktop ? 'start' : 'center'} 
              textAlign={isDesktop ? 'left' : 'center'}
              className="fade-in"
            >
              <Heading 
                as="h1" 
                size="2xl" 
                lineHeight="1.2"
                className="slide-up"
              >
                Discover Your True Beauty with{' '}
                <Text as="span" color="red.500">
                  Skinopathy AI
                </Text>
              </Heading>

              <Text fontSize="xl" color="gray.600" maxW="600px">
                Revolutionary AI-powered skin analysis that provides personalized
                skincare recommendations tailored to your unique needs.
              </Text>

              <Box>
                <HStack spacing={4} mt={4}>
                  <Button
                    colorScheme="red"
                    size="lg"
                    onClick={handleStartAnalysis}
                    className="button-primary"
                  >
                    Start Free Analysis
                  </Button>
                  {isDesktop && (
                    <Button
                      variant="outline"
                      colorScheme="red"
                      size="lg"
                    >
                      Learn More
                    </Button>
                  )}
                </HStack>

                <Text fontSize="sm" color="gray.500" mt={4}>
                  ✨ No registration required | 🔒 100% Private | 🎯 AI-Powered Results
                </Text>
              </Box>
            </VStack>

            {/* Right Column - Image */}
            <Box 
              className={`phone-preview ${isDesktop ? 'desktop-sidebar' : 'mt-8'}`}
              maxW={isDesktop ? '70%' : '400px'}
              mx="auto"
            >
              <Box
                className="card"
                bg="gray.50"
                borderRadius="2xl"
                overflow="hidden"
                position="relative"
                h="100%"
                w="600px"
              >
                <Box>
                  <Image
                    src={homeImage}
                    alt="Skin Analysis Preview"
                    objectFit="cover"
                    w="100%"
                    h="100%"
                  />
                </Box>

                {/* Feature Highlights */}
                <Box 
                  p={15} 
                  bg="white" 
                  borderTop="1px" 
                  borderColor="gray.200"
                  mt="auto"
                  marginTop="20px"
                >
                  <VStack spacing={3} align="stretch">
                    <HStack w="full" justify="space-between">
                      <Text fontSize="sm" fontWeight="medium">✓ Acne Detection</Text>
                      <Text fontSize="sm" fontWeight="medium">✓ Wrinkle Analysis</Text>
                    </HStack>
                    <HStack w="full" justify="space-between">
                      <Text fontSize="sm" fontWeight="medium">✓ Skin Type Test</Text>
                      <Text fontSize="sm" fontWeight="medium">✓ Product Matching</Text>
                    </HStack>
                  </VStack>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      <ConsentPopup 
        isOpen={isConsentOpen}
        onClose={handleConsentDecline}
        onAccept={handleConsentAccept}
      />

      {/* How It Works Section */}
      <Box py={16} bg="gray.50">
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <Heading textAlign="center" size="xl">
              How It Works
            </Heading>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} width="100%">
              {/* Step 1: Upload or Take Photo */}
              <Card 
                borderRadius="xl" 
                overflow="hidden" 
                boxShadow="lg"
                transition="transform 0.3s"
                _hover={{ transform: 'translateY(-5px)' }}
              >
                <CardHeader bg="red.50" pb={0}>
                  <Flex justify="center" align="center" h="60px">
                    <Icon as={FaCamera} w={8} h={8} color="red.500" />
                  </Flex>
                </CardHeader>
                <CardBody>
                  <VStack spacing={3} align="center" textAlign="center">
                    <Heading size="md">Upload or Take Photo</Heading>
                    <Text color="gray.600">
                      Upload a photo of your skin or take a picture using your device's camera
                    </Text>
                  </VStack>
                </CardBody>
              </Card>

              {/* Step 2: AI Analysis */}
              <Card 
                borderRadius="xl" 
                overflow="hidden" 
                boxShadow="lg"
                transition="transform 0.3s"
                _hover={{ transform: 'translateY(-5px)' }}
              >
                <CardHeader bg="red.50" pb={0}>
                  <Flex justify="center" align="center" h="60px">
                    <Icon as={FaChartBar} w={8} h={8} color="red.500" />
                  </Flex>
                </CardHeader>
                <CardBody>
                  <VStack spacing={3} align="center" textAlign="center">
                    <Heading size="md">AI Analysis</Heading>
                    <Text color="gray.600">
                      Our advanced AI analyzes your skin condition with high precision
                    </Text>
                  </VStack>
                </CardBody>
              </Card>

              {/* Step 3: View Results */}
              <Card 
                borderRadius="xl" 
                overflow="hidden" 
                boxShadow="lg"
                transition="transform 0.3s"
                _hover={{ transform: 'translateY(-5px)' }}
              >
                <CardHeader bg="red.50" pb={0}>
                  <Flex justify="center" align="center" h="60px">
                    <Icon as={FaUpload} w={8} h={8} color="red.500" />
                  </Flex>
                </CardHeader>
                <CardBody>
                  <VStack spacing={3} align="center" textAlign="center">
                    <Heading size="md">View Results</Heading>
                    <Text color="gray.600">
                      Get detailed analysis of your skin condition and recommendations
                    </Text>
                  </VStack>
                </CardBody>
              </Card>

              {/* Step 4: Get Products */}
              <Card 
                borderRadius="xl" 
                overflow="hidden" 
                boxShadow="lg"
                transition="transform 0.3s"
                _hover={{ transform: 'translateY(-5px)' }}
              >
                <CardHeader bg="red.50" pb={0}>
                  <Flex justify="center" align="center" h="60px">
                    <Icon as={FaShoppingCart} w={8} h={8} color="red.500" />
                  </Flex>
                </CardHeader>
                <CardBody>
                  <VStack spacing={3} align="center" textAlign="center">
                    <Heading size="md">Get Products</Heading>
                    <Text color="gray.600">
                      Purchase recommended products tailored to your skin needs
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            </SimpleGrid>

            <Button
              colorScheme="red"
              size="lg"
              onClick={handleStartAnalysis}
              mt={4}
            >
              Start Your Analysis
            </Button>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 