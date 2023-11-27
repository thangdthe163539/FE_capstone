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
  Checkbox,
  ScrollView,
} from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
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
  //
  const defaultData = {
    licenseId: '',
    softwareId: '',
    assetId: '',
    licenseKey: '',
    startDate: '',
    time: '',
    status_License: '',
    name: '',
    version: '',
    release: '',
    installDate: '',
    publisher: '',
    type: 'Desktop App',
    os: 'Window',
    status_AssetSoftware: '',
  };

  const router = useRouter();
  const [device, setDevice] = useState();
  const [account, setAccount] = useState();
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [formData, setFormData] = useState(defaultData);
  const [formData1, setFormData1] = useState(defaultData);
  const [formData2, setFormData2] = useState(defaultData);
  const [formData3, setFormData3] = useState(defaultData);
  const [data, setData] = useState([]);
  const [dataLicense, setDataLicense] = useState([]);
  const [listLicense, setListLicense] = useState([]);
  const [listAllSoftware, setListAllSoftware] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchAppQuery, setSearchAppQuery] = useState('');
  const [searchAddQuery, setSearchAddQuery] = useState('');
  const [showModalTable, setShowModalTable] = useState(true);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const toast = useToast();
  const [selectedRow1, setSelectedRow1] = useState(new Set());
  const [selectedRow2, setSelectedRow2] = useState(new Set());
  const [selectedRow3, setSelectedRow3] = useState(new Set());
  const [isButtonDisabled1, setButtonDisabled1] = useState(true);
  const [isButtonDisabled2, setButtonDisabled2] = useState(true);
  const [isButtonDisabled3, setButtonDisabled3] = useState(true);
  const [filteredSoftwareData, setFilteredSoftwareData] = useState([]);
  const [selectedSoftware, setSelectedSoftware] = useState([]);

  //
  const [software, setSoftware] = useState();

  useEffect(() => {
    const data = localStorage.getItem('software');
    if (data) {
      const softwareDataDecode = JSON.parse(data);
      if (!softwareDataDecode) {
        // router.push('/pmpages/assetlist');
      } else {
        setSoftware(softwareDataDecode);
      }
    }
  }, []);
  //
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // console.log(formData);
  };
  const handleInputChange1 = (e) => {
    const { name, value } = e.target;
    setFormData1({ ...formData1, [name]: value });
    // console.log(formData);
  };
  const handleInputChange2 = (e) => {
    const { name, value } = e.target;
    setFormData2({ ...formData2, [name]: value });
    // console.log(formData2);
  };
  const handleInputChange3 = (e) => {
    const { name, value } = e.target;
    setFormData3({ ...formData3, [name]: value });
    // console.log(formData);
  };
  const handleSearchAppInputChange = (e) => {
    setSearchAppQuery(e.target.value);
  };
  const handleSearchAddInputChange = (e) => {
    setSearchAddQuery(e.target.value);
  };
  const handleRowClick1 = (item) => {
    if (selectedRow1 === item.softwareId) {
      setSelectedRow1(null); // Unselect the row if it's already selected
      setFormData1(defaultData);
      setButtonDisabled1(true);
    } else {
      setSelectedRow1(item.softwareId);
      setFormData1(item);
      setButtonDisabled1(false);
    }
  };
  const handleRowClick2 = (item) => {
    if (selectedRow2 === item.licenseId) {
      setSelectedRow2(null); // Unselect the row if it's already selected
      setFormData2(defaultData);
      setButtonDisabled2(true);
    } else {
      setSelectedRow2(item.licenseId);
      setFormData2(item);
      setButtonDisabled2(false);
    }
  };
  const handleRowClick3 = (item) => {
    if (selectedRow3 === item.softwareId) {
      setSelectedRow3(null); // Unselect the row if it's already selected
      setFormData(defaultData);
      setButtonDisabled3(true);
    } else {
      setSelectedRow3(item.softwareId);
      setFormData(item);
      setButtonDisabled3(false);
    }
  };
  //
  const handleSaveCreate = async () => {
    try {
      // Replace 'YOUR_API_ENDPOINT_HERE' with your actual API endpoint
      const curDate = new Date();
      const currentDateOnly = new Date(
        curDate.getFullYear(),
        curDate.getMonth(),
        curDate.getDate(),
      );
      const formattedStartDate = formatDate(formData.start_Date);
      const response = await axios.post(
        `${BACK_END_PORT}/api/Software_Asset/CreateWithHaveLicenseAndSoftware`,
        {
          assetId: device.assetId,
          name: formData.name,
          publisher: formData.publisher,
          version: formData.version,
          release: formData.release,
          type: formData.type,
          os: formData.os,
          installDate: currentDateOnly,
          licenseKey: formData.licenseKey,
          start_Date: formattedStartDate,
          time: formData.time,
          status_License: 1,
          status_Software: 1,
          status_AssetSoftware: 1,
        },
      );
      console.log('Data saved:', response.data);
      setIsOpenAdd(false); // Close the modal after successful save
      setShowModalAdd(false);
      setShowModalTable(true);
      setFormData(defaultData);
      setSelectedRow1(new Set());
      // Reload new data for the table
      const newDataResponse = await axios.get(
        `${BACK_END_PORT}/api/v1/Software/list_Softwares_by_Asset/` +
          device.assetId,
      );
      setData(newDataResponse.data);
      const response2 = await axios.get(
        `${BACK_END_PORT}/api/v1/License/list_Licenses_by_Asset/` +
          device.assetId,
      );
      setDataLicense(response2.data);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  //
  const handleSaveAdd = async () => {
    try {
      // Replace 'YOUR_API_ENDPOINT_HERE' with your actual API endpoint
      const curDate = new Date();
      const currentDateOnly = new Date(
        curDate.getFullYear(),
        curDate.getMonth(),
        curDate.getDate(),
      );
      const response = await axios.post(
        `${BACK_END_PORT}/api/Software_Asset/CreateWithHaveLicense`,
        {
          assetId: device.assetId,
          softwareId: formData1.softwareId,
          installDate: currentDateOnly,
          status_AssetSoftware: 1,
          licenseKey: formData1.licenseKey,
          start_Date: formatDate(formData1.start_Date),
          time: formData1.time,
          status_License: 1,
        },
      );
      console.log('Data saved:', response.data);
      setIsOpenAdd(false); // Close the modal after successful save
      setShowModalAdd(false);
      setShowModalTable(true);
      setFormData(defaultData);
      setSelectedRow1(new Set());
      // Reload new data for the table
      const newDataResponse = await axios.get(
        `${BACK_END_PORT}/api/v1/Software/list_Softwares_by_Asset/` +
          device.assetId,
      );
      setData(newDataResponse.data);
      const response2 = await axios.get(
        `${BACK_END_PORT}/api/v1/License/list_Licenses_by_Asset/` +
          device.assetId,
      );
      setDataLicense(response2.data);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  //
  const handleSaveEdit = async () => {
    try {
      // Replace 'YOUR_API_ENDPOINT_HERE' with your actual API endpoint
      const response = await axios.put(
        `${BACK_END_PORT}/api/License/UpdateLicense` + formData2.licenseId,
        {
          // assetId: device.assetId,
          // softwareId: formData.softwareId,
          // licenseId: formData2.licenseId,
          licenseKey: formData2.licenseKey,
          startDate: formData2.startDate,
          time: formData2.time,
          status: formData2.status,
        },
      );
      console.log('Data saved:', response.data);
      setIsOpenEdit(false); // Close the modal after successful save
      setFormData2(defaultData);
      setSelectedRow2(new Set());
      // Reload new data for the table
      const newDataResponse = await axios.get(
        `${BACK_END_PORT}/api/v1/Software/list_Softwares_by_Asset/` +
          device.assetId,
      );
      setData(newDataResponse.data);
      const response2 = await axios.get(
        `${BACK_END_PORT}/api/License/list_licenses_by_device/` +
          device.assetId,
      );
      setDataLicense(response2.data);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  //
  useEffect(() => {
    const deviceData = localStorage.getItem('device');
    if (deviceData) {
      const deviceDataDecode = JSON.parse(deviceData);
      if (!deviceDataDecode) {
        router.push('/pmpages/assetlist');
      } else {
        setDevice(deviceDataDecode);
      }
    }
  }, []);

  //

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BACK_END_PORT}/api/v1/Software/list_Softwares_by_Asset/` +
            device.assetId,
        );
        setData(response.data); // Assuming the API returns an array of objects
        const response2 = await axios.get(
          `${BACK_END_PORT}/api/v1/License/list_Licenses_by_Asset/` +
            device.assetId,
        );
        setDataLicense(response2.data);
        const response3 = await axios.get(
          `${BACK_END_PORT}/api/v1/Software/ListSoftwares`,
        );
        setListAllSoftware(response3.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    if (device?.assetId && account?.accId) {
      fetchData();
    }
  }, [device, account]);
  //
  const softwareIdsInAsset = data?.map((software) => software?.softwareId);
  //
  useEffect(() => {
    if (data.length > 0 && dataLicense.length > 0) {
      const mergedData = dataLicense.map((license) => {
        const software = data.find(
          (sw) => sw.softwareId === license.softwareId,
        );
        return {
          ...license,
          name: software?.name ? software?.name : license.softwareId,
        };
      });
      setListLicense(mergedData);
    }
  }, [data, dataLicense]);
  //
  const handleDelete = async () => {
    try {
      await axios.delete(
        `${BACK_END_PORT}/api/Software_Asset/DeleteAssetSoftware/` +
          device.assetId +
          `/` +
          formData1.softwareId,
      );
      setIsOpenDelete(false); // Close the "Confirm Delete" modal
      setSelectedRow1(new Set());

      // Reload the data for the table after deletion
      const response = await axios.get(
        `${BACK_END_PORT}/api/v1/Software/list_Softwares_by_Asset/` +
          device.assetId,
      );
      setData(response.data); // Assuming the API returns an array of objects
      const response2 = await axios.get(
        `${BACK_END_PORT}/api/v1/License/list_Licenses_by_Asset/` +
          device.assetId,
      );
      setDataLicense(response2.data);
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
  const filterAssets = () => {
    const query = searchAppQuery.toLowerCase();
    const filteredData = data
      .filter((item) => item.type != 'Antivirus' && item.status != 3)
      .filter((item) => {
        const name = item?.name.toLowerCase();
        const publisher = item?.publisher.toLowerCase();
        return name.includes(query) || publisher.includes(query);
      });
    setFilteredSoftwareData(filteredData);
  };

  // Update filtered data whenever the search query changes

  useEffect(() => {
    filterAssets();
  }, [searchAppQuery, data]);
  //
  function calculateEndDate(startDate, months) {
    // Split the start date into day, month, and year
    const [day, month, year] = startDate.split('/').map(Number);

    // Create a Date object with the parsed values
    const startDateObj = new Date(year, month - 1, day);

    // Calculate the end date by adding the specified number of months
    startDateObj.setMonth(startDateObj.getMonth() + months);

    // Format the end date as "dd/mm/yyyy"
    const endYear = startDateObj.getFullYear();
    const endMonth = String(startDateObj.getMonth() + 1).padStart(2, '0');
    const endDay = String(startDateObj.getDate()).padStart(2, '0');

    const endDate = `${endDay}/${endMonth}/${endYear}`;

    return endDate;
  }
  const convertToISODate = (dateString) => {
    if (dateString) {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month}-${day}`;
    }
    return null; // or handle the case where dateString is undefined
  };
  const formatDate = (dateString) => {
    if (dateString) {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    }
    return null; // or handle the case where dateString is undefined
  };

  //
  return (
    <Box className={styles.bodybox}>
      <List>
        <ListItem className={styles.list}>
          <Link href='/pmpages/PoHome' className={styles.listitem}>
            Home
          </Link>
          <ArrowForwardIcon margin={1}></ArrowForwardIcon>
          <Link href='/pmpages/Application' className={styles.listitem}>
            Application
          </Link>
          <ArrowForwardIcon margin={1}></ArrowForwardIcon>
          <Link href='/pmpages/ApplicationDetail' className={styles.listitem}>
            {software?.name}
          </Link>
          <ArrowForwardIcon margin={1}></ArrowForwardIcon>
          {device?.name}
        </ListItem>
        <ListItem className={styles.list}>
          <Text fontSize='2xl'>{device?.name}</Text>
        </ListItem>
        <Tabs>
          <TabList>
            <Tab
              className={styles.tab}
              _selected={{
                color: '#4d9ffe',
                borderBottom: '1px solid #4d9ffe',
              }}
            >
              Hardware
            </Tab>
            <Tab
              className={styles.tab}
              _selected={{
                color: '#4d9ffe',
                borderBottom: '1px solid #4d9ffe',
              }}
            >
              Software
            </Tab>
            <Tab
              className={styles.tab}
              _selected={{
                color: '#4d9ffe',
                borderBottom: '1px solid #4d9ffe',
              }}
            >
              License
            </Tab>
            <Tab
              className={styles.tab}
              _selected={{
                color: '#4d9ffe',
                borderBottom: '1px solid #4d9ffe',
              }}
            >
              Antivirus
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Box borderWidth='1px' borderRadius='lg' p={4} boxShadow='md'>
                <TableContainer>
                  <Table>
                    <Tbody>
                      <Tr className={styles.borderTop}>
                        <Td className={styles.text2}>Name</Td>
                        <Td className={styles.borderRight}>{device?.name}</Td>
                        <Td className={styles.text2}>CPU</Td>
                        <Td className={styles.borderRight}>{device?.cpu}</Td>
                        <Td className={styles.text2}>Operation System</Td>
                        <Td>{device?.os}</Td>
                      </Tr>
                      <Tr>
                        <Td className={styles.text2}>Manufacturer</Td>
                        <Td className={styles.borderRight}>
                          {device?.manufacturer}
                        </Td>
                        <Td className={styles.text2}>GPU</Td>
                        <Td className={styles.borderRight}>{device?.gpu}</Td>
                        <Td className={styles.text2}>Version</Td>
                        <Td>{device?.version}</Td>
                      </Tr>
                      <Tr>
                        <Td className={styles.text2}>Model</Td>
                        <Td className={styles.borderRight}>{device?.model}</Td>
                        <Td className={styles.text2}>RAM</Td>
                        <Td className={styles.borderRight}>{device?.ram} GB</Td>
                        <Td className={styles.text2}>Last Updated</Td>
                        <Td>{device?.lastSuccesfullScan}</Td>
                      </Tr>
                      <Tr>
                        <Td className={styles.text2}>Serial Number</Td>
                        <Td className={styles.borderRight}>
                          {device?.serialNumber}
                        </Td>
                        <Td className={styles.text2}>Memory</Td>
                        <Td className={styles.borderRight}>
                          {device?.memory} GB
                        </Td>
                        <Td className={styles.text2}>Status</Td>
                        <Td>
                          {device?.status === 1
                            ? 'Active'
                            : device?.status === 2
                            ? 'Inactive'
                            : device?.status === 3
                            ? 'Deleted'
                            : 'Unknown'}
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
            </TabPanel>
            <TabPanel>
              <ListItem className={styles.list} pt={0}>
                <Flex>
                  <Input
                    type='text'
                    value={searchAppQuery}
                    onChange={handleSearchAppInputChange}
                    placeholder='Search'
                    w={300}
                    mr={1}
                  />
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
                      aria-label='Delete'
                      icon={<FaTrash />}
                      colorScheme='gray' // Choose an appropriate color
                      onClick={() => setIsOpenDelete(true)}
                      isDisabled={isButtonDisabled1}
                    />
                  </Box>
                </Flex>
              </ListItem>
              <ListItem className={styles.list}>
                <TableContainer>
                  <Table variant='striped' colorScheme='gray'>
                    <TableCaption>
                      Total{' '}
                      {
                        filteredSoftwareData.filter(
                          (item) =>
                            item.type != 'Antivirus' && item.status != 3,
                        ).length
                      }{' '}
                      softwares
                    </TableCaption>
                    <Thead>
                      <Tr>
                        <Th className={styles.cTh}>No</Th>
                        <Th className={styles.cTh}>Name</Th>
                        <Th className={styles.cTh}>Publisher</Th>
                        <Th className={styles.cTh}>Versions</Th>
                        <Th className={styles.cTh}>Release</Th>
                        <Th className={styles.cTh}>Type</Th>
                        <Th className={styles.cTh}>Install Date</Th>
                        {/* <Th className={styles.cTh}>Status</Th> */}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredSoftwareData
                        .filter(
                          (item) =>
                            item.type != 'Antivirus' && item.status != 3,
                        )
                        .map((item, index) => (
                          <Tr
                            cursor={'pointer'}
                            key={item.softwareId}
                            color={
                              selectedRow1 === item.softwareId ? 'red' : 'black'
                            } // Change background color for selected rows
                            onClick={() => handleRowClick1(item)}
                          >
                            <Td>{index + 1}</Td>
                            <Td>{item.name}</Td>
                            <Td>{item.publisher}</Td>
                            <Td>{item.version}</Td>
                            <Td>{item.release}</Td>
                            <Td>{item.type}</Td>
                            <Td>{item.installDate}</Td>
                            {/* <Td>{item.status ? 'Have Issue' : 'No Issue'}</Td> */}
                          </Tr>
                        ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </ListItem>
            </TabPanel>
            <TabPanel>
              <ListItem className={styles.list} pt={0}>
                <Flex>
                  <Input
                    type='text'
                    value={searchAppQuery}
                    onChange={handleSearchAppInputChange}
                    placeholder='Search'
                    w={300}
                    mr={1}
                  />
                  <Spacer />
                  <Box>
                    <IconButton
                      aria-label='Edit'
                      icon={<FaEdit />}
                      colorScheme='gray' // Choose an appropriate color
                      marginRight={1}
                      onClick={() => setIsOpenEdit(true)}
                      isDisabled={isButtonDisabled2}
                    />
                    {/* <IconButton
                      aria-label='Delete'
                      icon={<FaTrash />}
                      colorScheme='gray' // Choose an appropriate color
                      onClick={() => setIsOpenDelete(true)}
                      isDisabled={isButtonDisabled2}
                    /> */}
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
                    <TableCaption className={styles.cTableCaption}>
                      Total {listLicense.length} licenses
                    </TableCaption>
                    <Thead>
                      <Tr>
                        <Th className={styles.cTh}>No</Th>
                        <Th className={styles.cTh}>Software</Th>
                        <Th className={styles.cTh}>License Key</Th>
                        <Th className={styles.cTh}>Start Date</Th>
                        <Th className={styles.cTh}>End Date</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {listLicense.map((item, index) => (
                        <Tr
                          cursor={'pointer'}
                          key={item.licenseId}
                          color={
                            selectedRow2 === item.licenseId ? 'red' : 'black'
                          } // Change background color for selected rows
                          onClick={() => handleRowClick2(item)}
                        >
                          <Td>{index + 1}</Td>
                          <Td>{item.name}</Td>
                          <Td>{item.licenseKey}</Td>
                          <Td>{item.start_Date}</Td>
                          <Td>
                            {calculateEndDate(item.start_Date, item.time)}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </ListItem>
            </TabPanel>
            <TabPanel>
              <TableContainer>
                <Table variant='striped' colorScheme='gray'>
                  <TableCaption>
                    Total{' '}
                    {
                      data.filter(
                        (item) => item.type == 'Antivirus' && item.status != 3,
                      ).length
                    }{' '}
                    antivirus
                  </TableCaption>
                  <Thead>
                    <Tr>
                      <Th className={styles.cTh}>No</Th>
                      <Th className={styles.cTh}>Name</Th>
                      <Th className={styles.cTh}>Publisher</Th>
                      <Th className={styles.cTh}>Versions</Th>
                      <Th className={styles.cTh}>Release</Th>
                      <Th className={styles.cTh}>Install Date</Th>
                      {/* <Th className={styles.cTh}>Status</Th> */}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data
                      .filter(
                        (item) => item.type == 'Antivirus' && item.status != 3,
                      )
                      .map((item, index) => (
                        <Tr
                          cursor={'pointer'}
                          key={item.softwareId}
                          color={
                            selectedRow1 === item.softwareId ? 'red' : 'black'
                          } // Change background color for selected rows
                          onClick={() => handleRowClick1(item)}
                        >
                          <Td>{index + 1}</Td>
                          <Td>{item.name}</Td>
                          <Td>{item.publisher}</Td>
                          <Td>{item.version}</Td>
                          <Td>{item.release}</Td>
                          <Td>{item.installDate}</Td>
                          {/* <Td>{item.status ? 'No Issues' : 'Have Issues'}</Td> */}
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </List>

      <Modal //Modal edit license
        isOpen={isOpenEdit}
        onClose={() => setIsOpenEdit(false)}
        closeOnOverlayClick={false}
        size='lg'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit License</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8}>
            <Grid templateColumns='repeat(2, 1fr)' gap={4}>
              <GridItem>
                <FormControl>
                  <FormLabel>Software</FormLabel>
                  <Input
                    name='software'
                    value={
                      listAllSoftware.find(
                        (item) => item.softwareId === formData2?.softwareId,
                      )?.name
                    }
                    onChange={handleInputChange2}
                    isDisabled
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>License Key</FormLabel>
                  <Input
                    name='licenseKey'
                    value={formData2.licenseKey}
                    onChange={handleInputChange2}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Start Date</FormLabel>
                  <Input
                    name='startDate'
                    value={convertToISODate(formData2.start_Date)}
                    onChange={handleInputChange2}
                    type='date'
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Time</FormLabel>
                  <Input
                    name='time'
                    value={formData2.time}
                    onChange={handleInputChange2}
                  />
                </FormControl>
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

      <Modal // Modal add software
        isOpen={isOpenAdd}
        onClose={() => (
          setIsOpenAdd(false), setShowModalAdd(false), setShowModalTable(true)
        )}
        closeOnOverlayClick={false}
        size='6xl'
      >
        <ModalOverlay />
        <ModalContent w='80vw'>
          <ModalHeader>
            {showModalAdd ? 'Create New Software' : 'Add Software'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8}>
            {showModalAdd ? (
              <>
                <Grid templateColumns='repeat(2, 1fr)' gap={4}>
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
                    <FormControl>
                      <FormLabel>License Key</FormLabel>
                      <Input
                        name='licenseKey'
                        value={formData.licenseKey}
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
                    <FormControl>
                      <FormLabel>Start Date</FormLabel>
                      <Input
                        name='start_Date'
                        value={formData.start_Date}
                        onChange={handleInputChange}
                        type='date'
                        required
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Time</FormLabel>
                      <Input
                        name='time'
                        value={formData.time}
                        onChange={handleInputChange}
                      />
                    </FormControl>
                    {/* Add more fields for the second column */}
                  </GridItem>
                </Grid>
              </>
            ) : showModalTable ? (
              <TableContainer>
                <Table variant='simple'>
                  <Thead>
                    <Tr>
                      <Th className={styles.cTh}>#</Th>
                      <Th className={styles.cTh}>Name</Th>
                      <Th className={styles.cTh}>Publisher</Th>
                      <Th className={styles.cTh}>Versions</Th>
                      <Th className={styles.cTh}>Release</Th>
                      <Th className={styles.cTh}>Type</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {listAllSoftware
                      .filter(
                        (item) => !softwareIdsInAsset.includes(item.softwareId),
                      )
                      .filter((item) => item.status != 3)
                      .map((item) => (
                        <Tr key={item.softwareId}>
                          <Td>
                            <Button
                              onClick={() => (
                                setShowModalTable(false), setFormData1(item)
                              )}
                            >
                              Add
                            </Button>
                          </Td>
                          <Td>{item.name}</Td>
                          <Td>{item.publisher}</Td>
                          <Td>{item.version}</Td>
                          <Td>{item.release}</Td>
                          <Td>{item.type}</Td>
                        </Tr>
                      ))}
                    <Tr>
                      <Td colSpan='6'>
                        <Center>
                          <Button
                            w='100%'
                            bgColor='white'
                            border='1px solid gray'
                            onClick={() => setShowModalAdd(true)}
                          >
                            Create new software
                          </Button>
                        </Center>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <Grid templateColumns='repeat(2, 1fr)' gap={4}>
                <GridItem>
                  <FormControl>
                    <FormLabel>Software</FormLabel>
                    <Input
                      name='softwareId'
                      value={formData1.name}
                      onChange={handleInputChange1}
                      disabled
                    ></Input>
                  </FormControl>
                  <FormControl>
                    <FormLabel>License Key</FormLabel>
                    <Input
                      name='licenseKey'
                      value={formData1.licenseKey}
                      onChange={handleInputChange1}
                    />
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl>
                    <FormLabel>Start Date</FormLabel>
                    <Input
                      name='start_Date'
                      value={formData1.start_Date}
                      onChange={handleInputChange1}
                      type='date'
                      required
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Time</FormLabel>
                    <Input
                      name='time'
                      value={formData1.time}
                      onChange={handleInputChange1}
                    />
                  </FormControl>
                </GridItem>
              </Grid>
            )}
          </ModalBody>
          <ModalFooter>
            {showModalAdd ? (
              <>
                <Button colorScheme='blue' mr={3} onClick={handleSaveCreate}>
                  Save
                </Button>
                <Button
                  onClick={() => (
                    setShowModalAdd(false), setShowModalTable(true)
                  )}
                >
                  Back
                </Button>
              </>
            ) : showModalTable ? (
              <>
                <Button onClick={() => setIsOpenAdd(false)}>Cancel</Button>
              </>
            ) : (
              <>
                <Button mr={3} colorScheme='blue' onClick={handleSaveAdd}>
                  Save
                </Button>
                <Button onClick={() => setShowModalTable(true)}>Back</Button>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal // modal delete software
        isOpen={isOpenDelete}
        onClose={() => setIsOpenDelete(false)}
      >
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

export default AssetDetailPage;
