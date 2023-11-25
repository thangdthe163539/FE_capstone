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
  Image,
} from '@chakra-ui/react';
import { Alert, AlertIcon } from '@chakra-ui/react';
import axios from 'axios';
import Link from 'next/link';
import styles from '@/styles/pm.module.css';
import { ArrowForwardIcon, DeleteIcon } from '@chakra-ui/icons';
import { FaPlus } from 'react-icons/fa';
import { useState, useEffect } from 'react';
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

function IssuePage() {
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
  const [detail, setDetail] = useState(null);
  const [selectedOptionActive, setSelectedOptionActive] = useState('');
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [imagesState, setImages] = useState([]);
  const [error, setError] = useState('');
  const [image, setImage] = useState([]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomedIndex, setZoomedIndex] = useState(null);
  const [isHovered, setIsHovered] = useState(null);

  const allowedExtensions = ['jpg', 'png'];

  const handleFileChange = (e) => {
    const files = e.target.files;

    if (files) {
      const newImages = Array.from(files).map((file) => {
        const extension = file.name.split('.').pop().toLowerCase();

        if (allowedExtensions.includes(extension)) {
          const reader = new FileReader();

          reader.onload = () => {
            setImages((prevImages) => [
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
    }
  };

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

      // Giữ lại cả ảnh cũ và thêm ảnh mới
      setImage((prevImages) => [
        ...prevImages.filter((img) => img.dataURL),
        ...newImages.filter(Boolean),
      ]);
    }
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });
    setError('');
  };

  const handleRemoveImageU = (index) => {
    setImage((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });
    setError('');
  };

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
        <span style={{ color: 'blue', fontSize: '15px' }}>
          {words.length > trimmedWords.length ? ' ...' : ''}
        </span>
      </span>
    );
  };

  useEffect(() => {
    const url = 'http://localhost:5001/api/Report/ReportsByType/Issue';
    fetch(url, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          const filteredData = data.filter((item) => item.status !== -1);
          setIssues(filteredData);
        }
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //pagination

  const itemPerPage = 8;
  const [dynamicList, setDynamicList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  // filteredIssueData;
  const handleChangePage = (page) => {
    setCurrentPage(page);
    let newList = [];
    for (let i = (page - 1) * itemPerPage; i < page * itemPerPage; i++) {
      if (filteredIssueData[i]) {
        newList.push(filteredIssueData[i]);
      }
    }
    setDynamicList(newList);
  };
  const totalPages = filteredIssueData ? filteredIssueData?.length : 0;

  //lọc
  const filteIssue = () => {
    const query = searchQueryTb.toLowerCase();
    const filteredData = Issues.filter((item) => {
      const name = item.title.toLowerCase();
      const appName = Apps.find(
        (appItem) => appItem.appId === item.appId,
      )?.name.toLowerCase();
      return name.includes(query) || appName.includes(query);
    });
    setFilteredIssueData(filteredData);
  };

  useEffect(() => {
    filteIssue();
  }, [searchQueryTb, Issues]);

  useEffect(() => {
    if (filteredIssueData.length) {
      handleChangePage(1);
    }
  }, [filteredIssueData]);

  const filteApp = () => {
    const query = searchQuery.toLowerCase();
    const filteredData = Apps.filter((item) => {
      const name = item.name.toLowerCase();
      const os = item.os.toLowerCase();
      const version = item.osversion.toLowerCase();
      return (
        name.includes(query) || os.includes(query) || version.includes(query)
      );
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
    setIsOpenDetail(true);
  };

  const uniqueStatuses = [...new Set(Issues.map((st) => st.status))];

  const sortedIssue = uniqueStatuses.sort((a, b) =>
    a === detail?.status ? -1 : b === detail?.status ? 1 : 0,
  );

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
        accept: '*/*',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          setIsOpenDetail(false);
          setIsSuccess('true');
        } else {
          setIsOpenDetail(false);
          setIsSuccess('false');
        }
      })
      .catch((error) => {
        setIsOpenDetail(false);
        setIsSuccess('false');
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
    const fileObjects = await Promise.all(
      image.map(async (image) => {
        // Tạo một Blob từ dataURL
        if (image.dataURL) {
          const blob = dataURLtoBlob(image.dataURL);
          return new File([blob], image.fileName, { type: blob.type });
        } else {
          console.log(image.image1 + '----111');

          // Giữ nguyên ảnh khi dataURL không xác định
          const fullImagePath = `/images/${image.image1}`;
          const blob = await fetch(fullImagePath).then((res) => res.blob());
          return new File([blob], image.fileName, { type: blob.type });
        }
      }),
    );
    const formData = new FormData();
    formData.append('AppId', detail.appId);
    formData.append(
      'Title',
      title.trim() === '' ? detail.title.trim() : title.trim(),
    );
    formData.append(
      'Description',
      description.trim() === ''
        ? detail.description.trim()
        : description.trim(),
    );
    formData.append('Type', 'issues');
    formData.append('Start_Date', formattedDate);
    formData.append('End_Date', formattedDate);
    formData.append(
      'Status',
      selectedOptionActive === '' ? detail.status : selectedOptionActive,
    );

    fileObjects.forEach((file, index) => {
      formData.append(`Images`, file);
    });
    try {
      const response = await axios.put(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setIsSuccess('true');
      setIsOpenDetail(false);
    } catch (error) {
      setIsSuccess('false');
      setIsOpenDetail(false);
      console.error('Lỗi:', error);
    }
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

  const handleSaveAdd = async () => {
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
      return; // Nếu ngày không hợp lệ, thoát khỏi hàm
    }

    // Chuyển đổi imagesState thành một mảng các đối tượng giống với File
    const fileObjects = imagesState.map((image) => {
      // Tạo một Blob từ dataURL
      const blob = dataURLtoBlob(image.dataURL);
      // Tạo một File từ Blob
      return new File([blob], image.fileName, { type: blob.type });
      [];
    });
    // Sử dụng FormData để chứa dữ liệu và file
    const formData = new FormData();
    formData.append('AppId', Id);
    formData.append('Title', title);
    formData.append('Description', desc);
    formData.append('Type', 'Issue');
    formData.append('Start_Date', formattedDate);
    formData.append('End_Date', formattedDate);
    formData.append('Status', 1);

    // Duyệt qua tất cả các đối tượng file và thêm chúng vào formData
    fileObjects.forEach((file, index) => {
      formData.append(`Images`, file);
    });
    try {
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setIsSuccess('true');
      setIsOpenAdd(false);
    } catch (error) {
      setIsSuccess('false');
      setIsOpenAdd(false);
      console.error('Lỗi:', error);
    }
  };

  useEffect(() => {
    if (detail?.reportId) {
      const url = `http://localhost:5001/api/v1/Image/list_Images_by_Report/${detail.reportId}`;

      fetch(url, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((data) => {
          setImage(data);
        })
        .catch((error) => {
          console.error('Lỗi:', error);
        });
    }
  }, [detail?.reportId]);

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

  const handleDeleteClick_Add = (index, event) => {
    event.stopPropagation(); // Ngăn chặn sự kiện lan toả lên các phần tử cha
    handleRemoveImage(index);
  };

  return (
    <Box className={styles.bodybox}>
      <List>
        <ListItem className={styles.list}>
          <Link href='/adminpages/adminhome' className={styles.listitem}>
            Home
          </Link>
          <ArrowForwardIcon margin={1}></ArrowForwardIcon>Issues Management
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
            <Text fontSize='2xl'>
              Issues Management -{' '}
              <Link
                href='/adminpages/issueManager'
                style={{ color: '#4d9ffe', textDecoration: 'none' }}
              >
                Overview
              </Link>
            </Text>
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
                <Flex alignItems={'center'} justifyContent={'space-between'}>
                  <Text>Show {dynamicList.length}/{filteredIssueData.length} reports</Text>{' '}
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
                  <Th className={styles.cTh}>Title</Th>
                  <Th style={{ textAlign: 'center' }} className={styles.cTh}>
                    Description
                  </Th>
                  <Th className={styles.cTh}>Start Date</Th>
                  <Th className={styles.cTh}>End Date</Th>
                  <Th className={styles.cTh}>Status</Th>
                  <Th className={styles.cTh}>Application</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dynamicList?.map((issue, index) => (
                  <Tr key={issue.id}>
                    <Td>{index + 1}</Td>
                    <Td style={{ width: '200px' }}>
                      <Button
                        color={'blue'}
                        variant='link'
                        onClick={() => {
                          handleDetail();
                          setDetails(issue);
                        }}
                      >
                        {issue.title}
                      </Button>
                    </Td>
                    <Td
                      style={{ width: '50px' }}
                      onClick={() => {
                        handleDetail();
                        setDetails(issue);
                      }}
                    >
                      {trimTextToMaxWidth(issue.description.trim(), 350)}
                    </Td>
                    <Td>{issue.start_Date}</Td>
                    <Td>{issue.end_Date}</Td>
                    <Td>{issue.status}</Td>
                    <Td>
                      {
                        Apps.find((appItem) => appItem.appId === issue.appId)
                          ?.name
                      }
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </ListItem>
      </List>
      <Modal
        isOpen={isOpenDetail}
        onClose={() => setIsOpenDetail(false)}
        closeOnOverlayClick={false}
        size='lg'
      >
        <ModalOverlay />
        <ModalContent maxW='1100px'>
          <ModalHeader>Update Issue</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8}>
            <Grid
              style={{ marginTop: '5px' }}
              templateColumns='repeat(3, 1fr)'
              gap={4}
            >
              <GridItem colSpan={1}>
                <Flex alignItems='center'>
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
                <Flex alignItems='center'>
                  <FormLabel>Title</FormLabel>
                  <Input
                    id='title'
                    style={{ backgroundColor: 'whitesmoke' }}
                    defaultValue={detail?.title.trim()}
                    onChange={(e) => setTitle(e.target.value)}
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
                    defaultValue={
                      detail ? convertToISODate(detail.end_Date) : ''
                    }
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
                    onChange={handleFileChangeU}
                    multiple
                  />
                </Flex>
                <Box display='flex' flexWrap='wrap' gap={4}>
                  {image.map((image, index) => (
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
                        src={image.dataURL || `/images/${image.image1}`}
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
                            onClick={(event) => handleDeleteClick(index, event)}
                            _hover={{ color: 'black ' }}
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
                                src={
                                  image[zoomedIndex]?.dataURL ||
                                  `/images/${image[zoomedIndex]?.image1}`
                                }
                                alt={`${zoomedIndex}`}
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
            <Button colorScheme='blue' mr={3} onClick={handleUpdate}>
              Save
            </Button>
            <Button colorScheme='whatsapp' mr={3} onClick={handleSendMail}>
              Send Mail
            </Button>
            <Button
              onClick={() => (setIsOpenDetail(false), setFormData(defaultData))}
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
        <ModalContent maxW='1100px'>
          <ModalHeader>Create New Issue</ModalHeader>
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
                        {filteredAppData.map((app) => (
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
      </Modal>
    </Box>
  );
}

export default IssuePage;
