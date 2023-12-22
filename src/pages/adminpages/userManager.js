import {
  Table,
  FormLabel,
  Thead,
  GridItem,
  Tbody,
  Grid,
  Alert,
  Tr,
  ModalBody,
  ModalFooter,
  ListItem,
  ModalCloseButton,
  List,
  FormErrorMessage,
  ModalHeader,
  Flex,
  ModalContent,
  Spacer,
  ModalOverlay,
  Text,
  FormControl,
  Modal,
  Select,
  Td,
  InputRightAddon,
  IconButton,
  TableContainer,
  AlertIcon,
  TableCaption,
  Box,
  Input,
  Stack,
  InputGroup,
  Button,
  Center,
  InputLeftElement,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Pagination from '@/components/pagination';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowForwardIcon, EmailIcon } from '@chakra-ui/icons';
import styles from '@/styles/admin.module.css';
import { FaPlus } from 'react-icons/fa';
import ToastCustom from '@/components/toast';
function UserManager() {
  const router = useRouter();
  const [userData, setUserData] = useState([]);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [selectedOptionActive, setSelectedOptionActive] = useState('');
  const [selectedOptionRole, setSelectedOptionRole] = useState('');
  const [roles, setRoles] = useState([]);
  const [isSuccess, setIsSuccess] = useState('');
  const [filteredAccData, setFilteredAccData] = useState([]);
  const [searchQueryTb, setSearchQueryTb] = useState('');
  const notificationTimeout = 2000;

  useEffect(() => {
    // Access sessionStorage on the client side
    const storedAccount = sessionStorage.getItem('account');
    if (storedAccount) {
      try {
        const accountDataDecode = JSON.parse(storedAccount);
        if (!accountDataDecode) {
          // router.push('/page405');
        } else {
          if (accountDataDecode.roleId !== 1 || accountDataDecode.status !== 1) {
            router.push('/page405');
          }
        }
      } catch (error) {
        // router.push('/page405');
      }
    } else {
      router.push('/page405');
    }
  }, []);

  const itemPerPage = 5;
  const [dynamicList, setDynamicList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  // filteredIssueData;
  const handleChangePage = (page) => {
    setCurrentPage(page);
    let newList = [];
    for (let i = (page - 1) * itemPerPage; i < page * itemPerPage; i++) {
      if (filteredAccData[i]) {
        newList.push(filteredAccData[i]);
      }
    }
    setDynamicList(newList);
  };
  const totalPages = filteredAccData ? filteredAccData?.length : 0;

  useEffect(() => {
    if (filteredAccData.length) {
      handleChangePage(1);
    } else {
      setDynamicList([]);
    }
  }, [filteredAccData]);

  const handleSearchTbInputChange = (e) => {
    setSearchQueryTb(e.target.value);
  };

  const filteAcc = () => {
    const query = searchQueryTb.toLowerCase();
    const filteredData = userData.filter((item) => {
      const email = item.email.toLowerCase();
      return email.includes(query);
    });
    setFilteredAccData(filteredData);
  };

  useEffect(() => {
    filteAcc();
  }, [searchQueryTb, userData]);

  useEffect(() => {
    const url = 'http://localhost:5001/api/roles/listRole';
    fetch(url, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        setRoles(data);
      })
      .catch((error) => {
        console.error('Lỗi:', error);
      });
  }, []);

  const handleSearchByEmail = async () => {
    var email = document.getElementById('email').value;

    if (email == '') {
      const url = 'http://localhost:5001/api/Account/ListAccount';
      fetch(url, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((data) => {
          setUserData(data);
        })
        .catch((error) => {
          console.error('Lỗi:', error);
        });
    }
    if (email != '') {
      const url = `http://localhost:5001/api/Account/SearchByEmail?email=${email}`;
      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUserData(data);
        })
        .catch((error) => {
          console.error('Lỗi:', error);
        });
    }
  };

  const handleToUserDetails = (
    email,
    roleName,
    roleid,
    status,
    name,
    accid,
  ) => {
    const randomParameter = Math.random().toString(36).substring(2);
    const params = {
      email: email,
      role: roleName,
      roleid: roleid,
      status: status,
      name: name,
      accid: accid,
      softrack: randomParameter,
    };
    const encodedParams = btoa(JSON.stringify(params));
    const url = `userDetail?${encodedParams}`;
    router.push(url);
  };

  useEffect(() => {
    if (isSuccess) {
      const hideNotification = setTimeout(() => {
        setIsSuccess('');
        handleSearchByEmail();
      }, notificationTimeout);

      return () => {
        clearTimeout(hideNotification);
      };
    }
  }, [isSuccess]);

  const [dataSubmit, setDataSubmit] = useState({
    email: '',
    name: '',
  });

  const [isFirst, setIsFirst] = useState({
    email: true,
    name: true,
  });

  const handleChangeName = (e) => {
    const value = e.target.value;
    setIsFirst({ ...isFirst, name: false });
    setDataSubmit({ ...dataSubmit, name: value });
  };

  const handleChangeEmail = (e) => {
    const value = e.target.value;
    setIsFirst({ ...isFirst, email: false });
    setDataSubmit({ ...dataSubmit, email: value });
  };

  const [toast, setToast] = useState(false);

  const handleAddUser = () => {
    if (dataSubmit.email.trim() === '' || dataSubmit.name.trim() === '') {
      setToast(true);
      setTimeout(() => {
        setToast(false);
      }, 500);
      setIsFirst({ name: false, email: false });
      return;
    }
    const url = 'http://localhost:5001/api/Account/Register';
    const isActive =
      selectedOptionActive === '' ? 1 : parseInt(selectedOptionActive);
    const roleId = selectedOptionRole === '' ? 1 : parseInt(selectedOptionRole);

    const data = {
      name: dataSubmit?.name,
      email: dataSubmit?.email,
      status: isActive,
      roleId: roleId,
    };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          setIsSuccess('true');
          setIsOpenAdd(false);
        } else {
          setIsSuccess('false');
          setIsOpenAdd(false);
        }
      })
      .catch((error) => {
        setIsSuccess('false');
        console.error('Lỗi:', error);
      });
  };

  return (
    <>
      <Box className={styles.userBoxM}>
        <List className={styles.userListM}>
          <ListItem>
            <Link
              href='/adminpages/adminhome'
              _hover={{ textDecor: 'underline' }}
              style={{ color: '#4d9ffe' }}
            >
              Home
            </Link>
            <ArrowForwardIcon
              margin={1}
              style={{ color: 'black', pointerEvents: 'none' }}
            ></ArrowForwardIcon>
            User management
            {isSuccess === 'true' ? (
              <ToastCustom
                title={'Your request successfully!'}
                description={''}
                status={'success'}
              />
            ) : null}
            {isSuccess === 'false' ? (
              <ToastCustom
                title={'Error processing your request.'}
                description={''}
                status={'error'}
              />
            ) : null}
          </ListItem>

          <hr className={styles.userHrM} />
          <ListItem>
            <Flex>
              <Text style={{ width: '80vw' }} className={styles.userTitle}>
                User management
              </Text>
              <InputGroup style={{ paddingTop: '0.6%', width: '25%' }}>
                <InputLeftElement
                  pointerEvents='none'
                  children={<EmailIcon color='gray.300' boxSize={5} />}
                  style={{
                    position: 'absolute',
                    top: '60%',
                    transform: 'translateY(-50%)',
                    left: '2px',
                  }}
                />
                <Input
                  id='email'
                  value={searchQueryTb}
                  onChange={handleSearchTbInputChange}
                  placeholder='Email'
                  style={{
                    marginRight: '0%',
                    width: '100%',
                    marginTop: '0.7%',
                  }}
                />
              </InputGroup>
              <Button
                mt={'0.7%'}
                ml={'10px'}
                className={styles.userSearchM}
                onClick={handleSearchByEmail}
              >
                Search
              </Button>
              <Box>
                <IconButton
                  style={{ marginTop: '23%' }}
                  aria-label='Add'
                  icon={<FaPlus />}
                  colorScheme='gray'
                  marginRight={1}
                  onClick={() => setIsOpenAdd(true)}
                />
              </Box>
              <Spacer></Spacer>
            </Flex>
          </ListItem>
        </List>

        <TableContainer>
          <Text fontSize='20px' marginTop={2}>
            Total {filteredAccData.length} user(s) found:{' '}
          </Text>
          <Center>
            <Table variant='simple' style={{ marginTop: '2%', width: '80%' }}>
              <TableCaption>
                <Flex alignItems={'center'} justifyContent={'space-between'}>
                  <Text>
                    Show {dynamicList.length}/{filteredAccData.length} result(s)
                  </Text>{' '}
                  <Pagination
                    current={currentPage}
                    onChange={handleChangePage}
                    total={totalPages}
                    pageSize={itemPerPage}
                  />
                </Flex>
              </TableCaption>
              <Thead>
                <Tr
                  style={{
                    fontWeight: 'bold',
                    color: '#344e74',
                    fontFamilyfTo: 'Sanchez',
                    backgroundColor: 'whitesmoke',
                  }}
                >
                  <Td>No</Td>
                  <Td>Name</Td>
                  <Td>Email</Td>
                  <Td>Role</Td>
                  <Td>Status</Td>
                </Tr>
              </Thead>
              <Tbody>
                {dynamicList.map((user, index) => (
                  <Tr key={user.accId}>
                    <Td style={{ width: '5%' }}>{index + 1}</Td>
                    <Td style={{ width: '20%' }}>
                      <Button
                        color={'blue'}
                        variant='link'
                        onClick={() =>
                          handleToUserDetails(
                            user.email,
                            user.roleName,
                            user.roleId,
                            user.status,
                            user.name,
                            user.accId,
                          )
                        }
                      >
                        {user.name}
                      </Button>
                    </Td>
                    <Td style={{ width: '32%' }}>{user.email}</Td>
                    <Td style={{ width: '25%' }}>{user.roleName}</Td>
                    <Td style={{ width: '10%' }}>
                      {user.status === 1
                        ? 'Active'
                        : user.status === 2
                        ? 'Inactive'
                        : user.status === 3
                        ? 'Locked'
                        : 'Deleted'}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Center>
        </TableContainer>

        <Modal
          isOpen={isOpenAdd}
          onClose={() => setIsOpenAdd(false)}
          closeOnOverlayClick={false}
          size='lg'
        >
          <ModalOverlay />
          <ModalContent maxW='50%'>
            <ModalHeader>Create new user</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={8}>
              <Grid templateColumns='repeat(2, 1fr)' gap={8}>
                <GridItem colSpan={1}>
                  <FormControl
                    isRequired={true}
                    isInvalid={
                      isFirst?.email
                        ? false
                        : dataSubmit?.email === ''
                        ? true
                        : false
                    }
                  >
                    <Flex alignItems='center'>
                      <FormLabel style={{ width: '16%' }}>Email</FormLabel>
                      <Stack>
                        <Input
                          maxLength={255}
                          id='email1'
                          type='email'
                          value={dataSubmit?.email}
                          onChange={handleChangeEmail}
                        />
                        {(isFirst?.email
                          ? false
                          : dataSubmit?.email === ''
                          ? true
                          : false) && (
                          <FormErrorMessage mt={0}>
                            Email is required.
                          </FormErrorMessage>
                        )}
                      </Stack>
                    </Flex>
                  </FormControl>
                </GridItem>
                <GridItem colSpan={1}>
                  <Flex alignItems='center' justifyContent={'space-between'}>
                    <FormLabel style={{ width: '15%' }}>Role</FormLabel>
                    <Select
                      width={'80%'}
                      value={selectedOptionRole}
                      onChange={(e) => setSelectedOptionRole(e.target.value)}
                    >
                      {roles.map((role) => (
                        <option key={role.roleId} value={role.roleId}>
                          {role.name}
                        </option>
                      ))}
                    </Select>
                  </Flex>
                </GridItem>
              </Grid>
              <Grid
                templateColumns='repeat(2, 1fr)'
                gap={8}
                style={{ marginTop: '10px' }}
              >
                <GridItem colSpan={1}>
                  <FormControl
                    isRequired={true}
                    isInvalid={
                      isFirst?.name
                        ? false
                        : dataSubmit?.name === ''
                        ? true
                        : false
                    }
                  >
                    <Flex alignItems='center'>
                      <FormLabel style={{ width: '16%' }}>Name</FormLabel>
                      <Stack>
                        <Input
                          maxLength={255}
                          id='name'
                          value={dataSubmit?.name}
                          onChange={handleChangeName}
                        />
                        {(isFirst?.name
                          ? false
                          : dataSubmit?.name === ''
                          ? true
                          : false) && (
                          <FormErrorMessage mt={0}>
                            Name is required.
                          </FormErrorMessage>
                        )}
                      </Stack>
                    </Flex>
                  </FormControl>
                </GridItem>
                <GridItem colSpan={1}>
                  <Flex alignItems='center' justifyContent={'space-between'}>
                    <FormLabel>Status</FormLabel>
                    <Select
                      width={'80%'}
                      value={selectedOptionActive}
                      onChange={(e) => {
                        setSelectedOptionActive(e.target.value);
                      }}
                    >
                      <option value={1}>Active</option>
                      <option value={2}>Inactive</option>
                    </Select>
                  </Flex>
                </GridItem>
              </Grid>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={handleAddUser}>
                Save
              </Button>
              <Button onClick={() => setIsOpenAdd(false)}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
      {toast ? (
        <ToastCustom
          title={'Some fields is empty'}
          description={'Please re-check the fields'}
          status='error'
        />
      ) : null}
    </>
  );
}

export default UserManager;
