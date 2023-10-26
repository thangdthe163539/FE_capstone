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

function AssetDetailPage() {
  const router = useRouter();
  let report = null;

  try {
    report = JSON.parse(localStorage.getItem('report'));
    if (!report || report == null) {
      router.push('/pmpages/reportlist');
    }
  } catch (error) {
    console.error('Error saving data:', error);
  }
  //
  const defaultData = report;
  let account = null;

  useEffect(() => {
    // Access localStorage on the client side
    const storedAccount = localStorage.getItem('account');

    if (storedAccount) {
      account = JSON.parse(storedAccount);
      if (!account || account == null) {
        // router.push('http://localhost:3000');
      }
    }
  });
  // console.log(BACK_END_PORT);
  //
  const [formData, setFormData] = useState(defaultData);
  const toast = useToast();
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
    if (formData.status === 1) {
      // If status is 1, set endDate to an empty string
      setFormData({
        ...formData,
        endDate: null, // Empty string
      });
    } else {
      // If status is not 1, set endDate to the current date
      const currentDate = getCurrentDateString();
      setFormData({
        ...formData,
        endDate: currentDate, // Empty string
      });
    }
    try {
      // Replace 'YOUR_API_ENDPOINT_HERE' with your actual API endpoint
      const response = await axios.put(
        `${BACK_END_PORT}/api/Report/UpdateReport/` + formData.softwareId,
        {
          softwareId: formData.softwareId,
          description: formData.description,
          type: formData.type,
          startDate: formData.startDate,
          endDate: formData.endDate,
          status: formData.status,
        },
      );
      console.log('Data saved:', response.data);
      toast({
        title: 'Edit Report',
        description: 'The report has been successfully edited.',
        status: 'success',
        duration: 3000, // Duration in milliseconds
        isClosable: true,
      });
      router.push('/pmpages/reportlist');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  return (
    <Box className={styles.bodybox}>
      <List>
        <ListItem className={styles.list}>
          <Link href='/pmpages/pmhome' className={styles.listitem}>
            Home
          </Link>
          <ArrowForwardIcon margin={1}></ArrowForwardIcon>
          <Link href='/pmpages/reportlist' className={styles.listitem}>
            Reports Management
          </Link>
          <ArrowForwardIcon margin={1}></ArrowForwardIcon>Report Detail
        </ListItem>
        <ListItem className={styles.list}>
          <Text fontSize='2xl'>Report Detail</Text>
        </ListItem>
        <ListItem className={styles.list}>
          <Flex direction='row' width='100%' justify='space-between'>
            <Flex direction='row' align='center'>
              <Text className={`${styles.text1} ${styles.text2}`}>Name:</Text>
              <Text>{formData.name}</Text>
            </Flex>
            <Flex direction='row' align='center'>
              <Text className={`${styles.text1} ${styles.text2}`}>Type:</Text>
              <Text className={styles.text1}>{formData.type}</Text>
            </Flex>
            <Flex direction='row' align='center'>
              <Text className={`${styles.text1} ${styles.text2}`}>
                Start Date:
              </Text>
              <Text className={styles.text1}>{formData.startDate}</Text>
            </Flex>
            <Flex direction='row' align='center'>
              <Text className={`${styles.text1} ${styles.text2}`}>
                End Date:
              </Text>
              <Text className={styles.text1}>{formData.endDate}</Text>
            </Flex>
            <Flex direction='row' align='center'>
              <Text className={`${styles.text1} ${styles.text2}`}>Status:</Text>
              <Select
                name='status'
                value={formData.status}
                onChange={handleStatusChange} // Add onChange handler
                border='none'
              >
                <option value='1'>Unsolved</option>
                <option value='2'>Solved</option>
                <option value='3'>Deleted</option>
              </Select>
            </Flex>
          </Flex>

          <Box>
            <FormControl>
              <Text className={`${styles.text1} ${styles.text2}`}>
                Description
              </Text>
              <Textarea
                name='description'
                value={formData.description}
                onChange={handleDescriptionChange} // Add onChange handler
                minH={200}
              />
            </FormControl>
          </Box>
        </ListItem>
        <Button mt={2} onClick={handleSaveEdit}>
          Save
        </Button>
      </List>
    </Box>
  );
}

export default AssetDetailPage;
