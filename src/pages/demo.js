import {
  Box,
  ListItem,
  Text,
  List,
  Link,
  Flex,
  Center,
} from '@chakra-ui/react';
import styles from '@/styles/pm.module.css';

function DemoPage() {

  const params = {
    user: 'khangdthe151162@fpt.edu.vn',
    app: 'FAP',
  };

  const encodedParams = btoa(JSON.stringify(params));

  return (
    <Box className={styles.bodybox}>
      <Center>
        <Text fontSize={50}>FPT University Academic Portal</Text>
      </Center>
      <List>
        <ListItem className={styles.list}>
          <Flex style={{ fontSize: '18px' }}>
            <Link
              href={`http://localhost:3000/ViewApplication?${encodedParams}`}
            >
              Send feedback to SoftTrack
            </Link>
          </Flex>
        </ListItem>
      </List>
    </Box>
  );
}

export default DemoPage;
