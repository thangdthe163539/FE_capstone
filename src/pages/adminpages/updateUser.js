import {
    Table, Text,
    Thead,
    Tbody, Select,
    Tr, InputGroup,
    InputLeftAddon,
    Input, Button,
    TableContainer, TableCaption,
    Box,
    Flex,
} from '@chakra-ui/react'
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import styles from '@/styles/admin.module.css';
import {
    Alert,
    AlertIcon,
} from '@chakra-ui/react'
function UpdateUser() {
    const router = useRouter();
    const { name, email, status, roleid } = router.query;
    const [id, setId] = useState(null);
    const [name1, setName] = useState('');
    const [selectedOptionActive, setSelectedOptionActive] = useState('');
    const [selectedOptionRole, setSelectedOptionRole] = useState('');
    const [roles, setRoles] = useState([]);
    const [isSuccess, setIsSuccess] = useState('');
    const notificationTimeout = 2000;

    const handleBackToList = () => {
        router.push('userManager');
    };


    const handleNameChange = (event) => {
        setName(event.target.value);
    };
    useEffect(() => {
        setName(name);
    }, [name]);


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

    useEffect(() => {
        const url = `http://localhost:5001/api/v1/Account/SearchByEmail?email=${email}`;
        fetch(url, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                const id = data[0].accId;
                setId(id);
            })
            .catch(error => {
                console.error('Lỗi:', error);
            });
    }, []);

    const handleUpdateUser = () => {
        if (id) {
            const url = `http://localhost:5001/api/v1/Account/Update_Accpunt${id}`;

            const email = document.getElementById('email').value;
            const isActive = selectedOptionActive !== '' ? selectedOptionActive === 'true' : status === 'true';
            const name = document.getElementById('name').value;
            const role = selectedOptionRole ? selectedOptionRole : roleid;

            const data = {
                name: name,
                email: email,
                status: Boolean(isActive),
                roleId: parseInt(role)
            };

            fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
                .then(response => {
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
        } else {
            alert('Update failed(id)');
        }

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
                Update User

            </Text>
            <Text className={styles.alert}>
                {isSuccess === 'true' && (
                    <Alert status='success'>
                        <AlertIcon />
                        Update Success!
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
                <TableCaption><Button style={{ marginTop: '2%' }} onClick={handleUpdateUser}>Update</Button></TableCaption>
                <Thead>
                    <Tr>
                        <InputGroup size='lg'>
                            <InputLeftAddon children='Email ' style={{ width: '10%' }} />
                            <Input id='email' value={email} placeholder='' style={{ width: '40%' }} readOnly />
                        </InputGroup>
                    </Tr>
                </Thead>
                <Tbody>
                    <InputGroup size='lg'>
                        <InputLeftAddon children='Role ' style={{ width: '10%' }} />
                        <Select
                            style={{ width: '25%' }}
                            value={selectedOptionRole}
                            onChange={(e) => setSelectedOptionRole(e.target.value)}
                            size='0%'
                        >
                            {roles
                                .sort((a, b) => (a.roleId == roleid ? -1 : b.roleId == roleid ? 1 : 0))
                                .map(role1 => (
                                    <option key={role1.roleId} value={role1.roleId}>
                                        {role1.name}
                                    </option>
                                ))}
                        </Select>
                    </InputGroup>

                    <InputGroup size='lg'>
                        <InputLeftAddon children='Name ' style={{ width: '10%' }} />
                        <Input id='name' value={name1} placeholder='' style={{ width: '40%' }} onChange={handleNameChange} />
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
                            {status === 'true' && (
                                <>
                                    <option value='true'>Active</option>
                                    <option value='false'>InActive</option>
                                </>
                            )}
                            {status === 'false' && (
                                <>
                                    <option value='false'>InActive</option>
                                    <option value='true'>Active</option>
                                </>
                            )}
                        </Select>
                    </InputGroup>
                </Tbody>
            </Table>
        </TableContainer>
        <Button style={{ marginLeft: '5%', marginTop: '2%' }} onClick={handleBackToList}>Back to List</Button>

    </Box>;
}
export default UpdateUser;