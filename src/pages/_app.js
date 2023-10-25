import Header from '@/components/layouts/Header';
import Header2 from '@/components/layouts/Header/index2';
import '@/styles/globals.css';
import { Box, ChakraProvider } from '@chakra-ui/react';
import { useRouter } from "next/router"
import Footer from '@/components/layouts/Footer';
import Feature from '@/components/layouts/Feature';

export default function App({ Component, pageProps }) {
  //
  const router = useRouter();
  const pathsToShowHeader = ['home', 'sign-up', 'login', ''];
  const shouldShowHeader = pathsToShowHeader.includes(router.pathname);
  //
  return (
    <ChakraProvider>
      <Box>
        {router.pathname === ('/') || shouldShowHeader ? <Header /> : <Header2 />}
      </Box>
      <Box style={{ backgroundColor: 'white', minHeight: '100hv' }}>
        <Component {...pageProps} />
      </Box>
      <Box>
        <Feature />
      </Box>
      <Box>
        <Footer />
      </Box>
    </ChakraProvider>
  );
}
