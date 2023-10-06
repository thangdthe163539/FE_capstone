import Header from '@/components/layouts/Header';
import '@/styles/globals.css';
import { Box, ChakraProvider } from '@chakra-ui/react';

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Box background={'#4d9ffe'} minHeight={"100vh"}>
        <Header />
        <Component {...pageProps} />
      </Box>
    </ChakraProvider>
  );
}
