import {
    Table, Text,
    Thead,
    Tbody, Select,
    Tr, InputGroup,
    InputLeftAddon,
    Input, Button,
    TableContainer, TableCaption,
    Box, Flex
} from '@chakra-ui/react'
import {
    Alert,
    AlertIcon,
} from '@chakra-ui/react'
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import styles from '@/styles/admin.module.css';

function AddUser() {
    const router = useRouter();
    const [isSuccess, setIsSuccess] = useState('');
    const notificationTimeout = 2000;

    const handleBackToList = () => {
        router.push('userManager');
    };

    const [selectedOptionActive, setSelectedOptionActive] = useState('');
    const [selectedOptionRole, setSelectedOptionRole] = useState('');
    const [roles, setRoles] = useState([]);

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


    const handleAddUser = () => {
        const url = 'http://localhost:5001/api/v1/Account/Register';

        const email = document.getElementById('email').value;
        const name = document.getElementById('name').value;
        const isActive = selectedOptionActive === '' ? true : selectedOptionActive === 'true';
        const roleId = selectedOptionRole === '' ? 1 : parseInt(selectedOptionRole);

        const data = {
            name: name,
            email: email,
            status: isActive,
            roleId: roleId
        };
        console.log(data);

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                console.log(response);
                if (response.ok) {
                    setIsSuccess("true");
                } else {
                    setIsSuccess("false");
                }
            })
            .catch(error => {
                setIsSuccess("false");
                console.error('Lỗi:', error);
            });
    };

    useEffect(() => {
        if (isSuccess) {
            const hideNotification = setTimeout(() => {
                setIsSuccess('');
            }, notificationTimeout);

            return () => {
                clearTimeout(hideNotification);
            };
        }
    }, [isSuccess]);

    return <Box style={{ backgroundColor: 'white', width: 'auto', height: '100%', padding: '10px 20px' }}>
        <Flex>
            <Text fontSize='30px' color='black' style={{ marginLeft: '5%', marginTop: '2%', backgroundColor: 'white', width: '50%' }}>
                Add User
            </Text>
            <Text className={styles.alert}>
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
        </Flex>
        <hr style={{ borderTop: '1px solid #c4c4c4', width: '100%', marginTop: '0.5%' }} />

        <TableContainer>
            <Table variant='simple' style={{ marginTop: '2%', marginLeft: '5%', backgroundColor: 'white', width: '50%' }}>
                <TableCaption><Button style={{ marginTop: '2%' }} onClick={handleAddUser}>Create</Button></TableCaption>
                <Thead>
                    <Tr>
                        <InputGroup size='lg'>
                            <InputLeftAddon children='Email ' style={{ width: '10%' }} />
                            <Input id='email' placeholder='' style={{ width: '40%' }} />
                            <Text fontSize='110%' color='black' style={{ marginLeft: '2%', marginTop: '1%' }}>@fpt.edu.vn</Text>
                        </InputGroup>
                    </Tr>
                </Thead>
                <Tbody>
                    <InputGroup size='lg'>
                        <InputLeftAddon children='Role ' style={{ width: '10%' }} />
                        <Select style={{ width: '25%' }} value={selectedOptionRole} onChange={(e) => setSelectedOptionRole(e.target.value)} size='8%'>
                            {roles.map(role => (
                                <option key={role.roleId} value={role.roleId}>
                                    {role.name}
                                </option>
                            ))}
                        </Select>
                    </InputGroup>

                    <InputGroup size='lg'>
                        <InputLeftAddon children='Name ' style={{ width: '10%' }} />
                        <Input id='name' placeholder='' style={{ width: '40%' }} />
                    </InputGroup>

                    <InputGroup size='lg'>
                        <InputLeftAddon children='Active ' style={{ width: '10%' }} />
                        <Select
                            style={{ width: '15%' }}
                            value={selectedOptionActive}
                            onChange={(e) => {
                                setSelectedOptionActive(e.target.value);
                            }}
                            size='8%'
                        >
                            <option value='true'>Active</option>
                            <option value='false'>Inactive</option>
                        </Select>
                    </InputGroup>
                </Tbody>
            </Table>
        </TableContainer>
        <Button style={{ marginLeft: '5%', marginTop: '2%' }} onClick={handleBackToList}>Back to List</Button>

    </Box>;
}

export default AddUser;