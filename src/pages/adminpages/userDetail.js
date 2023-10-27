import {
    Table, Text,
    Thead,
    Tbody,
    Tr,
    Td,
    TableContainer,
    Box, Center, Button, Flex
} from '@chakra-ui/react'
import {
    Alert,
    AlertIcon,
}
from '@chakra-ui/react'
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import styles from '@/styles/admin.module.css';

function UserDetail() {
    const router = useRouter();
    const { email, role, roleid, status, name, accid } = router.query;
    const [isSuccess, setIsSuccess] = useState('');
    const notificationTimeout = 2000;
    const handleBackToList = () => {
        router.push('userManager');
    };

    const handleDelete = () => {
        const url = `http://localhost:5001/api/v1/Account/DeleteAccountWith_key?accountId=${accid}`;
        fetch(url, {
            method: 'DELETE',
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
    };


    const handleEdit = (name, email, status, roleid) => {
        router.push(`updateUser?email=${email}&name=${name}&status=${status}&roleid=${roleid}`);
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
            <Text fontSize='30px' color='black' style={{ marginLeft: '5%', marginTop: '2%' }}>
                User Details
            </Text>
            <Text className={styles.alert}>
                {isSuccess === 'true' && (
                    <Alert status='success'>
                        <AlertIcon />
                        Delete Success!
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
            <Center>
                <Table variant='simple' style={{ marginTop: '5%', backgroundColor: 'white', width: '90%' }}>
                    <Thead>
                        <Tr>
                            <Td style={{ fontWeight: 'bold', color: '#344e74', fontFamilyfTo: 'Sanchez', width: '200px' }}>Name</Td>
                            <Td>{name}</Td>
                        </Tr>
                        <Tr>
                            <Td style={{ fontWeight: 'bold', color: '#344e74', fontFamilyfTo: 'Sanchez' }}>Email</Td>
                            <Td>{email}</Td>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td style={{ fontWeight: 'bold', color: '#344e74', fontFamilyfTo: 'Sanchez' }}>Active</Td>
                            <Td>{status}</Td>
                        </Tr>
                        <Tr>
                            <Td style={{ fontWeight: 'bold', color: '#344e74', fontFamilyfTo: 'Sanchez' }}>Role Name</Td>
                            <Td>{role}</Td>
                        </Tr>
                    </Tbody>
                </Table>
            </Center>
        </TableContainer>

        <Button style={{ marginLeft: '5%', marginTop: '5%' }} onClick={() => handleEdit(name, email, status, roleid)}>Edit</Button>
        <Button style={{ marginLeft: '0.5%', marginTop: '5%' }} onClick={handleDelete}>Delete</Button>
        <Button style={{ marginLeft: '0.5%', marginTop: '5%' }} onClick={handleBackToList}>Back to List</Button>

    </Box>;
}

export default UserDetail;
