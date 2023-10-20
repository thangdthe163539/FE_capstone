import { Box, ListItem, List } from '@chakra-ui/react';
import Link from 'next/link';

function ADHomePage() {
  return (
    <Box style={{backgroundColor: 'white', width: 'auto', height: '100%', padding: '10px 20px'}}>
      <List style={{height: '100%', padding: '10px 0px', alignItems: 'center', fontSize: '18px', borderBottom: '1px solid #c4c4c4'}}>
        <ListItem style={{color: '#4d9ffe'}} _hover={{ textDecor: 'underline' }}>
          <Link href='/adminpages/userManager'>
            Management User
          </Link>
        </ListItem>
      </List>
    </Box>
  );
}
export default ADHomePage;
