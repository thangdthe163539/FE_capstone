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
    Button, ModalBody, Image,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { ArrowForwardIcon, DeleteIcon } from '@chakra-ui/icons';
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


function IssueDetailManagePage() {
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
    const [error, setError] = useState('');
    const [image, setImage] = useState([]);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomedIndex, setZoomedIndex] = useState(null);
    const [isHovered, setIsHovered] = useState(null);
    const allowedExtensions = ['jpg', 'png'];
    //Image
    const handleFileChangeU = (e) => {
        const files = e.target.files;

        if (files) {
            const newImages = Array.from(files).map((file) => {
                const extension = file.name.split('.').pop().toLowerCase();

                if (allowedExtensions.includes(extension)) {
                    const reader = new FileReader();

                    reader.onload = () => {
                        setImage((prevImages) => [
                            ...prevImages,
                            { fileName: file.name, dataURL: reader.result },
                        ]);
                        setError('');
                    };

                    reader.readAsDataURL(file);
                } else {
                    setError('Invalid file type. Please select a JPG or PNG file.');
                    return null;
                }
            });

            // Giữ lại cả ảnh cũ và ảnh mới
            const oldImages = image.filter((img) => img.dataURL);
            setImage([...oldImages, ...newImages.filter(Boolean)]);
        }
    };

    const handleRemoveImageU = (index) => {
        setImage((prevImages) => {
            const newImages = [...prevImages];
            newImages.splice(index, 1);
            return newImages;
        });
        setError('');
    };

    function dataURLtoBlob(dataURL) {
        const parts = dataURL.split(';base64,');
        const contentType = parts[0].split(':')[1];
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);

        for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }

        return new Blob([uInt8Array], { type: contentType });
    }

    useEffect(() => {
        if (detail?.reportId) {
            const url = `http://localhost:5001/api/v1/Image/list_Images_by_Report/${detail.reportId}`;

            fetch(url, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => {
                    setImage(data);
                })
                .catch(error => {
                    console.error('Lỗi:', error);
                });
        }
    }, [detail?.reportId]);

    const handleImageClick = (index) => {
        setZoomedIndex(index);
        setIsZoomed(true);
    };

    const handleZoomClose = () => {
        setIsZoomed(false);
        setZoomedIndex(null);
    };

    const handleImageMouseLeave = () => {
        setIsHovered(null);
    };

    const handleImageMouseEnter = (index, event) => {
        event.stopPropagation(); // Ngăn chặn sự kiện lan toả lên các phần tử cha
        setIsHovered(index);
    };

    const handleDeleteClick = (index, event) => {
        event.stopPropagation(); // Ngăn chặn sự kiện lan toả lên các phần tử cha
        handleRemoveImageU(index);
    };

    //End
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleBackToList = () => {
        router.push('issueManager');
    };

    const handleAdd = () => {
        setIsOpenAdd(true)
    };


    const setDetails = (item) => {
        setDetail(item);
    };

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
                    setIsOpenAdd(false);
                    setIsSuccess("true");
                } else {
                    setIsOpenAdd(false);
                    setIsSuccess("false");
                }
            })
            .catch(error => {
                setIsOpenAdd(false);
                setIsSuccess("false");
                console.error('Lỗi:', error);
            });
    };

    const handleUpdate = async () => {
        const url = `http://localhost:5001/api/Report/UpdateReport/${detail.reportId}`;
        const endDate = document.getElementsByName('endDate')[0].value;
        const dateParts = endDate.split('-');
        let formattedDate = '';
        if (dateParts.length === 3) {
            formattedDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
        } else {
            console.error('Ngày không hợp lệ.');
        }

        const fileObjects = await Promise.all(image.map(async (image) => {
            // Tạo một Blob từ dataURL
            if (image.dataURL) {
                const blob = dataURLtoBlob(image.dataURL);
                return new File([blob], image.fileName, { type: blob.type });
            } else {
                console.log(image.image1 + "----111");
    
                // Giữ nguyên ảnh khi dataURL không xác định
                const fullImagePath = `/images/${image.image1}`;
                const blob = await fetch(fullImagePath).then(res => res.blob());
                return new File([blob], image.fileName, { type: blob.type });
            }
        }));
        console.log(image + "dsd");
        const formData = new FormData();
        formData.append('AppId', detail.appId);
        formData.append('Title', title.trim() === '' ? detail.title.trim() : title.trim());
        formData.append('Description', description.trim() === '' ? detail.description.trim() : description.trim());
        formData.append('Type', 'issues');
        formData.append('Start_Date', formattedDate);
        formData.append('End_Date', formattedDate);
        formData.append('Status', selectedOptionActive === '' ? detail.status : selectedOptionActive);

        fileObjects.forEach((file, index) => {
            formData.append(`Images`, file);
        });
        try {
            const response = await axios.put(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setIsSuccess("true");
            setIsOpenAdd(false);
        } catch (error) {
            setIsSuccess("false");
            setIsOpenAdd(false);
            console.error('Lỗi:', error);
        }
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
        const url = `http://localhost:5001/api/Report/GetReportsForAppAndType/${appId}/issues`;
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
                router.push('issueManager');
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
                            Issue Management
                        </Link>
                        <ArrowForwardIcon margin={1}></ArrowForwardIcon>Issue Details
                    </Flex>
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

                <Flex>
                    <Text fontSize='35px'><strong>{Apps.find(appItem => appItem.appId == appId)?.name} - {Apps.find(appItem => appItem.appId == appId)?.os} - {Apps.find(appItem => appItem.appId == appId)?.version}</strong></Text>
                </Flex>
                <Flex>
                    <Text fontSize='30px'>Total {issue.length} issue found :</Text>
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
                                                }}>
                                                    {trimTextToMaxWidth(item.description, 300)}
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
                <ModalContent maxW="1100px">
                    <ModalHeader>Update Issue</ModalHeader>
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
                        <br />
                        <Grid templateColumns='repeat(1, 1fr)' gap={8}>
                            <GridItem>
                                <Flex>
                                    <FormLabel style={{ width: '50px' }}>Image</FormLabel>
                                    <Input style={{ width: '300px', border: 'none', textAlign: 'center', height: '40px' }} id='file' type='file' onChange={handleFileChangeU} multiple />
                                </Flex>
                                <Box display="flex" flexWrap="wrap" gap={4}>
                                    {image.map((image, index) => (
                                        <Box
                                            key={index}
                                            position="relative"
                                            maxW="100px"
                                            maxH="200px"
                                            overflow="hidden"
                                            onClick={() => handleImageClick(index)}
                                            onMouseEnter={(event) => handleImageMouseEnter(index, event)}
                                            onMouseLeave={handleImageMouseLeave}
                                        >
                                            <Image
                                                src={image.dataURL || `/images/${image.image1}`}
                                                alt={`Selected Image ${index}`}
                                                w="100%"
                                                h="100%"
                                                objectFit="cover"
                                                _hover={{ cursor: 'pointer' }}
                                            />
                                            {isHovered === index && (
                                                <>
                                                    <DeleteIcon
                                                        position="absolute"
                                                        top="5px"
                                                        color="black"
                                                        right="5px"
                                                        fontSize="15px"
                                                        variant="ghost"
                                                        onClick={(event) => handleDeleteClick(index, event)}
                                                        _hover={{ color: 'black ' }}
                                                    />
                                                    <Text position="absolute" bottom="5px" left="5px" fontSize="10px" color="white">
                                                        {image.fileName}
                                                    </Text>
                                                </>
                                            )}
                                        </Box>
                                    ))}
                                    {isZoomed && (
                                        <div className="modal-overlay" onClick={handleZoomClose}>
                                            <Modal isOpen={isZoomed} onClose={handleZoomClose} size="xl" isCentered>
                                                <ModalOverlay />
                                                <ModalContent>
                                                    <ModalBody>
                                                        <Box className="zoomed-image-container">
                                                            <Image
                                                                src={image[zoomedIndex]?.dataURL || `/images/${image[zoomedIndex]?.image1}`}
                                                                alt={`${zoomedIndex}`}
                                                            />
                                                        </Box>
                                                    </ModalBody>
                                                </ModalContent>
                                            </Modal>
                                        </div>
                                    )}
                                </Box>
                                {error && (
                                    <Text color="red">{error}</Text>
                                )}
                            </GridItem>
                        </Grid>
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
        </Box>
    )

}
export default IssueDetailManagePage;