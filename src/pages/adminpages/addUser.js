import {
    Table, Text,
    Thead, Checkbox,
    Tbody, Select,
    Tr, InputGroup,
    Th, InputLeftAddon,
    Td, Input, Button,
    TableContainer, TableCaption,
    Box, Center
} from '@chakra-ui/react'
import { useRouter } from 'next/router';

function AddUser() {
    const router = useRouter();
    const handleBackToList = () => {
        router.push('userManager');
    };

    return <Box>
        <Text fontSize='30px' color='black' style={{ marginLeft: '5%', marginTop: '2%' }}>
            Add User
        </Text>
        <TableContainer>
            <Table variant='simple' style={{ marginTop: '2%', marginLeft: '5%', backgroundColor: 'white', width: '50%' }}>
                <TableCaption>Imperial to metric conversion factors</TableCaption>
                <Thead>
                    <Tr>
                        <InputGroup size='lg'>
                            <InputLeftAddon children='Login: ' style={{ width: '10%' }} />
                            <Input id='email' placeholder='Email' style={{ width: '60%' }} />
                            <Text fontSize='110%' color='black' style={{ marginLeft: '2%', marginTop: '1%' }}>@fpt.edu.vn</Text>
                        </InputGroup>
                    </Tr>
                </Thead>
                <Tbody>
                    <InputGroup size='lg'>
                        <InputLeftAddon children='Role: ' style={{ width: '10%' }} />
                        <Select placeholder='medium size' size='8%' />
                    </InputGroup>
                    <InputGroup size='lg'>
                        <InputLeftAddon children='isActive: ' style={{ width: '10%' }} />
                        <Select defaultValue='active' size='8%'>
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

export default AddUser;