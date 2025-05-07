import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  useToast,
  Card,
  CardBody,
  CardHeader,
  Icon,
  Flex,
  useColorModeValue,
  Alert,
  AlertIcon,
  Divider,
  Grid,
} from '@chakra-ui/react';
import { FaArrowLeft, FaCalendarAlt, FaUserMd } from 'react-icons/fa';
import './DermatologistBooking.css';

const DermatologistBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  
  // Get data from navigation state
  const { skinCondition } = location.state || { skinCondition: '' };
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    skinCondition: skinCondition || '',
    additionalConditions: '',
    preferredDate: '',
    preferredTime: '',
    notes: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: 'Appointment Requested',
        description: 'Your appointment request has been submitted successfully. We will contact you shortly to confirm.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Navigate back to results page
      navigate('/results', { state: { appointmentRequested: true } });
    }, 1500);
  };
  
  // Generate available dates (next 14 days)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    
    return dates;
  };
  
  const availableDates = generateAvailableDates();
  
  return (
    <div className="app-container">
      <div className="nav-header">
        <Box p={4}>
          <Heading size="lg">Book a Dermatologist Appointment</Heading>
        </Box>
      </div>
      
      <div className="main-content">
        <Box p={8}>
          <Card className="card">
            <CardHeader className="card-header">
              <Heading size="md">Personal Information</Heading>
            </CardHeader>
            <CardBody className="card-body">
              <form onSubmit={handleSubmit}>
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                  <FormControl className="form-control" isRequired>
                    <FormLabel className="form-label">Full Name</FormLabel>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  
                  <FormControl className="form-control" isRequired>
                    <FormLabel className="form-label">Email</FormLabel>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  
                  <FormControl className="form-control" isRequired>
                    <FormLabel className="form-label">Phone Number</FormLabel>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  
                  <FormControl className="form-control" isRequired>
                    <FormLabel className="form-label">Age</FormLabel>
                    <Input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      min="1"
                      max="120"
                    />
                  </FormControl>
                </Grid>
                
                <Box mt={8}>
                  <Heading size="md" mb={4}>Skin Condition Information</Heading>
                  <FormControl className="form-control" isRequired>
                    <FormLabel className="form-label">Describe your skin condition</FormLabel>
                    <Textarea
                      name="skinCondition"
                      value={formData.skinCondition}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </FormControl>
                </Box>
                
                <Box mt={8}>
                  <Heading size="md" mb={4}>Appointment Scheduling</Heading>
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                    <FormControl className="form-control" isRequired>
                      <FormLabel className="form-label">Preferred Date</FormLabel>
                      <Select
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleInputChange}
                      >
                        <option value="">Select a date</option>
                        {availableDates.map((date) => (
                          <option key={date} value={date}>
                            {new Date(date).toLocaleDateString()}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    
                    <FormControl className="form-control" isRequired>
                      <FormLabel className="form-label">Preferred Time</FormLabel>
                      <Select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleInputChange}
                      >
                        <option value="">Select a time</option>
                        <option value="09:00">9:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                      </Select>
                    </FormControl>
                  </Grid>
                </Box>
                
                {isSubmitting && (
                  <Alert status="info" className="alert alert-info" mt={4}>
                    <AlertIcon />
                    Submitting your appointment request...
                  </Alert>
                )}
                
                <Button
                  type="submit"
                  colorScheme="red"
                  size="lg"
                  width="full"
                  mt={8}
                  isLoading={isSubmitting}
                  loadingText="Submitting"
                >
                  Book Appointment
                </Button>
              </form>
            </CardBody>
          </Card>
        </Box>
      </div>
    </div>
  );
};

export default DermatologistBooking; 