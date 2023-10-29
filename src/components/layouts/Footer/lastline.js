import { Box, Text } from '@chakra-ui/react';
import styles from '@/styles/footer.module.css';
function LastFooter() {
    return (
      <Box style={{ height: '320px' }}>
        <Text className={`${styles.lastline1}`}>SoftTrack Copyright © 2023 INDEPNET Development Team</Text>
      </Box>
    );
  }
  export default LastFooter;