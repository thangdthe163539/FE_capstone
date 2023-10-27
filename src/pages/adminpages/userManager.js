import {
    Table,
    Thead,
    Tbody,
    Tr,
    ListItem,
    List,
    Flex,
    Spacer,
    Text,
    Td, InputRightAddon,
    TableContainer,
    Box, Input, Stack, InputGroup, Button, Center
} from '@chakra-ui/react'
import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import styles from '@/styles/admin.module.css';

function UserManager() {
    const router = useRouter();
    const [userData, setUserData] = useState([]);
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

    console.log(userData + "dsad");
    const handleToUserDetails = (email, roleName, roleid, status, name, accid) => {
        router.push(`userDetail?email=${email}&role=${roleName}&roleid=${roleid}&status=${status}&name=${name}&accid=${accid}`);
    };

    const handleToAddUser = () => {
        router.push('addUser');
    };
    console.log(userData);
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
            </ListItem>
            <hr className={styles.userHrM} />
            <ListItem>
                <Flex>
                    <Text className={styles.userTitle}>User Management</Text>
                    <Stack spacing={4} className={styles.userStackM}>
                        <InputGroup size='lg' style={{ marginLeft: '65%' }}>
                            <Input id='email' placeholder='Email' style={{ marginRight: '0%', width: '20%', marginTop: '0.2%' }} />
                            <InputRightAddon className={styles.userSearchM} children='Search' onClick={handleSearchByEmail}></InputRightAddon>
                            <Button className={styles.userAddM} children='Add' onClick={handleToAddUser} />
                        </InputGroup>
                    </Stack>
                    <Spacer></Spacer>
                </Flex>
            </ListItem>
        </List>

        <TableContainer>
            <Text className={styles.userTextTotalM}>Total {userData.length} users found : </Text>
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
                        {userData.map((user, index) => (
                            <Tr key={user.id}>
                                <Td>{index + 1}</Td>
                                <Td style={{width: '20%'}}><Button color={'blue'} variant='link' onClick={() => handleToUserDetails(user.email, user.roleName, user.roleId, user.status, user.name, user.accId)}>{user.name}</Button></Td>
                                <Td style={{ width: '30%' }}>{user.email}</Td>
                                <Td>{user.status ? 'true' : 'false'}</Td>
                                <Td style={{ width: '15%' }}>{user.roleName}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Center>
        </TableContainer>
    </Box>;
}

export default UserManager;