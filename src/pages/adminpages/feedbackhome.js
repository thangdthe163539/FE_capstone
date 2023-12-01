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
  Flex,Center,InputLeftAddon,
  Spacer,InputGroup ,
  IconButton,
  Textarea,
  Image,
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
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { Alert, AlertIcon } from '@chakra-ui/react';
import axios from 'axios';
import Link from 'next/link';
import styles from '@/styles/pm.module.css';
import { ArrowForwardIcon, DeleteIcon } from '@chakra-ui/icons';
import { FaPlus } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Pagination from '@/components/pagination';

const defaultData = {
  reportId: '',
  softwareId: '',
  type: '',
  description: '',
  startDate: '',
  endDate: '',
  status: '',
};

function FeedbackPage() {
  const router = useRouter();
  // const [isOpenAdd, setIsOpenAdd] = useState(false);
  // const [formData, setFormData] = useState(defaultData);
  // const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryTb, setSearchQueryTb] = useState('');
  const [filteredAppData, setfilteredAppData] = useState([]);
  // const [filteredAppAddData, setfilteredAppAddData] = useState([]);
  const [dynamicFilteredAppData, setDynamicFilteredAppData] = useState([]);
  const [Apps, setApps] = useState([]);
  const [Issues, setIssues] = useState([]);
  // const [isSuccess, setIsSuccess] = useState('');
  // const [showOptions, setShowOptions] = useState(false);
  // const [appId, setAppId] = useState('');
  const notificationTimeout = 2000;
  // const [imagesState, setImages] = useState([]);
  // const [error, setError] = useState('');
  // const [isZoomed, setIsZoomed] = useState(false);
  // const [zoomedIndex, setZoomedIndex] = useState(null);
  // const [isHovered, setIsHovered] = useState(null);

  //pagination
  const itemPerPage = 5;
  const [dynamicList, setDynamicList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  // filteredIssueData;
  const handleChangePage = (page) => {
    setCurrentPage(page);
    let newList = [];
    for (let i = (page - 1) * itemPerPage; i < page * itemPerPage; i++) {
      if (dynamicFilteredAppData[i]) {
        newList.push(dynamicFilteredAppData[i]);
      }
    }
    setDynamicList(newList);
  };
  const totalPages = dynamicFilteredAppData
    ? dynamicFilteredAppData?.length
    : 0;

  useEffect(() => {
    if (dynamicFilteredAppData.length) {
      handleChangePage(1);
    }
  }, [dynamicFilteredAppData]);
  //

  // const allowedExtensions = ['jpg', 'png'];
  //Image
  // const handleFileChange = (e) => {
  //   const files = e.target.files;

  //   if (files) {
  //     const newImages = Array.from(files).map((file) => {
  //       const extension = file.name.split('.').pop().toLowerCase();

  //       if (allowedExtensions.includes(extension)) {
  //         const reader = new FileReader();

  //         reader.onload = () => {
  //           setImages((prevImages) => [
  //             ...prevImages,
  //             { fileName: file.name, dataURL: reader.result },
  //           ]);
  //           setError('');
  //         };

  //         reader.readAsDataURL(file);
  //       } else {
  //         setError('Invalid file type. Please select a JPG or PNG file.');
  //         return null;
  //       }
  //     });
  //   }
  // };

  // const handleImageClick = (index) => {
  //   setZoomedIndex(index);
  //   setIsZoomed(true);
  // };

  // const handleZoomClose = () => {
  //   setIsZoomed(false);
  //   setZoomedIndex(null);
  // };

  // const handleImageMouseLeave = () => {
  //   setIsHovered(null);
  // };

  // const handleImageMouseEnter = (index, event) => {
  //   event.stopPropagation(); // Ngăn chặn sự kiện lan toả lên các phần tử cha
  //   setIsHovered(index);
  // };

  // const handleRemoveImage = (index) => {
  //   setImages((prevImages) => {
  //     const newImages = [...prevImages];
  //     newImages.splice(index, 1);
  //     return newImages;
  //   });
  //   setError('');
  // };

  // const handleDeleteClick_Add = (index, event) => {
  //   event.stopPropagation(); // Ngăn chặn sự kiện lan toả lên các phần tử cha
  //   handleRemoveImage(index);
  // };

  // function dataURLtoBlob(dataURL) {
  //   const parts = dataURL.split(';base64,');
  //   const contentType = parts[0].split(':')[1];
  //   const raw = window.atob(parts[1]);
  //   const rawLength = raw.length;
  //   const uInt8Array = new Uint8Array(rawLength);

  //   for (let i = 0; i < rawLength; ++i) {
  //     uInt8Array[i] = raw.charCodeAt(i);
  //   }

  //   return new Blob([uInt8Array], { type: contentType });
  // }
  //End

  const handleIssuerDetails = (appId) => {
    router.push(`feedbackDetails?appId=${appId}`);
  };

  // const handleSearchInputChange = (e) => {
  //   setSearchQuery(e.target.value);
  // };

  const handleSearchTbInputChange = (e) => {
    setSearchQueryTb(e.target.value);
  };

  useEffect(() => {
    const url = 'http://localhost:5001/api/Report/ReportsByType/Feedback';
    fetch(url, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        setIssues(data);
      })
      .catch((error) => {
        console.error('Lỗi:', error);
      });
  }, []);

  useEffect(() => {
    const url = 'http://localhost:5001/api/v1/App/ListApps';
    fetch(url, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        setApps(data);
      })
      .catch((error) => {
        console.error('Lỗi:', error);
      });
  }, []);

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };

  const countIssue = (appId) => {
    const occurrences = Issues.filter((item) => item.appId === appId);
    console.log(occurrences.length + "---issue by appId = " + appId);
    return occurrences.length;
  };

  //lọc
  const filteApp = () => {
    const query = searchQueryTb.toLowerCase();
    const filteredData = Apps.filter((item) => {
      const name = item.name.toLowerCase();
      return (
        name.includes(query) 
      );
    });
    setfilteredAppData(filteredData);
    setDynamicFilteredAppData(
      filteredData.filter((item) => countIssue(item.appId) !== 0),
    );
  };

  useEffect(() => {
    filteApp();
  }, [searchQueryTb, Apps]);

  // const filteAppAdd = () => {
  //   const query = searchQuery.toLowerCase();
  //   const filteredData = Apps.filter((item) => {
  //     const name = item.name.toLowerCase();
  //     return (
  //       name.includes(query)
  //     );
  //   });
  //   setfilteredAppAddData(filteredData);
  // };

  // useEffect(() => {
  //   filteAppAdd();
  // }, [searchQuery, Apps]);
  //END

  // const handleSaveAdd = async () => {
  //   const url = 'http://localhost:5001/api/Report/CreateReport';

  //   const Id = parseInt(appId);
  //   const desc = document.getElementById('description').value;
  //   const title = document.getElementById('title').value;
  //   const endDate = document.getElementsByName('endDate')[0].value;
  //   const dateParts = endDate.split('-');
  //   let formattedDate = '';
  //   if (dateParts.length === 3) {
  //     formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
  //   } else {
  //     console.error('Ngày không hợp lệ.');
  //   }
  //   const fileObjects = imagesState.map((image) => {
  //     // Tạo một Blob từ dataURL
  //     const blob = dataURLtoBlob(image.dataURL);
  //     // Tạo một File từ Blob
  //     return new File([blob], image.fileName, { type: blob.type });
  //     [];
  //   });
  //   const formData = new FormData();
  //   formData.append('AppId', Id);
  //   formData.append('Title', title);
  //   formData.append('Description', desc);
  //   formData.append('Type', 'feedback');
  //   formData.append('Start_Date', formattedDate);
  //   formData.append('End_Date', formattedDate);
  //   formData.append('Status', 1);

  //   // Duyệt qua tất cả các đối tượng file và thêm chúng vào formData
  //   fileObjects.forEach((file, index) => {
  //     formData.append(`Images`, file);
  //   });
  //   try {
  //     const response = await axios.post(url, formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
  //     setIsSuccess('true');
  //     setIsOpenAdd(false);
  //   } catch (error) {
  //     setIsSuccess('false');
  //     setIsOpenAdd(false);
  //     console.error('Lỗi:', error);
  //   }
  // };

  // useEffect(() => {
  //   if (isSuccess) {
  //     const hideNotification = setTimeout(() => {
  //       setIsSuccess('');
  //       window.location.reload();
  //     }, notificationTimeout);

  //     return () => {
  //       clearTimeout(hideNotification);
  //     };
  //   }
  // }, [isSuccess]);
  return (
    <Box className={styles.bodybox}>
      <List>
        <ListItem className={styles.list}>
          <Link href='/adminpages/adminhome' className={styles.listitem}>
            Home
          </Link>
          <ArrowForwardIcon margin={1}></ArrowForwardIcon>Feedback management
          {/* <Text className={styles.alert}>
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
          </Text> */}
        </ListItem>
        <ListItem className={styles.list}>
          <Flex>
            <Text fontSize='2xl'>
              Feedback management -{' '}
              <Link
                href='/adminpages/feedbackManager'
                style={{ color: '#4d9ffe', textDecoration: 'none' }}
              >
                List open feedback
              </Link>
            </Text>
            <Spacer />
            <InputGroup style={{ paddingTop: '', width: '35%' }}>
              <InputLeftAddon
                pointerEvents="none"
                children='Application'
              />
              <Input
              style={{width:'100%'}}
              type='text'
              value={searchQueryTb}
              onChange={handleSearchTbInputChange}
              placeholder='Search'
              w={300}
              mr={1}
            />
            </InputGroup>
            {/* <Box>
              <IconButton
                aria-label='Add'
                icon={<FaPlus />}
                colorScheme='gray'
                marginRight={1}
                onClick={() => setIsOpenAdd(true)}
              />
            </Box> */}
          </Flex>
        </ListItem>
        <ListItem className={styles.list}>
          <TableContainer>
          <Center><Text fontSize={30} mb={2}>List all feedback</Text></Center>
            <Table
              variant='striped'
              colorScheme='gray'
              className={styles.cTable}
            >
              <TableCaption>
                <Flex alignItems={'center'} justifyContent={'space-between'}>
                  <Text>
                  Show {dynamicList.length}/{filteredAppData.length} result(s)
                  </Text>{' '}
                  <Pagination
                    current={currentPage}
                    onChange={handleChangePage}
                    total={totalPages}
                    pageSize={itemPerPage}
                  />
                </Flex>
              </TableCaption>
              <Thead>
                <Tr>
                  <Th className={styles.cTh}>No</Th>
                  <Th className={styles.cTh}>Application</Th>
                  <Th className={styles.cTh}>Release</Th>
                  <Th className={styles.cTh}>OS</Th>
                  <Th className={styles.cTh}>Version</Th>
                  <Th className={styles.cTh}>Publisher</Th>
                  <Th className={styles.cTh}>Status</Th>
                  <Th className={styles.cTh}>Quantity</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dynamicList.map(
                  (app, index) =>
                    countIssue(app.appId) !== 0 && 
                    (
                      <Tr key={app.appId}>
                        <Td style={{width:'5%'}}>{index + 1}</Td>
                        <Td>
                          <Button
                            color={'blue'}
                            variant='link'
                            onClick={() => handleIssuerDetails(app.appId)}
                          >
                            {app.name.trim()}
                          </Button>
                        </Td>
                        <Td>{app.release.trim()}</Td>
                        <Td>{app.os.trim()}</Td>
                        <Td>{app.osversion.trim()}</Td>
                        <Td>{app.publisher.trim()}</Td>
                        <Td>Active</Td>
                        <Td>{countIssue(app.appId)}</Td>
                      </Tr>
                    ),
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </ListItem>
      </List>
      {/* <Modal
        isOpen={isOpenAdd}
        onClose={() => (setIsOpenAdd(false), setFormData(defaultData))}
        closeOnOverlayClick={false}
        size='lg'
      >
        <ModalOverlay />
        <ModalContent maxW='1100px'>
          <ModalHeader>Create new feedback</ModalHeader>
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
                <Flex alignItems='center'>
                  <FormLabel style={{ marginRight: '1rem' }}>
                    Application
                  </FormLabel>
                  <div
                    style={{
                      position: 'relative',
                      display: 'inline-block',
                      backgroundColor: 'whitesmoke',
                      width: '300px',
                    }}
                  >
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
                      <div
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          width: '300px',
                          border: '2px solid whitesmoke',
                          background: '#fff',
                          zIndex: 1,
                          borderRadius: '5px',
                        }}
                      >
                        {filteredAppAddData.map((app) => (
                          <div
                            key={app.appId}
                            style={{ padding: '8px', cursor: 'pointer' }}
                            onClick={() => {
                              setSearchQuery(
                                `${app.name.trim()} - ${app.os.trim()} - ${app.osversion.trim()}`,
                              );
                              setAppId(app.appId);
                            }}
                          >
                            {app.name.trim()} - {app.os.trim()} -{' '}
                            {app.osversion.trim()}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Flex>
              </GridItem>
              <GridItem colSpan={1}>
                <Flex alignItems='center'>
                  <FormLabel>Title</FormLabel>
                  <Input
                    id='title'
                    placeholder='Title'
                    style={{ backgroundColor: 'whitesmoke' }}
                  />
                </Flex>
              </GridItem>
              <GridItem colSpan={1}>
                <Flex alignItems='center'>
                  <FormLabel>EndDate</FormLabel>
                  <Input
                    style={{
                      marginLeft: '-7px',
                      backgroundColor: 'whitesmoke',
                    }}
                    type='date'
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
            <br />
            <Grid templateColumns='repeat(1, 1fr)' gap={8}>
              <GridItem>
                <Flex>
                  <FormLabel style={{ width: '50px' }}>Image</FormLabel>
                  <Input
                    style={{
                      width: '300px',
                      border: 'none',
                      textAlign: 'center',
                      height: '40px',
                    }}
                    id='file'
                    type='file'
                    onChange={handleFileChange}
                    multiple
                  />
                </Flex>
                <Box display='flex' flexWrap='wrap' gap={4}>
                  {imagesState.map((image, index) => (
                    <Box
                      key={index}
                      position='relative'
                      maxW='100px'
                      maxH='200px'
                      overflow='hidden'
                      onClick={() => handleImageClick(index)}
                      onMouseEnter={(event) =>
                        handleImageMouseEnter(index, event)
                      }
                      onMouseLeave={handleImageMouseLeave}
                    >
                      <Image
                        src={image.dataURL}
                        alt={`Selected Image ${index}`}
                        w='100%'
                        h='100%'
                        objectFit='cover'
                        _hover={{ cursor: 'pointer' }}
                      />
                      {isHovered === index && (
                        <>
                          <DeleteIcon
                            position='absolute'
                            top='5px'
                            color='black'
                            right='5px'
                            fontSize='15px'
                            variant='ghost'
                            onClick={(event) =>
                              handleDeleteClick_Add(index, event)
                            }
                            _hover={{ color: 'black' }}
                          />
                          <Text
                            position='absolute'
                            bottom='5px'
                            left='5px'
                            fontSize='10px'
                            color='white'
                          >
                            {image.fileName}
                          </Text>
                        </>
                      )}
                    </Box>
                  ))}
                  {isZoomed && (
                    <div className='modal-overlay' onClick={handleZoomClose}>
                      <Modal
                        isOpen={isZoomed}
                        onClose={handleZoomClose}
                        size='xl'
                        isCentered
                      >
                        <ModalOverlay />
                        <ModalContent>
                          <ModalBody>
                            <Box className='zoomed-image-container'>
                              <Image
                                src={imagesState[zoomedIndex]?.dataURL}
                                alt={`${zoomedIndex}`}
                                w='100%' // Thiết lập kích thước modal sao cho đủ lớn
                                h='100%'
                                objectFit='contain'
                              />
                            </Box>
                          </ModalBody>
                        </ModalContent>
                      </Modal>
                    </div>
                  )}
                </Box>
                {error && <Text color='red'>{error}</Text>}
              </GridItem>
            </Grid>
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
      </Modal> */}
    </Box>
  );
}

export default FeedbackPage;
