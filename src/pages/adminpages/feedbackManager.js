import {
    Box,
    ListItem,
    List,
    Text,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Flex,
    Spacer,
    IconButton,
    Textarea,
} from '@chakra-ui/react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Button,
    Select,
    Grid,
    GridItem,
} from '@chakra-ui/react';
import {
    Alert,
    AlertIcon,
} from '@chakra-ui/react'

import Link from 'next/link';
import styles from '@/styles/pm.module.css';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { FaPlus } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const defaultData = {
    reportId: '',
    softwareId: '',
    type: '',
    description: '',
    startDate: '',
    endDate: '',
    status: '',
};

function FeedBackPage() {
    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const [isOpenDetail, setIsOpenDetail] = useState(false);
    const [formData, setFormData] = useState(defaultData);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchQueryTb, setSearchQueryTb] = useState('');
    const [filteredAppData, setfilteredAppData] = useState([]);
    const [filteredIssueData, setFilteredIssueData] = useState([]);
    const [Issues, setIssues] = useState([]);
    const [Apps, setApps] = useState([]);
    const [isSuccess, setIsSuccess] = useState('');
    const notificationTimeout = 2000;
    const [showOptions, setShowOptions] = useState(false);
    const [appId, setAppId] = useState('');
    const [detail, setDetail] = useState(null)
    const [selectedOptionActive, setSelectedOptionActive] = useState('');
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');

    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchTbInputChange = (e) => {
        setSearchQueryTb(e.target.value);
    };

    //cut text descriptions
    const trimTextToMaxWidth = (text, maxWidth) => {
        const words = text.split(' ');

        let currentWidth = 0;
        let trimmedWords = [];

        for (let i = 0; i < words.length; i++) {
            const wordWidth = words[i].length * 7; 

            if (currentWidth + wordWidth <= maxWidth) {
                trimmedWords.push(words[i]);
                currentWidth += wordWidth;
            } else {
                break;
            }
        }

        const trimmedText = trimmedWords.join(' ');

        return (
            <span>
                {trimmedText}
                <span style={{ color: 'blue', fontSize: '15px' }}>{words.length > trimmedWords.length ? ' see more...' : ''}</span>
            </span>
        );
    };

    useEffect(() => {
        const url = 'http://localhost:5001/api/Report/ReportsByType/feedback';
        fetch(url, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                const filteredData = data.filter(item => item.status !== 1);
                setIssues(filteredData);
            })
            .catch(error => {
                console.error('Lỗi:', error);
            });
    }, []);


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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    //lọc
    const filteIssue = () => {
        const query = searchQueryTb.toLowerCase();
        const filteredData = Issues.filter((item) => {
            const name = item.title.toLowerCase();
            const appName = Apps.find(appItem => appItem.appId === item.appId)?.name.toLowerCase();
            return name.includes(query) || appName.includes(query);
        });
        setFilteredIssueData(filteredData);
    };


    useEffect(() => {
        filteIssue();
    }, [searchQueryTb, Issues]);

    const filteApp = () => {
        const query = searchQuery.toLowerCase();
        const filteredData = Apps.filter((item) => {
            const name = item.name.toLowerCase();
            const os = item.os.toLowerCase();
            const version = item.osversion.toLowerCase();
            return name.includes(query) || os.includes(query) || version.includes(query);
        });
        setfilteredAppData(filteredData);
    };


    useEffect(() => {
        filteApp();
    }, [searchQuery, Issues]);
    //end

    //detail
    const setDetails = (item) => {
        setDetail(item);
    };

    const handleDetail = () => {
        setIsOpenDetail(true)
    };

    const uniqueStatuses = [...new Set(Issues.map((st) => st.status))];

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

    const convertToISODate = (dateString) => {
        const [day, month, year] = dateString.split('/');
        return `${year}-${month}-${day}`;
    };
    //End

    const handleSendMail = () => {
        const url = `http://localhost:5001/api/Report/SendReportByEmail/${detail.reportId}`;
        fetch(url, {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (response.ok) {
                    setIsOpenDetail(false);
                    setIsSuccess("true");
                } else {
                    setIsOpenDetail(false);
                    setIsSuccess("false");
                }
            })
            .catch(error => {
                setIsOpenDetail(false);
                setIsSuccess("false");
                console.error('Lỗi:', error);
            });
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
                    setIsOpenDetail(false);
                } else {
                    setIsSuccess("false");
                    setIsOpenDetail(false);
                }
            })
            .catch(error => {
                setIsSuccess("false");
                console.error('Lỗi:', error);
            });
    };

    const handleSaveAdd = () => {
        const url = 'http://localhost:5001/api/Report/CreateReport';

        const Id = parseInt(appId);
        const desc = document.getElementById('description').value;
        const title = document.getElementById('title').value;
        const endDate = document.getElementsByName('endDate')[0].value;
        const dateParts = endDate.split('-');
        let formattedDate = '';
        if (dateParts.length === 3) {
            formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
        } else {
            console.error('Ngày không hợp lệ.');
        }
        console.log(appId);
        const data = {
            appId: Id,
            title: title,
            description: desc,
            type: 'feedback',
            end_Date: formattedDate,
            status: 2
        };

        fetch(url, {
            method: 'POST',
            headers: {
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
                setIsOpenAdd(false);
                console.error('Lỗi:', error);
            });
    };

    useEffect(() => {
        if (isSuccess) {
            const hideNotification = setTimeout(() => {
                setIsSuccess('');
                window.location.reload();
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
                    <Link href='/adminpages/adminhome' className={styles.listitem}>
                        Home
                    </Link>
                    <ArrowForwardIcon margin={1}></ArrowForwardIcon>Feedback Management
                    <Text className={styles.alert}>
                        {isSuccess === 'true' && (
                            <Alert status='success'>
                                <AlertIcon />
                                Your request successfully!
                            </Alert>
                        )}
                        {isSuccess === 'false' && (
                            <Alert status='error' style={{ width: '350px' }}>
                                <AlertIcon />
                                Error processing your request.
                            </Alert>
                        )}
                    </Text>
                </ListItem>
                <ListItem className={styles.list}>
                    <Flex>
                        <Text fontSize='2xl'>Feedback Management -  <Link href='/adminpages/feedbackhome' style={{ color: '#4d9ffe', textDecoration: 'none' }}>
                            Overview
                        </Link></Text>
                        <Spacer />
                        <Input
                            type='text'
                            value={searchQueryTb}
                            onChange={handleSearchTbInputChange}
                            placeholder='Search'
                            w={300}
                            mr={1}
                        />
                        <Box>
                            <IconButton
                                aria-label='Add'
                                icon={<FaPlus />}
                                colorScheme='gray'
                                marginRight={1}
                                onClick={() => setIsOpenAdd(true)}
                            />
                        </Box>
                    </Flex>
                </ListItem>
                <ListItem className={styles.list}>
                    <TableContainer>
                        <Table
                            variant='striped'
                            colorScheme='gray'
                            className={styles.cTable}
                        >
                            <TableCaption>
                                Total {filteredIssueData.length} reports
                            </TableCaption>
                            <Thead>
                                <Tr>
                                    <Th className={styles.cTh}>No</Th>
                                    <Th className={styles.cTh}>Title</Th>
                                    <Th style={{ textAlign: 'center' }} className={styles.cTh}>Description</Th>
                                    <Th className={styles.cTh}>Start Date</Th>
                                    <Th className={styles.cTh}>End Date</Th>
                                    <Th className={styles.cTh}>Status</Th>
                                    <Th className={styles.cTh}>Application</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {filteredIssueData.map((issue, index) => (
                                    <Tr key={issue.id}>
                                        <Td>{index + 1}</Td>
                                        <Td style={{ width: '150px' }}>
                                            <Button color={'blue'} variant='link' onClick={() => {
                                                handleDetail();
                                                setDetails(issue);
                                            }}>
                                                {issue.title}
                                            </Button>
                                        </Td>
                                        <Td style={{ width: '50px' }} onClick={() => {
                                                handleDetail();
                                                setDetails(issue);
                                            }}  >{trimTextToMaxWidth(issue.description.trim(), 300)}</Td>
                                        <Td>{issue.start_Date}</Td>
                                        <Td>{issue.end_Date}</Td>
                                        <Td>{issue.status}</Td>
                                        <Td>{Apps.find(appItem => appItem.appId === issue.appId)?.name}</Td>
                                    </Tr>
                                ))
                                }
                            </Tbody>
                        </Table>
                    </TableContainer>
                </ListItem>
            </List>

            <Modal
                isOpen={isOpenDetail}
                onClose={() => (setIsOpenDetail(false))}
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
                                    <Input id='title' style={{ backgroundColor: 'whitesmoke' }}
                                        defaultValue={detail?.title.trim()}
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
                                defaultValue={detail?.description.trim()}
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
                        <Button colorScheme='whatsapp' mr={3} onClick={handleSendMail}>
                            Send Mail
                        </Button>
                        <Button onClick={() => (setIsOpenAdd(false))}
                        >
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal
                isOpen={isOpenAdd}
                onClose={() => (setIsOpenAdd(false), setFormData(defaultData))}
                closeOnOverlayClick={false}
                size='lg'
            >
                <ModalOverlay />
                <ModalContent maxW="1100px">
                    <ModalHeader>Create New Feedback</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={8}>
                        <Grid templateColumns='repeat(3, 1fr)' gap={8}>
                            <GridItem colSpan={1}>
                                <Input
                                    name='softwareID'
                                    value={formData.softwareId}
                                    onChange={handleInputChange}
                                    display='none'
                                />
                                <Flex alignItems="center">
                                    <FormLabel style={{ marginRight: '1rem' }}>Application</FormLabel>
                                    <div style={{ position: 'relative', display: 'inline-block', backgroundColor: 'whitesmoke', width: '300px' }}>
                                        <Input
                                            type='text'
                                            style={{ backgroundColor: 'whitesmoke, width: 270px' }}
                                            value={searchQuery}
                                            onChange={(e) => {
                                                handleSearchInputChange(e);
                                                setShowOptions(e.target.value !== '');
                                            }}
                                            placeholder='Name - Os - Version'
                                            w={300}
                                            mr={1}
                                        />
                                        {showOptions && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '100%',
                                                left: 0,
                                                width: '300px',
                                                border: '2px solid whitesmoke',
                                                background: '#fff',
                                                zIndex: 1,
                                                borderRadius: '5px'
                                            }}>
                                                {filteredAppData.map((app) => (
                                                    <div
                                                        key={app.appId}
                                                        style={{ padding: '8px', cursor: 'pointer' }}
                                                        onClick={() => {
                                                            setSearchQuery(`${app.name.trim()} - ${app.os.trim()} - ${app.osversion.trim()}`);
                                                            setAppId(app.appId);
                                                        }}
                                                    >
                                                        {app.name.trim()} - {app.os.trim()} - {app.osversion.trim()}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </Flex>
                            </GridItem>
                            <GridItem colSpan={1}>
                                <Flex alignItems="center">
                                    <FormLabel>Title</FormLabel>
                                    <Input id='title' placeholder='Title' style={{ backgroundColor: 'whitesmoke' }}
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
                                        onChange={handleInputChange}
                                    />
                                </Flex>
                            </GridItem>
                        </Grid>
                        <FormControl mt={4}>
                            <FormLabel>Description</FormLabel>
                            <Textarea
                                id='description'
                                placeholder='Description...'
                                width='100%'
                                minH={40}
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleSaveAdd}>
                            Save
                        </Button>
                        <Button
                            onClick={() => (setIsOpenAdd(false), setFormData(defaultData))}
                        >
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}

export default FeedBackPage;
