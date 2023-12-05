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
  ModalHeader,
  Flex,
  ModalContent,
  Spacer,
  ModalOverlay,
  Text,
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
  Center, InputLeftElement,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Pagination from '@/components/pagination';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowForwardIcon, EmailIcon } from '@chakra-ui/icons';
import styles from '@/styles/admin.module.css';
import { FaPlus } from 'react-icons/fa';
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
    }else{
      setDynamicList([])
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

  const handleAddUser = () => {
    const url = 'http://localhost:5001/api/Account/Register';

    const email = document.getElementById('email1').value;
    const name = document.getElementById('name').value;
    const isActive =
      selectedOptionActive === '' ? 1 : parseInt(selectedOptionActive);
    const roleId = selectedOptionRole === '' ? 1 : parseInt(selectedOptionRole);

    const data = {
      name: name,
      email: email,
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
    router.push(
      `userDetail?email=${email}&role=${roleName}&roleid=${roleid}&status=${status}&name=${name}&accid=${accid}`,
    );
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

  return (
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
          <Text className={styles.alert1}>
            {isSuccess === 'true' && (
              <Alert status='success'>
                <AlertIcon />
                Your request successfully!
              </Alert>
            )}
            {isSuccess === 'false' && (
              <Alert status='error'>
                <AlertIcon />
                Error processing your request.
              </Alert>
            )}
          </Text>
        </ListItem>

        <hr className={styles.userHrM} />
        <ListItem>
          <Flex>
            <Text style={{ width: '80vw' }} className={styles.userTitle}>
              User management
            </Text>
            <InputGroup style={{ paddingTop: '0.6%', width: '25%' }}>
              <InputLeftElement
                pointerEvents="none"
                children={<EmailIcon color="gray.300" boxSize={5} />}
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
                style={{ marginRight: '0%', width: '100%', marginTop: '0.7%' }}
              />
            </InputGroup>
            <Button
              style={{ marginTop: '0.7%' }}
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
                <Td>Name </Td>
                <Td>Email</Td>
                <Td>Role</Td>
                <Td>Active</Td>
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
                <Flex alignItems='center'>
                  <FormLabel style={{ width: '15%' }}>Email</FormLabel>
                  <Input id='email1'  autoComplete="off"/>
                </Flex>
              </GridItem>
              <GridItem colSpan={1}>
                <Flex alignItems='center'>
                  <FormLabel style={{ width: '15%' }}>Role</FormLabel>
                  <Select 
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
                <Flex alignItems='center'>
                  <FormLabel style={{ width: '15%' }}>Name</FormLabel>
                  <Input id='name'  autoComplete="off"/>
                </Flex>
              </GridItem>
              <GridItem colSpan={1}>
                <Flex alignItems='center'>
                  <FormLabel>Active</FormLabel>
                  <Select
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
  );
}

export default UserManager;
