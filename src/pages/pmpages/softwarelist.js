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
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { BACK_END_PORT } from '../../../env';
import Header2 from '@/components/layouts/Header/index2';
//
const defaultData = {
  accId: '',
  softwareId: '',
  deviceId: '',
  name: '',
  version: '',
  release: '',
  publisher: '',
  type: 'Web App',
  os: 'Window',
  installDate: '',
  status: '',
};

function SoftwarePage() {
  // console.log(BACK_END_PORT);
  const router = useRouter();
  let account = null;

  useEffect(() => {
    // Access localStorage on the client side
    const storedAccount = localStorage.getItem('account');
    if (storedAccount) {
      account = JSON.parse(storedAccount);
      defaultData.accId = account.accId;
      if (!account || account == null) {
        // router.push('http://localhost:3000');
      }
    }
  });
  //
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [formData, setFormData] = useState(defaultData);
  const [formData2, setFormData2] = useState(defaultData);
  const [data, setData] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [softwareData, setSoftwareData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSoftwareData, setFilteredSoftwareData] = useState([]);
  const toast = useToast();
  //
  //
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleInputChange2 = (e) => {
    const { name, value } = e.target;
    setFormData2({ ...formData2, [name]: value });
    // console.log(formData2);
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
      // console.log(formData2);
      setButtonDisabled(false);
    }
  };
  //
  const handleSaveAdd = async () => {
    try {
      // Replace 'YOUR_API_ENDPOINT_HERE' with your actual API endpoint
      const response = await axios.post(
        `${BACK_END_PORT}/api/v1/Software/CreateSW`,
        {
          accId: formData.accId,
          name: formData.name,
          publisher: formData.publisher,
          version: formData.version,
          release: formData.release,
          type: formData.type,
          os: formData.os,
          status: 1,
          // deviceId: formData.deviceId,
        },
      );
      console.log('Data saved:', response.data);
      setIsOpenAdd(false); // Close the modal after successful save
      setFormData(defaultData);
      setSelectedRow(new Set());
      // Reload new data for the table
      const newDataResponse = await axios.get(
        `${BACK_END_PORT}/api/v1/Software/list_software_by_user/` +
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
      const response = await axios.put(
        `${BACK_END_PORT}/api/v1/Software/UpdateSW` + formData2.softwareId,
        {
          accId: formData2.accId,
          name: formData2.name,
          publisher: formData2.publisher,
          version: formData2.version,
          release: formData2.release,
          type: formData2.type,
          os: formData2.os,
          status: formData2.status,
        },
      );
      console.log('Data saved:', response.data);
      setIsOpenEdit(false); // Close the modal after successful save
      setFormData2(defaultData);
      setSelectedRow(new Set());
      // Reload new data for the table
      const newDataResponse = await axios.get(
        `${BACK_END_PORT}/api/v1/Software/list_software_by_user/` +
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
          `${BACK_END_PORT}/api/v1/Software/list_software_by_user/` +
            account.accId,
        );
        setData(response.data); // Assuming the API returns an array of objects
        // const response2 = await axios.get(
        //   `${BACK_END_PORT}/api/v1/Device/list_device_with_user` +
        //     account.accId,
        // );
        // setDeviceData(response2.data); // Assuming the API returns an array of objects
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  //
  useEffect(() => {
    // if (data.length > 0 && deviceData.length > 0) {
    if (data.length > 0) {
      const mergedData = data.map((software) => {
        const device = deviceData.find(
          (sw) => sw.deviceId === software.deviceId,
        );
        return {
          ...software,
          deviceName: device ? device.name : 'Unknown Device',
        };
      });
      setSoftwareData(mergedData);
    }
  }, [data, deviceData]);
  // Filter function to search for assets
  const filterAssets = () => {
    const query = searchQuery.toLowerCase();
    const filteredData = softwareData.filter((item) => {
      const name = item.name.toLowerCase();
      const publisher = item.publisher.toLowerCase();
      return name.includes(query) || publisher.includes(query);
    });
    setFilteredSoftwareData(filteredData);
  };

  // Update filtered data whenever the search query changes
  useEffect(() => {
    filterAssets();
  }, [searchQuery, softwareData]);

  // Handle search input change
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };
  //
  const handleDetail = (item) => {
    localStorage.setItem('software', JSON.stringify(item));
    // console.log(localStorage.getItem('deviceId'));
  };
  //
  const handleDelete = async () => {
    try {
      await axios.delete(
        `${BACK_END_PORT}/api/v1/Software/DeleteSoftWareWith_key?softwareid=` +
          formData2.softwareId,
      );
      setIsOpenDelete(false); // Close the "Confirm Delete" modal
      setSelectedRow(new Set());

      // Reload the data for the table after deletion
      const newDataResponse = await axios.get(
        `${BACK_END_PORT}/api/v1/Software/list_software_by_user/` +
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
          <Link href='/pmpages/pmhome' className={styles.listitem}>
            Home
          </Link>
          <ArrowForwardIcon margin={1}></ArrowForwardIcon>Software Management
        </ListItem>
        <ListItem className={styles.list}>
          <Flex>
            <Text fontSize='2xl'>Software Management</Text>
            <Spacer />
            <Input
              type='text'
              value={searchQuery}
              onChange={handleSearchInputChange}
              placeholder='Search'
              w={300}
              mr={1}
            />
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
            <Table
              variant='striped'
              colorScheme='gray'
              className={styles.cTable}
            >
              <TableCaption>
                Total {filteredSoftwareData.length} softwares
              </TableCaption>
              <Thead>
                <Tr>
                  <Th display='none'>Software ID</Th>
                  <Th className={styles.cTh}>Name</Th>
                  <Th className={styles.cTh}>Assets</Th>
                  <Th className={styles.cTh}>Publisher</Th>
                  <Th className={styles.cTh}>Versions</Th>
                  <Th className={styles.cTh}>Release</Th>
                  <Th className={styles.cTh}>Type</Th>
                  <Th className={styles.cTh}>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredSoftwareData
                  .filter((item) => item.status === 1 || item.status === 2)
                  .map((item) => (
                    <Tr
                      _hover={{
                        cursor: 'pointer',
                      }}
                      key={item.softwareId}
                      color={selectedRow === item.softwareId ? 'red' : 'black'}
                      onClick={() => handleRowClick(item)}
                    >
                      <Td className={styles.listitem}>
                        <Link
                          href={'/pmpages/softwaredetail'}
                          onClick={() => handleDetail(item)}
                        >
                          {item.name}
                        </Link>
                      </Td>
                      <Td>{item.deviceName}</Td>
                      <Td>{item.publisher}</Td>
                      <Td>{item.version}</Td>
                      <Td>{item.release}</Td>
                      <Td>{item.type}</Td>
                      <Td>
                        {item.status === 1
                          ? 'No issue'
                          : item.status === 2
                          ? 'Have issue'
                          : item.status === 3
                          ? 'Deleted'
                          : 'Unknown'}
                      </Td>
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
                    name='release'
                    value={formData2.release}
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
                  <FormLabel>Type</FormLabel>
                  <Select
                    name='type'
                    value={formData2.type}
                    onChange={handleInputChange2}
                  >
                    <option value='Web App'>Web App</option>
                    <option value='Desktop App'>Desktop App</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>OS</FormLabel>
                  <Select
                    name='os'
                    value={formData2.os}
                    onChange={handleInputChange2}
                  >
                    <option value='Window'>Window</option>
                    <option value='macOS'>macOS</option>
                    <option value='Linux'>Linux</option>
                    <option value='Android'>Android</option>
                    <option value='iOS'>iOS</option>
                  </Select>
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
          <ModalHeader>Create New Software</ModalHeader>
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
                    name='release'
                    value={formData.release}
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
                  <FormLabel>Type</FormLabel>
                  <Select
                    name='type'
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    <option value='Web app'>Web app</option>
                    <option value='Desktop app'>Desktop app</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>OS</FormLabel>
                  <Select
                    name='os'
                    value={formData.os}
                    onChange={handleInputChange}
                  >
                    <option value='Window'>Window</option>
                    <option value='macOS'>macOS</option>
                    <option value='Linux'>Linux</option>
                    <option value='Android'>Android</option>
                    <option value='iOS'>iOS</option>
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
