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
          <Link href='/pmpages/assetlist' className={styles.listitem}>
            Assets Management
          </Link>
        </ListItem>
        <ListItem className={styles.list}>
          <Link href='/pmpages/softwarelist' className={styles.listitem}>
            Softwares Management
          </Link>
        </ListItem>
        <ListItem className={styles.list}>
          <Link href='/pmpages/reportlist' className={styles.listitem}>
            Reports Management
          </Link>
        </ListItem>
      </List>
    </Box>
  );
}

export default PmHome;
