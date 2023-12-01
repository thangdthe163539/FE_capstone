import { Box, ListItem, List } from '@chakra-ui/react';
import Link from 'next/link';
import styles from '@/styles/pm.module.css';
import { AiOutlineEye, AiFillEye } from 'react-icons/ai';
import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
// import { BACK_END_PORT } from '../../env';

function PmHome() {
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
