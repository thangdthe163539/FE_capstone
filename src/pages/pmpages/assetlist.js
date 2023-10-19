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
  deviceId: '',
  accId: '',
  name: '',
  ipAddress: '',
  macAddress: '',
  manufacturer: '',
  model: '',
  serialNumber: '',
  lastSuccessfullScan: '',
  status: '',
};

function AssetsPage() {
  // console.log(BACK_END_PORT);
  const router = useRouter();
  let account = null;

  useEffect(() => {
    // Access localStorage on the client side
    const storedAccount = localStorage.getItem('account');
    if (storedAccount) {
      account = JSON.parse(storedAccount);
      console.log('asset list');
      console.log(account);
      if (!account || account == null) {
        // router.push('http://localhost:3000');
      }
    }
  }, []);
  //
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [formData, setFormData] = useState(defaultData);
  const [data, setData] = useState([]);
  const [accData, setAccData] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  //
  //
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  //
  //
  const [selectedRow, setSelectedRow] = useState(new Set());
  const [isButtonDisabled, setButtonDisabled] = useState(true);
  const handleRowClick = (item) => {
    if (selectedRow === item.deviceId) {
      setSelectedRow(null); // Unselect the row if it's already selected
      setFormData(defaultData);
      setButtonDisabled(true);
    } else {
      setSelectedRow(item.deviceId);
      setFormData(item);
      setButtonDisabled(false);
    }
  };
  //
  //
  const handleSave = async () => {
    try {
      // Replace 'YOUR_API_ENDPOINT_HERE' with your actual API endpoint
      const response = await axios.put(`${BACK_END_PORT}/api/v1/Device`, {
        deviceId: formData.deviceId,
        accId: formData.accId,
        name: formData.name,
        ipAddress: formData.ipAddress,
        macAddress: formData.macAddress,
        manufacturer: formData.manufacturer,
        model: formData.model,
        serialNumber: formData.serialNumber,
        lastSuccessfullScan: formData.lastSuccessfullScan,
        status: formData.status,
      });
      console.log('Data saved:', response.data);
      setIsOpenEdit(false); // Close the modal after successful save
      setFormData(defaultData);
      setSelectedRow(new Set());
      // Reload new data for the table
      const newDataResponse = await axios.get(
        `${BACK_END_PORT}/api/v1/Device/list_device_with_user` + account.accId,
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
          `${BACK_END_PORT}/api/v1/Device/list_device_with_user` +
            account.accId,
        );
        setData(response.data); // Assuming the API returns an array of objects
        const response2 = await axios.get(
          `${BACK_END_PORT}/api/v1/Account/ListAccount`,
        );
        setAccData(response2.data); // Assuming the API returns an array of objects
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    if (data.length > 0 && accData.length > 0) {
      const mergedData = data.map((device) => {
        const account = accData.find((acc) => acc.accId === device.accId);
        return {
          ...device,
          accName: account ? account.account1 : 'Unknown Account',
        };
      });
      setDeviceData(mergedData);
    }
  }, [data, accData]);
  //
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      console.log('Selected File:', selectedFile);
      // You can perform actions with the selected file here
    }
  };
  const handleDetail = (item) => {
    localStorage.setItem('deviceId', JSON.stringify(item.deviceId));
    // console.log(localStorage.getItem('deviceId'));
  };
  //
  const handleDelete = async () => {
    try {
      await axios.delete(
        `${BACK_END_PORT}/api/v1/Device/with_key?DeviceId=` + formData.deviceId,
      );
      setIsOpenDelete(false); // Close the "Confirm Delete" modal
      setSelectedRow(new Set());

      // Reload the data for the table after deletion
      const newDataResponse = await axios.get(
        `${BACK_END_PORT}/api/v1/Device/list_device_with_user` + account.accId,
      );
      setData(newDataResponse.data);
      toast({
        title: 'Asset Deleted',
        description: 'The asset has been successfully deleted.',
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
          <ArrowForwardIcon margin={1}></ArrowForwardIcon>Management Assets
        </ListItem>
        <ListItem className={styles.list}>
          <Flex>
            <Text fontSize='2xl'>Management Assets</Text>
            <Spacer />
            <Box>
              <IconButton
                aria-label='Add'
                icon={<FaPlus />}
                colorScheme='gray' // Choose an appropriate color
                marginRight={1}
                onClick={() => setIsOpenAdd(true)}
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
              <TableCaption>Total {data.length} assets</TableCaption>
              <Thead>
                <Tr>
                  <Th></Th>
                  <Th>Account</Th>
                  <Th>Name</Th>
                  <Th>IP Address</Th>
                  <Th>MAC Address</Th>
                  <Th>Manufacturer</Th>
                  <Th>Model</Th>
                  <Th>Serial Number</Th>
                  <Th>Last Successfull Scan</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {deviceData.map((item) => (
                  <Tr
                    cursor={'pointer'}
                    key={item.deviceId}
                    bg={selectedRow === item.deviceId ? 'green.100' : 'white'} // Change background color for selected rows
                    onClick={() => handleRowClick(item)}
                  >
                    <Td>
                      <Button
                        bg='none'
                        border='1px solid gray'
                        w='5'
                        h='10'
                        onClick={() => handleDetail(item)}
                      >
                        <Link href='/pmpages/assetdetail'>
                          <Icon as={ViewIcon}></Icon>
                        </Link>
                      </Button>
                    </Td>
                    <Td display='none'>{item.deviceId}</Td>
                    <Td>{item.accName}</Td>
                    <Td>{item.name}</Td>
                    <Td>{item.ipAddress}</Td>
                    <Td>{item.macAddress}</Td>
                    <Td>{item.manufacturer}</Td>
                    <Td>{item.model}</Td>
                    <Td>{item.serialNumber}</Td>
                    <Td>{item.lastSuccessfullScan}</Td>
                    <Td>{item.status ? 'Active' : 'Disabled'}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </ListItem>
      </List>

      <Modal //Modal edit asset
        isOpen={isOpenEdit}
        onClose={() => setIsOpenEdit(false)}
        closeOnOverlayClick={false}
        size='lg'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Asset</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8}>
            <Grid templateColumns='repeat(2, 1fr)' gap={4}>
              <Input
                name='deviceID'
                value={formData.deviceId}
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
                  <FormLabel>IP Address</FormLabel>
                  <Input
                    name='ipAddress'
                    value={formData.ipAddress}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Manufacturer</FormLabel>
                  <Input
                    name='manufacturer'
                    value={formData.manufacturer}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Serial Number</FormLabel>
                  <Input
                    name='serialNumber'
                    value={formData.serialNumber}
                    onChange={handleInputChange}
                  />
                </FormControl>
                {/* Add more fields for the first column */}
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Account</FormLabel>
                  <Select
                    name='accId'
                    value={formData.accId}
                    onChange={handleInputChange}
                  >
                    {accData.map((item) => (
                      <option key={item.accId} value={item.accId}>
                        {item.account1}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>MAC Address</FormLabel>
                  <Input
                    name='macAddress'
                    value={formData.macAddress}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Model</FormLabel>
                  <Input
                    name='model'
                    value={formData.model}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Last Successful Scan</FormLabel>
                  <Input
                    name='lastSuccessfullScan'
                    value={formData.lastSuccessfullScan}
                    onChange={handleInputChange}
                  />
                </FormControl>
                {/* Add more fields for the second column */}
              </GridItem>
            </Grid>
            {/* Additional fields can be added to the respective columns */}
            <FormControl>
              <FormLabel>Status</FormLabel>
              <Select
                name='status'
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value='True'>Active</option>
                <option value='False'>Disable</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleSave}>
              Save
            </Button>
            <Button onClick={() => setIsOpenEdit(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal // Modal add new asset
        isOpen={isOpenAdd}
        onClose={() => setIsOpenAdd(false)}
        closeOnOverlayClick={false}
        size='lg'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Asset</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8}>
            <FormControl>
              <Input
                type='file'
                // display='none' // Hide the default input styling
                onChange={handleFileChange}
              ></Input>
              <label>
                <Button as='span'>Choose File</Button>
              </label>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleSave}>
              Save
            </Button>
            <Button onClick={() => setIsOpenAdd(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenDelete} onClose={() => setIsOpenDelete(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete this asset?</Text>
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

export default AssetsPage;
