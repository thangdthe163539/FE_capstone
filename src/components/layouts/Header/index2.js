import { Box, Flex, Button, Text } from '@chakra-ui/react';
import styles from '@/styles/Header2.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

function Header2() {
  const router = useRouter();
  const [account, setAccount] = useState(null); // Initialize the account state

  useEffect(() => {
    // Access localStorage on the client side
    const storedAccount = JSON.parse(localStorage.getItem('account'));
    if (storedAccount) {
      setAccount(storedAccount); // Set the account state
      console.log('Header');
      console.log(storedAccount);
    }
  }, []);

  return (
    <Box>
      <Flex className={`${styles.navbar}`}>
        <Text className={`${styles.navbarLogo}`}>
          <Link href={'/'}>SoftTrack</Link>
        </Text>
        <Flex>
          {account && account.account1 != null ? (
            <Text className={styles.navbarItem}>
              Welcome {account.account1}
            </Text>
          ) : null}
          <Button
            as={'a'}
            fontSize={'sm'}
            fontWeight={400}
            variant={'link'}
            href={'/'}
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
