import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  Image,
  Icon,
  useColorModeValue,
  Badge,
} from '@chakra-ui/react';
import { FaUserMd, FaLeaf, FaFlask, FaHeart, FaBrain, FaStar } from 'react-icons/fa';

const specialistTypes = [
  {
    id: 'dermatologist',
    name: 'Dermatologist',
    icon: FaUserMd,
    description: 'Medical specialists in skin conditions and treatments',
    color: 'blue',
  },
  {
    id: 'herbalist',
    name: 'Herbal Specialist',
    icon: FaLeaf,
    description: 'Experts in natural and herbal remedies for skin care',
    color: 'green',
  },
  {
    id: 'cosmetologist',
    name: 'Cosmetologist',
    icon: FaFlask,
    description: 'Specialists in cosmetic treatments and procedures',
    color: 'purple',
  },
  {
    id: 'holistic',
    name: 'Holistic Practitioner',
    icon: FaHeart,
    description: 'Focus on overall wellness and natural healing',
    color: 'pink',
  },
  {
    id: 'psychodermatologist',
    name: 'Psychodermatologist',
    icon: FaBrain,
    description: 'Specialists in skin conditions related to stress and mental health',
    color: 'orange',
  },
];

const ConsultSpecialists = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const [selectedSpecialist, setSelectedSpecialist] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSpecialist) {
      toast({
        title: 'Please select a specialist type',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    // Handle form submission
    toast({
      title: 'Consultation request submitted',
      description: 'We will contact you shortly to schedule your appointment.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    navigate('/');
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
          </HStack>
        </Container>
      </Box>

      {/* Main Content */}
      <Box className="main-content" py={8}>
        <Container maxW="container.xl">
          <VStack spacing={8} align="stretch">
            <Box textAlign="center">
              <Heading size="xl" mb={4}>Consult with Specialists</Heading>
              <Text fontSize="lg" color="gray.600" maxW="800px" mx="auto">
                Choose the type of specialist that best suits your needs and schedule a consultation.
              </Text>
            </Box>

            {/* Specialist Selection */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {specialistTypes.map((specialist) => (
                <Card
                  key={specialist.id}
                  borderRadius="xl"
                  overflow="hidden"
                  boxShadow="lg"
                  bg={cardBg}
                  cursor="pointer"
                  transition="transform 0.3s"
                  _hover={{ transform: 'translateY(-5px)' }}
                  onClick={() => setSelectedSpecialist(specialist.id)}
                  borderWidth={selectedSpecialist === specialist.id ? '2px' : '1px'}
                  borderColor={selectedSpecialist === specialist.id ? `${specialist.color}.500` : borderColor}
                >
                  <CardHeader bg={`${specialist.color}.50`}>
                    <HStack spacing={4}>
                      <Icon as={specialist.icon} w={8} h={8} color={`${specialist.color}.500`} />
                      <Heading size="md">{specialist.name}</Heading>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <Text color="gray.600">{specialist.description}</Text>
                  </CardBody>
                  <CardFooter>
                    <Badge colorScheme={specialist.color} fontSize="sm">
                      {selectedSpecialist === specialist.id ? 'Selected' : 'Click to select'}
                    </Badge>
                  </CardFooter>
                </Card>
              ))}
            </SimpleGrid>

            {/* Consultation Form */}
            <Card
              borderRadius="xl"
              overflow="hidden"
              boxShadow="lg"
              bg={cardBg}
              borderColor={borderColor}
              mt={8}
            >
              <CardHeader bg="red.50">
                <Heading size="md">Schedule Your Consultation</Heading>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleSubmit}>
                  <VStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Full Name</FormLabel>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Email</FormLabel>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Phone Number</FormLabel>
                      <Input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Additional Information</FormLabel>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us about your concerns and what you'd like to discuss"
                        rows={4}
                      />
                    </FormControl>

                    <Button
                      type="submit"
                      colorScheme="red"
                      size="lg"
                      width="100%"
                      leftIcon={<Icon as={FaStar} />}
                    >
                      Request Consultation
                    </Button>
                  </VStack>
                </form>
              </CardBody>
            </Card>

            {/* Featured Specialist */}
            <Card
              borderRadius="xl"
              overflow="hidden"
              boxShadow="lg"
              bg={cardBg}
              borderColor={borderColor}
              mt={8}
            >
              <CardHeader bg="red.50">
                <Heading size="md">Featured Specialist</Heading>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                  <Box>
                    <Image
                      src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&h=500&fit=crop"
                      alt="Featured Specialist"
                      borderRadius="lg"
                      objectFit="cover"
                      height="300px"
                      width="100%"
                    />
                  </Box>
                  <VStack align="start" spacing={4}>
                    <Heading size="md">Dr. Sarah Johnson</Heading>
                    <Badge colorScheme="green">Dermatologist</Badge>
                    <Text color="gray.600">
                      With over 15 years of experience in treating various skin conditions,
                      Dr. Johnson specializes in both medical and cosmetic dermatology.
                      She is known for her holistic approach to skin care and her dedication
                      to helping patients achieve their skin health goals.
                    </Text>
                    <HStack spacing={4}>
                      <Badge colorScheme="blue">Acne Treatment</Badge>
                      <Badge colorScheme="purple">Anti-aging</Badge>
                      <Badge colorScheme="pink">Skin Rejuvenation</Badge>
                    </HStack>
                  </VStack>
                </SimpleGrid>
              </CardBody>
            </Card>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default ConsultSpecialists; 