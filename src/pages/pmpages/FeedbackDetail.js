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
  FormErrorMessage,
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
  const [invalidFields, setInvalidFields] = useState([]);
  const [typePage, setTypePage] = useState(title);

  useEffect(() => {
    const reportData = sessionStorage.getItem('report');
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
    // Access sessionStorage on the client side
    const storedAccount = sessionStorage.getItem('account');
    if (storedAccount) {
      try {
        const accountDataDecode = JSON.parse(storedAccount);
        if (!accountDataDecode) {
          router.push('/page405');
        } else {
          if (accountDataDecode.roleId !== 2 || accountDataDecode.status == 3) {
            router.push('/page405');
          } else if (accountDataDecode.status == 2) {
            router.push('/ViewApplication');
          }
          setAccount(accountDataDecode);
        }
      } catch (error) {
        router.push('/page405');
      }
    } else {
      router.push('/page405');
    }
  }, []);
  //
  const handleDescriptionChange = (e) => {
    setFormData({
      ...formData,
      description: e.target.value,
    });
    validateInputs();
  };
  const validateInputs = () => {
    const requiredFields = ['description'];
    const errors = [];
    for (const field of requiredFields) {
      if (!formData[field]) {
        errors.push(field);
      }
    }
    // Update state to mark fields as invalid
    setInvalidFields(errors);
    return errors;
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
    // Validate inputs before saving
    const validationErrors = validateInputs();
    if (validationErrors.length > 0) {
      // You can handle validation errors as needed
      console.error('Validation Errors:', validationErrors);
      return;
    }
    const url =
      `${BACK_END_PORT}/api/Report/UpdateReport/` + formData?.reportId;

    const submitData = new FormData();
    submitData.append('AppId', formData.appId);
    submitData.append('UpdaterID', account?.accId);
    submitData.append('Title', formData.title);
    submitData.append('Description', formData.description);
    submitData.append('Type', formData.type);
    submitData.append('Start_Date', formData.start_Date);
    submitData.append('End_Date', formData.end_Date);
    submitData.append('Status', formData.status);
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
        submitData.append(`Images`, file);
      });
    } else {
      submitData.append(`Images`, ' ');
    }

    try {
      const response = await axios.put(url, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      router.push('/pmpages/ListFeedback');
      toast({
        title: 'Feedback Updated',
        description: 'The feedback has been successfully updated.',
        status: 'success',
        duration: 3000, // Duration in milliseconds
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Feedback Updated Fail',
        description: 'The feedback has been fail when updated.',
        status: 'error',
        duration: 3000, // Duration in milliseconds
        isClosable: true,
      });
      console.error('Error:', error);
    }
  };

  const allowedExtensions = ['jpg', 'png'];
  const [image, setImage] = useState([]);

  const [isHovered, setIsHovered] = useState(null);
  const [error, setError] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomedIndex, setZoomedIndex] = useState(null);

  //Start image
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
    if (formData?.reportId) {
      const url = `http://localhost:5001/api/Image/list_Images_by_Report/${formData.reportId}`;

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
  }, [formData?.reportId]);

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
  //End image
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
          <Text fontSize='2xl'>
            Feedback: {formData?.title ? formData.title : 'N/A'}
          </Text>
        </ListItem>
        <ListItem className={styles.list}>
          <Flex direction='row' width='100%' justify='space-between'>
            <Flex direction='row' align='center'>
              <Text className={`${styles.text1} ${styles.text2}`}>Name:</Text>
              <Text className={styles.text1}>
                {formData?.name ? formData.name : 'N/A'}
              </Text>
            </Flex>
            <Flex direction='row' align='center'>
              <Text className={`${styles.text1} ${styles.text2}`}>Type:</Text>
              <Text className={styles.text1}>
                {formData?.type ? formData.type : 'N/A'}
              </Text>
            </Flex>

            <Flex direction='row' align='center'>
              <Text className={`${styles.text1} ${styles.text2}`}>
                Start date:
              </Text>
              <Text className={styles.text1}>
                {formData?.start_Date ? formData.start_Date : 'N/A'}
              </Text>
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
              <Text className={styles.text1}>
                {formData?.emailSend ? formData.emailSend : 'N/A'}
              </Text>
            </Flex>
            <Flex direction='row' align='center'>
              <Text className={`${styles.text1} ${styles.text2}`}>Status:</Text>
              <Select
                name='status'
                value={formData?.status}
                onChange={handleStatusChange} // Add onChange handler
                border='none'
              >
                <option value='1'>Unsolved</option>
                <option value='2'>Solved</option>
                <option value='4'>Canceled</option>
              </Select>
            </Flex>
          </Flex>
          <Box mb={2}>
            <FormControl
              isRequired
              isInvalid={invalidFields.includes('description')}
            >
              <Flex>
                <FormLabel className={`${styles.text1}`}>Description</FormLabel>
                <Spacer />
                <FormErrorMessage>Description is required!</FormErrorMessage>
              </Flex>
              <Textarea
                name='description'
                value={formData?.description}
                onChange={handleDescriptionChange} // Add onChange handler
                minH={120}
              />
            </FormControl>
          </Box>
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
              )}
              {error && <Text color='red'>{error}</Text>}
            </GridItem>
          </Grid>
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
