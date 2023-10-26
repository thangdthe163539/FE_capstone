import { Box, Flex, Button, Text, Stack, Center } from '@chakra-ui/react';
import { Inter } from 'next/font/google';
import styles from '@/styles/SignIn.module.css';
import Link from 'next/link';
import { AiOutlineEye, AiFillEye } from 'react-icons/ai';
import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { BACK_END_PORT } from '../../env';
import { AiFillGoogleCircle } from 'react-icons/ai';

import { initializeApp } from 'firebase/app';

import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

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
        const url = `${BACK_END_PORT}/api/v1/Account/login`;

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
            const id = data.roleId;
            // console.log(id);
            localStorage.setItem('account', JSON.stringify(data));
            if (id == 1) {
              // router.push('/pmpages/pmhome');
              router.push('adminpages/adminhome');
            } else if (id == 2) {
              router.push('/pmpages/pmhome');
            } else if (id == 3) {
              router.push('/pmpages/pmhome');
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
    <Box>
      <Box className={styles.homeBody}>
        <Flex>
          <Box className={styles.homeContent} id={styles.LoginForm}>
            <Text className={styles.title1}>Welcome to SoftTrack</Text>
            <Text className={styles.title2}>Please login with</Text>
            <Center>
              <Button
                onClick={handleGoogleLogin}
                colorScheme='red'
                leftIcon={<AiFillGoogleCircle style={{ fontSize: '1.5em' }} />}
              >
                Google
              </Button>
            </Center>
          </Box>
          <Box className={styles.homeContent} id={styles.Banner}>
            <div className={styles.Layer}></div>
            <Center>
              <Text className={styles.title1}>
                SoftTrack: Navigating Your Software Assets with Precision
              </Text>
            </Center>
            <Link id={styles.Link} href='/'>
              Back to Home Page
            </Link>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

export default SignInPage;
