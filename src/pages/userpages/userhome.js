import { Box, ListItem, List } from '@chakra-ui/react';
import Link from 'next/link';
import styles from '@/styles/pm.module.css';
import { AiOutlineEye, AiFillEye } from 'react-icons/ai';
import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
// import { BACK_END_PORT } from '../../env';

function UserHome() {
  return (
    <Box className={styles.bodybox}>
      <List>
        <ListItem className={styles.list} _hover={{ textDecor: 'underline' }}>
          <Link href='/userpages/assetlist' className={styles.listitem}>
            Assets
          </Link>
        </ListItem>
        <ListItem className={styles.list} _hover={{ textDecor: 'underline' }}>
          <Link href='/userpages/reportlist' className={styles.listitem}>
            Reports
          </Link>
        </ListItem>
      </List>
    </Box>
  );
}

export default UserHome;
