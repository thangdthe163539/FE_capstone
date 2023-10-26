import { Box, Flex, Button, Text } from '@chakra-ui/react';
import styles from '@/styles/Header2.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

function Header2() {
  const router = useRouter();
  const [account2, setAccount2] = useState(null); // Initialize the account state

  useEffect(() => {
    // Access localStorage on the client side
    const storedAccount = JSON.parse(localStorage.getItem('account'));
    if (storedAccount) {
      console.log(storedAccount);
      setAccount2(storedAccount); // Set the account state
    }
  }, []);

  function handleLogout() {
    localStorage.clear();
    router.push('/');
  }

  return (
    <Box>
      <Flex className={`${styles.navbar}`}>
        <Text className={`${styles.navbarLogo}`}>
          <Link href={'/'}>SoftTrack</Link>
        </Text>
        <Flex>
          {account2 && account2.name != null ? (
            <Text className={styles.navbarItem}>
              {account2.roleName}: {account2.name}
            </Text>
          ) : null}
          <Button
            fontSize={'sm'}
            fontWeight={400}
            variant={'link'}
            onClick={handleLogout}
            className={`${styles.navbarItem} ${styles.signInButton}`}
          >
            LOG OUT
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}

export default Header2;
