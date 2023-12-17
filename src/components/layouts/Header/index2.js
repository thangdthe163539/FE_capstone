import {
  Box,
  Flex,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  background,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
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
          <Menu>
            {account2 && account2.name != null ? (
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                className={styles.menuButton}
                _active={{
                  bg: '#4d9ffe',
                  border: 'none',
                  color: '#fff',
                }}
              >
                {account2.roleName}: {account2.name}
              </MenuButton>
            ) : null}
            <MenuList>
              <MenuItem onClick={handleLogout}>LOG OUT</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
}

export default Header2;
