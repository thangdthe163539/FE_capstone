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
    const { email, role } = router.query;
    const handleBackToList = () => {
        router.push('userManager');
    };
    return <Box>
        <Text fontSize='30px' color='black' style={{ marginLeft: '5%', marginTop: '2%' }}>
            User Details
        </Text>
        <TableContainer>
            <Center>
                <Table variant='simple' style={{ marginTop: '5%', backgroundColor: 'white', width: '90%' }}>
                    <TableCaption>Imperial to metric conversion factors</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>Login</Th>
                            <Td>{email}</Td>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Th>isActive</Th>
                            <Td>True</Td>
                        </Tr>
                        <Tr>
                            <Th>Role_Name</Th>
                            <Td>{role}</Td>
                        </Tr>
                    </Tbody>
                </Table>
            </Center>
        </TableContainer>
        <Button style={{ marginLeft: '5%', marginTop: '2%' }} onClick={handleBackToList}>Back to List</Button>
    </Box>;
}

export default UserDetail;
