import { Box, ListItem, List, Text } from '@chakra-ui/react';
import Link from 'next/link';
import styles from '@/styles/pm.module.css';
import { Flex } from 'antd';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

function ADHomePage() {
  const router = useRouter();

  useEffect(() => {
    // Access localStorage on the client side
    const storedAccount = localStorage.getItem('account');

    if (storedAccount) {
      const accountDataDecode = JSON.parse(storedAccount);
      if (!accountDataDecode) {
        // router.push('http://localhost:3000');
      } else {
        if (accountDataDecode.roleId !== 1) {
          router.push('/page405');
        }
        // setAccount(accountDataDecode);
      }
    }
  }, []);
  return (
    <Box className={styles.bodybox}>
      <List>
        <ListItem className={styles.list}>
          <Flex style={{ fontSize: '18px' }}>
            <Link className={styles.listitem} href='/adminpages/report'>
              Report
            </Link>
          </Flex>
        </ListItem>
        <ListItem className={styles.list}>
          <Flex style={{ fontSize: '18px' }}>
            <Link className={styles.listitem} href='/adminpages/userManager'>
              User Management
            </Link>
            <Text style={{ marginLeft: '5px' }}>
              (This is to manage accounts in the system)
            </Text>
          </Flex>
        </ListItem>
        <ListItem className={styles.list}>
          <Flex style={{ fontSize: '18px' }}>
            <Link
              className={styles.listitem}
              href='/adminpages/feedbackManager'
            >
              Feedback Management
            </Link>
            <Text style={{ marginLeft: '5px' }}>
              (This is to manage responses posted by other systems)
            </Text>
          </Flex>
        </ListItem>
        <ListItem className={styles.list}>
          <Flex style={{ fontSize: '18px' }}>
            <Link className={styles.listitem} href='/adminpages/issuehome'>
              Issue Management
            </Link>
            <Text style={{ marginLeft: '5px' }}>
              (This is to manage errors posted by the admin asking the product
              owner to fix)
            </Text>
          </Flex>
        </ListItem>
      </List>
    </Box>
  );
}
export default ADHomePage;
