import React, { useState } from 'react';
import { Box, Button, Text, VStack, useToast } from '@chakra-ui/react';
import { testAIModel } from '../services/api';

const AIModelTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const handleTest = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await testAIModel();
      setResult(response);
      toast({
        title: 'Test Successful',
        description: 'AI model endpoint is working correctly',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      toast({
        title: 'Test Failed',
        description: 'Could not connect to AI model endpoint',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <Button
          colorScheme="blue"
          onClick={handleTest}
          isLoading={isLoading}
          loadingText="Testing..."
        >
          Test AI Model Endpoint
        </Button>

        {error && (
          <Text color="red.500">
            Error: {error}
          </Text>
        )}

        {result && (
          <Box p={4} borderWidth={1} borderRadius="md">
            <Text fontWeight="bold">Test Result:</Text>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default AIModelTest; 