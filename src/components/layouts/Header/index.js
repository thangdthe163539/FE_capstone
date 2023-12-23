import {
  Box,
  Image,
  Flex,
  Button,
  Text,
  Spacer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import styles from '@/styles/Header.module.css';
import Link from 'next/link';
import { initializeApp } from 'firebase/app';
import { useRouter } from 'next/router';
import { ChevronDownIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

function Header() {
  const [isLogin, setIsLogin] = useState({});
  const [isSuccess, setIsSuccess] = useState('');
  const [acc, setAcc] = useState([]);
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

  const tokenDecode = async (token) => {
    //decode token base64
    const [, payloadBase64] = token.split('.');
    const decodedPayload = JSON.parse(atob(payloadBase64));
    const id = decodedPayload.nameid;
    const response = await axios.get(
      `http://localhost:5001/api/Account/ListAccount`,
    );
    const account = response.data.find((item) => item.accId === parseInt(id));
    // console.log('1: ' + account.name);
    // console.log('2: ' + id);
    if (account) {
      return account;
    } else {
      return null;
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const mail = result.user.email;
      const url = 'http://localhost:5001/api/Account/login';
      const requestData = mail;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      const data = await response.json();

      // const roleId = data.roleId;
      // const status = data.status;
      // Wait for the tokenDecode function to complete
      const account = await tokenDecode(data.token);
      setAcc(account);
      // setIsLogin(account);
      if (account) {
        sessionStorage.setItem('account', JSON.stringify(account));
        //check cos session url -> viewapp
        if (account.status == 3) {
          router.push('/');
        } else if (account.status == 2) {
          router.push('/');
        } else if (account.status == 1) {
          if (account.roleId == 1) {
            router.push('adminpages/adminhome');
          } else if (account.roleId == 2) {
            router.push('/pmpages/PoHome');
          } else if (account.roleId == 3) {
            router.push('/');
          } else {
            router.push('/');
          }
        }
      } else {
        setIsSuccess('false');
      }
    } catch (error) {
      setIsSuccess('false');
      // console.error('Lỗi:', error);
    }
  };

  function handleLogout() {
    sessionStorage.clear();
    router.push('/');
    window.location.reload();
  }
  //end
  useEffect(() => {
    const storedAccount = sessionStorage.getItem('account');
    if (storedAccount && storedAccount.accId !== null) {
      const storedAccountEncode = JSON.parse(storedAccount);
      if (storedAccountEncode) {
        setIsLogin(storedAccountEncode);
        console.log(isLogin.status);
        console.log(storedAccountEncode.status);
        console.log(storedAccount.status);
      }
    }
  }, [acc]);
  return (
    <Box>
      <Flex className={`${styles.navbar}`}>
        <Box>
          <Flex>
            <Link className={`${styles.logo}`} href={'/'}>
              <Image src='/lo-go.png' alt='SoftTrack Logo' boxSize='40px' />
            </Link>
            <Text className={`${styles.navbarLogo}`}>
              <Link href={'/'}>SoftTrack</Link>
            </Text>
          </Flex>
        </Box>
        <Spacer />
        <Box>
          {isLogin && isLogin?.name ? (
            <Flex alignItems={'center'}>
              {((isLogin?.roleName === 'Admin' && isLogin?.status === 1) ||
                (isLogin?.roleName === 'Product owner' &&
                  isLogin?.status === 1)) && (
                <Link
                  style={{ marginRight: '2%', padding: '20px 12px' }}
                  href={
                    isLogin?.roleName === 'Admin'
                      ? 'adminpages/adminhome'
                      : '/pmpages/PoHome'
                  }
                >
                  Dashboard
                </Link>
              )}
              {isLogin?.status !== 3 ? (
                <Link
                  style={{
                    marginRight: '2%',
                    padding: '20px 12px',
                    minWidth: '150px',
                  }}
                  href={'/ViewApplication'}
                >
                  View Application
                </Link>
              ) : (
                ''
              )}
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  className={styles.menuButton}
                  _active={{
                    bg: '#4d9ffe',
                    border: 'none',
                    color: '#fff',
                  }}
                  minW={'230px'}
                >
                  {isLogin?.roleName}: {isLogin?.name}
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={handleLogout}>LOG OUT</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          ) : (
            <Flex>
              <Text className={`${styles.navbarText}`}>
                You are not logged in.(
              </Text>
              <Text onClick={handleGoogleLogin} className={`${styles.login}`}>
                Login
              </Text>
              )
              <Text
                style={{ paddingTop: '5px', position: 'fixed', right: '45%' }}
              >
                {isSuccess === 'false' && (
                  <Text style={{ color: 'black' }}>
                    Login failed. Please try again!
                  </Text>
                )}
              </Text>
            </Flex>
          )}
        </Box>
      </Flex>
    </Box>
  );
}

export default Header;
