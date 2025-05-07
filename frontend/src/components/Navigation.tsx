import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  HStack,
  Text,
  Button,
  useBreakpointValue,
} from '@chakra-ui/react';

const Navigation = () => {
  const navigate = useNavigate();
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  const handleStartAnalysis = () => {
    navigate('/analysis');
  };

  return (
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
  );
};

export default Navigation; 