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
  let defaultData = {
    softwareId: '',
    deviceId: '',
    name: '',
    version: '',
    publisher: '',
    type: '',
    installDate: '',
    status: '',
  };
  let deviceID = null;
  const router = useRouter();

  try {
    deviceID = JSON.parse(localStorage.getItem('deviceId'));
    if (!deviceID || deviceID == null) {
      router.push('/userpages/assetlist');
    } else {
      defaultData = {
        ...defaultData,
        deviceId: deviceID,
      };
    }
  } catch (error) {
    console.error('Error saving data:', error);
  }

  //

  // console.log(BACK_END_PORT);
  //
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [formData, setFormData] = useState(defaultData);
  const [formData2, setFormData2] = useState(defaultData);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSoftwareTable, setShowSoftwareTable] = useState(false);
  const [showChevronDown, setShowChevronDown] = useState(true);
  const toast = useToast();
  //
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(formData);
  };
  const handleInputChange2 = (e) => {
    const { name, value } = e.target;
    setFormData2({ ...formData2, [name]: value });
    console.log(formData2);
  };
  //
  //
  const [selectedRow, setSelectedRow] = useState(new Set());
  const [isButtonDisabled, setButtonDisabled] = useState(true);
  const handleRowClick = (item) => {
    if (selectedRow === item.softwareId) {
      setSelectedRow(null); // Unselect the row if it's already selected
      setFormData2(defaultData);
      setButtonDisabled(true);
    } else {
      setSelectedRow(item.softwareId);
      setFormData2(item);
      setButtonDisabled(false);
    }
  };
  //
  const handleSaveAdd = async () => {
    try {
      // Replace 'YOUR_API_ENDPOINT_HERE' with your actual API endpoint
      const response = await axios.post(`${BACK_END_PORT}/api/v1/Software`, {
        //softwareId: formData.accId,
        name: formData.name,
        version: formData.version,
        publisher: formData.publisher,
        type: formData.type,
        installDate: formData.installDate,
        status: false,
        deviceId: deviceID,
      });
      console.log('Data saved:', response.data);
      setIsOpenAdd(false); // Close the modal after successful save
      setFormData(defaultData);
      setSelectedRow(new Set());
      // Reload new data for the table
      const newDataResponse = await axios.get(
        `${BACK_END_PORT}/api/v1/Software/list_software_by_device` + deviceID,
      );
      setData(newDataResponse.data);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  //
  const handleSaveEdit = async () => {
    try {
      // Replace 'YOUR_API_ENDPOINT_HERE' with your actual API endpoint
      const response = await axios.put(`${BACK_END_PORT}/api/v1/Software`, {
        // deviceId: formData.deviceId,
        softwareId: formData2.softwareId,
        name: formData2.name,
        version: formData2.version,
        publisher: formData2.publisher,
        type: formData2.type,
        installDate: formData2.installDate,
        status: formData2.status,
      });
      console.log('Data saved:', response.data);
      setIsOpenEdit(false); // Close the modal after successful save
      setFormData2(defaultData);
      setSelectedRow(new Set());
      // Reload new data for the table
      const newDataResponse = await axios.get(
        `${BACK_END_PORT}/api/v1/Software/list_software_by_device` + deviceID,
      );
      setData(newDataResponse.data);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  //
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BACK_END_PORT}/api/v1/Software/list_software_by_device` + deviceID,
        );
        setData(response.data); // Assuming the API returns an array of objects
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  //
  const handleDelete = async () => {
    try {
      await axios.delete(
        `${BACK_END_PORT}/api/v1/Software?softwareid=` + formData2.softwareId,
      );
      setIsOpenDelete(false); // Close the "Confirm Delete" modal
      setSelectedRow(new Set());

      // Reload the data for the table after deletion
      const newDataResponse = await axios.get(
        `${BACK_END_PORT}/api/v1/Software/list_software_by_device` + deviceID,
      );
      setData(newDataResponse.data);
      toast({
        title: 'Software Deleted',
        description: 'The software has been successfully deleted.',
        status: 'success',
        duration: 3000, // Duration in milliseconds
        isClosable: true,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };
  //
  return (
    <Box className={styles.bodybox}>
      <List>
        <ListItem className={styles.list}>
          <Link
            href='/userpages/userhome'
            _hover={{ textDecor: 'underline' }}
            className={styles.listitem}
          >
            Home
          </Link>
          <ArrowForwardIcon margin={1}></ArrowForwardIcon>
          <Link
            href='/userpages/assetlist'
            _hover={{ textDecor: 'underline' }}
            className={styles.listitem}
          >
            Assets
          </Link>
          <ArrowForwardIcon margin={1}></ArrowForwardIcon>Asset Detail
        </ListItem>
        <ListItem className={styles.list}>
          <Flex>
            <Text fontSize='2xl'>Software</Text>
            {showChevronDown ? (
              <Box ml={1}>
                <ChevronDownIcon
                  border='1px solid gray'
                  borderRadius='50'
                  textAlign='center'
                  alignItems='center'
                  mt={2}
                  _hover={{ backgroundColor: 'gray.100' }}
                  cursor='pointer'
                  onClick={() => {
                    setShowSoftwareTable(true);
                    setShowChevronDown(false);
                  }}
                ></ChevronDownIcon>
              </Box>
            ) : (
              <Box ml={1}>
                <ChevronUpIcon
                  border='1px solid gray'
                  borderRadius='50'
                  textAlign='center'
                  alignItems='center'
                  mt={2}
                  _hover={{ backgroundColor: 'gray.100' }}
                  cursor='pointer'
                  onClick={() => {
                    setShowSoftwareTable(false);
                    setShowChevronDown(true);
                  }}
                ></ChevronUpIcon>
              </Box>
            )}
          </Flex>
        </ListItem>
        {showSoftwareTable && (
          <ListItem className={styles.list}>
            <TableContainer>
              <Table variant='simple'>
                <TableCaption>Total {data.length} softwares</TableCaption>
                <Thead>
                  <Tr>
                    <Th display='none'>Software ID</Th>
                    <Th>Name</Th>
                    <Th display='none'>Assets</Th>
                    <Th>Publisher</Th>
                    <Th>Versions</Th>
                    <Th>Release</Th>
                    <Th>Install Date</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.map((item) => (
                    <Tr
                      cursor={'pointer'}
                      key={item.softwareId}
                      bg={
                        selectedRow === item.softwareId ? 'green.100' : 'white'
                      } // Change background color for selected rows
                      onClick={() => handleRowClick(item)}
                    >
                      <Td display='none'>{item.softwareId}</Td>
                      <Td>{item.name}</Td>
                      <Td display='none'>{item.deviceId}</Td>
                      <Td>{item.publisher}</Td>
                      <Td>{item.version}</Td>
                      <Td>{item.type}</Td>
                      <Td>{item.installDate}</Td>
                      <Td>{item.status ? 'Have Issues' : 'No Issues'}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </ListItem>
        )}
        <ListItem className={styles.list}>
          <Flex>
            <Text fontSize='2xl'>Lisence Keys</Text>
          </Flex>
        </ListItem>
        <ListItem className={styles.list}>
          <Flex>
            <Text fontSize='2xl'>Antivirus</Text>
          </Flex>
        </ListItem>
      </List>
    </Box>
  );
}

export default AssetDetailPage;
