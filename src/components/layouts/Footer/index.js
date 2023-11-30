import { Box, Image, Flex, Button, Text } from '@chakra-ui/react';
import styles from '@/styles/footer.module.css';
import Link from 'next/link';

function Footer() {
  return (
    <Box style={{ height: '320px' }}>
      <hr style={{ borderTop: '1px solid #c4c4c4', width: '100%', marginTop: '2.5%' }} />
      <Flex className={`${styles.footer}`}>
        <Link className={`${styles.logo}`} href={'/'}><Image src="/lo-go.png" alt="SoftTrack Logo" boxSize="30px" /></Link>
        <Text className={`${styles.navbarLogo}`}>
          <Link href={'/'}>SoftTrack</Link>
        </Text>

        <Text className={`${styles.contact}`}>
          Any question 
        </Text>
        <Text style={{marginTop: '6%', marginLeft:'-10.6%'}}>
          Phone number: 0974-421-458
        </Text>
        <Text style={{marginTop: '8%', marginLeft:'-14%'}}>
         Email: khangdt01001@gmail.com
        </Text>
        {/* <Button className={`${styles.buttonContact}`} colorScheme='blue'>CONTACT US</Button> */}
        <Text className={`${styles.about}`}>
          About SoftTrack
        </Text>
      </Flex>
      <Text className={`${styles.textAbout}`}>
        SoftTrack is a cutting-edge Software Asset Management (SAM)<br />
        solution designed to streamline the management of your software assets.<br />
        With SoftTrack, you can effortlessly track, monitor, and optimize<br />
        your software licenses, ensuring compliance and cost efficiency <br />
        for your organization.
      </Text>
      <Text className={`${styles.lastline}`}>SoftTrack Copyright © 2023 INDEPNET Development Team</Text>
    </Box>
  );
}

export default Footer;