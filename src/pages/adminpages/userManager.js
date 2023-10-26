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
    TableContainer, TableCaption,
    Box, Input, Stack, InputGroup, InputLeftAddon, Button, Center
} from '@chakra-ui/react'
import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { color } from 'framer-motion';

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
    return <Box style={{ backgroundColor: 'white', width: 'auto', height: '100%', padding: '10px 20px' }}>
        <List style={{ height: '100%', padding: '10px 0px', alignItems: 'center', fontSize: '18px', borderBottom: '1px solid #c4c4c4' }}>
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
            <hr style={{ borderTop: '1px solid #c4c4c4', width: '100%', marginTop: '0.5%' }} />
            <ListItem>
                <Flex>
                    <Text style={{ color: 'black', marginTop: '0.2%', width: '300px', fontSize: '30px' }}>User Management</Text>
                    <Stack spacing={4} style={{ width: '100%', marginTop: '0.2%' }}>
                        <InputGroup size='lg' style={{ marginLeft: '65%' }}>
                            <Input id='email' placeholder='Email' style={{ marginRight: '0%', width: '20%', marginTop: '0.2%' }} />
                            <InputRightAddon style={{
                                marginRight: '0.3%',
                                width: '7%',
                                marginTop: '0.2%',
                                transition: 'color 0.3s',
                                cursor: 'pointer',
                            }}
                                children='Search'
                                className="hover-effect" onClick={handleSearchByEmail}></InputRightAddon>
                            <Button style={{ width: '6%', marginTop: '0.2%' }} children='Add' onClick={handleToAddUser} />
                        </InputGroup>
                    </Stack>
                    <Spacer></Spacer>
                </Flex>
            </ListItem>
        </List>
        <TableContainer>
            <Text style={{ color: '#4d9ffe', marginTop: '2%', marginLeft: '0%', fontSize: '20px' }}>Total {userData.length} user found : </Text>
            <Center>
                <Table variant='simple' style={{ marginTop: '2%', width: '90%' }}>
                    <Thead>
                        <Tr style={{ fontWeight: 'bold', color: '#344e74', fontFamilyfTo: 'Sanchez', backgroundColor: 'whitesmoke' }}>
                            <Td>Name </Td>
                            <Td>Email</Td>
                            <Td>Active</Td>
                            <Td>Role</Td>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {userData.map(user => (
                            <Tr key={user.id}>
                                <Td><Button color={'blue'} variant='link' onClick={() => handleToUserDetails(user.email, user.roleName, user.roleId, user.status, user.name, user.accId)}>{user.name}</Button></Td>
                                <Td style={{ width: '35%' }}>{user.email}</Td>
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