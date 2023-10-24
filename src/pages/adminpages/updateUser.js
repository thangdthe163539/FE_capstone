import {
    Table, Text,
    Thead,
    Tbody, Select,
    Tr, InputGroup,
    InputLeftAddon,
    Input, Button,
    TableContainer, TableCaption,
    Box
} from '@chakra-ui/react'
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

function UpdateUser() {
    const router = useRouter();
    const { emailEdit } = router.query;
    const [id, setId] = useState(null);
    const handleBackToList = () => {
        router.push('userManager');
    };

    const [selectedOptionActive, setSelectedOptionActive] = useState('');
    const [selectedOptionRole, setSelectedOptionRole] = useState('');
    const [roles, setRoles] = useState([]);
    useEffect(() => {
        const url = 'http://localhost:5001/api/roles';
        fetch(url, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                setRoles(data); // Lưu danh sách các roles vào state
            })
            .catch(error => {
                console.error('Lỗi:', error);
            });
    }, []);

    useEffect(() => {
        const url = `http://localhost:5001/api/v1/Account/SearchByEmail?email=${emailEdit}`;
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
            const isActive = selectedOptionActive;
            const roleName = selectedOptionRole;

            const data = {
                account1: isActive,
                email: email,
                role_Name: roleName
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
                        alert('Update success');
                    } else {
                        alert('Update failed');
                    }
                })
                .catch(error => {
                    alert('Update failed');
                    console.error('Lỗi:', error);
                });
        }else {
            alert('Update failed(id)');
        }

    };

    return <Box style={{ backgroundColor: 'white', width: 'auto', height: '100%', padding: '10px 20px' }}>
        <Text fontSize='30px' color='black' style={{ marginLeft: '5%', marginTop: '2%', backgroundColor: 'white', width: '50%' }}>
            Update User
        </Text>
        <hr style={{ borderTop: '1px solid #c4c4c4', width: '100%', marginTop: '0.5%' }} />

        <TableContainer>
            <Table variant='simple' style={{ marginTop: '2%', marginLeft: '5%', backgroundColor: 'white', width: '50%' }}>
                <TableCaption><Button style={{ marginTop: '2%' }} onClick={handleUpdateUser}>Update</Button></TableCaption>
                <Thead>
                    <Tr>
                        <InputGroup size='lg'>
                            <InputLeftAddon children='Login: ' style={{ width: '10%' }} />
                            <Input id='email' placeholder='Email' style={{ width: '80%' }} />
                            <Text fontSize='110%' color='black' style={{ marginLeft: '2%', marginTop: '1%' }}>@fpt.edu.vn</Text>
                        </InputGroup>
                    </Tr>
                </Thead>
                <Tbody>
                    <InputGroup size='lg'>
                        <InputLeftAddon children='Role: ' style={{ width: '10%' }} />
                        <Select value={selectedOptionRole} onChange={(e) => setSelectedOptionRole(e.target.value)} size='8%'>
                            {roles.map(role => (
                                <option key={role.name} value={role.name}>
                                    {role.name}
                                </option>
                            ))}
                        </Select>
                    </InputGroup>

                    <InputGroup size='lg'>
                        <InputLeftAddon children='isActive: ' style={{ width: '10%' }} />
                        <Select value={selectedOptionActive} defaultValue='active' onChange={(e) => setSelectedOptionActive(e.target.value)}
                            size='8%'>
                            <option value='active'>Active</option>
                            <option value='inactive'>Inactive</option>
                        </Select>
                    </InputGroup>
                </Tbody>
            </Table>
        </TableContainer>
        <Button style={{ marginLeft: '5%', marginTop: '2%' }} onClick={handleBackToList}>Back to List</Button>

    </Box>;
}
export default UpdateUser;