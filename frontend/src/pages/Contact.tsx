import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  SimpleGrid,
  Icon,
  Flex,
  Card,
  CardBody,
  CardHeader,
  useBreakpointValue,
  useColorModeValue,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { FaArrowRight, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  const navigate = useNavigate();
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const toast = useToast();

  const handleStartAnalysis = () => {
    navigate('/analysis');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Message Sent',
      description: 'Thank you for contacting us. We will get back to you soon!',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
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
              <Heading size="2xl" mb={4}>Get in Touch</Heading>
              <Text fontSize="xl" color="gray.600" maxW="800px" mx="auto">
                We would love to hear from you. If you have any questions or concerns don't hesitate to email us!
              </Text>
            </Box>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} width="100%">
              {/* Contact Information */}
              <Card 
                borderRadius="xl" 
                overflow="hidden" 
                boxShadow="lg"
                bg={cardBg}
                borderColor={borderColor}
              >
                <CardBody>
                  <VStack spacing={6} align="start">
                    <Heading size="lg">Contact Information</Heading>
                    
                    <HStack spacing={4}>
                      <Icon as={FaEnvelope} color="red.500" />
                      <Text>hello@getskinbeauty.com</Text>
                    </HStack>
                    
                    <HStack spacing={4}>
                      <Icon as={FaPhone} color="red.500" />
                      <Text>+1 (416) 555-0123</Text>
                    </HStack>
                    
                    <HStack spacing={4}>
                      <Icon as={FaMapMarkerAlt} color="red.500" />
                      <Text>302 Sheppard Avenue West<br />North York, ON, M2N 1N5</Text>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>

              {/* Contact Form */}
              <Card 
                borderRadius="xl" 
                overflow="hidden" 
                boxShadow="lg"
                bg={cardBg}
                borderColor={borderColor}
              >
                <CardBody>
                  <form onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>First Name</FormLabel>
                        <Input type="text" placeholder="Enter your first name" />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Last Name</FormLabel>
                        <Input type="text" placeholder="Enter your last name" />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Phone Number</FormLabel>
                        <Input type="tel" placeholder="Enter your phone number" />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Email Address</FormLabel>
                        <Input type="email" placeholder="Enter your email address" />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Message</FormLabel>
                        <Textarea 
                          placeholder="Enter your message" 
                          rows={4}
                        />
                      </FormControl>

                      <Button
                        type="submit"
                        colorScheme="red"
                        size="lg"
                        width="100%"
                        rightIcon={<Icon as={FaArrowRight} />}
                      >
                        Send Message
                      </Button>
                    </VStack>
                  </form>
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
                Start Free Analysis
              </Button>
            </Box>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default Contact; 