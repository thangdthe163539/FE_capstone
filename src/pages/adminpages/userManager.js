import {
    Table, FormLabel,
    Thead, GridItem,
    Tbody, Grid, Alert,
    Tr, ModalBody, ModalFooter,
    ListItem, ModalCloseButton,
    List, ModalHeader,
    Flex, ModalContent,
    Spacer, ModalOverlay,
    Text, Modal, Select,
    Td, InputRightAddon,
    TableContainer, AlertIcon,
    Box, Input, Stack, InputGroup, Button, Center
} from '@chakra-ui/react'
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import styles from '@/styles/admin.module.css';

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

    const handleSearchTbInputChange = (e) => {
        setSearchQueryTb(e.target.value);
    };

    const filteAcc = () => {
        const query = searchQueryTb.toLowerCase();
        const filteredData = userData.filter((item) => {
            const name = item.name.toLowerCase();
            const email = item.email.toLowerCase();
            return name.includes(query) || email.includes(query);
        });
        setFilteredAccData(filteredData);
    };

    useEffect(() => {
        filteAcc();
      }, [searchQueryTb, userData]);

    const handleAddUser = () => {
        const url = 'http://localhost:5001/api/v1/Account/Register';

        const email = document.getElementById('email1').value;
        const name = document.getElementById('name').value;
        const isActive = selectedOptionActive === '' ? 1 : parseInt(selectedOptionActive);
        const roleId = selectedOptionRole === '' ? 1 : parseInt(selectedOptionRole);

        const data = {
            name: name,
            email: email,
            status: isActive,
            roleId: roleId
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (response.ok) {
                    setIsSuccess("true");
                    setIsOpenAdd(false);
                } else {
                    setIsSuccess("false");
                    setIsOpenAdd(false);
                }
            })
            .catch(error => {
                setIsSuccess("false");
                console.error('Lỗi:', error);
            });
    };


    useEffect(() => {
        const url = 'http://localhost:5001/api/roles/listRole';
        fetch(url, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                setRoles(data);
            })
            .catch(error => {
                console.error('Lỗi:', error);
            });
    }, []);

    const handleSearchByEmail = async () => {
        var email = document.getElementById('email').value;

        if (email == '') {
            const url = 'http://localhost:5001/api/v1/Account/ListAccount'
            fetch(url, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => {
                    setUserData(data);
                })
                .catch(error => {
                    console.error('Lỗi:', error);
                });
        } if (email != '') {
            const url = `http://localhost:5001/api/v1/Account/SearchByEmail?email=${email}`;
            fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => {
                    setUserData(data);
                })
                .catch(error => {
                    console.error('Lỗi:', error);
                });
        }
    };

    const handleToUserDetails = (email, roleName, roleid, status, name, accid) => {
        router.push(`userDetail?email=${email}&role=${roleName}&roleid=${roleid}&status=${status}&name=${name}&accid=${accid}`);
    };

    useEffect(() => {
        if (isSuccess) {
            const hideNotification = setTimeout(() => {
                setIsSuccess('');
                // window.location.reload();
            }, notificationTimeout);

            return () => {
                clearTimeout(hideNotification);
            };
        }
    }, [isSuccess]);

    return <Box className={styles.userBoxM}>
        <List className={styles.userListM}>
            <ListItem>
                <Link
                    href='/adminpages/adminhome'
                    _hover={{ textDecor: 'underline' }}
                    style={{ color: '#4d9ffe' }}
                >
                    Home
                </Link>
                <ArrowForwardIcon margin={1} style={{ color: 'black', pointerEvents: 'none' }}></ArrowForwardIcon>User Management
                <Text className={styles.alert1}>
                    {isSuccess === 'true' && (
                        <Alert status='success'>
                            <AlertIcon />
                            Add Success!
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
                    <Text className={styles.userTitle}>User Management</Text>
                    <Stack spacing={4} className={styles.userStackM}>
                        <InputGroup size='lg' style={{ marginLeft: '65%' }}>
                            <Input id='email' value={searchQueryTb}
                                onChange={handleSearchTbInputChange} placeholder='Email' style={{ marginRight: '0%', width: '20%', marginTop: '0.2%' }} />
                            <InputRightAddon className={styles.userSearchM} children='Search' onClick={handleSearchByEmail}></InputRightAddon>
                            <Button className={styles.userAddM} children='Add' onClick={() => setIsOpenAdd(true)} />
                        </InputGroup>
                    </Stack>
                    <Spacer></Spacer>
                </Flex>
            </ListItem>
        </List>

        <TableContainer>
            <Text className={styles.userTextTotalM}>Total {filteredAccData.length} users found : </Text>
            <Center>
                <Table variant='simple' style={{ marginTop: '2%', width: '90%' }}>
                    <Thead>
                        <Tr style={{ fontWeight: 'bold', color: '#344e74', fontFamilyfTo: 'Sanchez', backgroundColor: 'whitesmoke' }}>
                            <Td>No</Td>
                            <Td>Name </Td>
                            <Td>Email</Td>
                            <Td>Active</Td>
                            <Td>Role</Td>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredAccData.map((user, index) => (
                            <Tr key={user.id}>
                                <Td>{index + 1}</Td>
                                <Td style={{ width: '20%' }}><Button color={'blue'} variant='link' onClick={() => handleToUserDetails(user.email, user.roleName, user.roleId, user.status, user.name, user.accId)}>{user.name}</Button></Td>
                                <Td style={{ width: '30%' }}>{user.email}</Td>
                                <Td>{user.status === 1 ? 'Active' : user.status === 3 ? 'InActive' : ''}</Td>
                                <Td style={{ width: '15%' }}>{user.roleName}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Center>
        </TableContainer>

        <Modal
            isOpen={isOpenAdd}
            onClose={() => (setIsOpenAdd(false))}
            closeOnOverlayClick={false}
            size='lg'
        >
            <ModalOverlay />
            <ModalContent maxW="800px">
                <ModalHeader>Create New User</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={8}>
                    <Grid templateColumns='repeat(2, 1fr)' gap={8}>
                        <GridItem colSpan={1}>
                            <Flex alignItems="center">
                                <FormLabel style={{ width: '50px' }}>Email</FormLabel>
                                <Input id='email1' />
                            </Flex>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <Flex alignItems="center">
                                <FormLabel style={{ width: '50px' }}>Role</FormLabel>
                                <Select value={selectedOptionRole} onChange={(e) => setSelectedOptionRole(e.target.value)}>
                                    {roles.map(role => (
                                        <option key={role.roleId} value={role.roleId}>
                                            {role.name}
                                        </option>
                                    ))}
                                </Select>
                            </Flex>
                        </GridItem>
                    </Grid>
                    <Grid templateColumns='repeat(2, 1fr)' gap={8} style={{ marginTop: '10px' }}>
                        <GridItem colSpan={1}>
                            <Flex alignItems="center">
                                <FormLabel style={{ width: '50px' }}>Name</FormLabel>
                                <Input id='name' />
                            </Flex>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <Flex alignItems="center">
                                <FormLabel>Active</FormLabel>
                                <Select
                                    value={selectedOptionActive}
                                    onChange={(e) => {
                                        setSelectedOptionActive(e.target.value);
                                    }}
                                >
                                    <option value= {1}>Active</option>
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
                    <Button onClick={() => (setIsOpenAdd(false))}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </Box>;
}

export default UserManager;