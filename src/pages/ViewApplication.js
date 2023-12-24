import {
  Box,
  ListItem,
  List,
  Text,
  Flex,
  Spacer,
  Center,
  useToast,
  InputGroup,
  InputLeftElement,
  Input,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Button,
  Grid,
  GridItem,
  Textarea,
} from '@chakra-ui/react';
import Link from 'next/link';
import { VStack, HStack, Image } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';
import styles from '@/styles/pm.module.css';
import axios from 'axios';
import { BACK_END_PORT } from '../../env';
import { Inter } from 'next/font/google';
import PaginationCustom from '@/components/pagination';
const inter = Inter({ subsets: ['latin'] });
import { useRouter } from 'next/router';

const defaultData = {
  accId: '',
  appId: '',
  reportId: '',
  title: '',
  description: '',
  type: '',
  start_Date: '',
  end_Date: '',
  status: '',
};

function ApplicationPage() {
  const [data, setData] = useState([]);
  const [dataAcc, setDataAcc] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(defaultData);
  const [selectedApp, setSelectedApp] = useState(defaultData);
  const [isShowFeedback, setIsShowFeedback] = useState(false);
  const [imagesState, setImages] = useState([]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomedIndex, setZoomedIndex] = useState(null);
  const [error, setError] = useState('');
  const [image, setImage] = useState([]);
  const [isHovered, setIsHovered] = useState(null);
  const [account, setAccount] = useState();
  const [Apps, setApps] = useState([]);
  const router = useRouter();
  const toast = useToast();
  const [isFirst, setIsFirst] = useState({
    title: true,
    description: true,
  });
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    // Access sessionStorage on the client side
    const storedAccount = sessionStorage.getItem('account');
    if (storedAccount) {
      try {
        const accountDataDecode = JSON.parse(storedAccount);
        if (!accountDataDecode) {
          router.push('/page405');
        } else {
          // if (accountDataDecode.roleId !== 2 || accountDataDecode.status == 3) {
          //   router.push('/page405');
          // } else if (accountDataDecode.status == 2) {
          //   router.push('/ViewApplication');
          // }
          setAccount(accountDataDecode);
        }
      } catch (error) {
        router.push('/page405');
      }
    } else {
      router.push('/page405');
    }
  }, []);

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
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BACK_END_PORT}/api/App/ListApps`);
        setData(response.data);
        setDataDynamicList(response.data); // Assuming the API returns an array of objects
        const response2 = await axios.get(
          `${BACK_END_PORT}/api/Account/ListAccount`,
        );
        setDataAcc(response2.data); // Assuming the API returns an array of objects
        // setApps(response2.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let user, app;
    const query = router.asPath.split('?')[1];
    if (query) {
      const decodedParams = JSON.parse(atob(query));
      user = decodedParams?.user;
      app = decodedParams?.app;
    }
    if (user && app) {
      setIsShowFeedback(true);
      const selectedAppData = Apps.find((item) => item.name === app);
      if (selectedAppData) {
        setSelectedApp(selectedAppData);
      }
    }
  }, [router.query, Apps]);

  function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based
    const year = date.getFullYear();

    // Pad single-digit day and month with leading zeros
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${formattedDay}/${formattedMonth}/${year}`;
  }

  const handleSaveAdd = async () => {
    const url = 'http://localhost:5001/api/Report/CreateReport_appids';

    const Id = parseInt(selectedApp.appId);
    const desc = document.getElementById('description').value;
    const tit = document.getElementById('title').value;
    if (!title || !description) {
      setIsFirst({
        title: false,
        description: false,
      });
      return;
    }
    const curDate = new Date();
    const currentDateOnly = new Date(
      curDate.getFullYear(),
      curDate.getMonth(),
      curDate.getDate(),
    );
    const currentDateFormatted = formatDate(currentDateOnly);
    // Chuyển đổi imagesState thành một mảng các đối tượng giống với File
    const fileObjects = imagesState.map((image) => {
      // Tạo một Blob từ dataURL
      const blob = dataURLtoBlob(image.dataURL);
      // Tạo một File từ Blob
      return new File([blob], image.fileName, { type: blob.type });
      [];
    });
    const formData = new FormData();
    formData.append('AppIds', Id);
    formData.append('CreatorID', account?.accId);
    formData.append('Title', title);
    formData.append('Description', desc);
    formData.append('Type', 'Feedback');
    formData.append('Start_Date', currentDateFormatted);
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
      setIsShowFeedback(false);
      setSelectedApp(defaultData);
      setIsFirst({
        title: true,
        description: true,
      });
      setTitle('');
      setDescription('');
      setImages([]);
      toast({
        title: 'Send Feedback',
        description: 'The feedback has been successfully sended.',
        status: 'success',
        duration: 3000, // Duration in milliseconds
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Send Feedback Fail',
        description: 'The feedback has been fail when sended.',
        status: 'error',
        duration: 3000, // Duration in milliseconds
        isClosable: true,
      });
      setImages([]);
      setIsShowFeedback(false);
      setIsFirst({
        title: true,
        description: true,
      });
      setTitle('');
      setDescription('');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // console.log(formData);
  };

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
  const allowedExtensions = ['jpg', 'png'];

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

  const handleRemoveImage = (index) => {
    setImages((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });
    setError('');
  };
  const handleDeleteClick_Add = (index, event) => {
    event.stopPropagation(); // Ngăn chặn sự kiện lan toả lên các phần tử cha
    handleRemoveImage(index);
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

  //pagination
  const itemPerPage = 6;
  const [dynamicList, setDynamicList] = useState([]);
  const [dataDynamicList, setDataDynamicList] = useState([]);
  const [totalPages, setTotalPages] = useState(data ? data?.length : 0);
  const [currentPage, setCurrentPage] = useState(1);
  // filteredIssueData;
  const handleChangePage = (page = 1, list = dataDynamicList) => {
    if (list && !Array.isArray(list)) {
      list = dataDynamicList;
    }
    setCurrentPage(page);
    let newList = [];
    for (let i = (page - 1) * itemPerPage; i < page * itemPerPage; i++) {
      if (list[i]) {
        newList.push(list[i]);
      }
    }
    setTotalPages(list ? list?.length : 0);
    setDynamicList(newList);
  };

  useEffect(() => {
    if (data.length) {
      handleChangePage(1);
    } else {
      setDynamicList([]);
    }
  }, [data]);
  const [querySearch, setQuerySearch] = useState('');
  const handleSearchApplication = (query) => {
    if (query) {
      const value = query.toLowerCase().trim();
      const filterList = data.filter((item) =>
        item?.name.toLowerCase().trim().includes(value),
      );
      setDataDynamicList(filterList);
      handleChangePage(1, filterList);
      setQuerySearch(query);
    } else {
      setQuerySearch('');
      setDataDynamicList(data);
      handleChangePage(1, data);
    }
  };

  return (
    <Box className={styles.bodybox}>
      <List>
        <ListItem className={styles.list}>
          <Box
            style={{
              backgroundImage: `url('https://www.netsolutions.com/assets/images/software-dev-hub-banner-img.webp')`, // Thay đổi đường dẫn đến hình ảnh của bạn
              backgroundSize: 'cover', // Để tự động điều chỉnh kích thước ảnh cho phù hợp với phần tử
              backgroundRepeat: 'no-repeat', // Không lặp lại hình ảnh
              backgroundPosition: 'center', // Hiển thị ảnh tại giữa phần tử
              height: '200px',
            }}
            className={styles.homeBody + ' ' + inter.className}
          >
            <Box
              style={{
                letterSpacing: '1px',
                fontSize: '15px',
                color: 'white',
                marginLeft: '4%',
                padding: '40px',
              }}
            >
              <Text fontSize='24px' fontWeight='bold'>
                SoftTrack
              </Text>
              <Text>Advanced software asset management solution</Text>
              <Text>
                that helps you track, control, and optimize software licenses
              </Text>
              <Text>
                {' '}
                with ease, ensuring compliance and cost efficiency for your
                organization.
              </Text>
            </Box>
          </Box>
        </ListItem>
        <ListItem my={5}>
          <Flex justifyContent={'space-between'}>
            <InputGroup w={'24%'} minWidth={'340px'}>
              <InputLeftElement pointerEvents='none'>
                <SearchIcon color='gray.300' />
              </InputLeftElement>
              <Input
                type='text'
                placeholder='Search'
                value={querySearch}
                onChange={(e) => handleSearchApplication(e.target.value)}
              />
            </InputGroup>
            <PaginationCustom
              current={currentPage}
              onChange={handleChangePage}
              total={totalPages}
              pageSize={itemPerPage}
            />
          </Flex>

          <Grid
            templateColumns={{
              base: 'repeat(2, minmax(150px, 1fr))', // Responsive cho mobile và các thiết bị nhỏ hơn
              md: 'repeat(3, minmax(200px, 1fr))', // Responsive cho màn hình lớn hơn medium
              lg: 'repeat(3, minmax(250px, 1fr))', // Responsive cho màn hình lớn
            }}
            mt={5}
            gap={'20px'}
            justifyItems={'center'}
          >
            {dynamicList.map((item, i) => (
              <Box
                key={item.id}
                borderWidth='1px'
                borderRadius='lg'
                overflow='hidden'
                p={4}
                maxH={'220px'}
                w={'100%'}
                boxShadow='md'
                mb={'3%'}
              >
                <Box>
                  <Text fontSize='lg' fontWeight='bold' mb={2}>
                    {item.name}
                  </Text>
                  <Text
                    h={'95px'}
                    textOverflow={'ellipsis'}
                    overflow={'hidden'}
                    noOfLines={4}
                  >
                    {item.description}
                  </Text>
                  <HStack justify='space-between' mt={8}>
                    <Text
                      className={styles.listitem}
                      onClick={() => (
                        setIsShowFeedback(true), setSelectedApp(item)
                      )}
                    >
                      Send feedback
                    </Text>
                  </HStack>
                </Box>
              </Box>
            ))}
          </Grid>
        </ListItem>
      </List>
      <Modal
        isOpen={isShowFeedback}
        onClose={() => (
          setIsShowFeedback(false),
          setFormData(defaultData),
          setIsFirst({
            title: true,
            description: true,
          })
        )}
        closeOnOverlayClick={false}
        size='lg'
      >
        <ModalOverlay />
        <ModalContent maxW='1100px'>
          <ModalHeader>Send new feedback</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8}>
            <Grid templateColumns='repeat(2, 1fr)' gap={8}>
              <GridItem colSpan={1}>
                <Flex alignItems='center'>
                  <FormLabel style={{ marginRight: '1rem' }}>
                    Application
                  </FormLabel>
                  <div
                    style={{
                      position: 'relative',
                      display: 'inline-block',
                      width: '300px',
                    }}
                  >
                    <Input
                      type='text'
                      value={selectedApp.name}
                      w={300}
                      mr={1}
                      disabled
                    />
                  </div>
                </Flex>
              </GridItem>
              <GridItem colSpan={1} width='600px'>
                <FormControl
                  isRequired
                  isInvalid={isFirst?.title ? false : !title ? true : false}
                >
                  <Flex alignItems='center'>
                    <FormLabel>Title</FormLabel>
                    <Input
                      id='title'
                      placeholder='Title'
                      onChange={(e) => {
                        setTitle(e.target.value);
                        setIsFirst({ ...isFirst, title: false });
                      }}
                    />
                  </Flex>
                  <Flex>
                    <Spacer />
                    {(isFirst?.title ? false : !title ? true : false) && (
                      <FormErrorMessage>Title is required</FormErrorMessage>
                    )}
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
              <Flex>
                <FormLabel>Description</FormLabel>
                <Spacer />
                {(isFirst?.description
                  ? false
                  : !description
                  ? true
                  : false) && (
                  <FormErrorMessage>Description is required</FormErrorMessage>
                )}
              </Flex>
              <Textarea
                id='description'
                placeholder='Description...'
                width='100%'
                minH={40}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setIsFirst({ ...isFirst, description: false });
                }}
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
              onClick={() => (
                setIsShowFeedback(false),
                setFormData(defaultData),
                setIsFirst({
                  title: true,
                  description: true,
                })
              )}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
export default ApplicationPage;
