import { Box, Image, Flex, Button, Text } from '@chakra-ui/react';
import styles from '@/styles/footer.module.css';
import Link from 'next/link';

function Footer() {
  return (
    <Box style={{ height: '320px' }}>
      <Flex className={`${styles.footer}`}>
        <Link className={`${styles.logo}`} href={'/'}><Image src="/lo-go.png" alt="SoftTrack Logo" boxSize="30px" /></Link>
        <Text className={`${styles.navbarLogo}`}>
          <Link href={'/'}>SoftTrack</Link>
        </Text>
        
        <Text className={`${styles.contact}`}>
          Any Question
        </Text>
        <Button className={`${styles.buttonContact}`} colorScheme='blue'>CONTACT US</Button>
        <Text className={`${styles.about}`}>
          About SoftTrack
        </Text>
      </Flex>
      <Text className={`${styles.textAbout}`}>
        <Text>SoftTrack is a cutting-edge Software Asset Management (SAM)</Text>
        <Text>solution designed to streamline the management of your software assets.</Text>
        <Text>With SoftTrack, you can effortlessly track, monitor, and optimize</Text>
        <Text>your software licenses, ensuring compliance and cost efficiency </Text>
        <Text>for your organization.</Text>
      </Text>
      <Text className={`${styles.lastline}`}>SoftTrack Copyright © 2023 INDEPNET Development Team</Text>
    </Box>
  );
}

export default Footer;