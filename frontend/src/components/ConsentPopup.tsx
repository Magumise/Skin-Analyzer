import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaShieldAlt, FaCamera, FaLock } from 'react-icons/fa';

interface ConsentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const ConsentPopup: React.FC<ConsentPopupProps> = ({ isOpen, onClose, onAccept }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay backdropFilter="blur(5px)" />
      <ModalContent 
        bg={bgColor}
        borderColor={borderColor}
        borderRadius="xl"
        boxShadow="xl"
        maxW="500px"
      >
        <ModalHeader textAlign="center" color="red.500">
          <Icon as={FaShieldAlt} w={8} h={8} mr={2} />
          Privacy & Consent
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Text fontSize="md" color="gray.600">
              Before proceeding with the skin analysis, please review our privacy policy and consent to the following:
            </Text>
            
            <VStack spacing={3} align="start">
              <HStack>
                <Icon as={FaCamera} color="red.500" />
                <Text>Your uploaded images will be used solely for skin analysis purposes</Text>
              </HStack>
              <HStack>
                <Icon as={FaLock} color="red.500" />
                <Text>Your data is encrypted and stored securely</Text>
              </HStack>
              <HStack>
                <Icon as={FaShieldAlt} color="red.500" />
                <Text>We will not share your images or personal information with third parties</Text>
              </HStack>
            </VStack>

            <Text fontSize="sm" color="gray.500" mt={2}>
              By clicking "I Consent", you agree to our terms of service and privacy policy.
            </Text>
          </VStack>
        </ModalBody>

        <ModalFooter justifyContent="center" gap={4}>
          <Button variant="outline" onClick={onClose}>
            Decline
          </Button>
          <Button colorScheme="red" onClick={onAccept}>
            I Consent
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConsentPopup; 