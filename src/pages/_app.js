import Header from '@/components/layouts/Header';
import Header2 from '@/components/layouts/Header/index2';
import '@/styles/globals.css';
import { Box, ChakraProvider } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  //
  const router = useRouter();
  const pathsToShowHeader = ['home', 'sign-up', 'login', ''];
  const shouldShowHeader = pathsToShowHeader.includes(router.pathname);
  //
  return (
    <ChakraProvider>
      <Box background={'#4d9ffe'} minHeight={'100vh'}>
        {router.pathname === '/' || shouldShowHeader ? <Header /> : <Header2 />}
        <Component {...pageProps} />
      </Box>
    </ChakraProvider>
  );
}
