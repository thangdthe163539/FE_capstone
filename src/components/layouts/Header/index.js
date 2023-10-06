import { Box, Flex, Button, Text } from '@chakra-ui/react';
import styles from '@/styles/Header.module.css';
import Link from 'next/link';

function Header() {
  return (
    <Box>
      <Flex className={`${styles.navbar}`}>
        <Text className={`${styles.navbarLogo}`}>
          <Link href={"/"}>SoftTrack</Link>
        </Text>
        <Flex>
          <Button
            as={'a'}
            fontSize={'sm'}
            fontWeight={400}
            variant={'link'}
            href={'/'}
            className={`${styles.navbarItem}`}
          >
            HOME
          </Button>
          <Button
            as={'a'}
            fontSize={'sm'}
            fontWeight={400}
            variant={'link'}
            href={'#'}
            className={`${styles.navbarItem}`}
          >
            ABOUT
          </Button>
          <Button
            as={'a'}
            fontSize={'sm'}
            fontWeight={400}
            variant={'link'}
            href={'#'}
            className={`${styles.navbarItem}`}
          >
            FEATURE
          </Button>
          <Button
            as={'a'}
            fontSize={'sm'}
            fontWeight={400}
            variant={'link'}
            href={'#'}
            className={`${styles.navbarItem}`}
          >
            CONTACT
          </Button>
          <Button
            as={'a'}
            fontSize={'sm'}
            fontWeight={400}
            variant={'link'}
            href={'/'}
            className={`${styles.navbarItem} ${styles.signInButton}`}
          >
            SIGN IN
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}

export default Header;
