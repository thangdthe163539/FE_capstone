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
import { useState, useEffect } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

function Header() {
  const [isLogin, setIsLogin] = useState({});
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
        const url = 'http://localhost:5001/api/Account/login';

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
            localStorage.setItem('account', JSON.stringify(data));
            if (id == 1) {
              router.push('adminpages/adminhome');
            } else if (id == 2) {
              router.push('/pmpages/PoHome');
            } else if (id == 3) {
              router.push('/userpages/userhome');
            } else {
              router.push('http://localhost:3000/');
            }
          })
          .catch((error) => {
            setIsSuccess('false');
            console.error('Lỗi:', error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  function handleLogout() {
    localStorage.clear();
    router.push('/');
    window.location.reload();
  }
  //end
  useEffect(() => {
    const storedAccount = localStorage.getItem('account');
    if (storedAccount) {
      const storedAccountEncode = JSON.parse(storedAccount);
      if (storedAccountEncode) {
        setIsLogin(storedAccountEncode);
      }
    }
  }, []);
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
              {isLogin?.roleName === 'Admin' ||
                (isLogin?.roleName === 'Product owner' && (
                  <>
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

                    <Link
                      style={{ marginRight: '2%', padding: '20px 12px', minWidth:"150px" }}
                      href={'/ViewApplication'}
                    >
                      View Application
                    </Link>
                  </>
                ))}
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
