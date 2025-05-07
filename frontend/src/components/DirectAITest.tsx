import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  Text,
  VStack,
  HStack,
  Image,
  Heading,
  useToast,
  Alert,
  AlertIcon,
  Spinner,
  Center,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
} from '@chakra-ui/react';

const DirectAITest = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
      
      // Reset states
      setResult(null);
      setError(null);
    }
  };

  const analyzeImage = async () => {
    if (!file) {
      toast({
        title: 'No image selected',
        description: 'Please select an image first',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      
      // Log the request details
      console.log('Sending request to AI model with file:', file.name, file.type, file.size);
      
      // Send request directly to AI model
      const response = await axios.post(
        'http://localhost:5000/predict',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000, // 60 second timeout
        }
      );
      
      console.log('AI Model Response:', response.data);
      setResult(response.data);
      
      toast({
        title: 'Analysis complete',
        description: 'Your skin analysis results are ready!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error analyzing image:', error);
      
      let errorMessage = 'An unknown error occurred';
      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage = `Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`;
        } else if (error.request) {
          errorMessage = 'No response received from AI model. Please check your internet connection.';
        } else {
          errorMessage = `Request error: ${error.message}`;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      
      toast({
        title: 'Analysis failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="app-container" bg="gray.50" minH="100vh">
      {/* Header */}
      <Box py={4} bg="white" boxShadow="sm">
        <Container maxW="container.xl">
          <Text fontSize="xl" fontWeight="bold">
            <span style={{ color: '#E53E3E' }}>GET</span>
            <span style={{ color: '#000000' }}>SKIN</span>
            <span style={{ color: '#E53E3E' }}>BEAUTY</span>
          </Text>
        </Container>
      </Box>

      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Heading as="h1" size="xl" textAlign="center">
            Direct AI Model Test
          </Heading>
          
          <Text textAlign="center" fontSize="lg">
            Upload an image to test the AI model directly
          </Text>
          
          <Card>
            <CardHeader>
              <Heading size="md">Upload Image</Heading>
            </CardHeader>
            
            <CardBody>
              <VStack spacing={4} align="stretch">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                
                {preview && (
                  <Box borderRadius="lg" overflow="hidden" boxShadow="xl">
                    <Image src={preview} alt="Preview" maxH="300px" mx="auto" />
                  </Box>
                )}
                
                {error && (
                  <Alert status="error">
                    <AlertIcon />
                    {error}
                  </Alert>
                )}
                
                {isLoading && (
                  <Center py={4}>
                    <VStack>
                      <Spinner size="xl" color="blue.500" />
                      <Text mt={2}>Analyzing your image...</Text>
                    </VStack>
                  </Center>
                )}
                
                {result && (
                  <Box p={4} bg="gray.50" borderRadius="md">
                    <Heading size="sm" mb={2}>Analysis Result:</Heading>
                    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </Box>
                )}
              </VStack>
            </CardBody>
            
            <CardFooter>
              <Button
                colorScheme="blue"
                onClick={analyzeImage}
                isLoading={isLoading}
                loadingText="Analyzing..."
                isDisabled={!file}
              >
                Analyze Image
              </Button>
            </CardFooter>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default DirectAITest; 