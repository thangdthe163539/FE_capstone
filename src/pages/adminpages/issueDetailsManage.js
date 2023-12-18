import {
  Box,
  InputGroup,
  Thead,
  InputLeftAddon,
  Textarea,
  ListItem,
  Tr,
  FormControl,
  List,
  Th,
  FormErrorMessage,
  Input,
  ModalFooter,
  Stack,
  Text,
  Td,
  Select,
  Flex,
  Grid,
  GridItem,
  TableContainer,
  FormLabel,
  Table,
  ModalOverlay,
  Tbody,
  ModalContent,
  Center,
  ModalHeader,
  Modal,
  ModalCloseButton,
  Button,
  ModalBody,
  Image,
  TableCaption,
  Spacer,
} from '@chakra-ui/react';
import Link from 'next/link';
import { parse, isAfter } from 'date-fns';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { ArrowForwardIcon, DeleteIcon } from '@chakra-ui/icons';
import styles from '@/styles/pm.module.css';
import { Alert, AlertIcon } from '@chakra-ui/react';
import Pagination from '@/components/pagination';
import ToastCustom from '@/components/toast';
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
  const [detail, setDetail] = useState(null);
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

  const [account, setAccount] = useState();
  useEffect(() => {
    // Access localStorage on the client side
    const storedAccount = localStorage.getItem('account');
    if (storedAccount) {
      try {
        const accountDataDecode = JSON.parse(storedAccount);
        if (!accountDataDecode) {
          // router.push('/page405');
        } else {
          if (accountDataDecode.roleId !== 1 || accountDataDecode.status == 3) {
            router.push('/page405');
          }
          setAccount(accountDataDecode);
        }
      } catch (error) {
        // router.push('/page405');
      }
    } else {
      router.push('/page405');
    }
  }, []);

  const [searchQueryTb, setSearchQueryTb] = useState('');
  const [dynamicfilteredFb, setDynamicfilteredFb] = useState([]);
  const [filteredFb, setfilteredFb] = useState([]);
  const handleSearchTbInputChange = (e) => {
    setSearchQueryTb(e.target.value);
  };
  //pagination
  const itemPerPage = 5;
  const [dynamicList, setDynamicList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  // filteredIssueData;
  const handleChangePage = (page) => {
    setCurrentPage(page);
    let newList = [];
    for (let i = (page - 1) * itemPerPage; i < page * itemPerPage; i++) {
      if (dynamicfilteredFb[i]) {
        newList.push(dynamicfilteredFb[i]);
      }
    }
    setDynamicList(newList);
  };

  const totalPages = dynamicfilteredFb ? dynamicfilteredFb?.length : 0;

  useEffect(() => {
    if (dynamicfilteredFb.length) {
      handleChangePage(1);
    } else {
      setDynamicList([]);
    }
  }, [dynamicfilteredFb]);

  const filterStatus = () => {
    const query = searchQueryTb.toLowerCase();
    const filteredData = issue.filter((item) => {
      const status = getStatusLabel(item.status).toLowerCase(); // Chuyển đổi số trạng thái thành nhãn tương ứng
      return status.includes(query);
    });
    setfilteredFb(filteredData);
    setDynamicfilteredFb(filteredData);
  };

  useEffect(() => {
    filterStatus();
  }, [searchQueryTb, Apps, issue]);
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
  //convert to show update
  const convertToISODate = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'title' || name === 'endDate') {
      setIsFirst({ ...isFirst, [name]: false });
    }
  };

  const handleBackToList = () => {
    router.push('issueManager');
  };

  const handleAdd = () => {
    setIsOpenAdd(true);
  };

  const setDetails = (item) => {
    setDetail(item);
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

  useEffect(() => {
    const url = `http://localhost:5001/api/Report/GetReportsForAppAndType/${appId}/Issue`;
    if (appId) {
      fetch(url, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status !== 400) {
            const sortedData = data.sort((a, b) => {
              if (a.status === 1 && b.status !== 1) {
                return -1;
              } else if (a.status !== 1 && b.status === 1) {
                return 1;
              } else if (a.status === 1 && b.status === 1) {
                const dateA = new Date(
                  a.start_Date.split('/').reverse().join('-'),
                );
                const dateB = new Date(
                  b.start_Date.split('/').reverse().join('-'),
                );

                return dateA.getTime() - dateB.getTime();
              }
            });
            setIssue(sortedData);
          }
        })
        .catch((error) => {
          console.error('Lỗi:', error);
        });
    }
  }, [appId]);

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

  const [isFirst, setIsFirst] = useState({
    title: true,
    description: true,
    endDate: true,
  });

  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (detail) {
      setIsFirst({
        title: true,
        description: true,
        endDate: true,
      });
      setTitle(detail?.title?.trim());
      setFormData({
        ...formData,
        endDate: convertToISODate(detail?.end_Date),
      });
      setDescription(detail?.description?.trim());
    }
  }, [detail]);

  const handleUpdate = async () => {
    const url = `http://localhost:5001/api/Report/UpdateReport/${detail.reportId}`;
    const endDate = document.getElementsByName('endDate')[0].value;
    const dateParts = endDate.split('-');
    const accId = account?.accId;
    let formattedDate = '';
    if (dateParts.length === 3) {
      formattedDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
    } else {
      console.error('Ngày không hợp lệ.');
    }
    if (!endDate || !title || !description) {
      setToast(true);
      setTimeout(() => {
        setToast(false);
      }, 500);
      setIsFirst({
        title: false,
        description: false,
        endDate: false,
      });
      return;
    }
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
    formData.append('Type', 'Issue');
    formData.append('Start_Date', formattedDate);
    formData.append('End_Date', formattedDate);
    formData.append(
      'Status',
      selectedOptionActive === '' ? detail.status : selectedOptionActive,
    );
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
      setIsOpenAdd(false);
    } catch (error) {
      setIsSuccess('false');
      setIsOpenAdd(false);
      console.error('Lỗi:', error);
    }
  };

  return (
    <>
      <Box className={styles.bodybox}>
        <List>
          <ListItem className={styles.list}>
            <Flex>
              <Link href='/adminpages/adminhome' className={styles.listitem}>
                Home
              </Link>
              <ArrowForwardIcon margin={1}></ArrowForwardIcon>
              <Link href='/adminpages/issueManager' className={styles.listitem}>
                Issue management
              </Link>
              <ArrowForwardIcon margin={1}></ArrowForwardIcon>Issue detail
            </Flex>
            <Text className={styles.alert}>
              {isSuccess === 'true' ? (
                <ToastCustom
                  title={'Your request successfully!'}
                  description={''}
                  status={'success'}
                />
              ) : null}
              {isSuccess === 'false' ? (
                <ToastCustom
                  title={'Error processing your request.'}
                  description={''}
                  status={'error'}
                />
              ) : null}
            </Text>
          </ListItem>

          <Flex>
            <Text fontSize='24px'>
              <strong>
                {Apps.find((appItem) => appItem.appId == appId)?.name} -{' '}
                {Apps.find((appItem) => appItem.appId == appId)?.os} -{' '}
                {Apps.find((appItem) => appItem.appId == appId)?.version}
              </strong>
            </Text>
            <Spacer />
            <InputGroup style={{ paddingTop: '5px', width: '20%' }}>
              <InputLeftAddon pointerEvents='none' children='Status' />
              <Select
                value={searchQueryTb}
                onChange={handleSearchTbInputChange}
                style={{ width: '100%' }}
              >
                <option value=''>All Issue</option>
                <option value='Unsolve'>Unsolve</option>
                <option value='Solved'>Solved</option>
                <option value='Deleted'>Deleted</option>
                <option value='Cancel'>Cancel</option>
              </Select>
            </InputGroup>
          </Flex>
          <Flex>
            <Text fontSize='20px'>
              Total {dynamicList.length} issue(s) found:
            </Text>
          </Flex>
          <ListItem className={styles.list}>
            <Center>
              <Box width='90%'>
                <TableContainer>
                  <Table
                    variant='striped'
                    colorScheme='gray'
                    className={styles.cTable}
                  >
                    <TableCaption>
                      <Flex
                        alignItems={'center'}
                        justifyContent={'space-between'}
                      >
                        <Text>
                          Show {dynamicList.length}/{filteredFb.length}{' '}
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
                        <Th style={{ width: '5%' }} className={styles.cTh}>
                          No
                        </Th>
                        <Th
                          style={{ width: '5%', textAlign: 'left' }}
                          className={styles.cTh}
                        >
                          Title
                        </Th>
                        <Th
                          style={{ width: '5%', textAlign: 'left' }}
                          className={styles.cTh}
                        >
                          Create By
                        </Th>
                        <Th
                          style={{ width: '5%', textAlign: 'left' }}
                          className={styles.cTh}
                        >
                          Start Date
                        </Th>
                        <Th
                          style={{ width: '5%', textAlign: 'left' }}
                          className={styles.cTh}
                        >
                          Deadline
                        </Th>
                        <Th
                          style={{ width: '5%', textAlign: 'left' }}
                          className={styles.cTh}
                        >
                          Closed Date
                        </Th>
                        <Th
                          style={{ width: '5%', textAlign: 'left' }}
                          className={styles.cTh}
                        >
                          Status
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {dynamicList.map((item, index) => {
                        const currentDate = new Date();
                        const endDate = parse(
                          item.end_Date,
                          'dd/MM/yyyy',
                          new Date(),
                        );
                        const isOverdue =
                          item.status === 1 && isAfter(currentDate, endDate);
                        return (
                          <Tr key={index}>
                            <Td
                              style={{
                                width: '5%',
                                color: isOverdue ? 'red' : 'black',
                              }}
                            >
                              {index + 1}
                            </Td>
                            <Td
                              cursor={'pointer'}
                              style={{ color: 'blue', textAlign: 'left' }}
                              onClick={() => {
                                handleAdd();
                                setDetails(item);
                              }}
                            >
                              {item.title}
                            </Td>
                            <Td
                              style={{
                                width: '15%',
                                textAlign: 'left',
                                color: isOverdue ? 'red' : 'black',
                              }}
                            >
                              {item.emailSend}
                            </Td>
                            <Td
                              style={{
                                width: '15%',
                                textAlign: 'left',
                                color: isOverdue ? 'red' : 'black',
                              }}
                            >
                              {item.start_Date}
                            </Td>
                            <Td
                              style={{
                                width: '15%',
                                textAlign: 'left',
                                color: isOverdue ? 'red' : 'black',
                              }}
                            >
                              {item.end_Date}
                            </Td>
                            <Td
                              style={{
                                width: '15%',
                                textAlign: 'left',
                                color: isOverdue ? 'red' : 'black',
                              }}
                            >
                              {item.closedDate !== null
                                ? item.closedDate
                                : 'In processing'}
                            </Td>
                            <Td
                              style={{
                                width: '15%',
                                textAlign: 'left',
                                color: isOverdue ? 'red' : 'black',
                              }}
                            >
                              {item.status === 1
                                ? 'Unsolve '
                                : item.status === 2
                                ? 'Solved '
                                : item.status === 3
                                ? 'Deleted '
                                : item.status === 4
                                ? 'Cancel '
                                : 'Unknown Status'}
                            </Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
            </Center>
            <Button
              style={{ marginLeft: '0%', marginTop: '2%' }}
              onClick={handleBackToList}
            >
              Back to List
            </Button>
          </ListItem>
        </List>

        <Modal
          isOpen={isOpenAdd}
          onClose={() => setIsOpenAdd(false)}
          closeOnOverlayClick={false}
          size='lg'
        >
          <ModalOverlay />
          <ModalContent maxW='1100px'>
            <ModalHeader>Update issue</ModalHeader>
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
                  {/* <Flex alignItems='center'>
                    <FormLabel>Title</FormLabel>
                    <Input
                      id='title'
                      defaultValue={detail?.title.trim()}
                      style={{ backgroundColor: 'white' }}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </Flex> */}
                  <FormControl
                    isRequired
                    isInvalid={isFirst?.title ? false : !title ? true : false}
                  >
                    <Flex alignItems=''>
                      <FormLabel>Title</FormLabel>
                      <Stack gap={0}>
                        <Input
                          id='title'
                          style={{ backgroundColor: 'white' }}
                          defaultValue={detail?.title.trim()}
                          // value={title}
                          onChange={(e) => {
                            setTitle(e.target.value);
                            setIsFirst({ ...isFirst, title: false });
                          }}
                        />
                        {(isFirst?.title ? false : !title ? true : false) && (
                          <FormErrorMessage mt={0}>
                            Title is required
                          </FormErrorMessage>
                        )}
                      </Stack>
                    </Flex>
                  </FormControl>
                </GridItem>
                <GridItem colSpan={1}>
                  {/* <Flex alignItems='center'>
                    <FormLabel>Deadline</FormLabel>
                    <Input
                      style={{
                        marginLeft: '-7px',
                        backgroundColor: 'white',
                      }}
                      type='date'
                      name='endDate'
                      defaultValue={
                        detail ? convertToISODate(detail.end_Date) : ''
                      }
                      onChange={handleInputChange}
                    />
                  </Flex> */}
                  <FormControl
                    isRequired
                    isInvalid={
                      isFirst?.endDate
                        ? false
                        : !formData?.endDate
                        ? true
                        : false
                    }
                  >
                    <Flex alignItems='center'>
                      <FormLabel>Deadline</FormLabel>
                      <Stack gap={0}>
                        <Input
                          style={{
                            marginLeft: '-7px',
                            backgroundColor: 'white',
                          }}
                          type='date'
                          name='endDate'
                          defaultValue={
                            detail ? convertToISODate(detail.end_Date) : ''
                          }
                          onChange={handleInputChange}
                        />
                        {(isFirst?.endDate
                          ? false
                          : !formData?.endDate
                          ? true
                          : false) && (
                          <FormErrorMessage mt={0}>
                            Deadline is required
                          </FormErrorMessage>
                        )}
                      </Stack>
                    </Flex>
                  </FormControl>
                </GridItem>
              </Grid>
              <FormControl
                mt={4}
                isRequired
                isInvalid={
                  isFirst?.description ? false : !description ? true : false
                }
              >
                <FormLabel>Description</FormLabel>
                <Stack>
                  <Textarea
                    id='description'
                    defaultValue={detail?.description.trim()}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setIsFirst({ ...isFirst, description: false });
                    }}
                    width='100%'
                    minH={40}
                  />
                  {(isFirst?.description
                    ? false
                    : !description
                    ? true
                    : false) && (
                    <FormErrorMessage>Description is required</FormErrorMessage>
                  )}
                </Stack>
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
                        <div
                          className='modal-overlay'
                          onClick={handleZoomClose}
                        >
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
              <Button onClick={() => setIsOpenAdd(false)}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
      {toast ? (
        <ToastCustom
          title={'Some fields is empty'}
          description={'Please re-check the fields'}
          status='error'
        />
      ) : null}
    </>
  );
}
export default IssueDetailManagePage;
