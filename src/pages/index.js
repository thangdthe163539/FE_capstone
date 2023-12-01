import { Box, Flex, Text } from '@chakra-ui/react';
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
        height: '700px',
      }}
      className={styles.homeBody + ' ' + inter.className}
    >
      <Flex
        style={{
          justifyContent: 'left',
          paddingLeft: '4%',
          paddingTop: '200px',
        }}
      >
        <Text
          style={{ letterSpacing: '5px', fontSize: '40px', color: 'white' }}
        >
          SOFTTRACK
        </Text>
      </Flex>
      <hr
        style={{
          borderTop: '1px solid white',
          width: '20%',
          marginTop: '0.5%',
          marginLeft: '4%',
        }}
      />
      <Text
        style={{
          letterSpacing: '5px',
          fontSize: '20px',
          color: 'white',
          marginLeft: '4%',
          marginTop: '1%',
        }}
      >
        Your Software Asset Management Solution!
      </Text>
      <Image
        style={{ paddingLeft: '55%', marginTop: '-10%', height: '400px' }}
        boxSize=''
        src='image2.png'
        alt='Dan Abramov'
      />
      <Text
        style={{
          letterSpacing: '1px',
          fontSize: '15px',
          color: 'white',
          marginTop: '-17%',
          marginLeft: '4%',
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
  );
}

export default SignInPage;
