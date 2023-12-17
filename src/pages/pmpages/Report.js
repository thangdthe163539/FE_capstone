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
import PaginationCustom from '@/components/pagination';
//
function ReportPage() {
  const router = useRouter();
  const [account, setAccount] = useState();
  const [appData, setAppData] = useState([]);
  const [assetData, setAssetData] = useState([]);
  const [softwareData, setSoftwareData] = useState([]);
  const [licenseData, setLicenseData] = useState([]);
  const [libraryData, setLibraryData] = useState([]);

  useEffect(() => {
    // Access localStorage on the client side
    const storedAccount = localStorage.getItem('account');
    if (storedAccount) {
      try {
        const accountDataDecode = JSON.parse(storedAccount);
        if (!accountDataDecode) {
          router.push('/page405');
        } else {
          if (accountDataDecode.roleId !== 2 || accountDataDecode.status == 3) {
            router.push('/page405');
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

  //pagination filteredDeviceData
  const [appDataDynamic, setAppDataDynamic] = useState([]);
  const itemPerPage = 6;
  const [dynamicList1, setDynamicList1] = useState([]);
  const [currentPage1, setCurrentPage1] = useState(1);
  // filteredIssueData;
  const handleChangePage1 = (page) => {
    setCurrentPage1(page);
    let newList = [];
    for (let i = (page - 1) * itemPerPage; i < page * itemPerPage; i++) {
      if (appDataDynamic[i]) {
        newList.push(appDataDynamic[i]);
      }
    }
    setDynamicList1(newList);
  };

  const totalPages1 = appDataDynamic ? appDataDynamic?.length : 0;

  useEffect(() => {
    if (appDataDynamic.length) {
      handleChangePage1(1);
    } else {
      setDynamicList1([]);
    }
  }, [appDataDynamic]);

  //

  //pagination filteredLibrary
  const [assetDataDynamic, setAssetDataDynamic] = useState([]);
  const [dynamicList2, setDynamicList2] = useState([]);
  const [currentPage2, setCurrentPage2] = useState(1);
  // filteredIssueData;
  const handleChangePage2 = (page) => {
    setCurrentPage2(page);
    let newList = [];
    for (let i = (page - 1) * itemPerPage; i < page * itemPerPage; i++) {
      if (assetDataDynamic[i]) {
        newList.push(assetDataDynamic[i]);
      }
    }
    setDynamicList2(newList);
  };

  const totalPages2 = assetDataDynamic ? assetDataDynamic?.length : 0;

  useEffect(() => {
    if (assetDataDynamic.length) {
      handleChangePage2(1);
    } else {
      setDynamicList2([]);
    }
  }, [assetDataDynamic]);

  //

  //pagination filteredIssue
  const [softwareDataDynamic, setSoftwareDataDynamic] = useState([]);
  const [dynamicList3, setDynamicList3] = useState([]);
  const [currentPage3, setCurrentPage3] = useState(1);
  // filteredIssueData;
  const handleChangePage3 = (page) => {
    setCurrentPage3(page);
    let newList = [];
    for (let i = (page - 1) * itemPerPage; i < page * itemPerPage; i++) {
      if (softwareDataDynamic[i]) {
        newList.push(softwareDataDynamic[i]);
      }
    }
    setDynamicList3(newList);
  };

  const totalPages3 = softwareDataDynamic ? softwareDataDynamic?.length : 0;

  useEffect(() => {
    if (softwareDataDynamic.length) {
      handleChangePage3(1);
    } else {
      setDynamicList3([]);
    }
  }, [softwareDataDynamic]);

  //

  //pagination filteredFeedback
  const [libraryDataDynamic, setLibraryDataDynamic] = useState([]);
  const [dynamicList4, setDynamicList4] = useState([]);
  const [currentPage4, setCurrentPage4] = useState(1);
  // filteredIssueData;
  const handleChangePage4 = (page) => {
    setCurrentPage4(page);
    let newList = [];
    for (let i = (page - 1) * itemPerPage; i < page * itemPerPage; i++) {
      if (libraryDataDynamic[i]) {
        newList.push(libraryDataDynamic[i]);
      }
    }
    setDynamicList4(newList);
  };

  const totalPages4 = libraryDataDynamic ? libraryDataDynamic?.length : 0;

  useEffect(() => {
    if (libraryDataDynamic.length) {
      handleChangePage4(1);
    } else {
      setDynamicList4([]);
    }
  }, [libraryDataDynamic]);

  //

  //pagination AddIssue
  const [licenseDataDynamic, setLicenseDataDynamic] = useState([]);
  const [dynamicList5, setDynamicList5] = useState([]);
  const [currentPage5, setCurrentPage5] = useState(1);
  // filteredIssueData;
  const handleChangePage5 = (page) => {
    setCurrentPage5(page);
    let newList = [];
    for (let i = (page - 1) * itemPerPage; i < page * itemPerPage; i++) {
      if (licenseDataDynamic[i]) {
        newList.push(licenseDataDynamic[i]);
      }
    }
    setDynamicList5(newList);
  };

  const totalPages5 = licenseDataDynamic ? licenseDataDynamic?.length : 0;

  useEffect(() => {
    if (licenseDataDynamic.length) {
      handleChangePage5(1);
    } else {
      setDynamicList5([]);
    }
  }, [licenseDataDynamic]);

  //

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BACK_END_PORT}/api/App/list_App_by_user/` + account?.accId,
        );
        setAppData(response.data); // Assuming the API returns an array of objects
        setAppDataDynamic(response.data);
        // const response2 = await axios.get(
        //   `${BACK_END_PORT}/api/Device/list_device_with_user` +
        //     account.accId,
        // );
        // setDeviceData(response2.data); // Assuming the API returns an array of objects
        // setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        // setLoading(false);
      }
    };

    fetchData();
  }, [account]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const uniqueAssetIds = new Set();
        const uniqueLibraryIds = new Set();
        const allAssets = [];
        const allLibrary = [];

        await Promise.all(
          appData
            .filter((software) => software.status !== 3)
            .map(async (software) => {
              try {
                try {
                  const response = await axios.get(
                    `${BACK_END_PORT}/api/Asset/list_Asset_by_App/` +
                      software?.appId,
                  );

                  // Filter out duplicate assets based on device ID

                  const uniqueAssets = response.data.filter((asset) => {
                    if (!uniqueAssetIds.has(asset.assetId)) {
                      uniqueAssetIds.add(asset.assetId);
                      return true;
                    }
                    return false;
                  });
                  allAssets.push(...uniqueAssets);
                } catch (error) {}

                try {
                  const response = await axios.get(
                    `${BACK_END_PORT}/api/Library/ListLibrariesByApp/` +
                      software?.appId,
                  );
                  const response4 = await axios.get(
                    `${BACK_END_PORT}/api/App/ListApps`,
                  );
                  // Add assetId to each license item
                  const licenseDataWithAssetId = response.data.map(
                    (license) => ({
                      ...license,
                      appName: response4.data.find(
                        (software) => software.appId === license.appId,
                      )?.name,
                    }),
                  );

                  allLibrary.push(...licenseDataWithAssetId);
                } catch (error) {}

                return {
                  ...software,
                  // No need to set assets here
                };
              } catch (error) {
                console.log(error);
                return {
                  ...software,
                  // Handle error if needed
                };
              }
            }),
        );

        setAssetData(allAssets);
        setAssetDataDynamic(allAssets);
        setLibraryData(allLibrary);
        setLibraryDataDynamic(allLibrary);
      } catch (error) {
        setAssetData([]);
        console.error('Error fetching data:', error);
      }
    };

    if (appData.length > 0) {
      fetchData();
    }
  }, [appData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const uniqueSoftwareIds = new Set();
        const allSoftware = [];
        const allLicense = [];

        await Promise.all(
          assetData.map(async (asset) => {
            try {
              try {
                const response2 = await axios.get(
                  `${BACK_END_PORT}/api/Software/list_Softwares_by_Asset/` +
                    asset?.assetId,
                );
                // Filter out duplicate software based on assetID
                const uniqueSoftware = response2.data.filter((sw) => {
                  if (!uniqueSoftwareIds.has(sw.softwareId)) {
                    uniqueSoftwareIds.add(sw.softwareId);
                    return true;
                  }
                  return false;
                });
                allSoftware.push(...uniqueSoftware);
              } catch (error) {}

              try {
                const response3 = await axios.get(
                  `${BACK_END_PORT}/api/License/list_Licenses_by_Asset/` +
                    asset?.assetId,
                );
                const response4 = await axios.get(
                  `${BACK_END_PORT}/api/Software/ListSoftwares`,
                );
                // Add assetId to each license item
                const licenseDataWithAssetId = response3.data.map(
                  (license) => ({
                    ...license,
                    asset: asset?.name,
                    name: response4.data.find(
                      (software) => software.softwareId === license.softwareId,
                    )?.name,
                  }),
                );
                allLicense.push(...licenseDataWithAssetId);
              } catch (error) {}
              return {
                ...asset,
                // No need to set assets here
              };
            } catch (error) {
              console.log(error);
              return {
                ...asset,
                // Handle error if needed
              };
            }
          }),
        );
        // Filter out null values (failed assets) before setting the state
        const filteredAssets = assetData.filter(
          (_, index) =>
            allSoftware[index] !== null && allLicense[index] !== null,
        );
        setSoftwareData(allSoftware);
        setSoftwareDataDynamic(allSoftware);
        setLicenseData(allLicense);
        setLicenseDataDynamic(allLicense);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (assetData.length > 0) {
      fetchData();
    }
  }, [assetData]);

  function calculateEndDate(startDate, months) {
    if (months !== 0) {
      if (startDate) {
        // Split the start date into day, month, and year
        const [day, month, year] = startDate?.split('/').map(Number);

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
      } else {
        return months;
      }
    } else {
      return 'No limited time';
    }
  }

  return (
    <Box className={styles.bodybox}>
      <List>
        <ListItem className={styles.list}>
          <Link href='/pmpages/PoHome' className={styles.listitem}>
            Home
          </Link>
          <ArrowForwardIcon margin={1}></ArrowForwardIcon>Report
        </ListItem>
        <ListItem className={styles.list}>
          <Text fontSize='2xl'>Report</Text>
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
              Application
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
              Software
            </Tab>
            <Tab
              className={styles.tab}
              _selected={{
                color: '#4d9ffe',
                borderBottom: '1px solid #4d9ffe',
              }}
            >
              Application License
            </Tab>
            <Tab
              className={styles.tab}
              _selected={{
                color: '#4d9ffe',
                borderBottom: '1px solid #4d9ffe',
              }}
            >
              Software License
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <ListItem className={styles.list}>
                <TableContainer>
                  <Table
                    variant='striped'
                    colorScheme='gray'
                    className={styles.cTable}
                  >
                    <TableCaption>
                      <Flex
                        alignItems={'center'}
                        justifyContent={'space-between'}
                      >
                        <Text>
                          Total {appDataDynamic.length} application(s)
                        </Text>
                        <PaginationCustom
                          current={currentPage1}
                          onChange={handleChangePage1}
                          total={totalPages1}
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
                        <Th className={styles.cTh}>Publisher</Th>
                        <Th className={styles.cTh}>Version</Th>
                        <Th className={styles.cTh}>Release</Th>
                        <Th className={styles.cTh}>Type</Th>
                        <Th className={styles.cTh}>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {dynamicList1.map((item, index) => (
                        <Tr key={item.appId}>
                          <Td>{index + 1}</Td>
                          <Td>{item.name ? item.name : 'N/A'}</Td>
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
            </TabPanel>
            <TabPanel>
              {/* <ListItem className={styles.list} pt={0}>
                <Flex>
                  <Box>
                    <InputGroup>
                      <InputLeftAddon children='Search' />
                      <Input
                        type='text'
                        placeholder='name - manufacturer - model'
                        w={300}
                        mr={1}
                      />
                    </InputGroup>
                  </Box>
                </Flex>
              </ListItem> */}
              <ListItem className={styles.list}>
                <TableContainer>
                  <Table
                    variant='striped'
                    colorScheme='gray'
                    className={styles.cTable}
                  >
                    <TableCaption className={styles.cTableCaption}>
                      <Flex
                        alignItems={'center'}
                        justifyContent={'space-between'}
                      >
                        <Text>Total {assetDataDynamic.length} asset(s)</Text>
                        <PaginationCustom
                          current={currentPage2}
                          onChange={handleChangePage2}
                          total={totalPages2}
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
                        <Th className={styles.cTh}>Manufacturer</Th>
                        <Th className={styles.cTh}>Model</Th>
                        <Th className={styles.cTh}>Serial Number</Th>
                        <Th className={styles.cTh}>Last Updated</Th>
                        <Th className={styles.cTh}>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {dynamicList2.map((item, index) => (
                        <Tr key={item.assetId}>
                          <Td>{index + 1}</Td>
                          <Td>{item.name ? item.name : 'N/A'}</Td>
                          <Td>
                            {item.manufacturer ? item.manufacturer : 'N/A'}
                          </Td>
                          <Td>{item.model ? item.model : 'N/A'}</Td>
                          <Td>
                            {item.serialNumber ? item.serialNumber : 'N/A'}
                          </Td>
                          <Td>
                            {item.lastSuccesfullScan
                              ? item.lastSuccesfullScan
                              : 'N/A'}
                          </Td>
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
              {/* <ListItem className={styles.list} pt={0}>
                <Flex>
                  <Box>
                    <InputGroup>
                      <InputLeftAddon children='Search' />
                      <Input
                        type='text'
                        placeholder='name - publisher'
                        w={300}
                        mr={1}
                      />
                    </InputGroup>
                  </Box>
                </Flex>
              </ListItem> */}
              <ListItem className={styles.list}>
                <TableContainer>
                  <Table variant='striped' colorScheme='gray'>
                    <TableCaption>
                      <Flex
                        alignItems={'center'}
                        justifyContent={'space-between'}
                      >
                        <Text>
                          Total {softwareDataDynamic.length} software(s)
                        </Text>
                        <PaginationCustom
                          current={currentPage3}
                          onChange={handleChangePage3}
                          total={totalPages3}
                          pageSize={itemPerPage}
                        />
                      </Flex>
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
                      </Tr>
                    </Thead>
                    <Tbody>
                      {dynamicList3.map((item, index) => (
                        <Tr key={item.softwareId}>
                          <Td>{index + 1}</Td>
                          <Td>{item.name ? item.name : 'N/A'}</Td>
                          <Td>{item.publisher ? item.publisher : 'N/A'}</Td>
                          <Td>{item.version ? item.version : 'N/A'}</Td>
                          <Td>{item.release ? item.release : 'N/A'}</Td>
                          <Td>{item.type ? item.type : 'N/A'}</Td>
                          <Td>{item.installDate ? item.installDate : 'N/A'}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </ListItem>
            </TabPanel>
            <TabPanel>
              {/* <ListItem className={styles.list} pt={0}>
                <Flex>
                  <Box>
                    <InputGroup>
                      <InputLeftAddon children='Search' />
                      <Input
                        type='text'
                        placeholder='software'
                        w={300}
                        mr={1}
                      />
                    </InputGroup>
                  </Box>
                </Flex>
              </ListItem> */}
              <ListItem className={styles.list}>
                <TableContainer>
                  <Table
                    variant='striped'
                    colorScheme='gray'
                    className={styles.cTable}
                  >
                    <TableCaption className={styles.cTableCaption}>
                      <Flex
                        alignItems={'center'}
                        justifyContent={'space-between'}
                      >
                        <Text>
                          Total {libraryDataDynamic.length} license(s)
                        </Text>
                        <PaginationCustom
                          current={currentPage4}
                          onChange={handleChangePage4}
                          total={totalPages4}
                          pageSize={itemPerPage}
                        />
                      </Flex>
                    </TableCaption>
                    <Thead>
                      <Tr>
                        <Th className={styles.cTh} width='10px'>
                          No
                        </Th>
                        <Th className={styles.cTh}>Application</Th>
                        <Th className={styles.cTh}>Name</Th>
                        <Th className={styles.cTh}>Publisher</Th>
                        <Th className={styles.cTh}>License Key</Th>
                        <Th className={styles.cTh}>Start Date</Th>
                        <Th className={styles.cTh}>End Date</Th>
                        <Th className={styles.cTh}>Type</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {dynamicList4.map((item, index) => (
                        <Tr key={item.libraryId}>
                          <Td>{index + 1}</Td>
                          <Td>{item.appName ? item.appName : 'N/A'}</Td>
                          <Td>{item.name ? item.name : 'N/A'}</Td>
                          <Td>{item.publisher ? item.publisher : 'N/A'}</Td>
                          <Td>{item.libraryKey ? item.libraryKey : 'N/A'}</Td>
                          <Td>{item.start_Date ? item.start_Date : 'N/A'}</Td>
                          <Td>
                            {calculateEndDate(item.start_Date, item.time)}
                          </Td>
                          <Td>
                            {item.status == 1
                              ? 'Closed source license'
                              : item.status == 2
                              ? 'Open source license'
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
              {/* <ListItem className={styles.list} pt={0}>
                <Flex>
                  <Box>
                    <InputGroup>
                      <InputLeftAddon children='Search' />
                      <Input
                        type='text'
                        placeholder='software'
                        w={300}
                        mr={1}
                      />
                    </InputGroup>
                  </Box>
                </Flex>
              </ListItem> */}
              <ListItem className={styles.list}>
                <TableContainer>
                  <Table
                    variant='striped'
                    colorScheme='gray'
                    className={styles.cTable}
                  >
                    <TableCaption className={styles.cTableCaption}>
                      <Flex
                        alignItems={'center'}
                        justifyContent={'space-between'}
                      >
                        <Text>
                          Total {licenseDataDynamic.length} license(s)
                        </Text>
                        <PaginationCustom
                          current={currentPage5}
                          onChange={handleChangePage5}
                          total={totalPages5}
                          pageSize={itemPerPage}
                        />
                      </Flex>
                    </TableCaption>
                    <Thead>
                      <Tr>
                        <Th className={styles.cTh} width='10px'>
                          No
                        </Th>
                        <Th className={styles.cTh}>Software</Th>
                        <Th className={styles.cTh}>Asset</Th>
                        <Th className={styles.cTh}>License Key</Th>
                        <Th className={styles.cTh}>Start Date</Th>
                        <Th className={styles.cTh}>End Date</Th>
                        <Th className={styles.cTh}>Type</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {dynamicList5.map((item, index) => (
                        <Tr key={item.licenseId}>
                          <Td>{index + 1}</Td>
                          <Td>{item.name ? item.name : 'N/A'}</Td>
                          <Td>{item.asset ? item.asset : 'N/A'}</Td>
                          <Td>{item.licenseKey ? item.licenseKey : 'N/A'}</Td>
                          <Td>{item.start_Date ? item.start_Date : 'N/A'}</Td>
                          <Td>
                            {calculateEndDate(item.start_Date, item.time)}
                            {/* {item.time} */}
                          </Td>
                          <Td>
                            {item.status == 1
                              ? 'Closed source license'
                              : item.status == 2
                              ? 'Open source license'
                              : 'Unknown'}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </ListItem>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </List>
    </Box>
  );
}
export default ReportPage;
