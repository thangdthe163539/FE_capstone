import {
    Table,
    Thead,
    Tbody,
    Tr,
    ListItem,
    List,
    Flex,
    Spacer,
    Th,
    Td,
    TableContainer, TableCaption,
    Box, Input, Stack, InputGroup, InputLeftAddon, Button, Center
} from '@chakra-ui/react'
import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowForwardIcon } from '@chakra-ui/icons';

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

    const handleToUserDetails = (email, role) => {
        router.push(`userDetail?email=${email}&role=${role}`);
    };

    const handleToAddUser = () => {
        router.push('addUser');
    };

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
                <ArrowForwardIcon margin={1} style={{ color: 'black', pointerEvents: 'none' }}></ArrowForwardIcon>Management User
            </ListItem>
            <hr style={{ borderTop: '1px solid #c4c4c4', width: '100%', marginTop: '0.5%' }} />
            <ListItem>
                <Flex>
                    <Stack spacing={4} style={{ width: '100%', marginTop: '0.2%' }}>
                        <InputGroup size='lg'>
                            <InputLeftAddon style={{ color: 'black', marginTop: '0.2%' }} fontSize='2xl' children='Management User: ' />
                            <Input id='email' placeholder='Email' style={{ marginRight: '5%', width: '100%', marginTop: '0.2%' }} />
                            <Button style={{ marginRight: '3%', width: '30%', marginTop: '0.2%' }} children='Search' onClick={handleSearchByEmail} />
                            <Button style={{ width: '30%', marginTop: '0.2%' }} children='Add User' onClick={handleToAddUser} />
                        </InputGroup>
                    </Stack>
                    <Spacer></Spacer>
                </Flex>
            </ListItem>
        </List>
        <TableContainer>
            <Center>
                <Table variant='simple' style={{ marginTop: '5%', backgroundColor: 'white', width: '90%', marginLeft: '10%' }}>
                    <TableCaption>Total {userData.length} user</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>Login</Th>
                            <Th>IsActive</Th>
                            <Th>Role Name</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {userData.map(user => (
                            <Tr key={user.id}>
                                <Td><Button color={'blue'} variant='link' onClick={() => handleToUserDetails(user.email, user.role_Name)}>{user.email}</Button></Td>
                                <Td>True</Td>
                                <Td>{user.role_Name}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Center>
        </TableContainer>
    </Box>;
}

export default UserManager;