import {
  Box,
  InputGroup,
  ListItem,
  InputLeftAddon,
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
  Textarea,
  Image,
  Center,
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
import { Alert, AlertIcon } from '@chakra-ui/react';
import axios from 'axios';
import Link from 'next/link';
import styles from '@/styles/pm.module.css';
import { ArrowForwardIcon, DeleteIcon } from '@chakra-ui/icons';
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

function FeedBackPage() {
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [formData, setFormData] = useState(defaultData);
  const [searchQueryTb, setSearchQueryTb] = useState('');
  const [filteredIssueData, setFilteredIssueData] = useState([]);
  const [Issues, setIssues] = useState([]);
  const [Apps, setApps] = useState([]);
  const [isSuccess, setIsSuccess] = useState('');
  const notificationTimeout = 2000;
  const [detail, setDetail] = useState(null);
  const [selectedOptionActive, setSelectedOptionActive] = useState('');
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [image, setImage] = useState([]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomedIndex, setZoomedIndex] = useState(null);
  const [isHovered, setIsHovered] = useState(null);

  const allowedExtensions = ['jpg', 'png'];

  //pagination
  const itemPerPage = 5;
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
  useEffect(() => {
    if (filteredIssueData.length) {
      handleChangePage(1);
    } else {
      setDynamicList([]);
    }
  }, [filteredIssueData]);
  //Image
  useEffect(() => {
    if (detail?.reportId) {
      const url = `http://localhost:5001/api/Image/list_Images_by_Report/${detail.reportId}`;

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

  const handleFileChangeU = (e) => {
    const files = e.target.files;

    if (files) {
      const newImages = Array.from(files).map((file) => {
        const extension = file.name.split('.').pop().toLowerCase();

        if (allowedExtensions.includes(extension)) {
          const reader = new FileReader();

          reader.onload = () => {
            setImage((prevImages) => [
              ...(Array.isArray(prevImages) ? prevImages : []), // Kiểm tra và sử dụng prevImages nếu là mảng, nếu không sử dụng mảng trống
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

      // Kiểm tra và sử dụng prevImages nếu là mảng, nếu không sử dụng mảng trống
      setImage((prevImages) => [
        ...(Array.isArray(prevImages) ? prevImages : []).filter(
          (img) => img && img.dataURL,
        ),
        ...newImages.filter(Boolean),
      ]);
    }
  };

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

  const handleRemoveImageU = (index) => {
    setImage((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });
    setError('');
  };

  const handleDeleteClick = (index, event) => {
    event.stopPropagation(); // Ngăn chặn sự kiện lan toả lên các phần tử cha
    handleRemoveImageU(index);
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
    const url = 'http://localhost:5001/api/App/ListApps';
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

  const getStatusLabel = (status) => {
    switch (status) {
      case 1:
        return 'Unsolve';
      case 2:
        return 'Solved';
      case 3:
        return 'Deleted';
      case 4:
        return 'Cancel';
      default:
        return '';
    }
  };

  const selectedLabels = sortedIssue.map((status) => getStatusLabel(status));

  const defaultOptions = defaultStatuses
    .filter((status) => !selectedLabels.includes(getStatusLabel(status)))
    .map((status) => (
      <option key={status} value={status}>
        {getStatusLabel(status)}
      </option>
    ));

  // const convertToISODate = (dateString) => {
  //   const [day, month, year] = dateString.split('/');
  //   return `${year}-${month}-${day}`;
  // };
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

  const [account, setAccount] = useState();
  useEffect(() => {
    // Access localStorage on the client side
    const storedAccount = localStorage.getItem('account');

    if (storedAccount) {
      const accountDataDecode = JSON.parse(storedAccount);
      if (!accountDataDecode) {
        // router.push('http://localhost:3000');
      } else {
        setAccount(accountDataDecode);
      }
    }
  }, []);

  const handleUpdate = async () => {
    const url = `http://localhost:5001/api/Report/UpdateReport/${detail.reportId}`;
    const accId = account?.accId;
    const formData = new FormData();
    formData.append('AppId', detail.appId);
    formData.append('UpdaterID', accId);
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
    formData.append('Type', 'Feedback');
    formData.append('Start_Date', '11/11/2023');
    formData.append(
      'Status',
      selectedOptionActive === '' ? detail.status : selectedOptionActive,
    )

    if (Array.isArray(image) && image.length !== 0) {
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
      fileObjects.forEach((file, index) => {
        formData.append(`Images`, file);
      });
    } else {
      formData.append(`Images`, ' ');
    }
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

  const fetchDataAndUpdateState = () => {
    const url = 'http://localhost:5001/api/Report/ReportsByType/Feedback';
    fetch(url, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.filter(
          (item) =>
            item.status !== -1 &&
            item.status !== 3 &&
            item.status !== 4 &&
            item.status !== 2,
        );
        setIssues(filteredData);
      })
      .catch((error) => {
        console.error('Lỗi:', error);
      });
  };

  useEffect(() => {
    fetchDataAndUpdateState();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      const hideNotification = setTimeout(() => {
        setIsSuccess('');
        fetchDataAndUpdateState();
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
          <ArrowForwardIcon margin={1}></ArrowForwardIcon>Feedback management
          <Text className={styles.alert}>
            {isSuccess === 'true' && (
              <Alert status='success'>
                <AlertIcon />
                Your request successfully!
              </Alert>
            )}
            {isSuccess === 'false' && (
              <Alert status='error' style={{ width: '320px' }}>
                <AlertIcon />
                Error processing your request.
              </Alert>
            )}
          </Text>
        </ListItem>
        <ListItem className={styles.list}>
          <Flex>
            <Text fontSize='2xl'>
              Feedback management -{' '}
              <Link
                href='/adminpages/feedbackhome'
                style={{ color: '#4d9ffe', textDecoration: 'none' }}
              >
                List all feedback
              </Link>
            </Text>
            <Spacer />
            <InputGroup style={{ paddingTop: '', width: '35%' }}>
              <InputLeftAddon
                pointerEvents='none'
                children='Title / Application'
              />
              <Input
                style={{ width: '100%' }}
                type='text'
                value={searchQueryTb}
                onChange={handleSearchTbInputChange}
                placeholder='Search'
                w={300}
                mr={1}
              />
            </InputGroup>
          </Flex>
        </ListItem>
        <ListItem className={styles.list}>
          <TableContainer>
            <Center>
              <Text fontSize={30} mb={2}>
                Open feedback
              </Text>
            </Center>
            <Table
              variant='striped'
              colorScheme='gray'
              className={styles.cTable}
            >
              <TableCaption>
                <Flex alignItems={'center'} justifyContent={'space-between'}>
                  <Text>
                    Show {dynamicList.length}/{filteredIssueData.length}{' '}
                    result(s)
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
                  <Th className={styles.cTh}>Title</Th>
                  <Th style={{ textAlign: 'left' }} className={styles.cTh}>
                    Description
                  </Th>
                  <Th className={styles.cTh}>Application</Th>
                  <Th className={styles.cTh}>Start Date</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dynamicList.map((issue, index) => (
                  <Tr key={issue.id}>
                    <Td style={{ width: '5%' }}>{index + 1}</Td>
                    <Td>
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
                      style={{ width: '45%' }}
                      onClick={() => {
                        handleDetail();
                        setDetails(issue);
                      }}
                    >
                      {trimTextToMaxWidth(issue.description.trim(), 400)}
                    </Td>
                    <Td>
                      {
                        Apps.find((appItem) => appItem.appId === issue.appId)
                          ?.name
                      }
                    </Td>
                    <Td style={{ width: '10%' }}>{issue.start_Date}</Td>
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
        <ModalContent maxW='1000px'>
          <ModalHeader>Update feedback</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8}>
            <Grid
              style={{ marginTop: '5px' }}
              templateColumns='repeat(2, 1fr)'
              gap={4}
            >
              <GridItem colSpan={1}>
                <Flex alignItems='center'>
                  <FormLabel>Status</FormLabel>
                  <Select
                    style={{ backgroundColor: 'white' }}
                    value={selectedOptionActive}
                    onChange={(e) => {
                      setSelectedOptionActive(e.target.value);
                    }}
                  >
                    {sortedIssue.map((status) => (
                      <option key={status} value={status}>
                        {status === 1
                          ? 'Unsolve'
                          : status === 2
                            ? 'Solved'
                            : status === 3
                              ? 'Deleted'
                              : status === 4
                                ? 'Cancel'
                                : 'Unknow'}
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
                    style={{ backgroundColor: 'white' }}
                    defaultValue={detail?.title.trim()}
                    onChange={(e) => setTitle(e.target.value)}
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
                {Array.isArray(image) && image.length !== 0 && (
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
                              onClick={(event) =>
                                handleDeleteClick(index, event)
                              }
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
                )}
                {error && <Text color='red'>{error}</Text>}
              </GridItem>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleUpdate}>
              Save
            </Button>
            <Button onClick={() => setIsOpenDetail(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default FeedBackPage;
