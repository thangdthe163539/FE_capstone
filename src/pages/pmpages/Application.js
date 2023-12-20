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
  FormErrorMessage,
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
import PaginationCustom from '@/components/pagination';
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
  const [invalidFields1, setInvalidFields1] = useState([]);
  const [invalidFields2, setInvalidFields2] = useState([]);
  const toast = useToast();
  //
  //pagination
  const itemPerPage = 6;
  const [dynamicList, setDynamicList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  // filteredIssueData;
  const handleChangePage = (page) => {
    setCurrentPage(page);
    let newList = [];
    for (let i = (page - 1) * itemPerPage; i < page * itemPerPage; i++) {
      if (filteredSoftwareData[i]) {
        newList.push(filteredSoftwareData[i]);
      }
    }
    setDynamicList(newList);
  };

  const totalPages = filteredSoftwareData ? filteredSoftwareData?.length : 0;

  useEffect(() => {
    if (filteredSoftwareData.length) {
      handleChangePage(1);
    } else {
      setDynamicList([]);
    }
  }, [filteredSoftwareData]);
  //
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    validateInputs1();
    setFormData({ ...formData, [name]: value });
  };
  const handleInputChange2 = (e) => {
    const { name, value } = e.target;
    validateInputs2();
    setFormData2({ ...formData2, [name]: value });
    // console.log(formData2);
  };
  const validateInputs1 = () => {
    const requiredFields = [
      'name',
      'publisher',
      'osversion',
      'description',
      'language',
      'db',
      'description',
    ];
    const errors = [];

    for (const field of requiredFields) {
      if (!formData[field]) {
        errors.push(field);
      }
    }

    // Update state to mark fields as invalid
    setInvalidFields1(errors);

    return errors;
  };
  const validateInputs2 = () => {
    const requiredFields = [
      'name',
      'publisher',
      'osversion',
      'description',
      'language',
      'db',
      'description',
    ];
    const errors = [];

    for (const field of requiredFields) {
      if (!formData2[field]) {
        errors.push(field);
      }
    }

    // Update state to mark fields as invalid
    setInvalidFields2(errors);

    return errors;
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
    // Validate inputs before saving
    const validationErrors = validateInputs1();
    if (validationErrors.length > 0) {
      // You can handle validation errors as needed
      console.error('Validation Errors:', validationErrors);
      return;
    }
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
      toast({
        title: 'Application Created',
        description: 'The application has been successfully created.',
        status: 'success',
        duration: 3000, // Duration in milliseconds
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Application Created Fail',
        description: 'The application has been fail when created.',
        status: 'error',
        duration: 3000, // Duration in milliseconds
        isClosable: true,
      });
      setIsOpenEdit(false); // Close the modal after successful save
      setButtonDisabled(true);
      setFormData2(defaultData);
      setSelectedRow(new Set());
      console.error('Error saving data:', error);
    }
  };
  //
  const handleSaveEdit = async () => {
    // Validate inputs before saving
    const validationErrors = validateInputs2();
    if (validationErrors.length > 0) {
      // You can handle validation errors as needed
      console.error('Validation Errors:', validationErrors);
      return;
    }
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
      toast({
        title: 'Application Updated',
        description: 'The application has been successfully updated.',
        status: 'success',
        duration: 3000, // Duration in milliseconds
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Application Updated Fail',
        description: 'The application has been fail when updated.',
        status: 'error',
        duration: 3000, // Duration in milliseconds
        isClosable: true,
      });
      setIsOpenEdit(false); // Close the modal after successful save
      setButtonDisabled(true);
      setFormData2(defaultData);
      setSelectedRow(new Set());
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
              // console.log(error);
              return {
                ...software,
                assets: 0, // Use '0' if count is falsy (including undefined)
              };
            }
          }),
        );
        setSoftwareData(mergedData.filter((item) => item.status !== 3));
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
    setFilteredSoftwareData(filteredData.filter((item) => item.status !== 3));
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
    sessionStorage.setItem('software', JSON.stringify(item));
    // console.log(sessionStorage.getItem('deviceId'));
  };
  //
  const handleDelete = async () => {
    try {
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
          status: 3,
        },
      );
      setIsOpenDelete(false); // Close the "Confirm Delete" modal
      setButtonDisabled(true);
      setFormData2(defaultData);
      setSelectedRow(new Set());

      // Reload the data for the table after deletion
      const newDataResponse = await axios.get(
        `${BACK_END_PORT}/api/App/list_App_by_user/` + account?.accId,
      );
      setData(newDataResponse.data);
      toast({
        title: 'Application Deleted',
        description: 'The application has been successfully deleted.',
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
                  maxLength={100}
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
                <Flex alignItems={'center'} justifyContent={'space-between'}>
                  <Text>
                    Show {dynamicList.length}/{filteredSoftwareData.length}{' '}
                    application(s)
                  </Text>
                  <PaginationCustom
                    current={currentPage}
                    onChange={handleChangePage}
                    total={totalPages}
                    pageSize={itemPerPage}
                  />
                </Flex>
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
                {dynamicList.map((item, index) => (
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
                        {item.name ? item.name : 'N/A'}
                      </Link>
                    </Td>
                    <Td>{item.assets}</Td>
                    <Td>{item.publisher ? item.publisher : 'N/A'}</Td>
                    <Td>{item.version ? item.version : 'N/A'}</Td>
                    <Td>{item.release ? item.release : 'N/A'}</Td>
                    <Td>{item.type ? item.type : 'N/A'}</Td>
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
        onClose={() => (setIsOpenEdit(false), setInvalidFields2([]))}
        closeOnOverlayClick={false}
        size='4x1'
      >
        <ModalOverlay />
        <ModalContent w='70vw'>
          <ModalHeader>Edit application</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8}>
            <Grid templateColumns='repeat(3, 1fr)' gap={4}>
              <GridItem>
                <FormControl
                  isRequired
                  isInvalid={invalidFields2.includes('name')}
                >
                  <Flex>
                    <FormLabel>Name</FormLabel>
                    <Spacer />
                    <FormErrorMessage mt={-2}>
                      Name is required!
                    </FormErrorMessage>
                  </Flex>
                  <Input
                    name='name'
                    value={formData2.name}
                    onChange={handleInputChange2}
                    maxLength={255}
                    required
                  />
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={invalidFields2.includes('publisher')}
                  className={styles.formInput}
                >
                  <Flex>
                    <FormLabel>Publisher</FormLabel>
                    <Spacer />
                    <FormErrorMessage mt={-2}>
                      Publisher is required!
                    </FormErrorMessage>
                  </Flex>
                  <Input
                    name='publisher'
                    maxLength={255}
                    value={formData2.publisher}
                    onChange={handleInputChange2}
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Version</FormLabel>
                  <Input
                    name='version'
                    maxLength={255}
                    value={formData2.version}
                    onChange={handleInputChange2}
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Release</FormLabel>
                  <Input
                    name='release'
                    maxLength={255}
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
                <FormControl
                  isRequired
                  isInvalid={invalidFields2.includes('osversion')}
                  className={styles.formInput}
                >
                  <Flex>
                    <FormLabel>OS Version</FormLabel>
                    <Spacer />
                    <FormErrorMessage mt={-2}>
                      OS Version is required!
                    </FormErrorMessage>
                  </Flex>
                  <Input
                    name='osversion'
                    maxLength={255}
                    value={formData2.osversion}
                    onChange={handleInputChange2}
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Download Link</FormLabel>
                  <Input
                    name='download'
                    maxLength={255}
                    value={formData2.download}
                    onChange={handleInputChange2}
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Document Link</FormLabel>
                  <Input
                    name='docs'
                    maxLength={255}
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
                <FormControl
                  isRequired
                  isInvalid={invalidFields2.includes('language')}
                  className={styles.formInput}
                >
                  <Flex>
                    <FormLabel>Programming</FormLabel>
                    <Spacer />
                    <FormErrorMessage mt={-2}>
                      Programming is required!
                    </FormErrorMessage>
                  </Flex>
                  <Input
                    name='language'
                    maxLength={255}
                    value={formData2.language}
                    onChange={handleInputChange2}
                  />
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={invalidFields2.includes('db')}
                  className={styles.formInput}
                >
                  <Flex>
                    <FormLabel>Database</FormLabel>
                    <Spacer />
                    <FormErrorMessage mt={-2}>
                      Database is required!
                    </FormErrorMessage>
                  </Flex>
                  <Input
                    name='db'
                    maxLength={255}
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
            <FormControl
              isRequired
              isInvalid={invalidFields2.includes('description')}
              className={styles.formInput}
            >
              <Flex>
                <FormLabel>Description</FormLabel>
                <Spacer />
                <FormErrorMessage mt={-2}>
                  Description is required!
                </FormErrorMessage>
              </Flex>
              <Input
                name='description'
                maxLength={1000}
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
            <Button
              onClick={() => (setIsOpenEdit(false), setInvalidFields2([]))}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal // Modal add new application
        isOpen={isOpenAdd}
        onClose={() => (
          setIsOpenAdd(false), setFormData(defaultData), setInvalidFields1([])
        )}
        closeOnOverlayClick={false}
        size='4x1'
      >
        <ModalOverlay />
        <ModalContent w='70ws'>
          <ModalHeader>Create new application</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8}>
            <Grid templateColumns='repeat(3, 1fr)' gap={4}>
              <GridItem>
                <FormControl
                  isRequired
                  isInvalid={invalidFields1.includes('name')}
                >
                  <Flex>
                    <FormLabel>Name</FormLabel>
                    <Spacer />
                    <FormErrorMessage mt={-2}>
                      Name is required!
                    </FormErrorMessage>
                  </Flex>
                  <Input
                    name='name'
                    maxLength={255}
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={invalidFields1.includes('publisher')}
                  className={styles.formInput}
                >
                  <Flex>
                    <FormLabel>Publisher</FormLabel>
                    <Spacer />
                    <FormErrorMessage mt={-2}>
                      Publisher is required!
                    </FormErrorMessage>
                  </Flex>
                  <Input
                    name='publisher'
                    maxLength={255}
                    value={formData.publisher}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Version</FormLabel>
                  <Input
                    name='version'
                    maxLength={255}
                    value={formData.version}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Release</FormLabel>
                  <Input
                    name='release'
                    maxLength={255}
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
                <FormControl
                  isRequired
                  isInvalid={invalidFields1.includes('osversion')}
                  className={styles.formInput}
                >
                  <Flex>
                    <FormLabel>OS Version</FormLabel>
                    <Spacer />
                    <FormErrorMessage mt={-2}>
                      OS Version is required!
                    </FormErrorMessage>
                  </Flex>
                  <Input
                    name='osversion'
                    maxLength={255}
                    value={formData.osversion}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Download Link</FormLabel>
                  <Input
                    name='download'
                    maxLength={255}
                    value={formData.download}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Document Link</FormLabel>
                  <Input
                    name='docs'
                    maxLength={255}
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
                <FormControl
                  isRequired
                  isInvalid={invalidFields1.includes('language')}
                  className={styles.formInput}
                >
                  <Flex>
                    <FormLabel>Programming</FormLabel>
                    <Spacer />
                    <FormErrorMessage mt={-2}>
                      Programming is required!
                    </FormErrorMessage>
                  </Flex>
                  <Input
                    name='language'
                    maxLength={255}
                    value={formData.language}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={invalidFields1.includes('db')}
                  className={styles.formInput}
                >
                  <Flex>
                    <FormLabel>Database</FormLabel>
                    <Spacer />
                    <FormErrorMessage mt={-2}>
                      Database is required!
                    </FormErrorMessage>
                  </Flex>
                  <Input
                    name='db'
                    maxLength={255}
                    value={formData.db}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Status</FormLabel>
                  <Select
                    name='status'
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value='1'>Active</option>
                    <option value='2'>Inactive</option>
                  </Select>
                </FormControl>
              </GridItem>
            </Grid>
            <FormControl
              isRequired
              isInvalid={invalidFields1.includes('description')}
              className={styles.formInput}
            >
              <Flex>
                <FormLabel>Description</FormLabel>
                <Spacer />
                <FormErrorMessage mt={-2}>
                  Description is required!
                </FormErrorMessage>
              </Flex>
              <Input
                name='description'
                maxLength={1000}
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
              onClick={() => (
                setIsOpenAdd(false),
                setFormData(defaultData),
                setInvalidFields1([])
              )}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal // modal delete
        isOpen={isOpenDelete}
        onClose={() => setIsOpenDelete(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm delete</ModalHeader>
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
