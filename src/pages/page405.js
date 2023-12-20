import { Box, Text, Center, Link } from '@chakra-ui/react';

import { useRouter } from 'next/router';
import { Inter } from 'next/font/google';

function ApplicationPage() {
  const router = useRouter();

  const boxStyle = {
    backgroundImage: `url(/page405.jpg)`, // Adjust the path as needed
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    width: '920px',
    height: '500px',
    display: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  };
  function handleLogout() {
    sessionStorage.clear();
    router.push('/');
  }
  return (
    <Box>
      <Center>
        <Box style={boxStyle}>
          <Center>
            <Text
              fontSize='22px'
              position='absolute'
              bottom='5'
              color={'white'}
            >
              You have no permission to access this page!{' '}
              <Link onClick={handleLogout} color={'#ff7632'}>
                Logout.
              </Link>
            </Text>
          </Center>
        </Box>
      </Center>
    </Box>
  );
}
export default ApplicationPage;
