import { Box, Center, Text } from '@chakra-ui/react';
import styles from '@/styles/footer.module.css';
function LastFooter() {
  return (
    <Box mt='40px'>
      <Text className={`${styles.lastline1}`}>
        SoftTrack Copyright © 2023 INDEPNET Development Team
      </Text>
    </Box>
  );
}
export default LastFooter;
