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
  useDisclosure,
  Icon,
  useToast,
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
const inter = Inter({ subsets: ['latin'] });

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BACK_END_PORT}/api/App/ListApps`);
        setData(response.data); // Assuming the API returns an array of objects
        const response2 = await axios.get(
          `${BACK_END_PORT}/api/Account/ListAccount`,
        );
        setDataAcc(response2.data); // Assuming the API returns an array of objects
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSaveAdd = async () => {
    const url = 'http://localhost:5001/api/Report/CreateReport';

    const Id = parseInt(selectedApp.appId);
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
    // Chuyển đổi imagesState thành một mảng các đối tượng giống với File
    const fileObjects = imagesState.map((image) => {
      // Tạo một Blob từ dataURL
      const blob = dataURLtoBlob(image.dataURL);
      // Tạo một File từ Blob
      return new File([blob], image.fileName, { type: blob.type });
      [];
    });
    const formData = new FormData();
    formData.append('AppId', Id);
    formData.append('Title', title);
    formData.append('Description', desc);
    formData.append('Type', 'Feedback');
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
      setIsShowFeedback(false);
      setSelectedApp(defaultData);
      setImages([]);
    } catch (error) {
      setImages([]);
      setIsShowFeedback(false);
      console.error('Lỗi:', error);
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
        <ListItem>
          <Center>
            <Grid templateColumns='repeat(3, 1fr)' gap={4} mt={5}>
              {data.map((item) => (
                <Box
                  key={item.id}
                  borderWidth='1px'
                  borderRadius='lg'
                  overflow='hidden'
                  p={4}
                  width='300px'
                  boxShadow='md'
                >
                  <Box>
                    <Text fontSize='lg' fontWeight='bold' mb={2}>
                      {item.name}
                    </Text>
                    <Text>{item.description}</Text>
                    <HStack justify='space-between' mt={8}>
                      <Text
                        className={styles.listitem}
                        onClick={() => (
                          setIsShowFeedback(true), setSelectedApp(item)
                        )}
                      >
                        Send Feedback
                      </Text>
                    </HStack>
                  </Box>
                </Box>
              ))}
            </Grid>
          </Center>
        </ListItem>
      </List>
      <Modal
        isOpen={isShowFeedback}
        onClose={() => (setIsShowFeedback(false), setFormData(defaultData))}
        closeOnOverlayClick={false}
        size='lg'
      >
        <ModalOverlay />
        <ModalContent maxW='1100px'>
          <ModalHeader>Send New Feedback</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8}>
            <Grid templateColumns='repeat(3, 1fr)' gap={8}>
              <GridItem colSpan={1}>
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
                      value={selectedApp.name}
                      w={300}
                      mr={1}
                      disabled
                    />
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
              onClick={() => (
                setIsShowFeedback(false), setFormData(defaultData)
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
