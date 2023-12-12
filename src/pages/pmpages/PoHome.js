import { Box, ListItem, List } from '@chakra-ui/react';
import Link from 'next/link';
import styles from '@/styles/pm.module.css';
import { AiOutlineEye, AiFillEye } from 'react-icons/ai';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
// import { BACK_END_PORT } from '../../env';

function PmHome() {
  const router = useRouter();

  useEffect(() => {
    // Access localStorage on the client side
    const storedAccount = localStorage.getItem('account');

    if (storedAccount) {
      const accountDataDecode = JSON.parse(storedAccount);
      if (!accountDataDecode) {
        // router.push('http://localhost:3000');
      } else {
        if (accountDataDecode.roleId !== 2) {
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
          <Link href='/pmpages/Application' className={styles.listitem}>
            Application
          </Link>
        </ListItem>
        <ListItem className={styles.list}>
          <Link href='/pmpages/Issue' className={styles.listitem}>
            Issue
          </Link>
        </ListItem>
        <ListItem className={styles.list}>
          <Link href='/pmpages/Feedback' className={styles.listitem}>
            Feedback
          </Link>
        </ListItem>
        <ListItem className={styles.list}>
          <Link href='/pmpages/Report' className={styles.listitem}>
            Report
          </Link>
        </ListItem>
      </List>
    </Box>
  );
}

export default PmHome;
