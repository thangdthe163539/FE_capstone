import { Box, Image, Flex, Button, Text } from '@chakra-ui/react';
import styles from '@/styles/Header.module.css';
import Link from 'next/link';
import { initializeApp } from 'firebase/app';
import { useRouter } from 'next/router';

import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useState, useEffect } from 'react';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

import {
  Alert,
  AlertIcon,
} from '@chakra-ui/react'

function Header() {
  const [isSuccess, setIsSuccess] = useState('');
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
            console.log(data);
            const id = data.roleId;
            console.log('khang');
            console.log(id);
            localStorage.setItem('account', JSON.stringify(data));
            if (id == 1) {
              router.push('adminpages/adminhome');
              //   router.push('/userpages/userhome');
            } else if (id == 2) {
              router.push('/pmpages/PoHome');
            } else if (id == 3) {
              router.push('/userpages/userhome');
            } else {
              router.push('http://localhost:3000/');
            }
          })
          .catch((error) => {
            setIsSuccess("false");
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
      <Flex className={`${styles.navbar}`}>
        <Link className={`${styles.logo}`} href={'/'}>
          <Image src='/lo-go.png' alt='SoftTrack Logo' boxSize='40px' />
        </Link>
        <Text className={`${styles.navbarLogo}`}>
          <Link href={'/'}>SoftTrack</Link>
        </Text>
        <Text className={`${styles.navbarText}`}>YOU ARE NOT LOGGED IN.</Text>
        <Text
          style={{
            fontSize: '20px',
            textAlign: 'center',
            marginTop: '-0.5%',
            marginLeft: '0.5%',
            color: '#344e74',
          }}
        >
          (
        </Text>
        <Text onClick={handleGoogleLogin} className={`${styles.loggin}`}>
          LOGIN
        </Text>
        <Text
          style={{
            fontSize: '20px',
            textAlign: 'center',
            marginTop: '-0.5%',
            color: '#344e74',
          }}
        >
          )
        </Text>
      </Flex>
    </Box>
  );
}

export default Header;
