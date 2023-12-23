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
import { useRouter } from 'next/router';

function DemoPage() {
  const params = {
    user: 'khangdthe151162@fpt.edu.vn',
    app: 'New',
  };
  const router = useRouter();
  const encodedParams = btoa(JSON.stringify(params));

  // const handleDemo - checkLogin ?  : tao sessionStorage url
  const handleURL = () => {
    const url = `http://localhost:3000/ViewApplication?${encodedParams}`;
    const accountDataDecode = JSON.parse(sessionStorage.getItem('account'));
    console.log('acc demo: ' + accountDataDecode);
    if (!accountDataDecode) {
      sessionStorage.setItem('url', JSON.stringify(url));
      console.log('url demo: ' + url);
    }
    router.push(url);
  };

  return (
    <Box className={styles.bodybox}>
      <Center>
        <Text fontSize={50}>FPT University Academic Portal</Text>
      </Center>
      <List>
        <ListItem className={styles.list}>
          <Flex style={{ fontSize: '18px' }}>
            <Link onClick={handleURL}>Send feedback to SoftTrack</Link>
          </Flex>
        </ListItem>
      </List>
    </Box>
  );
}

export default DemoPage;
