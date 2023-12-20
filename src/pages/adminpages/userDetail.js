import {
  Text,
  ModalBody,
  TableContainer,
  Center,
  Modal,
  Grid,
  Select,
  Table,
  ModalOverlay,
  ModalFooter,
  Thead,
  ModalContent,
  FormLabel,
  Input,
  ModalHeader,
  GridItem,
  Tr,
  FormErrorMessage,
  ModalCloseButton,
  Td,
  FormControl,
  Stack,
  Box,
  Button,
  Flex,
  Tbody,
} from '@chakra-ui/react';
import { Alert, AlertIcon } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import styles from '@/styles/admin.module.css';
import ToastCustom from '@/components/toast';

function UserDetail() {
  const router = useRouter();
  const [isOpenUD, setIsOpenUD] = useState(false);
  const [selectedOptionActive, setSelectedOptionActive] = useState('');
  const [selectedOptionRole, setSelectedOptionRole] = useState('');
  const [isSuccess, setIsSuccess] = useState('');
  const notificationTimeout = 2000;
  const [toast, setToast] = useState(false);
  const [roles, setRoles] = useState([]);

  //getData
  const query = router.asPath.split('?')[1];
  const decodedParams = JSON.parse(atob(query));
  const { email, role, roleid, status, name, accid } = decodedParams;

  useEffect(() => {
    const storedAccount = sessionStorage.getItem('account');
    if (storedAccount) {
      try {
        const accountDataDecode = JSON.parse(storedAccount);
        if (!accountDataDecode) {
        } else {
          if (accountDataDecode.roleId !== 1 || accountDataDecode.status == 3) {
            router.push('/page405');
          } else if (accountDataDecode.status == 2) {
            router.push('/ViewApplication');
          }
        }
      } catch (error) {}
    } else {
      router.push('/page405');
    }
  }, []);

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

  const [dataSubmit, setDataSubmit] = useState({
    name: name,
  });

  const [isFirst, setIsFirst] = useState({
    name: true,
  });
  const handleUpdateUser = () => {
    if (accid) {
      if (dataSubmit.name.trim() === '') {
        setToast(true);
        setTimeout(() => {
          setToast(false);
        }, 500);
        setIsFirst({ name: false, name: false });
        return;
      }
      const url = `http://localhost:5001/api/Account/Update_Account${accid}`;

      const email = document.getElementById('email1').value;
      const isActive = selectedOptionActive ? selectedOptionActive : status;
      const role = selectedOptionRole ? selectedOptionRole : roleid;

      const data = {
        name: dataSubmit?.name,
        email: email,
        status: parseInt(isActive),
        roleId: parseInt(role),
      };

      fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (response.ok) {
            setIsSuccess('true');
            setIsOpenUD(false);
          } else {
            setIsSuccess('false');
            setIsOpenUD(false);
          }
        })
        .catch((error) => {
          setIsSuccess('false');
          setIsOpenUD(false);
          console.error('Lỗi:', error);
        });
    } else {
      alert('Update failed(id)');
    }
  };

  const handleDelete = () => {
    const url = `http://localhost:5001/api/Account/DeleteAccountWith_key?accountId=${accid}`;
    fetch(url, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          setIsSuccess('true');
        } else {
          setIsSuccess('false');
        }
      })
      .catch((error) => {
        setIsSuccess('false');
        console.error('Lỗi:', error);
      });
  };

  const handleBackToList = () => {
    router.push('userManager');
  };

  useEffect(() => {
    if (isSuccess) {
      const hideNotification = setTimeout(() => {
        setIsSuccess('');
        router.push('userManager');
      }, notificationTimeout);

      return () => {
        clearTimeout(hideNotification);
      };
    }
  }, [isSuccess]);

  const handleChangeName = (e) => {
    const value = e.target.value;
    setIsFirst({ ...isFirst, name: false });
    setDataSubmit({ ...dataSubmit, name: value });
  };

  return (
    <>
      <Box
        style={{
          backgroundColor: 'white',
          width: 'auto',
          height: '100%',
          padding: '10px 20px',
        }}
      >
        <Flex>
          <Text
            fontSize='30px'
            color='black'
            style={{ marginLeft: '5%', marginTop: '2%' }}
          >
            User detail
          </Text>
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
        </Flex>

        <hr
          style={{
            borderTop: '1px solid #c4c4c4',
            width: '100%',
            marginTop: '0.5%',
          }}
        />
        <TableContainer>
          <Center>
            <Table
              variant='simple'
              style={{
                marginTop: '5%',
                backgroundColor: 'white',
                width: '90%',
              }}
            >
              <Thead>
                <Tr>
                  <Td style={{ width: '50px', textAlign: 'right' }}>Name:</Td>
                  <Td
                    style={{
                      fontWeight: 'bold',
                      color: '#344e74',
                      fontFamilyfTo: 'Sanchez',
                      textAlign: 'left',
                    }}
                  >
                    {name}
                  </Td>
                </Tr>
                <Tr>
                  <Td style={{ width: '50px', textAlign: 'right' }}>Email:</Td>
                  <Td
                    style={{
                      fontWeight: 'bold',
                      color: '#344e74',
                      fontFamilyfTo: 'Sanchez',
                      textAlign: 'left',
                    }}
                  >
                    {email}
                  </Td>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td style={{ width: '50px', textAlign: 'right' }}>Active:</Td>
                  <Td
                    style={{
                      fontWeight: 'bold',
                      color: '#344e74',
                      fontFamilyfTo: 'Sanchez',
                      textAlign: 'left',
                    }}
                  >
                    {status == 1
                      ? 'Active'
                      : status == 2
                      ? 'InActive'
                      : 'Locked'}
                  </Td>
                </Tr>
                <Tr>
                  <Td style={{ width: '50px', textAlign: 'right' }}>
                    Role Name:
                  </Td>
                  <Td
                    style={{
                      fontWeight: 'bold',
                      color: '#344e74',
                      fontFamilyfTo: 'Sanchez',
                      textAlign: 'left',
                    }}
                  >
                    {role}
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </Center>
        </TableContainer>

        <Button
          style={{ marginLeft: '7%', marginTop: '5%' }}
          onClick={() => setIsOpenUD(true)}
        >
          Edit
        </Button>
        <Button
          style={{ marginLeft: '0.5%', marginTop: '5%' }}
          onClick={handleDelete}
        >
          Delete
        </Button>
        <Button
          style={{ marginLeft: '0.5%', marginTop: '5%' }}
          onClick={handleBackToList}
        >
          Back to list
        </Button>
        <Modal
          isOpen={isOpenUD}
          onClose={() => setIsOpenUD(false)}
          closeOnOverlayClick={false}
          size='lg'
        >
          <ModalOverlay />
          <ModalContent maxW='800px'>
            <ModalHeader>Update user</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={8}>
              <Grid templateColumns='repeat(2, 1fr)' gap={8}>
                <GridItem colSpan={1}>
                  <Flex alignItems='center'>
                    <FormLabel style={{ width: '70px' }}>Email</FormLabel>
                    <Input
                      id='email1'
                      value={email}
                      isReadOnly
                      background={'whitesmoke'}
                    />
                  </Flex>
                </GridItem>
                <GridItem colSpan={1}>
                  <Flex alignItems='center'>
                    <FormLabel style={{ width: '50px' }}>Role</FormLabel>
                    <Select
                      value={selectedOptionRole}
                      onChange={(e) => setSelectedOptionRole(e.target.value)}
                    >
                      {roles
                        .sort((a, b) =>
                          a.roleId == roleid ? -1 : b.roleId == roleid ? 1 : 0,
                        )
                        .map((role1) => (
                          <option key={role1.roleId} value={role1.roleId}>
                            {role1.name}
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
                      <FormLabel style={{ width: '60px' }}>Name</FormLabel>
                      <Stack w={'100%'}>
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
                  <Flex alignItems='center'>
                    <FormLabel>Status</FormLabel>
                    <Select
                      value={selectedOptionActive}
                      onChange={(e) => {
                        setSelectedOptionActive(e.target.value);
                      }}
                    >
                      {status == 1 && (
                        <>
                          <option value={1}>Active</option>
                          <option value={2}>InActive</option>
                          <option value={3}>Locked</option>
                        </>
                      )}
                      {status == 2 && (
                        <>
                          <option value={2}>InActive</option>
                          <option value={1}>Active</option>
                          <option value={3}>Locked</option>
                        </>
                      )}
                      {status == 3 && (
                        <>
                          <option value={3}>Locked</option>
                          <option value={2}>InActive</option>
                          <option value={1}>Active</option>
                        </>
                      )}
                    </Select>
                  </Flex>
                </GridItem>
              </Grid>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={handleUpdateUser}>
                Save
              </Button>
              <Button onClick={() => setIsOpenUD(false)}>Cancel</Button>
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

export default UserDetail;
