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

const inter = Inter({ subsets: ['latin'] });

function SignInPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [paramsData, setParamsData] = useState({
    email: '',
    password: '',
  });

  const handleChangeEmail = (e) => {    
    setParamsData({ ...paramsData, email: e.target.value });
    //console.log(paramsData);
  };

  const handleChangePassword = (e) => {
    setParamsData({ ...paramsData, password: e.target.value });
    //console.log(paramsData);
  };

  //input endpoint here
  const handleLoginAccount = async () => {
    const { email, password } = paramsData;
    //console.log("email/password: " + paramsData);
    if (!email || !password) return;
    try {
      const response = axios.post(`${BACK_END_PORT}/api/v1/Account/login`, {
        email, password
      });
      //console.log("run api");
      if ((await response).status === 200) {
        //console.log((await response).data.token);
        localStorage.setItem("token", (await response).data.token);
        if((await response).data.roll === 1){
          router.push('/admin-pages/adminhome');
        } else if((await response).data.roll === 2){
          router.push('/pm-pages/pmhome');
        } else if((await response).data.roll === 3){
          router.push('/user-pages/userhome');
        } else {
          router.push('/home');
        }        
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box className={styles.homeBody + ' ' + inter.className}>
      <Flex>
        <Flex alignItems={'center'}>
          <Stack className={styles.loginForm}>
            <Box className={styles.loginFormTitle}>
              <Text className={styles.title1}>Welcome back,</Text>
              <Text className={styles.title2}>Log In</Text>
            </Box>
            <Box w={'90%'}>
              <Input
                className={styles.inputField + ' ' + styles.userName}
                onChange={handleChangeEmail}
                placeholder='Account/Email'
                value={paramsData?.email}
              />
              <InputGroup>
                <InputRightElement
                  height={'51px'}
                  w={'51px'}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <AiFillEye className={styles.eyeIcon} />
                  ) : (
                    <AiOutlineEye className={styles.eyeIcon} />
                  )}
                </InputRightElement>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Password'
                  className={styles.inputField + ' ' + styles.passWord}
                  onChange={handleChangePassword}
                  value={paramsData?.password}
                />
              </InputGroup>
              {/* <Text className={styles.forgetPassword}>
                <Link href={'#'}>Forget password?</Link>
              </Text> */}
            </Box>
            <Button
              className={styles.buttonSignIn}
              onClick={handleLoginAccount}
            >
              LOGIN
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
          <Text className={styles.signUpText}>
            Dont’t have an account yet?{' '}
            <Link href={'/sign-up'} className={styles.link}>
              Sign up for free!
            </Link>
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
}

export default SignInPage;
