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
//
function ReportPage() {
  const router = useRouter();
  const [account, setAccount] = useState();
  const [appData, setAppData] = useState([]);
  const [assetData, setAssetData] = useState([]);
  const [softwareData, setSoftwareData] = useState([]);
  const [licenseData, setLicenseData] = useState([]);

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
          `${BACK_END_PORT}/api/v1/App/list_App_by_user/` + account?.accId,
        );
        setAppData(response.data); // Assuming the API returns an array of objects
        // const response2 = await axios.get(
        //   `${BACK_END_PORT}/api/v1/Device/list_device_with_user` +
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
        const allAssets = [];

        await Promise.all(
          appData
            .filter((software) => software.status !== 3)
            .map(async (software) => {
              try {
                const response2 = await axios.get(
                  `${BACK_END_PORT}/api/v1/Asset/list_Asset_by_App/` +
                    software?.appId,
                );

                // Filter out duplicate assets based on device ID

                const uniqueAssets = response2.data.filter((asset) => {
                  if (!uniqueAssetIds.has(asset.assetId)) {
                    uniqueAssetIds.add(asset.assetId);
                    return true;
                  }
                  return false;
                });
                // Accumulate unique assets for each app
                allAssets.push(...uniqueAssets);

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
      } catch (error) {
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
        const uniqueLicenseIds = new Set();
        const allLicense = [];

        await Promise.all(
          assetData.map(async (asset) => {
            try {
              const response2 = await axios.get(
                `${BACK_END_PORT}/api/v1/Software/list_Softwares_by_Asset/` +
                  asset?.assetId,
              );
              const response3 = await axios.get(
                `${BACK_END_PORT}/api/v1/License/list_Licenses_by_Asset/` +
                  asset?.assetId,
              );

              // Filter out duplicate assets based on device ID
              const uniqueSoftware = response2.data.filter((sw) => {
                if (!uniqueSoftwareIds.has(sw.softwareId)) {
                  uniqueSoftwareIds.add(sw.softwareId);
                  return true;
                }
                return false;
              });
              const uniqueLicense = response3.data.filter((sw) => {
                if (!uniqueLicenseIds.has(sw.softwareId)) {
                  uniqueLicenseIds.add(sw.softwareId);
                  return true;
                }
                return false;
              });

              // Accumulate unique assets for each app
              allSoftware.push(...uniqueSoftware);
              allLicense.push(...uniqueLicense);

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

        setSoftwareData(allSoftware);
        setLicenseData(allLicense);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (assetData.length > 0) {
      fetchData();
    }
  }, [assetData]);

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
              License
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <ListItem className={styles.list} pt={0}>
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
                      {assetData.filter((item) => item.status != 3).length < 2
                        ? assetData.filter((item) => item.status != 3).length +
                          ' asset'
                        : assetData.filter((item) => item.status != 3).length +
                          ' assets'}
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
                      {assetData
                        .filter((item) => item.status != 3)
                        .map((item, index) => (
                          <Tr key={item.assetId}>
                            <Td>{index + 1}</Td>
                            <Td className={styles.listitem}>{item.name}</Td>
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
                        placeholder='name - publisher'
                        w={300}
                        mr={1}
                      />
                    </InputGroup>
                  </Box>
                </Flex>
              </ListItem>
              <ListItem className={styles.list}>
                <TableContainer>
                  <Table variant='striped' colorScheme='gray'>
                    <TableCaption>
                      Total {softwareData.length} softwares
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
                      {softwareData.map((item, index) => (
                        <Tr cursor={'pointer'} key={item.softwareId}>
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
              </ListItem>
              <ListItem className={styles.list}>
                <TableContainer>
                  <Table
                    variant='striped'
                    colorScheme='gray'
                    className={styles.cTable}
                  >
                    <TableCaption className={styles.cTableCaption}>
                      Total {licenseData.length} licenses
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
                      {licenseData.map((item, index) => (
                        <Tr cursor={'pointer'} key={item.licenseId}>
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
          </TabPanels>
        </Tabs>
      </List>
    </Box>
  );
}
export default ReportPage;
