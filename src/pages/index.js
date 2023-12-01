import { Box, Flex, Text, Spacer } from '@chakra-ui/react';
import { Inter } from 'next/font/google';
import styles from '@/styles/SignIn.module.css';
import { Image } from '@chakra-ui/react';
import axios from 'axios';

const inter = Inter({ subsets: ['latin'] });

function SignInPage() {
  return (
    <Box
      style={{
        backgroundImage: `url('/banner.jpg')`, // Thay đổi đường dẫn đến hình ảnh của bạn
        backgroundSize: 'cover', // Để tự động điều chỉnh kích thước ảnh cho phù hợp với phần tử
        backgroundRepeat: 'no-repeat', // Không lặp lại hình ảnh
        backgroundPosition: 'center', // Hiển thị ảnh tại giữa phần tử
        overflow: 'hidden',
      }}
      className={styles.homeBody + ' ' + inter.className}
    >
      <Flex
        style={{
          paddingTop: '10%',
        }}
      >
        <Box>
          <Text
            style={{ letterSpacing: '5px', fontSize: '40px', color: 'white' }}
          >
            SOFTTRACK
          </Text>
          <hr
            style={{
              borderTop: '1px solid white',
              width: '50%',
            }}
          />
          <Text
            style={{
              fontSize: '22px',
              color: 'white',
              marginTop: '5px',
            }}
          >
            Your Software Asset Management Solution!
          </Text>
          <Text
            style={{
              letterSpacing: '1px',
              fontSize: '15px',
              color: 'white',
              marginTop: '10px',
            }}
          >
            Advanced software asset management solution
            <br />
            that helps you track, control, and optimize software licenses
            <br />
            with ease, ensuring compliance and cost efficiency for your
            organization.
          </Text>
        </Box>
        <Spacer />
        <Image className={styles.image1} src='image2.png' alt='Dan Abramov' />
      </Flex>
    </Box>
  );
}

export default SignInPage;
