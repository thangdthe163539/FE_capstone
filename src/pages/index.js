import {
  Box,
  Flex,
  Button,
  Text,
  InputGroup,
  InputRightElement,
  Stack,
  Input,
} from '@chakra-ui/react';
import { Inter } from 'next/font/google';
import styles from '@/styles/SignIn.module.css';
import Link from 'next/link';

import { AiOutlineEye, AiFillEye } from 'react-icons/ai';
import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { BACK_END_PORT } from '../../env';
import Header from '@/components/layouts/Header';

import { initializeApp } from 'firebase/app';
import {
  confirmPasswordReset,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

const inter = Inter({ subsets: ['latin'] });

function SignInPage() {
  const router = useRouter();

  // start config firebase - login gg
  const firebaseConfig = {
    apiKey: 'AIzaSyBPQERi46GDLNjIVX2k7RBxro66VxV74tY',
    authDomain: 'capstone-e29dd.firebaseapp.com',
    projectId: 'capstone-e29dd',
    storageBucket: 'capstone-e29dd.appspot.com',
    messagingSenderId: '525712107578',
    appId: '1:525712107578:web:0e09593d57696909136d03',
    measurementId: 'G-0QH2KVSVVB',
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const mail = result.user.email;
        const url = 'http://localhost:5001/api/v1/Account/login';

        const requestData = mail;

        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        })
          .then((response) => response.json())
          .then((data) => {
            const id = data.roleAccounts[0].roleId;
            localStorage.setItem('account', JSON.stringify(data));
            if (id == 1) {
              router.push('adminpages/adminhome');
            }
            if (id == 2) {
              router.push('/pmpages/pmhome');
            }
            if (id == 3) {
              router.push('/userpages/userhome');
            } else {
              router.push('home');
            }
          })
          .catch((error) => {
            console.error('Lỗi:', error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //end

  return (
    <Box className={styles.homeBody + ' ' + inter.className}>
      <Flex>
        <Flex alignItems={'center'}>
          <Stack className={styles.loginForm}>
            <Box className={styles.loginFormTitle}>
              <Text className={styles.title1}>Welcome back,</Text>
              <Text className={styles.title2}>Log In</Text>
            </Box>
            <Button onClick={handleGoogleLogin} colorScheme='red'>
              Login with Google
            </Button>
          </Stack>
          <Box className={styles.dividerVertical} />
        </Flex>
        <Flex className={styles.introduce}>
          <Flex className={styles.intro}>
            <Text className={styles.title}>Welcome to SoftTrack,</Text>
            <Text className={styles.detail}>
              SoftTrack: Navigating Your Software Assets with Precision
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}

export default SignInPage;
