import { Box, Container, Text, VStack, Button, Grid, GridItem, Heading, useBreakpointValue, SimpleGrid, Badge, HStack, Spinner } from '@chakra-ui/react';
import ProductImage from '../components/ProductImage';
import { useState } from 'react';

interface Product {
  name: string;
  brand: string;
  description: string;
  image: string;
  price: string;
  rating: number;
  benefits: string[];
  ingredients: string[];
}

const recommendedProducts: Product[] = [
  {
    name: 'Niacinamide 10% + Zinc 1%',
    brand: 'The Ordinary',
    description: 'High-Strength Vitamin and Mineral Blemish Formula',
    image: 'https://theordinary.com/dw/image/v2/BFKJ_PRD/on/demandware.static/-/Sites-deciem-master/default/dw5c9d2f6f/Images/products/The%20Ordinary/rdn-niacinamide-10pct-zinc-1pct-30ml.png?sw=500&sh=500&sm=fit',
    price: '$5.90',
    rating: 4.5,
    benefits: [
      'Reduces blemishes and congestion',
      'Controls oil production',
      'Improves skin texture',
    ],
    ingredients: ['Niacinamide', 'Zinc PCA', 'Glycerin'],
  },
  {
    name: 'Salicylic Acid 2% Solution',
    brand: 'The Ordinary',
    description: 'Targeted treatment for blemishes',
    image: 'https://theordinary.com/dw/image/v2/BFKJ_PRD/on/demandware.static/-/Sites-deciem-master/default/dw5c9d2f6f/Images/products/The%20Ordinary/rdn-salicylic-acid-2pct-solution-30ml.png?sw=500&sh=500&sm=fit',
    price: '$6.50',
    rating: 4.3,
    benefits: [
      'Exfoliates inside the pores',
      'Fights acne and blackheads',
      'Reduces inflammation',
    ],
    ingredients: ['Salicylic Acid', 'Witch Hazel', 'Aloe Vera'],
  },
];

const Recommendations = () => {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const [loadingImages, setLoadingImages] = useState<{ [key: string]: boolean }>({});

  const handleImageError = (productName: string) => {
    setLoadingImages(prev => ({ ...prev, [productName]: false }));
  };

  return (
    <Box className="app-container">
      {/* Header */}
      <Box py={4} className="nav-header">
        <Container maxW="container.xl">
          <Text fontSize="xl" fontWeight="bold">
            <span style={{ color: '#E53E3E' }}>GET</span>
            <span style={{ color: '#000000' }}>SKIN</span>
            <span style={{ color: '#E53E3E' }}>BEAUTY</span>
          </Text>
        </Container>
      </Box>

      <Container maxW="container.xl" className="main-content">
        <Grid
          templateColumns={isDesktop ? 'repeat(2, 1fr)' : '1fr'}
          gap={8}
          alignItems="start"
        >
          {/* Recommendations Section */}
          <GridItem colSpan={isDesktop ? 2 : 1}>
            <VStack spacing={8} align="stretch">
              <Box>
                <Heading size="lg">Your Personalized Recommendations</Heading>
                <Text color="gray.600" mt={2}>
                  Based on your skin analysis, we've selected these products to
                  address your specific concerns
                </Text>
              </Box>

              <SimpleGrid columns={isDesktop ? 2 : 1} spacing={8}>
                {recommendedProducts.map((product) => (
                  <Box key={product.name} className="card" position="relative">
                    <Grid templateColumns={isDesktop ? '200px 1fr' : '1fr'} gap={6}>
                      {/* Product Image */}
                      <Box>
                        <ProductImage
                          imageUrl={product.image}
                          size="md"
                          onError={() => handleImageError(product.name)}
                        />
                        {loadingImages[product.name] && (
                          <Box
                            position="absolute"
                            top="50%"
                            left="50%"
                            transform="translate(-50%, -50%)"
                          >
                            <Spinner size="md" color="red.500" />
                          </Box>
                        )}
                      </Box>

                      {/* Product Details */}
                      <VStack align="stretch" spacing={4}>
                        <Box>
                          <Text
                            fontSize="lg"
                            fontWeight="bold"
                            color="gray.700"
                          >
                            {product.brand}
                          </Text>
                          <Heading size="md">{product.name}</Heading>
                          <Text color="gray.600" mt={1}>
                            {product.description}
                          </Text>
                        </Box>

                        <HStack spacing={2}>
                          <Badge colorScheme="green">
                            ★ {product.rating.toFixed(1)}
                          </Badge>
                          <Text color="green.600" fontWeight="bold">
                            {product.price}
                          </Text>
                        </HStack>

                        <Box>
                          <Text fontWeight="medium" mb={2}>
                            Key Benefits:
                          </Text>
                          <VStack align="stretch" spacing={1}>
                            {product.benefits.map((benefit) => (
                              <Text
                                key={benefit}
                                fontSize="sm"
                                color="gray.600"
                              >
                                • {benefit}
                              </Text>
                            ))}
                          </VStack>
                        </Box>

                        <Button colorScheme="red" size="lg">
                          Buy Now
                        </Button>
                      </VStack>
                    </Grid>
                  </Box>
                ))}
              </SimpleGrid>

              {/* Additional Information */}
              <Box className="card" bg="blue.50">
                <VStack spacing={4} align="stretch">
                  <Heading size="md" color="blue.800">
                    Why These Products?
                  </Heading>
                  <Text color="blue.800">
                    These recommendations are specifically chosen based on your skin
                    analysis results. The selected products contain ingredients that
                    target your main concerns: acne and fine lines.
                  </Text>
                  <Text fontSize="sm" color="blue.600">
                    Note: Results may vary. Always patch test new products and
                    introduce them gradually into your skincare routine.
                  </Text>
                </VStack>
              </Box>
            </VStack>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default Recommendations; 