import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, we'll use a simple check. In production, this should be replaced with proper authentication
    if (email === 'admin@skincare.com' && password === 'admin123') {
      localStorage.setItem('adminToken', 'dummy-token');
      navigate('/admin/dashboard');
    } else {
      toast({
        title: 'Invalid credentials',
        description: 'Please check your email and password',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.sm" py={10}>
      <VStack spacing={8} as="form" onSubmit={handleSubmit}>
        <Box textAlign="center">
          <Heading size="xl" mb={2}>
            Admin Login
          </Heading>
          <Text color="gray.600">
            Access the admin dashboard to manage products and recommendations
          </Text>
        </Box>

        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="admin@skincare.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement>
              <IconButton
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                variant="ghost"
                onClick={() => setShowPassword(!showPassword)}
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button
          colorScheme="red"
          size="lg"
          w="100%"
          type="submit"
          className="button-primary"
        >
          Sign In
        </Button>
      </VStack>
    </Container>
  );
};

export default AdminLogin; 