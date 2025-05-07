import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  useToast,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
}

const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleAddProduct = (product: Product) => {
    setProducts([...products, { ...product, id: Date.now().toString() }]);
    toast({
      title: 'Product added',
      status: 'success',
      duration: 2000,
    });
  };

  const handleEditProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    toast({
      title: 'Product updated',
      status: 'success',
      duration: 2000,
    });
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast({
      title: 'Product deleted',
      status: 'success',
      duration: 2000,
    });
  };

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Heading size="xl">Admin Dashboard</Heading>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="red"
            onClick={() => {
              setEditingProduct(null);
              onOpen();
            }}
          >
            Add Product
          </Button>
        </HStack>

        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Category</Th>
                <Th>Price</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {products.map((product) => (
                <Tr key={product.id}>
                  <Td>{product.name}</Td>
                  <Td>{product.category}</Td>
                  <Td>${product.price}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        aria-label="Edit product"
                        icon={<EditIcon />}
                        onClick={() => {
                          setEditingProduct(product);
                          onOpen();
                        }}
                      />
                      <IconButton
                        aria-label="Delete product"
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        onClick={() => handleDeleteProduct(product.id)}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>

      <ProductModal
        isOpen={isOpen}
        onClose={onClose}
        product={editingProduct}
        onSave={editingProduct ? handleEditProduct : handleAddProduct}
      />
    </Container>
  );
};

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (product: Product) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onSave,
}) => {
  const [formData, setFormData] = useState<Product>(
    product || {
      id: '',
      name: '',
      description: '',
      category: '',
      price: 0,
      imageUrl: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {product ? 'Edit Product' : 'Add New Product'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Product Name</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Category</FormLabel>
                <Select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <option value="">Select a category</option>
                  <option value="cleanser">Cleanser</option>
                  <option value="moisturizer">Moisturizer</option>
                  <option value="serum">Serum</option>
                  <option value="sunscreen">Sunscreen</option>
                  <option value="mask">Mask</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Price</FormLabel>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: parseFloat(e.target.value) })
                  }
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Image URL</FormLabel>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                />
              </FormControl>

              <Button type="submit" colorScheme="red" w="full">
                {product ? 'Update Product' : 'Add Product'}
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AdminDashboard; 