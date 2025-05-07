import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Heading, Text, VStack, HStack, Image, useBreakpointValue } from '@chakra-ui/react';
import homeImage from '../assets/home-page.jpg';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  return (
    <Box className="app-container">
      {/* Header */}
      <Box py={4} className="nav-header">
        <Container maxW="container.xl">
          <HStack justify="space-between" align="center">
            <Text fontSize="xl" fontWeight="bold">
              GET<span className="text-red-500">SKIN</span>BEAUTY
            </Text>
            {isDesktop && (
              <HStack spacing={8}>
                <Text cursor="pointer">How it Works</Text>
                <Text cursor="pointer">About</Text>
                <Text cursor="pointer">Contact</Text>
                <Button colorScheme="red" size="sm">
                  Get Started
                </Button>
              </HStack>
            )}
          </HStack>
        </Container>
      </Box>

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
                    onClick={() => navigate('/auth')}
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
                <Box
                  
                >
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
    </Box>
  );
};

export default Home; 