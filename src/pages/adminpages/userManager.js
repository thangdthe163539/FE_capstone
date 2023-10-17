import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer, TableCaption,
    Box, Input, Stack, InputGroup, InputLeftAddon, Button, Center
} from '@chakra-ui/react'
import { useRouter } from 'next/router';
import { useState } from 'react';

function UserManager() {
    const router = useRouter();
    const [userData, setUserData] = useState([]);
    const handleSearchByEmail = async () => {
        var email = document.getElementById('email').value;

        if (email == '') {
            const url = 'http://localhost:5001/api/v1/Account'
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

    return <Box>
        <Stack spacing={4} style={{ width: '50%', marginLeft: '5%', marginTop: '3%' }}>
            <InputGroup size='lg'>
                <InputLeftAddon children='User: ' />
                <Input id='email' placeholder='Email' style={{ marginRight: '5%' }} />
                <Button children='Search' onClick={handleSearchByEmail} />
                <Button colorScheme='black' variant='link' style={{ marginLeft: '5%' }} onClick={handleToAddUser}>
                    Add new user
                </Button>
            </InputGroup>
        </Stack>
        <TableContainer>
            <Center>
                <Table variant='simple' style={{ marginTop: '5%', backgroundColor: 'white', width: '90%' }}>
                    <TableCaption>Imperial to metric conversion factors</TableCaption>
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