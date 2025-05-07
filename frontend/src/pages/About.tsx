import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Image,
  Button,
  SimpleGrid,
  Icon,
  Flex,
  Card,
  CardBody,
  CardHeader,
  useBreakpointValue,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react';
import { FaArrowRight, FaHeart, FaLightbulb, FaUsers } from 'react-icons/fa';
import './About.css';

const About = () => {
  const navigate = useNavigate();
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleStartAnalysis = () => {
    navigate('/analysis');
  };

  return (
    <Box className="app-container">
      {/* Header */}
      <Box py={4} className="nav-header">
        <Container maxW="container.xl">
          <HStack justify="space-between" align="center">
            <Text fontSize="xl" fontWeight="bold" cursor="pointer" onClick={() => navigate('/')}>
              <span style={{ color: '#E53E3E' }}>GET</span>
              <span style={{ color: '#000000' }}>SKIN</span>
              <span style={{ color: '#E53E3E' }}>BEAUTY</span>
            </Text>
            {isDesktop && (
              <HStack spacing={8}>
                <Text cursor="pointer" onClick={() => navigate('/how-it-works')}>How it Works</Text>
                <Text cursor="pointer" onClick={() => navigate('/about')}>About</Text>
                <Text cursor="pointer" onClick={() => navigate('/contact')}>Contact</Text>
                <Button 
                  colorScheme="red" 
                  size="sm"
                  onClick={handleStartAnalysis}
                >
                  Get Started
                </Button>
              </HStack>
            )}
          </HStack>
        </Container>
      </Box>

      {/* Main Content */}
      <Box className="main-content" py={16}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <Box textAlign="center">
              <Heading size="2xl" mb={4}>Our Story</Heading>
              <Text fontSize="xl" color="gray.600" maxW="800px" mx="auto">
                Be part of a movement that is revolutionizing the future of dermatology
              </Text>
            </Box>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} width="100%">
              <Card 
                borderRadius="xl" 
                overflow="hidden" 
                boxShadow="lg"
                bg={cardBg}
                borderColor={borderColor}
              >
                <CardBody>
                  <VStack spacing={6} align="start">
                    <Heading size="lg">What is GetSkinBeauty?</Heading>
                    <Text>
                      GetSkinBeauty brings together virtual health, artificial intelligence, and e-commerce to provide individuals with the best possible science-backed and medically validated treatments for their skin.
                    </Text>
                    <Text>
                      It was created by Skinopathy, a Canadian medical Data & AI startup that is helping people get accessible and inclusive dermatological care using advanced digital health tools.
                    </Text>
                  </VStack>
                </CardBody>
              </Card>

              <Card 
                borderRadius="xl" 
                overflow="hidden" 
                boxShadow="lg"
                bg={cardBg}
                borderColor={borderColor}
              >
                <CardBody>
                  <VStack spacing={6} align="start">
                    <Heading size="lg">Our Mission</Heading>
                    <Text>
                      We are committed to making dermatological care accessible to everyone through innovative technology and personalized solutions.
                    </Text>
                    <Text>
                      Our AI-powered platform helps you understand your skin better and provides tailored recommendations for your unique needs.
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            </SimpleGrid>

            <Divider />

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} width="100%">
              <Card 
                borderRadius="xl" 
                overflow="hidden" 
                boxShadow="lg"
                bg={cardBg}
                borderColor={borderColor}
                transition="transform 0.3s"
                _hover={{ transform: 'translateY(-5px)' }}
              >
                <CardHeader bg="red.50">
                  <Flex justify="center" align="center" h="60px">
                    <Icon as={FaHeart} w={8} h={8} color="red.500" />
                  </Flex>
                </CardHeader>
                <CardBody>
                  <VStack spacing={3} align="center" textAlign="center">
                    <Heading size="md">Our Values</Heading>
                    <Text color="gray.600">
                      We believe in accessible, inclusive, and science-backed skincare solutions
                    </Text>
                  </VStack>
                </CardBody>
              </Card>

              <Card 
                borderRadius="xl" 
                overflow="hidden" 
                boxShadow="lg"
                bg={cardBg}
                borderColor={borderColor}
                transition="transform 0.3s"
                _hover={{ transform: 'translateY(-5px)' }}
              >
                <CardHeader bg="red.50">
                  <Flex justify="center" align="center" h="60px">
                    <Icon as={FaLightbulb} w={8} h={8} color="red.500" />
                  </Flex>
                </CardHeader>
                <CardBody>
                  <VStack spacing={3} align="center" textAlign="center">
                    <Heading size="md">Innovation</Heading>
                    <Text color="gray.600">
                      Using cutting-edge AI technology to revolutionize skincare
                    </Text>
                  </VStack>
                </CardBody>
              </Card>

              <Card 
                borderRadius="xl" 
                overflow="hidden" 
                boxShadow="lg"
                bg={cardBg}
                borderColor={borderColor}
                transition="transform 0.3s"
                _hover={{ transform: 'translateY(-5px)' }}
              >
                <CardHeader bg="red.50">
                  <Flex justify="center" align="center" h="60px">
                    <Icon as={FaUsers} w={8} h={8} color="red.500" />
                  </Flex>
                </CardHeader>
                <CardBody>
                  <VStack spacing={3} align="center" textAlign="center">
                    <Heading size="md">Community</Heading>
                    <Text color="gray.600">
                      Building a community of people passionate about skincare
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            </SimpleGrid>

            <Box textAlign="center" mt={8}>
              <Button
                colorScheme="red"
                size="lg"
                onClick={handleStartAnalysis}
                rightIcon={<Icon as={FaArrowRight} />}
              >
                Start Your Journey
              </Button>
            </Box>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default About; 