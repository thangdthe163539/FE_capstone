import { Box, Flex, Button, Text } from '@chakra-ui/react';
import styles from '@/styles/Header2.module.css';
import Link from 'next/link';
function Header2() {
  return (
    <Box>
      <Flex className={`${styles.navbar}`}>
        <Text className={`${styles.navbarLogo}`}>
          <Link href={"/"}>SoftTrack</Link>
        </Text>
        <Flex>
            <Text
            className={styles.navbarItem}
            >Welcome Admin</Text>
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
