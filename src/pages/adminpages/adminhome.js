import { Box, ListItem, List } from '@chakra-ui/react';
import Link from 'next/link';
import styles from '@/styles/pm.module.css';

function ADHomePage() {
  return (
    <Box className={styles.bodybox}>
      <List>
        <ListItem className={styles.list}>
          <Link className={styles.listitem} href='/adminpages/userManager'>
            Users Management
          </Link>
        </ListItem>
        <ListItem className={styles.list}>
          <Link className={styles.listitem} href='/adminpages/reportlist'>
            Reports Management
          </Link>
        </ListItem>
      </List>
    </Box>
  );
}
export default ADHomePage;
