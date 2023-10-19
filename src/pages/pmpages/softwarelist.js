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
import { ArrowForwardIcon, ViewIcon } from '@chakra-ui/icons';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { AiOutlineEye, AiFillEye } from 'react-icons/ai';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { BACK_END_PORT } from '../../../env';
const defaultData = {
  softwareId: '',
  deviceId: '',
  name: '',
  version: '',
  publisher: '',
  type: '',
  installDate: '',
  status: '',
};

function SoftwarePage() {
  // console.log(BACK_END_PORT);
  const router = useRouter();
  const [account, setAccount] = useState(null);

  useEffect(() => {
    // Access localStorage on the client side
    const storedAccount = localStorage.getItem('account');
    if (storedAccount) {
      setAccount(JSON.parse(storedAccount));
      if (!account || account == null) {
        router.push('http://localhost:3000');
      }
    }
  }, []);
  //
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [formData, setFormData] = useState(defaultData);
  const [formData2, setFormData2] = useState(defaultData);
  const [data, setData] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  //
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
        deviceId: formData.deviceId,
      });
      console.log('Data saved:', response.data);
      setIsOpenAdd(false); // Close the modal after successful save
      setFormData(defaultData);
      setSelectedRow(new Set());
      // Reload new data for the table
      const newDataResponse = await axios.get(
        `${BACK_END_PORT}/api/v1/Software/list_software_by_user` +
          account.accId,
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
        `${BACK_END_PORT}/api/v1/Software/list_software_by_user` +
          account.accId,
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
          `${BACK_END_PORT}/api/v1/Software/list_software_by_user` +
            account.accId,
        );
        setData(response.data); // Assuming the API returns an array of objects
        const response2 = await axios.get(
          `${BACK_END_PORT}/api/v1/Device/list_device_with_user` +
            account.accId,
        );
        setDeviceData(response2.data); // Assuming the API returns an array of objects
        setLoading(false);
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
        `${BACK_END_PORT}/api/v1/Software/list_software_by_user` +
          account.accId,
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
            href='/pmpages/pmhome'
            _hover={{ textDecor: 'underline' }}
            className={styles.listitem}
          >
            Home
          </Link>
          <ArrowForwardIcon margin={1}></ArrowForwardIcon>Management Software
        </ListItem>
        <ListItem className={styles.list}>
          <Flex>
            <Text fontSize='2xl'>Management Software</Text>
            <Spacer />
            <Box>
              <IconButton
                aria-label='Add'
                icon={<FaPlus />}
                colorScheme='gray' // Choose an appropriate color
                marginRight={1}
                onClick={() => (
                  setFormData({
                    ...formData,
                    deviceId: deviceData[0].deviceId,
                  }),
                  setIsOpenAdd(true)
                )}
              />
              <IconButton
                aria-label='Edit'
                icon={<FaEdit />}
                colorScheme='gray' // Choose an appropriate color
                marginRight={1}
                onClick={() => setIsOpenEdit(true)}
                isDisabled={isButtonDisabled}
              />
              <IconButton
                aria-label='Delete'
                icon={<FaTrash />}
                colorScheme='gray' // Choose an appropriate color
                onClick={() => setIsOpenDelete(true)}
                isDisabled={isButtonDisabled}
              />
            </Box>
          </Flex>
        </ListItem>
        <ListItem className={styles.list}>
          <TableContainer>
            <Table variant='simple'>
              <TableCaption>Total {data.length} softwares</TableCaption>
              <Thead>
                <Tr>
                  <Th display='none'>Software ID</Th>
                  <Th>Name</Th>
                  <Th>Assets</Th>
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
                    bg={selectedRow === item.softwareId ? 'green.100' : 'white'} // Change background color for selected rows
                    onClick={() => handleRowClick(item)}
                  >
                    <Td display='none'>{item.softwareId}</Td>
                    <Td>{item.name}</Td>
                    <Td>{item.deviceId}</Td>
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
      </List>

      <Modal //Modal edit software
        isOpen={isOpenEdit}
        onClose={() => setIsOpenEdit(false)}
        closeOnOverlayClick={false}
        size='lg'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Software</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8}>
            <Grid templateColumns='repeat(2, 1fr)' gap={4}>
              <Input
                name='softwareId'
                value={formData2.softwareId}
                onChange={handleInputChange2}
                display='none'
              />
              <GridItem>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    name='name'
                    value={formData2.name}
                    onChange={handleInputChange2}
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Version</FormLabel>
                  <Input
                    name='version'
                    value={formData2.version}
                    onChange={handleInputChange2}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Release</FormLabel>
                  <Input
                    name='type'
                    value={formData2.type}
                    onChange={handleInputChange2}
                  />
                </FormControl>
                {/* Add more fields for the first column */}
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Publisher</FormLabel>
                  <Input
                    name='publisher'
                    value={formData2.publisher}
                    onChange={handleInputChange2}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Install Date</FormLabel>
                  <Input
                    name='installDate'
                    value={formData2.installDate}
                    // onChange={handleInputChange}
                    isDisabled={true}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Input
                    name='status'
                    value={formData2.status}
                    // onChange={handleInputChange}
                    isDisabled={true}
                  />
                </FormControl>
                {/* Add more fields for the second column */}
              </GridItem>
            </Grid>
            {/* Additional fields can be added to the respective columns */}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleSaveEdit}>
              Save
            </Button>
            <Button onClick={() => setIsOpenEdit(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal // Modal add new software
        isOpen={isOpenAdd}
        onClose={() => (setIsOpenAdd(false), setFormData(defaultData))}
        closeOnOverlayClick={false}
        size='lg'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Software</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8}>
            <Grid templateColumns='repeat(2, 1fr)' gap={4}>
              <Input
                name='softwareID'
                value={formData.softwareId}
                onChange={handleInputChange}
                display='none'
              />
              <GridItem>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Version</FormLabel>
                  <Input
                    name='version'
                    value={formData.version}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Release</FormLabel>
                  <Input
                    name='type'
                    value={formData.type}
                    onChange={handleInputChange}
                  />
                </FormControl>
                {/* Add more fields for the first column */}
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Publisher</FormLabel>
                  <Input
                    name='publisher'
                    value={formData.publisher}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Install Date</FormLabel>
                  <Input
                    name='installDate'
                    value={formData.installDate}
                    onChange={handleInputChange}
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Asset</FormLabel>
                  <Select
                    name='deviceId'
                    value={formData.deviceId}
                    onChange={handleInputChange}
                  >
                    {deviceData.map((item) => (
                      <option key={item.deviceId} value={item.deviceId}>
                        {item.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                {/* Add more fields for the second column */}
              </GridItem>
            </Grid>
            {/* Additional fields can be added to the respective columns */}
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

      <Modal isOpen={isOpenDelete} onClose={() => setIsOpenDelete(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete this software?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={handleDelete}>
              Delete
            </Button>
            <Button onClick={() => setIsOpenDelete(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default SoftwarePage;
