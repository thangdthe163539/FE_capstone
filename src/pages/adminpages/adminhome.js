import { Box, ListItem, List, Text } from '@chakra-ui/react';
import Link from 'next/link';
import styles from '@/styles/pm.module.css';
import { Flex } from 'antd';

function ADHomePage() {
  return (
    <Box className={styles.bodybox}>
      <List>
        <ListItem className={styles.list}>
          <Link className={styles.listitem} href='/adminpages/userManager'>
            User Management
          </Link>
        </ListItem>
        <ListItem className={styles.list}>
            <Link className={styles.listitem} href='/adminpages/feedbackManager'>
              Feedback Management
            </Link>
        </ListItem>
        <ListItem className={styles.list}>
          <Flex style={{ fontSize: '18px' }}>
            <Link className={styles.listitem} href='/adminpages/issuehome'>
              Issue Management
            </Link>
            <Text style={{ marginLeft: '5px' }}>(These are errors posted by admins asking product owners to fix)</Text>
          </Flex>
        </ListItem>
      </List>
    </Box>
  );
}
export default ADHomePage;
