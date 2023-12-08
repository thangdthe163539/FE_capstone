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
  InputGroup,
  InputLeftAddon,
  Tooltip,
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
//
const defaultData = {
  accId: '',
  appId: '',
  deviceId: '',
  name: '',
  version: '',
  release: '',
  publisher: '',
  type: 'Web App',
  os: 'Windows',
  osversion: '',
  description: '',
  download: '',
  docs: '',
  language: '',
  db: '',
  status: '',
};

function SoftwarePage() {
  // console.log(BACK_END_PORT);
  const router = useRouter();
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
    if (selectedRow === item.appId) {
      setSelectedRow(null); // Unselect the row if it's already selected
      setFormData2(defaultData);
      setButtonDisabled(true);
    } else {
      setSelectedRow(item.appId);
      setFormData2(item);
      // console.log(formData2);
      setButtonDisabled(false);
    }
  };
  //
  const handleSaveAdd = async () => {
    try {
      // Replace 'YOUR_API_ENDPOINT_HERE' with your actual API endpoint
      const response = await axios.post(`${BACK_END_PORT}/api/App/CreateApp`, {
        accId: account.accId,
        name: formData.name,
        publisher: formData.publisher,
        version: formData.version,
        release: formData.release,
        type: formData.type,
        os: formData.os,
        osversion: formData.osversion,
        description: formData.description,
        download: formData.download,
        docs: formData.docs,
        language: formData.language,
        db: formData.db,
        status: 1,
        // deviceId: formData.deviceId,
      });
      console.log('Data saved:', response.data);
      setIsOpenAdd(false); // Close the modal after successful save
      setFormData(defaultData);
      setSelectedRow(new Set());
      // Reload new data for the table
      const newDataResponse = await axios.get(
        `${BACK_END_PORT}/api/App/list_App_by_user/` + account?.accId,
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
        `${BACK_END_PORT}/api/App/UpdateApplication/` + formData2.appId,
        {
          // accId: account.accId,
          name: formData2.name,
          publisher: formData2.publisher,
          version: formData2.version,
          release: formData2.release,
          type: formData2.type,
          os: formData2.os,
          osversion: formData2.osversion,
          description: formData2.description,
          download: formData2.download,
          docs: formData2.docs,
          language: formData2.language,
          db: formData2.db,
          status: formData2.status,
        },
      );
      console.log('Data saved:', response.data);
      setIsOpenEdit(false); // Close the modal after successful save
      setButtonDisabled(true);
      setFormData2(defaultData);
      setSelectedRow(new Set());
      // Reload new data for the table
      const newDataResponse = await axios.get(
        `${BACK_END_PORT}/api/App/list_App_by_user/` + account?.accId,
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
        try {
          const response = await axios.get(
            `${BACK_END_PORT}/api/App/list_App_by_user/` + account?.accId,
          );
          setData(response.data); // Assuming the API returns an array of objects
        } catch (error) {
          setData([]);
        }
        // const response2 = await axios.get(
        //   `${BACK_END_PORT}/api/Device/list_device_with_user` +
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
  }, [account]);
  //
  useEffect(() => {
    const fetchData = async () => {
      try {
        const mergedData = await Promise.all(
          data.map(async (software) => {
            try {
              const response2 = await axios.get(
                `${BACK_END_PORT}/api/Asset/list_Asset_by_App/` +
                  software?.appId,
              );
              const count = response2.data.length;
              return {
                ...software,
                assets: count || 0, // Use '0' if count is falsy (including undefined)
              };
            } catch (error) {
              console.log(error);
              return {
                ...software,
                assets: 0, // Use '0' if count is falsy (including undefined)
              };
            }
          }),
        );
        // console.log(mergedData)
        setSoftwareData(mergedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (data.length > 0) {
      fetchData();
    }
  }, [data]);

  // console.log(softwareData)

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
        `${BACK_END_PORT}/api/App/DeleteAppWith_key?Appid=` + formData2.appId,
      );
      setIsOpenDelete(false); // Close the "Confirm Delete" modal
      setButtonDisabled(true);
      setSelectedRow(new Set());

      // Reload the data for the table after deletion
      const newDataResponse = await axios.get(
        `${BACK_END_PORT}/api/App/list_App_by_user/` + account?.accId,
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
          <Link href='/pmpages/PoHome' className={styles.listitem}>
            Home
          </Link>
          <ArrowForwardIcon margin={1}></ArrowForwardIcon>Application
        </ListItem>
        <ListItem className={styles.list}>
          <Text fontSize='2xl'>Application</Text>
        </ListItem>
        <ListItem className={styles.list}>
          <Flex>
            <Box>
              <InputGroup>
                <InputLeftAddon children='Name / publisher' />
                <Input
                  type='text'
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  placeholder='search...'
                  w={300}
                  mr={1}
                />
              </InputGroup>
            </Box>
            <Spacer />
            <Box>
              <Tooltip label='Create'>
                <IconButton
                  aria-label='Add'
                  icon={<FaPlus />}
                  colorScheme='gray' // Choose an appropriate color
                  marginRight={1}
                  onClick={() => setIsOpenAdd(true)}
                />
              </Tooltip>
              <Tooltip label='Edit'>
                <IconButton
                  aria-label='Edit'
                  icon={<FaEdit />}
                  colorScheme='gray' // Choose an appropriate color
                  marginRight={1}
                  onClick={() => setIsOpenEdit(true)}
                  isDisabled={isButtonDisabled}
                />
              </Tooltip>
              <Tooltip label='Delete'>
                <IconButton
                  aria-label='Delete'
                  icon={<FaTrash />}
                  colorScheme='gray' // Choose an appropriate color
                  onClick={() => setIsOpenDelete(true)}
                  isDisabled={isButtonDisabled}
                />
              </Tooltip>
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
                Total{' '}
                {
                  filteredSoftwareData.filter((item) => item.status !== 3)
                    .length
                }{' '}
                application(s)
              </TableCaption>
              <Thead>
                <Tr>
                  <Th className={styles.cTh} width='10px'>
                    No
                  </Th>
                  <Th className={styles.cTh}>Name</Th>
                  <Th className={styles.cTh}>Assets</Th>
                  <Th className={styles.cTh}>Publisher</Th>
                  <Th className={styles.cTh}>Version</Th>
                  <Th className={styles.cTh}>Release</Th>
                  <Th className={styles.cTh}>Type</Th>
                  <Th className={styles.cTh}>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredSoftwareData
                  .filter((item) => item.status !== 3)
                  .map((item, index) => (
                    <Tr
                      _hover={{
                        cursor: 'pointer',
                      }}
                      key={item.appId}
                      color={selectedRow === item.appId ? 'red' : 'black'}
                      onClick={() => handleRowClick(item)}
                    >
                      <Td>{index + 1}</Td>
                      <Td className={styles.listitem}>
                        <Link
                          href={'/pmpages/ApplicationDetail'}
                          onClick={() => handleDetail(item)}
                        >
                          {item.name}
                        </Link>
                      </Td>
                      <Td>{item.assets}</Td>
                      <Td>{item.publisher}</Td>
                      <Td>{item.version}</Td>
                      <Td>{item.release}</Td>
                      <Td>{item.type}</Td>
                      <Td>
                        {item.status === 1
                          ? 'Active'
                          : item.status === 2
                          ? 'Inactive'
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
        size='4x1'
      >
        <ModalOverlay />
        <ModalContent w='60vw'>
          <ModalHeader>Edit Application</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8}>
            <Grid templateColumns='repeat(3, 1fr)' gap={4}>
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
                <FormControl className={styles.formInput}>
                  <FormLabel>Publisher</FormLabel>
                  <Input
                    name='publisher'
                    value={formData2.publisher}
                    onChange={handleInputChange2}
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Version</FormLabel>
                  <Input
                    name='version'
                    value={formData2.version}
                    onChange={handleInputChange2}
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
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
                  <FormLabel>OS</FormLabel>
                  <Select
                    name='os'
                    value={formData2.os}
                    onChange={handleInputChange2}
                  >
                    <option value='Windows'>Windows</option>
                    <option value='macOS'>macOS</option>
                    <option value='Linux'>Linux</option>
                    <option value='Android'>Android</option>
                    <option value='iOS'>iOS</option>
                  </Select>
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>OS Version</FormLabel>
                  <Input
                    name='osversion'
                    value={formData2.osversion}
                    onChange={handleInputChange2}
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Download Link</FormLabel>
                  <Input
                    name='download'
                    value={formData2.download}
                    onChange={handleInputChange2}
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Document Link</FormLabel>
                  <Input
                    name='docs'
                    value={formData2.docs}
                    onChange={handleInputChange2}
                  />
                </FormControl>
                {/* Add more fields for the second column */}
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Type</FormLabel>
                  <Select
                    name='type'
                    value={formData2.type}
                    onChange={handleInputChange2}
                  >
                    <option value='Web App'>Web App</option>
                    <option value='Desktop App'>Desktop App</option>
                    <option value='Mobile App'>Mobile App</option>
                  </Select>
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Programming</FormLabel>
                  <Input
                    name='language'
                    value={formData2.language}
                    onChange={handleInputChange2}
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Database</FormLabel>
                  <Input
                    name='db'
                    value={formData2.db}
                    onChange={handleInputChange2}
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Status</FormLabel>
                  <Select
                    name='status'
                    value={formData2.status}
                    onChange={handleInputChange2}
                  >
                    <option value='1'>Active</option>
                    <option value='2'>Inactive</option>
                  </Select>
                </FormControl>
              </GridItem>
            </Grid>
            <FormControl className={styles.formInput}>
              <FormLabel>Description</FormLabel>
              <Input
                name='description'
                value={formData2.description}
                onChange={handleInputChange2}
              />
            </FormControl>
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

      <Modal // Modal add new application
        isOpen={isOpenAdd}
        onClose={() => (setIsOpenAdd(false), setFormData(defaultData))}
        closeOnOverlayClick={false}
        size='4x2'
      >
        <ModalOverlay />
        <ModalContent w='60ws'>
          <ModalHeader>Create New Application</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8}>
            <Grid templateColumns='repeat(3, 1fr)' gap={4}>
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
                <FormControl className={styles.formInput}>
                  <FormLabel>Publisher</FormLabel>
                  <Input
                    name='publisher'
                    value={formData.publisher}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Version</FormLabel>
                  <Input
                    name='version'
                    value={formData.version}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
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
                  <FormLabel>OS</FormLabel>
                  <Select
                    name='os'
                    value={formData.os}
                    onChange={handleInputChange}
                  >
                    <option value='Windows'>Windows</option>
                    <option value='macOS'>macOS</option>
                    <option value='Linux'>Linux</option>
                    <option value='Android'>Android</option>
                    <option value='iOS'>iOS</option>
                  </Select>
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>OS Version</FormLabel>
                  <Input
                    name='osversion'
                    value={formData.osversion}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Download Link</FormLabel>
                  <Input
                    name='download'
                    value={formData.download}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Document Link</FormLabel>
                  <Input
                    name='docs'
                    value={formData.docs}
                    onChange={handleInputChange}
                  />
                </FormControl>
                {/* Add more fields for the second column */}
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Type</FormLabel>
                  <Select
                    name='type'
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    <option value='Web App'>Web App</option>
                    <option value='Desktop App'>Desktop App</option>
                    <option value='Mobile App'>Mobile App</option>
                  </Select>
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Programming</FormLabel>
                  <Input
                    name='language'
                    value={formData.language}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Database</FormLabel>
                  <Input
                    name='db'
                    value={formData.db}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </GridItem>
            </Grid>
            <FormControl className={styles.formInput}>
              <FormLabel>Description</FormLabel>
              <Input
                name='description'
                value={formData.description}
                onChange={handleInputChange}
              />
            </FormControl>
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
            <Text>Are you sure you want to delete this application?</Text>
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
