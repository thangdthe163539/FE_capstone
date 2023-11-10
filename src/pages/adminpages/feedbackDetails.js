import {
    Box, Thead, Textarea,
    ListItem, Tr, FormControl,
    List, Th, Input, ModalFooter,
    Text, Td, Select,
    Flex, Grid, GridItem,
    TableContainer, FormLabel,
    Table, ModalOverlay,
    Tbody, ModalContent,
    Center, ModalHeader,
    Modal, ModalCloseButton,
    Button, ModalBody,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import styles from '@/styles/pm.module.css';
import {
    Alert,
    AlertIcon,
} from '@chakra-ui/react'

const defaultData = {
    reportId: '',
    type: '',
    description: '',
    startDate: '',
    endDate: '',
    status: '',
};


function FeedBackDetailManagePage() {
    const router = useRouter();
    const { appId } = router.query;
    const [formData, setFormData] = useState(defaultData);
    const [issue, setIssue] = useState([]);
    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const [detail, setDetail] = useState(null)
    const [selectedOptionActive, setSelectedOptionActive] = useState('');
    const notificationTimeout = 2000;
    const [isSuccess, setIsSuccess] = useState('');
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [Apps, setApps] = useState([]);

    const uniqueStatuses = [...new Set(issue.map((st) => st.status))];

    const sortedIssue = uniqueStatuses
        .sort((a, b) => (a === detail?.status ? -1 : b === detail?.status ? 1 : 0));

    const defaultStatuses = [1, 2, 3, 4];

    const defaultOptions = defaultStatuses
        .filter((status) => !sortedIssue.includes(status))
        .map((status) => (
            <option key={status} value={status}>
                {status}
            </option>
        ));

    //convert to show update
    const convertToISODate = (dateString) => {
        const [day, month, year] = dateString.split('/');
        return `${year}-${month}-${day}`;
    };

    const trimTextToWordCount = (text, wordCount) => {
        const words = text.split(' ');
        const trimmedText = words.slice(0, wordCount).join(' ');
        return (
            <span>
                {trimmedText}
                <span style={{ color: 'blue', fontSize: '15px' }}>{words.length > wordCount ? ' see more...' : ''}</span>
            </span>
        );
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleBackToList = () => {
        router.push('feedbackhome');
    };

    const handleAdd = () => {
        setIsOpenAdd(true)
    };


    const setDetails = (item) => {
        setDetail(item);
    };

    const handleUpdate = () => {
        const url = `http://localhost:5001/api/Report/UpdateReport/${detail.reportId}`;

        const endDate = document.getElementsByName('endDate')[0].value;
        const dateParts = endDate.split('-');
        let formattedDate = '';
        if (dateParts.length === 3) {
            formattedDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
        } else {
            console.error('Ngày không hợp lệ.');
        }

        const data = {
            title: title.trim() === '' ? detail.title.trim() : title.trim(),
            description: description.trim() === '' ? detail.description.trim() : description.trim(),
            type: 'feedback',
            end_Date: formattedDate,
            status: selectedOptionActive === '' ? detail.status : selectedOptionActive
        };
        fetch(url, {
            method: 'PUT',
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (response.ok) {
                    setIsSuccess("true");
                    setIsOpenAdd(false);
                } else {
                    setIsSuccess("false");
                    setIsOpenAdd(false);
                }
            })
            .catch(error => {
                setIsSuccess("false");
                console.error('Lỗi:', error);
            });
    };

    useEffect(() => {
        const url = 'http://localhost:5001/api/v1/App/ListApps';
        fetch(url, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                setApps(data);
            })
            .catch(error => {
                console.error('Lỗi:', error);
            });
    }, []);

    useEffect(() => {
        const url = `http://localhost:5001/api/Report/GetReportsForAppAndType/${appId}/feedback`;
        fetch(url, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                setIssue(data);
            })
            .catch(error => {
                console.error('Lỗi:', error);
            });
    }, []);

    useEffect(() => {
        if (isSuccess) {
            const hideNotification = setTimeout(() => {
                setIsSuccess('');
                router.push('feedbackhome');
            }, notificationTimeout);

            return () => {
                clearTimeout(hideNotification);
            };
        }
    }, [isSuccess]);
    return (
        <Box className={styles.bodybox}>
            <List>
                <ListItem className={styles.list}>
                    <Flex>
                        <Link href='/adminpages/adminhome' className={styles.listitem}>
                            Home
                        </Link>
                        <ArrowForwardIcon margin={1}></ArrowForwardIcon><Link href='/adminpages/issueManager' className={styles.listitem}>
                            Feedback Management
                        </Link>
                        <ArrowForwardIcon margin={1}></ArrowForwardIcon>Feedback Details
                    </Flex>
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
                </ListItem>

                <Flex>
                    <Text fontSize='35px'><strong>{Apps.find(appItem => appItem.appId == appId)?.name} - {Apps.find(appItem => appItem.appId == appId)?.os} - {Apps.find(appItem => appItem.appId == appId)?.version}</strong></Text>
                </Flex>
                <Flex>
                    <Text fontSize='30px'>Total {issue.length} feedback found :</Text>
                </Flex>
                <ListItem className={styles.list}>
                    <Center>
                        <Box width="80%">
                            <TableContainer>
                                <Table variant='striped' colorScheme='gray' className={styles.cTable}>
                                    <Thead>
                                        <Tr>
                                            <Th style={{ width: '5%' }} className={styles.cTh}>No</Th>
                                            <Th style={{ width: '5%', textAlign: 'center' }} className={styles.cTh}>Title</Th>
                                            <Th style={{ textAlign: 'center' }} className={styles.cTh}>Description</Th>
                                            <Th style={{ width: '5%', textAlign: 'center' }} className={styles.cTh}>StartDate</Th>
                                            <Th style={{ width: '5%', textAlign: 'center' }} className={styles.cTh}>EndDate</Th>
                                            <Th style={{ width: '5%', textAlign: 'center' }} className={styles.cTh}>Status</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {issue.map((item, index) => (
                                            <Tr key={index}>
                                                <Td style={{ width: '5%' }}>{index + 1}</Td>
                                                <Td style={{ width: '5%', color: 'blue' }} onClick={() => {
                                                    handleAdd();
                                                    setDetails(item);
                                                }}>{item.title}</Td>
                                                <Td style={{ width: '50px', textAlign: 'left' }} onClick={() => {
                                                    handleAdd();
                                                    setDetails(item);
                                                }} >
                                                    {trimTextToWordCount(item.description, 6)}
                                                </Td>
                                                <Td style={{ width: '15%', textAlign: 'center' }}>{item.start_Date}</Td>
                                                <Td style={{ width: '15%', textAlign: 'center' }}>{item.end_Date}</Td>
                                                <Td style={{ width: '15%', textAlign: 'center' }}>
                                                    {item.status}
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Center>
                    <Button style={{ marginLeft: '0%', marginTop: '2%' }} onClick={handleBackToList}>Back to List</Button>
                </ListItem>
            </List>

            <Modal
                isOpen={isOpenAdd}
                onClose={() => (setIsOpenAdd(false))}
                closeOnOverlayClick={false}
                size='lg'
            >
                <ModalOverlay />
                <ModalContent maxW="800px">
                    <ModalHeader>Update Feedback</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={8}>
                        <Grid style={{ marginTop: '5px' }} templateColumns='repeat(3, 1fr)' gap={4}>
                            <GridItem colSpan={1}>
                                <Flex alignItems="center">
                                    <FormLabel>Status</FormLabel>
                                    <Select
                                        style={{ backgroundColor: 'whitesmoke' }}
                                        value={selectedOptionActive}
                                        onChange={(e) => {
                                            setSelectedOptionActive(e.target.value);
                                        }}
                                    >
                                        {sortedIssue.map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                        {defaultOptions}
                                    </Select>
                                </Flex>
                            </GridItem>
                            <GridItem colSpan={1}>
                                <Flex alignItems="center">
                                    <FormLabel>Title</FormLabel>
                                    <Input id='title' defaultValue={detail?.title.trim()} style={{ backgroundColor: 'whitesmoke' }}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </Flex>
                            </GridItem>
                            <GridItem colSpan={1}>
                                <Flex alignItems="center">
                                    <FormLabel>EndDate</FormLabel>
                                    <Input
                                        style={{ marginLeft: '-7px', backgroundColor: 'whitesmoke' }}
                                        type="date"
                                        name='endDate'
                                        defaultValue={detail ? convertToISODate(detail.end_Date) : ''}
                                        onChange={handleInputChange}
                                    />
                                </Flex>
                            </GridItem>
                        </Grid>
                        <FormControl mt={4}>
                            <FormLabel>Description</FormLabel>
                            <Textarea
                                id='description'
                                defaultValue={detail?.description}
                                onChange={(e) => setDescription(e.target.value)}
                                width='100%'
                                minH={40}
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleUpdate}>
                            Save
                        </Button>
                        <Button onClick={() => (setIsOpenAdd(false))}
                        >
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )

}
export default FeedBackDetailManagePage;