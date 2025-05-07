import React, { useRef, useState, useEffect } from 'react';
import { Box, Button, Container, Heading, VStack, HStack, Image, useToast, Progress, Badge, Alert, AlertIcon, Text, List, ListItem, ListIcon, Flex } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import Webcam from 'react-webcam';
import { analysisAPI } from '../../services/api';
import { useAuth } from '../auth/AuthContext';

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user"
};

export const SkinAnalysis: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [image, setImage] = useState<string | null>(null);
  const [lightingStatus, setLightingStatus] = useState<'good' | 'poor'>('poor');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [brightness, setBrightness] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const toast = useToast();
  const { user } = useAuth();

  const handleCameraError = (error: string | DOMException) => {
    setCameraError('Failed to access camera. Please ensure you have granted camera permissions.');
    console.error('Camera error:', error);
  };

  useEffect(() => {
    const checkLighting = () => {
      if (webcamRef.current && webcamRef.current.video) {
        const video = webcamRef.current.video;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.drawImage(video, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          let brightness = 0;
          
          for (let i = 0; i < data.length; i += 4) {
            brightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
          }
          
          brightness = brightness / (data.length / 4);
          const brightnessPercentage = (brightness / 255) * 100;
          setBrightness(brightnessPercentage);
          
          if (brightnessPercentage > 30) {
            setLightingStatus('good');
          } else {
            setLightingStatus('poor');
          }
        }
      }
    };

    const interval = setInterval(checkLighting, 1000);
    return () => clearInterval(interval);
  }, []);

  const capture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setImage(imageSrc);
        toast({
          title: "Photo captured",
          description: "Your photo has been captured successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Capture failed",
          description: "Failed to capture photo. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const retakePhoto = () => {
    setImage(null);
  };

  const analyzeSkin = async () => {
    if (!image || !user) return;

    try {
      setIsAnalyzing(true);
      const formData = new FormData();
      const blob = await fetch(image).then(r => r.blob());
      formData.append('image', blob, 'skin-analysis.jpg');
      formData.append('user_id', user.id);

      await analysisAPI.uploadImage(formData);
      toast({
        title: "Analysis complete",
        description: "Your skin analysis has been completed",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      // TODO: Navigate to results page with analysis data
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your skin",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center" mb={8}>
          <Heading 
            size="2xl" 
            bgGradient="linear(to-r, blue.400, purple.500)"
            bgClip="text"
            fontWeight="extrabold"
          >
            Skin Analysis
          </Heading>
          <Text fontSize="xl" color="gray.600" mt={4}>
            Capture a clear photo of your skin for detailed analysis
          </Text>
        </Box>

        <Flex direction={{ base: 'column', lg: 'row' }} gap={8}>
          <Box 
            flex="1"
            p={6} 
            borderRadius="xl" 
            bg="white"
            boxShadow="xl"
            borderWidth="1px"
            borderColor="gray.200"
          >
            <Heading size="lg" mb={6} color="gray.700">Photo Guidelines</Heading>
            <List spacing={4}>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={CheckIcon} color="green.500" boxSize={5} />
                <Text fontSize="lg">Ensure your face is well-lit and clearly visible</Text>
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={CheckIcon} color="green.500" boxSize={5} />
                <Text fontSize="lg">Remove any makeup or face coverings</Text>
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={CheckIcon} color="green.500" boxSize={5} />
                <Text fontSize="lg">Position your face in the center of the frame</Text>
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={CheckIcon} color="green.500" boxSize={5} />
                <Text fontSize="lg">Keep a neutral expression</Text>
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={CheckIcon} color="green.500" boxSize={5} />
                <Text fontSize="lg">Make sure your hair is pulled back from your face</Text>
              </ListItem>
            </List>
          </Box>

          <Box flex="2">
            {cameraError ? (
              <Alert status="error" borderRadius="xl" mb={4}>
                <AlertIcon />
                {cameraError}
              </Alert>
            ) : (
              <Box 
                w="full" 
                position="relative"
                borderRadius="xl"
                overflow="hidden"
                boxShadow="xl"
                borderWidth="1px"
                borderColor="gray.200"
              >
                {!image ? (
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    style={{ width: '100%', borderRadius: '12px' }}
                    onUserMediaError={handleCameraError}
                  />
                ) : (
                  <Image
                    src={image}
                    alt="Captured skin"
                    borderRadius="12px"
                    w="full"
                  />
                )}

                <Box position="absolute" top={4} right={4}>
                  <Badge
                    colorScheme={lightingStatus === 'good' ? 'green' : 'red'}
                    p={2}
                    borderRadius="md"
                    fontSize="sm"
                  >
                    Lighting: {lightingStatus === 'good' ? 'Good' : 'Poor'}
                  </Badge>
                </Box>

                <Progress
                  value={brightness}
                  size="sm"
                  colorScheme={lightingStatus === 'good' ? 'green' : 'red'}
                  position="absolute"
                  bottom={4}
                  left={4}
                  right={4}
                  borderRadius="md"
                />
              </Box>
            )}

            <HStack spacing={4} justify="center" mt={6}>
              {!image ? (
                <Button
                  colorScheme="blue"
                  size="lg"
                  px={8}
                  onClick={capture}
                  isDisabled={lightingStatus !== 'good' || !!cameraError}
                >
                  Capture Photo
                </Button>
              ) : (
                <>
                  <Button 
                    colorScheme="red" 
                    size="lg"
                    px={8}
                    onClick={retakePhoto}
                  >
                    Retake Photo
                  </Button>
                  <Button
                    colorScheme="green"
                    size="lg"
                    px={8}
                    onClick={analyzeSkin}
                    isLoading={isAnalyzing}
                  >
                    Analyze Skin
                  </Button>
                </>
              )}
            </HStack>
          </Box>
        </Flex>
      </VStack>
    </Container>
  );
}; 