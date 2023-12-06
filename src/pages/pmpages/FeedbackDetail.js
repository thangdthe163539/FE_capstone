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
  Icon,
  useToast,
  Center,
  Image,
  InputGroup,
  InputLeftAddon,
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
import { DeleteIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import styles from '@/styles/pm.module.css';
import {
  ArrowForwardIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@chakra-ui/icons';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { AiOutlineEye, AiFillEye } from 'react-icons/ai';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { BACK_END_PORT } from '../../../env';

function ReportPage(title) {
  const router = useRouter();
  const [formData, setFormData] = useState();
  const toast = useToast();
  const [typePage, setTypePage] = useState(title);

  useEffect(() => {
    const reportData = localStorage.getItem('report');
    if (reportData) {
      const reportDataDecode = JSON.parse(reportData);
      if (!reportDataDecode) {
        // router.push('/pmpages/assetlist');
      } else {
        // setReport(reportDataDecode);
        setFormData(reportDataDecode);
      }
    }
  }, []);
  //
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
  //
  const handleDescriptionChange = (e) => {
    setFormData({
      ...formData,
      description: e.target.value,
    });
  };

  // Define an onChange handler for the Status Select
  const handleStatusChange = (e) => {
    setFormData({
      ...formData,
      status: e.target.value,
    });
  };
  // Function to get the current date and set it for the endDate field
  const getCurrentDateString = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSaveEdit = async () => {
    // if (formData.status === 1) {
    //   // If status is 1, set endDate to an empty string
    //   setFormData({
    //     ...formData,
    //     endDate: null, // Empty string
    //   });
    // } else {
    //   // If status is not 1, set endDate to the current date
    //   const currentDate = getCurrentDateString();
    //   setFormData({
    //     ...formData,
    //     endDate: currentDate, // Empty string
    //   });
    // }
    const submitData = new FormData();
    const currentDate = getCurrentDateString();
    try {
      fileObjects.forEach((file) => {
        submitData.append(`Images`, file);
      });
      submitData.append('AppId', formData?.appId);
      submitData.append('UpdaterID', account?.accId);
      submitData.append('Title', formData?.title);
      submitData.append('Description', formData?.description);
      submitData.append('Type', formData?.type);
      submitData.append('Start_Date', formData?.start_Date);
      submitData.append('End_Date', formData?.end_Date);
      submitData.append(
        'ClosedDate',
        formData?.status == 2 ? currentDate : formData?.closedDate,
      );
      submitData.append('Status', formData?.status);
      // Replace 'YOUR_API_ENDPOINT_HERE' with your actual API endpoint
      const response = await axios.put(
        `${BACK_END_PORT}/api/Report/UpdateReport/` + formData.reportId,
        submitData,
      );
      console.log('Data saved:', response.data);
      toast({
        title: 'Edit Report',
        description: 'The report has been successfully edited.',
        status: 'success',
        duration: 3000, // Duration in milliseconds
        isClosable: true,
      });
      router.push('/pmpages/ListFeedback');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const allowedExtensions = ['jpg', 'png'];
  const [image, setImage] = useState([]);

  const [isHovered, setIsHovered] = useState(null);
  const [error, setError] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomedIndex, setZoomedIndex] = useState(null);
  const handleImageClick = (index) => {
    setZoomedIndex(index);
    setIsZoomed(true);
  };
  const handleZoomClose = () => {
    setIsZoomed(false);
    setZoomedIndex(null);
  };
  const handleDeleteClick = (index, event) => {
    event.stopPropagation(); // Ngăn chặn sự kiện lan toả lên các phần tử cha
    handleRemoveImageU(index);
  };

  const handleDeleteClick_Add = (index, event) => {
    event.stopPropagation(); // Ngăn chặn sự kiện lan toả lên các phần tử cha
    handleRemoveImage(index);
  };
  const handleRemoveImageU = (index) => {
    setImage((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });
    setError('');
  };

  const [imagesState, setImages] = useState([]);

  // console.log(imagesState);
  const handleImageMouseLeave = () => {
    setIsHovered(null);
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

  const fileObjects = imagesState.map((image) => {
    // Tạo một Blob từ dataURL
    const blob = dataURLtoBlob(image.dataURL);
    // Tạo một File từ Blob
    return new File([blob], image.fileName, { type: blob.type });
    [];
  });

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

  const handleImageMouseEnter = (index, event) => {
    event.stopPropagation(); // Ngăn chặn sự kiện lan toả lên các phần tử cha
    setIsHovered(index);
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
  useEffect(() => {
    if (formData?.reportId) {
      const url = `http://localhost:5001/api/Image/list_Images_by_Report/${formData?.reportId}`;

      fetch(url, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((data) => {
          if (data?.status !== 400 && data?.status !== 404) {
            setImage(data);
          }
        })
        .catch((error) => {
          console.error('Lỗi:', error);
        });
    }
  }, [formData]);
  console.log(title);
  return (
    <Box className={styles.bodybox}>
      <List>
        <ListItem className={styles.list}>
          <Link href='/pmpages/PoHome' className={styles.listitem}>
            Home
          </Link>
          <ArrowForwardIcon margin={1}></ArrowForwardIcon>
          <Link href='/pmpages/Feedback' className={styles.listitem}>
            Feedback
          </Link>
          <ArrowForwardIcon margin={1}></ArrowForwardIcon>
          <Link href='/pmpages/ListFeedback' className={styles.listitem}>
            List Feedback
          </Link>
          <ArrowForwardIcon margin={1}></ArrowForwardIcon>Feedback Detail
        </ListItem>
        <ListItem className={styles.list}>
          <Text fontSize='2xl'>Feedback Detail</Text>
        </ListItem>
        <ListItem className={styles.list}>
          <Flex direction='row' width='100%' justify='space-between'>
            <Flex direction='row' align='center'>
              <Text className={`${styles.text1} ${styles.text2}`}>Name:</Text>
              <Text>{formData?.name}</Text>
            </Flex>
            <Flex direction='row' align='center'>
              <Text className={`${styles.text1} ${styles.text2}`}>Type:</Text>
              <Text className={styles.text1}>{formData?.type}</Text>
            </Flex>

            <Flex direction='row' align='center'>
              <Text className={`${styles.text1} ${styles.text2}`}>
                Start date:
              </Text>
              <Text className={styles.text1}>{formData?.start_Date}</Text>
            </Flex>
            <Flex direction='row' align='center'>
              <Text className={`${styles.text1} ${styles.text2}`}>
                Deadline:
              </Text>
              <Text className={styles.text1}>{formData?.end_Date}</Text>
            </Flex>
            <Flex direction='row' align='center'>
              <Text className={`${styles.text1} ${styles.text2}`}>
                Closed date:
              </Text>
              <Text className={styles.text1}>
                {formData?.closedDate !== null
                  ? formData?.closedDate
                  : 'In processing'}
              </Text>
            </Flex>
          </Flex>
          <Flex direction='row' width='100%' justify='space-between'>
            <Flex direction='row' align='center'>
              <Text className={`${styles.text1} ${styles.text2}`}>
                Created by:{' '}
              </Text>
              <Text className={styles.text1}>{formData?.emailSend}</Text>
            </Flex>
            <Flex direction='row' align='center'>
              <Text className={`${styles.text1} ${styles.text2}`}>Status:</Text>
              <Select
                name='status'
                value={formData?.status}
                onChange={handleStatusChange} // Add onChange handler
              >
                <option value='1'>Unsolved</option>
                <option value='2'>Solved</option>
                <option value='4'>Canceled</option>
              </Select>
            </Flex>
          </Flex>
          <Box>
            <Flex>
              <Text className={`${styles.text1} ${styles.text2}`}>Title: </Text>
              <Text className={styles.text1}>{formData?.title}</Text>
            </Flex>
            <FormControl>
              <Text className={`${styles.text1}`} fontWeight='bold'>
                Description
              </Text>
              <Textarea
                name='description'
                value={formData?.description}
                onChange={handleDescriptionChange} // Add onChange handler
                minH={200}
              />
            </FormControl>
          </Box>
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
            {!imagesState.length &&
              image.map((image, index) => (
                <Box
                  key={index}
                  position='relative'
                  maxW='100px'
                  maxH='200px'
                  overflow='hidden'
                  onClick={() => handleImageClick(index)}
                  onMouseEnter={(event) => handleImageMouseEnter(index, event)}
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
            {imagesState.map((image, index) => (
              <Box
                key={index}
                position='relative'
                maxW='100px'
                maxH='200px'
                overflow='hidden'
                onClick={() => handleImageClick(index)}
                onMouseEnter={(event) => handleImageMouseEnter(index, event)}
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
                      onClick={(event) => handleDeleteClick_Add(index, event)}
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
        </ListItem>
        <Button mt={2} onClick={handleSaveEdit}>
          Save
        </Button>
      </List>
    </Box>
  );
}

export default ReportPage;
