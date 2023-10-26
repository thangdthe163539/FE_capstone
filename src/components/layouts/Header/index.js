import { Box, Flex, Button, Text } from '@chakra-ui/react';
import styles from '@/styles/Header.module.css';
import Link from 'next/link';

function Header() {
  return (
    <Box>
      <Flex className={`${styles.navbar}`}>
        <Text className={`${styles.navbarLogo}`}>
          <Link href={'/'}>SoftTrack</Link>
        </Text>
        <Text className={`${styles.navbarText}`}>YOU ARE NOT LOGGED IN.</Text>
        <Text
          style={{
            fontSize: '20px',
            textAlign: 'center',
            marginTop: '-0.5%',
            marginLeft: '0.5%',
            color: '#344e74',
          }}
        >
          (
        </Text>
        <Text onClick={handleGoogleLogin} className={`${styles.loggin}`}>
          LOGIN
        </Text>
        <Text
          style={{
            fontSize: '20px',
            textAlign: 'center',
            marginTop: '-0.5%',
            color: '#344e74',
          }}
        >
          )
        </Text>
      </Flex>
    </Box>
  );
}

export default Header;
