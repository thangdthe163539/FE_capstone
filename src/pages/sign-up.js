import {
  Button,
  Flex,
  Stack,
  InputGroup,
  InputRightElement,
  Input,
  Text,
  Box,
} from '@chakra-ui/react';
import styles from '@/styles/SignUp.module.css';
import { Inter } from 'next/font/google';
import { useRouter } from 'next/router';
import { useState } from 'react';
import axios from 'axios'
import Link from 'next/link';

import { AiOutlineEye, AiFillEye } from 'react-icons/ai';
import { BACK_END_PORT } from '../../env';
const inter = Inter({ subsets: ['latin'] });

function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showComfirmPassword, setShowComfirmPassword] = useState(false);

  const [paramsData, setParamsData] = useState({
    email: '',
    password: '',
    confirm_password: '',
    dob: '',
    name: '',
  });

  const handleChangeEmail = (e) => {
    setParamsData({ ...paramsData, email: e.target.value });
  };

  const handleChangePassword = (e) => {
    setParamsData({ ...paramsData, password: e.target.value });
  };

  const handleChangeConfirmPassword = (e) => {
    setParamsData({ ...paramsData, confirm_password: e.target.value });
  };

  const handleChangeDob = (e) => {
    setParamsData({ ...paramsData, dob: e.target.value });
  };

  const handleChangeName = (e) => {
    setParamsData({ ...paramsData, name: e.target.value });
  };

  //input endpoint here
  const handleRegisterAccount = async () => {
    const { email, password, confirm_password, dob, name } = paramsData;
    if (!email || !password || !confirm_password || !dob || !name) return;
    if (confirm_password !== password) return;
    try {
      const response = axios.post(`${BACK_END_PORT}/endpoint`, {
        paramsData,
      });
      if (response.data.statusCode === 200) {
        router.push('/home');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Stack>
      return{' '}
      <Stack className={styles.signUpForm + ' ' + inter.className}>
        <Text className={styles.title}>Sign Up</Text>
        <Box>
          <Flex>
            <Input
              className={styles.inputField + ' ' + styles.userName}
              onChange={handleChangeEmail}
              placeholder='Account/Email'
              value={paramsData?.email}
            />
            <Box w={'55px'}></Box>
            <Input
              className={styles.inputField + ' ' + styles.userName}
              onChange={handleChangeName}
              placeholder='Name'
              value={paramsData?.name}
            />
          </Flex>
          <Flex>
            <InputGroup w={'379px'}>
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
            <Box w={'55px'}></Box>

            <Input
              className={styles.inputField + ' ' + styles.userName}
              onChange={handleChangeDob}
              placeholder='dd/mm/yy'
              type='date'
              value={paramsData?.dob}
            />
          </Flex>
          <Flex w={'90%'}>
            <InputGroup w={'379px'}>
              <InputRightElement
                height={'51px'}
                w={'51px'}
                onClick={() => setShowComfirmPassword(!showComfirmPassword)}
              >
                {showComfirmPassword ? (
                  <AiFillEye className={styles.eyeIcon} />
                ) : (
                  <AiOutlineEye className={styles.eyeIcon} />
                )}
              </InputRightElement>
              <Input
                type={showComfirmPassword ? 'text' : 'password'}
                placeholder='Repeat Password'
                className={styles.inputField + ' ' + styles.passWord}
                onChange={handleChangeConfirmPassword}
                value={paramsData?.confirm_password}
              />
            </InputGroup>
          </Flex>
        </Box>
        <Button className={styles.buttonSignIn} onClick={handleRegisterAccount}>
          REGISTER
        </Button>
      </Stack>
      <Text className={styles.signUpText}>
       Already have an account?{' '}
        <Link href={'/'} className={styles.link}>
          Sign In!
        </Link>
      </Text>
    </Stack>
  );
}

export default SignUpPage;
