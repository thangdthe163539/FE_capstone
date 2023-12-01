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
  Center,
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
} from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
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
  appId: '',
  assetId: '',
  libraryId: '',
  name: '',
  version: '',
  publisher: '',
  type: '',
  installDate: '',
  status: '',
};
const defaultData2 = {
  appId: '',
  libraryId: '',
  name: '',
  publisher: '',
  libraryKey: '',
  start_Date: '',
  time: '',
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
  const [software, setSoftware] = useState();

  //
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenAddLi, setIsOpenAddLi] = useState(false);
  const [isOpenEditLi, setIsOpenEditLi] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenDeleteLi, setIsOpenDeleteLi] = useState(false);
  const [formData, setFormData] = useState([]);
  const [formData1, setFormData1] = useState(defaultData2);
  const [formData2, setFormData2] = useState(defaultData);
  const [formData3, setFormData3] = useState(defaultData2);
  const [formData4, setFormData4] = useState(defaultData2);
  const [feedbackData, setFeedbackData] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [softwareData, setSoftwareData] = useState([]);
  const [appData, setAppData] = useState({});
  const [reportData, setReportData] = useState([]);
  const [libraryData, setLibraryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQuery1, setSearchQuery1] = useState('');
  const [filteredDeviceData, setFilteredDeviceData] = useState([]);
  const [filteredLibraryData, setFilteredLibraryData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(new Set());
  const [selectedRow1, setSelectedRow1] = useState(new Set());
  const [isButtonDisabled, setButtonDisabled] = useState(true);
  const [isButtonDisabled1, setButtonDisabled1] = useState(true);
  const [showEditApp, setShowEditApp] = useState(true);
  const toast = useToast();
  //
  //
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppData({ ...appData, [name]: value });
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
    // console.log(formData2);
  };
  const handleInputChange4 = (e) => {
    const { name, value } = e.target;
    setFormData1({ ...formData1, [name]: value });
    console.log(formData1);
  };
  //
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      console.log('Selected File:', selectedFile);
      // You can perform actions with the selected file here
    }
  };
  //
  const handleEditApp = async () => {
    try {
      // Replace 'YOUR_API_ENDPOINT_HERE' with your actual API endpoint
      const response = await axios.put(
        `${BACK_END_PORT}/api/v1/App/UpdateApplication/` + software.appId,
        {
          // accId: account.accId,
          name: appData.name,
          publisher: appData.publisher,
          version: appData.version,
          release: appData.release,
          type: appData.type,
          os: appData.os,
          osversion: appData.osversion,
          description: appData.description,
          download: appData.download,
          docs: appData.docs,
          language: appData.language,
          db: appData.db,
          status: appData.status,
        },
      );
      console.log('Data saved:', response.data);
      setShowEditApp(true); // Close the modal after successful save
      // Reload new data for the table
      const newDataResponse = await axios.get(
        `${BACK_END_PORT}/api/v1/App/get_App_by_Id/` + software.appId,
      );
      setAppData(newDataResponse.data);
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
      const response = await axios.put(
        `${BACK_END_PORT}/api/v1/Asset/CreateAsset`,
        {
          name: formData.name,
          cpu: formData.cpu,
          gpu: formData.gpu,
          ram: formData.ram,
          memory: formData.memory,
          os: formData.os,
          version: formData.version,
          ipAddress: formData.ipAddress,
          manufacturer: formData.manufacturer,
          model: formData.model,
          serialNumber: formData.serialNumber,
          lastSuccesfullScan: currentDateOnly,
          status: 1,
        },
      );
      console.log('Data saved:', response.data);
      setIsOpenEdit(false); // Close the modal after successful save
      // setFormData(defaultData);
      setSelectedRow(new Set());
      // Reload new data for the table
      const newDataResponse = await axios.get(
        `${BACK_END_PORT}/api/v1/Asset/list_Asset_by_App/` + software?.appId,
      );
      setDeviceData(newDataResponse.data);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  const handleSaveEditAsset = async () => {
    try {
      // Replace 'YOUR_API_ENDPOINT_HERE' with your actual API endpoint
      const curDate = new Date();
      const response = await axios.put(
        `${BACK_END_PORT}/api/v1/Asset/UpdateAsset/` + formData2.assetId,
        {
          name: formData2.name,
          cpu: formData2.cpu,
          gpu: formData2.gpu,
          ram: formData2.ram,
          memory: formData2.memory,
          os: formData2.os,
          version: formData2.version,
          ipAddress: formData2.ipAddress,
          bandwidth: formData2.bandwidth,
          manufacturer: formData2.manufacturer,
          model: formData2.model,
          serialNumber: formData2.serialNumber,
          lastSuccesfullScan: curDate,
          status: formData2.status,
        },
      );
      console.log('Data saved:', response.data);
      setIsOpenEdit(false); // Close the modal after successful save
      setFormData2(defaultData);
      setButtonDisabled(true);
      setSelectedRow(new Set());
      // Reload new data for the table
      const newDataResponse = await axios.get(
        `${BACK_END_PORT}/api/v1/Asset/list_Asset_by_App/` + software?.appId,
      );
      setDeviceData(newDataResponse.data);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  const handleDelete = async () => {
    try {
      await axios.delete(
        `${BACK_END_PORT}/api/Asset_App/DeleteAssetApplication/` +
          formData2.assetId +
          `/` +
          software.appId,
      );
      setIsOpenDelete(false); // Close the "Confirm Delete" modal
      setSelectedRow(new Set());
      setButtonDisabled(true);

      // Reload the data for the table after deletion
      const newDataResponse = await axios.get(
        `${BACK_END_PORT}/api/v1/Asset/list_Asset_by_App/` + software?.appId,
      );
      setDeviceData(newDataResponse.data);
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

  const handleSaveAddLi = async () => {
    try {
      // Replace 'YOUR_API_ENDPOINT_HERE' with your actual API endpoint
      const response = await axios.post(
        `${BACK_END_PORT}/api/v1/Library/CreateLibrary`,
        {
          appId: software.appId,
          name: formData3.name,
          publisher: formData3.publisher,
          libraryKey: formData3.libraryKey,
          start_Date: formData3.start_Date,
          time: formData3.time,
          status: 1,
        },
      );
      console.log('Data saved:', response.data);
      setIsOpenAddLi(false); // Close the modal after successful save
      setFormData3(defaultData2);
      setButtonDisabled1(true);
      setSelectedRow1(new Set());
      // Reload new data for the table
      const newDataResponse = await axios.get(
        `${BACK_END_PORT}/api/v1/Library/ListLibrariesByApp/` + software?.appId,
      );
      setLibraryData(newDataResponse.data);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  const handleSaveEditLi = async () => {
    try {
      // Replace 'YOUR_API_ENDPOINT_HERE' with your actual API endpoint
      const response = await axios.put(
        `${BACK_END_PORT}/api/v1/Library/UpdateLibrary/` + formData1.libraryId,
        {
          appId: software.appId,
          name: formData1.name,
          publisher: formData1.publisher,
          libraryKey: formData1.libraryKey,
          start_Date: formData1.start_Date,
          time: formData1.time,
          status: formData1.status,
        },
      );
      console.log('Data saved:', response.data);
      setIsOpenEditLi(false); // Close the modal after successful save
      setButtonDisabled1(true);
      setFormData1(defaultData2);
      setSelectedRow1(new Set());
      // Reload new data for the table
      const newDataResponse = await axios.get(
        `${BACK_END_PORT}/api/v1/Library/ListLibrariesByApp/` + software?.appId,
      );
      setLibraryData(newDataResponse.data);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  const handleDeleteLi = async () => {
    try {
      await axios.delete(
        `${BACK_END_PORT}/api/v1/Library/DeleteLibraryWith_key?libraryId=` +
          formData1?.libraryId,
      );
      setIsOpenDeleteLi(false); // Close the "Confirm Delete" modal
      setSelectedRow1(new Set());

      // Reload the data for the table after deletion
      const newDataResponse = await axios.get(
        `${BACK_END_PORT}/api/v1/Library/ListLibrariesByApp/` + software?.appId,
      );
      setLibraryData(newDataResponse.data);
      toast({
        title: 'License Deleted',
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
  const handleRowClick = (item) => {
    if (selectedRow === item.assetId) {
      setSelectedRow(null); // Unselect the row if it's already selected
      setFormData2(defaultData);
      setButtonDisabled(true);
    } else {
      setSelectedRow(item.assetId);
      setFormData2(item);
      setButtonDisabled(false);
    }
  };
  const handleRowClick1 = (item) => {
    if (selectedRow1 === item.libraryId) {
      setSelectedRow1(null); // Unselect the row if it's already selected
      setFormData1(defaultData2);
      setButtonDisabled1(true);
    } else {
      setSelectedRow1(item.libraryId);
      setFormData1(item);
      setButtonDisabled1(false);
    }
  };
  //
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        try {
          const response = await axios.get(
            `${BACK_END_PORT}/api/Report/GetReportsForAppAndType/` +
              software?.appId +
              `/Issue`,
          );
          setReportData(response.data); // Assuming the API returns an array of objects
        } catch (error) {
          setReportData([]);
        }
        try {
          const response2 = await axios.get(
            `${BACK_END_PORT}/api/v1/Asset/list_Asset_by_App/` +
              software?.appId,
          );
          setDeviceData(response2.data); // Assuming the API returns an array of objects
        } catch (error) {
          setDeviceData([]);
        }
        try {
          const response3 = await axios.get(
            `${BACK_END_PORT}/api/v1/App/list_App_by_user/` + account?.accId,
          );
          setSoftwareData(response3.data);
        } catch (error) {
          setSoftwareData([]);
        }
        try {
          const response4 = await axios.get(
            `${BACK_END_PORT}/api/Report/GetReportsForAppAndType/` +
              software?.appId +
              `/Feedback`,
          );
          setFeedbackData(response4.data); // Assuming the API returns an array of objects
        } catch (error) {
          setFeedbackData([]);
        }
        try {
          const response5 = await axios.get(
            `${BACK_END_PORT}/api/v1/Library/ListLibrariesByApp/` +
              software?.appId,
          );
          setLibraryData(response5.data);
        } catch (error) {
          setLibraryData([]);
        }
        try {
          const response6 = await axios.get(
            `${BACK_END_PORT}/api/v1/App/get_App_by_Id/` + software?.appId,
          );
          setAppData(response6.data[0]);
        } catch (error) {
          setAppData([]);
        }
        setLoading(false);
      } catch (error) {
        //console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [software, account, showEditApp]);
  //
  // useEffect(() => {
  //   if (data.length > 0 && softwareData.length > 0) {
  //     const mergedData = data.map((report) => {
  //       const software = softwareData.find((sw) => sw.appId === report.appId);
  //       return {
  //         ...report,
  //         name: software?.name ? software?.name : report.appId,
  //       };
  //     });
  //     setReportData(mergedData);
  //     // console.log(reportData);
  //   }
  // }, [data, softwareData]);
  // Handle search input change
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleSearchInputChange1 = (e) => {
    setSearchQuery1(e.target.value);
  };
  // Filter function to search for assets
  const filterAssets = () => {
    const query = searchQuery.toLowerCase();
    const filteredData = deviceData.filter((item) => {
      const name = item?.name.toLowerCase();
      const model = item?.model.toLowerCase();
      const manufacturer = item?.manufacturer.toLowerCase();
      return (
        name.includes(query) ||
        model.includes(query) ||
        manufacturer.includes(query)
      );
    });
    setFilteredDeviceData(filteredData);
  };
  const filterLibrary = () => {
    const query = searchQuery1.toLowerCase();
    const filteredData = libraryData.filter((item) => {
      const name = item?.name.toLowerCase();
      const publisher = item?.publisher.toLowerCase();
      return name.includes(query) || publisher.includes(query);
    });
    setFilteredLibraryData(filteredData);
  };
  // Update filtered data whenever the search query changes
  useEffect(() => {
    filterAssets();
  }, [searchQuery, deviceData]);
  useEffect(() => {
    filterLibrary();
  }, [searchQuery1, libraryData]);
  //

  const handleDetail = (item) => {
    localStorage.setItem('device', JSON.stringify(item));
    // console.log(localStorage.getItem('assetId'));
  };
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
          {software?.name}
        </ListItem>
        <ListItem className={styles.list}>
          <Text fontSize='2xl'>{software?.name}</Text>
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
              Summary
            </Tab>
            <Tab
              className={styles.tab}
              _selected={{
                color: '#4d9ffe',
                borderBottom: '1px solid #4d9ffe',
              }}
            >
              Asset
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
              Issue
            </Tab>
            <Tab
              className={styles.tab}
              _selected={{
                color: '#4d9ffe',
                borderBottom: '1px solid #4d9ffe',
              }}
            >
              Feedback
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {showEditApp ? (
                <Box borderWidth='1px' borderRadius='lg' p={4} boxShadow='md'>
                  <TableContainer>
                    <Table>
                      <Tbody>
                        <Tr className={styles.borderTop}>
                          <Td className={styles.text2}>Name</Td>
                          <Td className={styles.borderRight}>
                            {appData?.name || 'loading'}
                          </Td>
                          <Td className={styles.text2}>Version</Td>
                          <Td className={styles.borderRight}>
                            {appData?.version}
                          </Td>
                          <Td className={styles.text2}>OS</Td>
                          <Td>{appData?.os}</Td>
                        </Tr>
                        <Tr>
                          <Td className={styles.text2}>Publisher</Td>
                          <Td className={styles.borderRight}>
                            {appData?.publisher}
                          </Td>
                          <Td className={styles.text2}>Release</Td>
                          <Td className={styles.borderRight}>
                            {appData?.release}
                          </Td>
                          <Td className={styles.text2}>OS Version</Td>
                          <Td>{appData?.osversion}</Td>
                        </Tr>
                        <Tr>
                          <Td className={styles.text2}>Programming</Td>
                          <Td className={styles.borderRight}>
                            {appData?.language}
                          </Td>
                          <Td className={styles.text2}>Database</Td>
                          <Td className={styles.borderRight}>{appData?.db}</Td>
                          <Td className={styles.text2}>Status</Td>
                          <Td>
                            {appData?.status === 1
                              ? 'Active'
                              : appData?.status === 2
                              ? 'Inactive'
                              : appData?.status === 3
                              ? 'Deleted'
                              : 'Unknown'}
                          </Td>
                        </Tr>
                        <Tr className={styles.borderTop}>
                          <Td className={styles.text2}>Download Link</Td>
                          <Td className={styles.borderRight} colSpan='2'>
                            {appData?.download}
                          </Td>
                          <Td className={styles.text2}>Document Link</Td>
                          <Td colSpan='2'>{appData?.docs}</Td>
                        </Tr>
                        <Tr className={styles.borderTop}>
                          <Td className={styles.text2}>Note</Td>
                          <Td colSpan='5'>{appData?.description}</Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </TableContainer>
                  <Button
                    colorScheme='gray'
                    mt={3}
                    onClick={() => setShowEditApp(false)}
                  >
                    Edit
                  </Button>
                </Box>
              ) : (
                <Box borderWidth='1px' borderRadius='lg' p={4} boxShadow='md'>
                  <TableContainer>
                    <Table>
                      <Tbody>
                        <Tr className={styles.borderTop}>
                          <Td className={styles.text2}>Name</Td>
                          <Td className={styles.borderRight}>
                            <Input
                              name='name'
                              value={appData?.name}
                              onChange={handleInputChange}
                            />
                          </Td>
                          <Td className={styles.text2}>Version</Td>
                          <Td className={styles.borderRight}>
                            <Input
                              name='version'
                              value={appData?.version}
                              onChange={handleInputChange}
                            />
                          </Td>
                          <Td className={styles.text2}>OS</Td>
                          <Td>
                            <Input
                              name='os'
                              value={appData?.os}
                              onChange={handleInputChange}
                            />
                          </Td>
                        </Tr>
                        <Tr>
                          <Td className={styles.text2}>Publisher</Td>
                          <Td className={styles.borderRight}>
                            <Input
                              name='publisher'
                              value={appData?.publisher}
                              onChange={handleInputChange}
                            />
                          </Td>
                          <Td className={styles.text2}>Release</Td>
                          <Td className={styles.borderRight}>
                            <Input
                              name='release'
                              value={appData?.release}
                              onChange={handleInputChange}
                            />
                          </Td>
                          <Td className={styles.text2}>OS Version</Td>
                          <Td>
                            <Input
                              name='osversion'
                              value={appData?.osversion}
                              onChange={handleInputChange}
                            />
                          </Td>
                        </Tr>
                        <Tr>
                          <Td className={styles.text2}>Programming</Td>
                          <Td className={styles.borderRight}>
                            <Input
                              name='language'
                              value={appData?.language}
                              onChange={handleInputChange}
                            />
                          </Td>
                          <Td className={styles.text2}>Database</Td>
                          <Td className={styles.borderRight}>
                            <Input
                              name='db'
                              value={appData?.db}
                              onChange={handleInputChange}
                            />
                          </Td>
                          <Td className={styles.text2}>Status</Td>
                          <Td>
                            <Select
                              name='status'
                              value={appData?.status}
                              onChange={handleInputChange}
                            >
                              <option value='1'>Active</option>
                              <option value='2'>Inactive</option>
                              <option value='3'>Deleted</option>
                            </Select>
                          </Td>
                        </Tr>
                        <Tr className={styles.borderTop}>
                          <Td className={styles.text2}>Download Link</Td>
                          <Td className={styles.borderRight} colSpan='2'>
                            <Input
                              name='download'
                              value={appData?.download}
                              onChange={handleInputChange}
                            />
                          </Td>
                          <Td className={styles.text2}>Document Link</Td>
                          <Td colSpan='2'>
                            <Input
                              name='docs'
                              value={appData?.docs}
                              onChange={handleInputChange}
                            />
                          </Td>
                        </Tr>
                        <Tr className={styles.borderTop}>
                          <Td className={styles.text2}>Note</Td>
                          <Td colSpan='5'>
                            <Input
                              name='description'
                              value={appData?.description}
                              onChange={handleInputChange}
                            />
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </TableContainer>
                  <Button
                    colorScheme='blue'
                    mt={3}
                    mr={2}
                    onClick={handleEditApp}
                  >
                    Save
                  </Button>
                  <Button
                    colorScheme='gray'
                    mt={3}
                    onClick={() => setShowEditApp(true)}
                  >
                    Back
                  </Button>
                </Box>
              )}
            </TabPanel>
            <TabPanel>
              <ListItem className={styles.list} pt={0}>
                <Flex>
                  <Box>
                    <InputGroup>
                      <InputLeftAddon children='Search' />
                      <Input
                        type='text'
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        placeholder='name - manufacturer - model'
                        w={300}
                        mr={1}
                      />
                    </InputGroup>
                  </Box>
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
                  <Table
                    variant='striped'
                    colorScheme='gray'
                    className={styles.cTable}
                  >
                    <TableCaption className={styles.cTableCaption}>
                      Total{' '}
                      {filteredDeviceData.filter((item) => item.status != 3)
                        .length < 2
                        ? filteredDeviceData.filter((item) => item.status != 3)
                            .length + ' asset'
                        : filteredDeviceData.filter((item) => item.status != 3)
                            .length + ' assets'}
                    </TableCaption>
                    <Thead>
                      <Tr>
                        <Th className={styles.cTh}>No</Th>
                        <Th className={styles.cTh}>Name</Th>
                        <Th className={styles.cTh}>Manufacturer</Th>
                        <Th className={styles.cTh}>Model</Th>
                        <Th className={styles.cTh}>Serial Number</Th>
                        <Th className={styles.cTh}>Last Updated</Th>
                        <Th className={styles.cTh}>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredDeviceData
                        .filter((item) => item.status != 3)
                        .map((item, index) => (
                          <Tr
                            key={item.assetId}
                            color={
                              selectedRow === item.assetId ? 'red' : 'black'
                            }
                            onClick={() => handleRowClick(item)}
                          >
                            <Td>{index + 1}</Td>
                            <Td className={styles.listitem}>
                              <Link
                                href={'/pmpages/AssetDetail'}
                                onClick={() => handleDetail(item)}
                              >
                                {item.name}
                              </Link>
                            </Td>
                            <Td>{item.manufacturer}</Td>
                            <Td>{item.model}</Td>
                            <Td>{item.serialNumber}</Td>
                            <Td>{item.lastSuccesfullScan}</Td>
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
            </TabPanel>
            <TabPanel>
              <ListItem className={styles.list} pt={0}>
                <Flex>
                  <Box>
                    <InputGroup>
                      <InputLeftAddon children='Search' />
                      <Input
                        type='text'
                        value={searchQuery1}
                        onChange={handleSearchInputChange1}
                        placeholder='name - publisher'
                        w={300}
                        mr={1}
                      />
                    </InputGroup>
                  </Box>
                  <Spacer />
                  <Box>
                    <IconButton
                      aria-label='Add'
                      icon={<FaPlus />}
                      colorScheme='gray' // Choose an appropriate color
                      marginRight={1}
                      onClick={() => setIsOpenAddLi(true)}
                    />
                    <IconButton
                      aria-label='Edit'
                      icon={<FaEdit />}
                      colorScheme='gray' // Choose an appropriate color
                      marginRight={1}
                      onClick={() => setIsOpenEditLi(true)}
                      isDisabled={isButtonDisabled1}
                    />
                    <IconButton
                      aria-label='Delete'
                      icon={<FaTrash />}
                      colorScheme='gray' // Choose an appropriate color
                      onClick={() => setIsOpenDeleteLi(true)}
                      isDisabled={isButtonDisabled1}
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
                    <TableCaption className={styles.cTableCaption}>
                      Total{' '}
                      {filteredLibraryData.filter((item) => item.status != 3)
                        .length < 2
                        ? filteredLibraryData.filter((item) => item.status != 3)
                            .length + ' license'
                        : filteredLibraryData.filter((item) => item.status != 3)
                            .length + ' licenses'}
                    </TableCaption>
                    <Thead>
                      <Tr>
                        <Th className={styles.cTh}>No</Th>
                        <Th className={styles.cTh}>Name</Th>
                        <Th className={styles.cTh}>Publisher</Th>
                        <Th className={styles.cTh}>License Key</Th>
                        <Th className={styles.cTh}>Start Date</Th>
                        <Th className={styles.cTh}>End Date</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredLibraryData
                        .filter((item) => item.status != 3)
                        .map((item, index) => (
                          <Tr
                            cursor={'pointer'}
                            key={item.libraryId}
                            color={
                              selectedRow1 === item.libraryId ? 'red' : 'black'
                            }
                            onClick={() => handleRowClick1(item)}
                          >
                            <Td>{index + 1}</Td>
                            <Td>{item.name}</Td>
                            <Td>{item.publisher}</Td>
                            <Td>{item.libraryKey}</Td>
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
                <Table
                  variant='striped'
                  colorScheme='gray'
                  className={styles.cTable}
                >
                  <TableCaption>
                    Total{' '}
                    {reportData.length < 2
                      ? reportData.length + ' issue'
                      : reportData.length + ' issues'}
                  </TableCaption>
                  <Thead>
                    <Tr>
                      <Th className={styles.cTh}>Title</Th>
                      <Th className={styles.cTh}>Start Date</Th>
                      <Th className={styles.cTh}>End Date</Th>
                      <Th className={styles.cTh}>Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {reportData.map((item) => (
                      <Tr key={item.reportId}>
                        <Td>{item.title}</Td>
                        <Td>{item.start_Date}</Td>
                        <Td>{item.end_Date}</Td>
                        <Td>
                          {item.status === 1
                            ? 'Unsolved'
                            : item.status === 2
                            ? 'Solved'
                            : item.status === 3
                            ? 'Deleted'
                            : item.status === 4
                            ? 'Canceled'
                            : 'Unknown'}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </TabPanel>
            <TabPanel>
              <TableContainer>
                <Table
                  variant='striped'
                  colorScheme='gray'
                  className={styles.cTable}
                >
                  <TableCaption>
                    Total{' '}
                    {feedbackData.length < 2
                      ? feedbackData.length + ' feedback'
                      : feedbackData.length + ' feedbacks'}
                  </TableCaption>
                  <Thead>
                    <Tr>
                      <Th className={styles.cTh}>Title</Th>
                      <Th className={styles.cTh}>Start Date</Th>
                      <Th className={styles.cTh}>End Date</Th>
                      <Th className={styles.cTh}>Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {feedbackData.map((item) => (
                      <Tr key={item.reportId}>
                        <Td>{item.title}</Td>
                        <Td>{item.start_Date}</Td>
                        <Td>{item.end_Date}</Td>
                        <Td>
                          {item.status === 1
                            ? 'Unsolved'
                            : item.status === 2
                            ? 'Solved'
                            : item.status === 3
                            ? 'Deleted'
                            : item.status === 4
                            ? 'Canceled'
                            : 'Unknown'}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </List>

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
            <Button colorScheme='blue' mr={3} onClick={handleSaveAdd}>
              Save
            </Button>
            <Button onClick={() => setIsOpenAdd(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal // Modal add new library
        isOpen={isOpenAddLi}
        onClose={() => setIsOpenAddLi(false)}
        closeOnOverlayClick={false}
        size='lg'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New License</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8}>
            <Grid templateColumns='repeat(2, 1fr)' gap={4}>
              <GridItem>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    name='name'
                    value={formData3.name}
                    onChange={handleInputChange3}
                    required
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Publisher</FormLabel>
                  <Input
                    name='publisher'
                    value={formData3.publisher}
                    onChange={handleInputChange3}
                    required
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>License key</FormLabel>
                  <Input
                    name='libraryKey'
                    value={formData3.libraryKey}
                    onChange={handleInputChange3}
                    required
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Start Date</FormLabel>
                  <Input
                    name='start_Date'
                    value={formData3.start_Date}
                    onChange={handleInputChange3}
                    type='date'
                    required
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Time</FormLabel>
                  <Input
                    name='time'
                    value={formData3.time}
                    onChange={handleInputChange3}
                    required
                  />
                </FormControl>
              </GridItem>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleSaveAddLi}>
              Save
            </Button>
            <Button onClick={() => setIsOpenAddLi(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal // Modal edit library
        isOpen={isOpenEditLi}
        onClose={() => setIsOpenEditLi(false)}
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
                  <FormLabel>Name</FormLabel>
                  <Input
                    name='name'
                    value={formData1.name}
                    onChange={handleInputChange4}
                    required
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Publisher</FormLabel>
                  <Input
                    name='publisher'
                    value={formData1.publisher}
                    onChange={handleInputChange4}
                    required
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>License key</FormLabel>
                  <Input
                    name='libraryKey'
                    value={formData1.libraryKey}
                    onChange={handleInputChange4}
                    required
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Start Date</FormLabel>
                  <Input
                    name='start_Date'
                    value={convertToISODate(formData1.start_Date)}
                    onChange={handleInputChange4}
                    type='date'
                    required
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Time</FormLabel>
                  <Input
                    name='time'
                    value={formData1.time}
                    onChange={handleInputChange4}
                    required
                  />
                </FormControl>
              </GridItem>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleSaveEditLi}>
              Save
            </Button>
            <Button onClick={() => setIsOpenEditLi(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal //Modal edit asset
        isOpen={isOpenEdit}
        onClose={() => setIsOpenEdit(false)}
        closeOnOverlayClick={false}
        size='4x1'
      >
        <ModalOverlay />
        <ModalContent w='60ws'>
          <ModalHeader>Edit Asset</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8}>
            <Grid templateColumns='repeat(3, 1fr)' gap={4}>
              <Input
                name='assetId'
                value={formData2.assetId}
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
                <FormControl className={styles.formInput}>
                  <FormLabel>Manufacturer</FormLabel>
                  <Input
                    name='manufacturer'
                    value={formData2.manufacturer}
                    onChange={handleInputChange2}
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Model</FormLabel>
                  <Input
                    name='model'
                    value={formData2.model}
                    onChange={handleInputChange2}
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Serial Number</FormLabel>
                  <Input
                    name='serialNumber'
                    value={formData2.serialNumber}
                    onChange={handleInputChange2}
                  />
                </FormControl>
                {/* Add more fields for the first column */}
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>CPU</FormLabel>
                  <Input
                    name='cpu'
                    value={formData2.cpu}
                    onChange={handleInputChange2}
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>GPU</FormLabel>
                  <Input
                    name='gpu'
                    value={formData2.gpu}
                    onChange={handleInputChange2}
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>RAM</FormLabel>
                  <Input
                    name='ram'
                    value={formData2.ram}
                    onChange={handleInputChange2}
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Memory</FormLabel>
                  <Input
                    name='memory'
                    value={formData2.memory}
                    onChange={handleInputChange2}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Operation System</FormLabel>
                  <Input
                    name='os'
                    value={formData2.os}
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
                  <FormLabel>IP Address</FormLabel>
                  <Input
                    name='ipAddress'
                    value={formData2.ipAddress}
                    onChange={handleInputChange2}
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Bandwidth</FormLabel>
                  <Input
                    name='bandwidth'
                    value={formData2.bandwidth}
                    onChange={handleInputChange2}
                  />
                </FormControl>
                {/* Add more fields for the second column */}
              </GridItem>
            </Grid>
            {/* Additional fields can be added to the respective columns */}
            <FormControl className={styles.formInput}>
              <FormLabel>Status</FormLabel>
              <Select
                name='status'
                value={formData2.status}
                onChange={handleInputChange2}
              >
                <option value='1'>Active</option>
                <option value='2'>Inactive</option>
                {/* <option value='3'>Deleted</option> */}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleSaveEditAsset}>
              Save
            </Button>
            <Button onClick={() => setIsOpenEdit(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal //modal delete
        isOpen={isOpenDelete}
        onClose={() => setIsOpenDelete(false)}
      >
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

      <Modal //modal delete
        isOpen={isOpenDeleteLi}
        onClose={() => setIsOpenDeleteLi(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete this license?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={handleDeleteLi}>
              Delete
            </Button>
            <Button onClick={() => setIsOpenDeleteLi(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default SoftwarePage;
