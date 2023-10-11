import { Box, ListItem , List} from '@chakra-ui/react';
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
            <ListItem className={styles.list} _hover={{ textDecor: 'underline' }}><Link href="/pmpages/assetlist" className={styles.listitem}>Management Assets</Link></ListItem>
            <ListItem className={styles.list} _hover={{ textDecor: 'underline' }}><Link href="/pmpages/softwarelist" className={styles.listitem}>Management Softwares</Link></ListItem>
            <ListItem className={styles.list} _hover={{ textDecor: 'underline' }}><Link href="/pmpages/reportlist" className={styles.listitem}>Management Reports</Link></ListItem>
        </List>
    </Box>
  )
}

export default PmHome;
