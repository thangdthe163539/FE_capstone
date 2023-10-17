import { Box, Button} from '@chakra-ui/react';
import { useRouter } from 'next/router';

function HomePage() {
  const router = useRouter();
  const handleUserManager = () => {
    router.push('userManager');
  };

  return <Box>
    Welcome HomePage
    <Button onClick={handleUserManager}>
      click
    </Button>
    </Box>;
}

export default HomePage;
