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
  HStack,
  Divider,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just navigate to questionnaire after form submission
    // Backend integration will be handled later
    navigate('/questionnaire');
  };

  return (
    <Container maxW="container.sm" py={10}>
      <VStack spacing={8} as="form" onSubmit={handleSubmit}>
        <Box textAlign="center">
          <Heading size="xl" mb={2}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </Heading>
          <Text color="gray.600">
            {isLogin
              ? 'Sign in to continue your skin analysis journey'
              : 'Join us to start your personalized skin analysis'}
          </Text>
        </Box>

        {!isLogin && (
          <>
            <HStack spacing={4} w="100%">
              <FormControl isRequired>
                <FormLabel>First Name</FormLabel>
                <Input type="text" placeholder="John" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Last Name</FormLabel>
                <Input type="text" placeholder="Doe" />
              </FormControl>
            </HStack>
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input type="text" placeholder="johndoe" />
            </FormControl>
          </>
        )}

        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input type="email" placeholder="john@example.com" />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
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

        {!isLogin && (
          <FormControl isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
              />
              <InputRightElement>
                <IconButton
                  aria-label={
                    showConfirmPassword ? 'Hide password' : 'Show password'
                  }
                  icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                  variant="ghost"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>
        )}

        <Button
          colorScheme="red"
          size="lg"
          w="100%"
          type="submit"
          className="button-primary"
        >
          {isLogin ? 'Sign In' : 'Create Account'}
        </Button>

        <Divider />

        <HStack spacing={1}>
          <Text color="gray.600">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
          </Text>
          <Button
            variant="link"
            colorScheme="red"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </Button>
        </HStack>
      </VStack>
    </Container>
  );
};

export default Auth; 