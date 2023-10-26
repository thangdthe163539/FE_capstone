import {
    Table, Text,
    Thead, Checkbox,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer, TableCaption,
    Box, Center, Button
} from '@chakra-ui/react'
import { useRouter } from 'next/router';

function UserDetail() {
    const router = useRouter();
    const { email, role, roleid, status, name } = router.query;
    const handleBackToList = () => {
        router.push('userManager');
    };

    const handleEdit = (name,email,status,role, roleid) => {
        router.push(`updateUser?email=${email}&name=${name}&status=${status}&role=${role}&roleid=${roleid}`);
    };
    return <Box style={{ backgroundColor: 'white', width: 'auto', height: '100%', padding: '10px 20px' }}>
        <Text fontSize='30px' color='black' style={{ marginLeft: '5%', marginTop: '2%' }}>
            User Details
        </Text>
        <hr style={{ borderTop: '1px solid #c4c4c4', width: '100%', marginTop: '0.5%' }} />
        <TableContainer>
            <Center>
                <Table variant='simple' style={{ marginTop: '5%', backgroundColor: 'white', width: '90%' }}>
                    <Thead>
                        <Tr>
                            <Td style={{ fontWeight: 'bold', color: '#344e74', fontFamilyfTo: 'Sanchez', width:'200px' }}>Name</Td>
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

        <Button style={{ marginLeft: '5%', marginTop: '5%' }} onClick={() => handleEdit(name,email,status,role, roleid)}>Edit</Button>
        <Button style={{ marginLeft: '0.5%', marginTop: '5%' }} onClick={handleBackToList}>Delete</Button>
        <Button style={{ marginLeft: '0.5%', marginTop: '5%' }} onClick={handleBackToList}>Back to List</Button>

    </Box>;
}

export default UserDetail;
