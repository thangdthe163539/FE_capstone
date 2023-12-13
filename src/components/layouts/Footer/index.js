import { Box, Image, Flex, Button, Text, Spacer } from '@chakra-ui/react';
import styles from '@/styles/footer.module.css';
import Link from 'next/link';

function Footer() {
  return (
    <Box>
      <hr
        style={{
          borderTop: '1px solid #c4c4c4',
          width: '100%',
        }}
      />
      <Flex className={`${styles.footer}`}>
        <Box>
          <Flex>
            <Link className={`${styles.logo}`} href={'/'}>
              <Image src='/lo-go.png' alt='SoftTrack Logo' boxSize='30px' />
            </Link>
            <Text className={`${styles.navbarLogo}`}>
              <Link href={'/'}>SoftTrack</Link>
            </Text>
          </Flex>
        </Box>
        <Spacer />
        <Box>
          <Text className={`${styles.contact}`}>Any question</Text>
          <Text>Phone number: 0974-421-458</Text>
          <Text>Email: softtrackfpt@gmail.com</Text>

          {/* <Button className={`${styles.buttonContact}`} colorScheme='blue'>CONTACT US</Button> */}
        </Box>
        <Spacer />
        <Box>
          <Text className={`${styles.about}`}>About SoftTrack</Text>
          <Text>
            SoftTrack is a cutting-edge Software Asset Management (SAM).
            <br />
            The Solution designed to streamline the management of your software
            assets.
            <br />
            With SoftTrack, you can effortlessly track, monitor, and optimize
            <br />
            your software licenses, ensuring compliance and cost efficiency{' '}
            <br />
            for your organization.
          </Text>
        </Box>
      </Flex>
      <Text className={`${styles.lastline}`}>
        SoftTrack Copyright © 2023 INDEPNET Development Team
      </Text>
    </Box>
  );
}

export default Footer;
