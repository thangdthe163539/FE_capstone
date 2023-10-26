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
  let account = null;

  useEffect(() => {
    // Access localStorage on the client side
    const storedAccount = localStorage.getItem('account');
    if (storedAccount) {
      account = JSON.parse(storedAccount);
      if (!account || account == null) {
        // router.push('http://localhost:3000');
      }
    }
  }, []);
  //
  let software = {};

  try {
    software = JSON.parse(localStorage.getItem('software'));
    // console.log(software);
  } catch (error) {
    console.error('Error saving data:', error);
  }
  //
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [formData, setFormData] = useState(defaultData);
  const [formData2, setFormData2] = useState(defaultData);
  const [data, setData] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [softwareData, setSoftwareData] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [showDeviceTable, setShowDeviceTable] = useState(true);
  const [showReportTable, setShowReportTable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSoftwareData, setFilteredSoftwareData] = useState([]);
  const toast = useToast();
  //
  //
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // console.log(formData);
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
      setButtonDisabled(false);
    }
  };
  //
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BACK_END_PORT}/api/Report/GetReportsForSoftware/` +
            software.softwareId,
        );
        setData(response.data); // Assuming the API returns an array of objects
        const response2 = await axios.get(
          `${BACK_END_PORT}/api/v1/Device/list_device_with_sw` +
            software.softwareId,
        );
        setDeviceData(response2.data); // Assuming the API returns an array of objects
        const response3 = await axios.get(
          `${BACK_END_PORT}/api/v1/Software/list_software_by_user/` +
            account.accId,
        );
        setSoftwareData(response3.data);
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
    if (data.length > 0 && softwareData.length > 0) {
      const mergedData = data.map((report) => {
        const software = softwareData.find(
          (sw) => sw.softwareId === report.softwareId,
        );
        return {
          ...report,
          name: software.name ? software.name : report.softwareId,
        };
      });
      setReportData(mergedData);
      // console.log(reportData);
    }
  }, [data, softwareData]);
  //
  const text_select = {
    backgroundColor: '#fff',
    borderBottom: 'none',
    color: '#4d9ffe',
  };
  const handleShowDevice = async () => {
    setShowDeviceTable(true);
    setShowReportTable(false);
  };
  const handleShowReport = async () => {
    setShowDeviceTable(false);
    setShowReportTable(true);
  };
  //
  return (
    <Box className={styles.bodybox}>
      <List>
        <ListItem className={styles.list}>
          <Link href='/pmpages/pmhome' className={styles.listitem}>
            Home
          </Link>
          <ArrowForwardIcon margin={1}></ArrowForwardIcon>
          <Link href='/pmpages/softwarelist' className={styles.listitem}>
            Software Management
          </Link>
          <ArrowForwardIcon margin={1}></ArrowForwardIcon>Software Detail
        </ListItem>
        <ListItem className={styles.list}>
          <Flex>
            <Text fontSize='2xl'>Software Detail</Text>
          </Flex>
        </ListItem>
        <ListItem className={styles.list}>
          <Box borderWidth='1px' borderRadius='lg' p={4} boxShadow='md'>
            <Center>
              <Box className={styles.card}>
                <Text className={styles.text2}>Name</Text>
                <Text className={styles.text2}>Publisher</Text>
              </Box>
              <Box className={styles.card}>
                <Text>{software.name}</Text>
                <Text>{software.publisher}</Text>
              </Box>
              <Box className={styles.card}>
                <Text className={styles.text2}>Version</Text>
                <Text className={styles.text2}>Release</Text>
              </Box>
              <Box className={styles.card}>
                <Text>{software.version}</Text>
                <Text>{software.release}</Text>
              </Box>
              <Box className={styles.card}>
                <Text className={styles.text2}>Operation System</Text>
                <Text className={styles.text2}>Status</Text>
              </Box>
              <Box className={styles.card}>
                <Text>{software.os}</Text>
                <Text>
                  {software.status === 1
                    ? 'No issue'
                    : software.status === 2
                    ? 'Have issue'
                    : software.status === 3
                    ? 'Deleted'
                    : 'Unknown'}
                </Text>
              </Box>
            </Center>
          </Box>
        </ListItem>
        <ListItem className={styles.list}>
          <Flex>
            <Text
              className={styles.text}
              onClick={handleShowDevice}
              style={showDeviceTable ? text_select : {}}
            >
              Assets
            </Text>
            <Text
              className={styles.text}
              onClick={handleShowReport}
              style={showReportTable ? text_select : {}}
            >
              Reports
            </Text>
            <Spacer />
          </Flex>
        </ListItem>
        {showDeviceTable && (
          <ListItem className={styles.list}>
            <TableContainer>
              <Table
                variant='striped'
                colorScheme='gray'
                className={styles.cTable}
              >
                <TableCaption className={styles.cTableCaption}>
                  Total {deviceData.length} assets
                </TableCaption>
                <Thead>
                  <Tr>
                    <Th className={styles.cTh}>Name</Th>
                    <Th className={styles.cTh}>Manufacturer</Th>
                    <Th className={styles.cTh}>Model</Th>
                    <Th className={styles.cTh}>Serial Number</Th>
                    <Th className={styles.cTh}>Last Successful Scan</Th>
                    <Th className={styles.cTh}>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {deviceData.map((item) => (
                    <Tr
                      key={item.deviceId}
                      color={selectedRow === item.deviceId ? 'red' : 'black'}
                    >
                      <Td>{item.name}</Td>
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
        )}
        {showReportTable && (
          <ListItem className={styles.list}>
            <TableContainer>
              <Table
                variant='striped'
                colorScheme='gray'
                className={styles.cTable}
              >
                <TableCaption>Total {data.length} reports</TableCaption>
                <Thead>
                  <Tr>
                    <Th className={styles.cTh}>Software</Th>
                    <Th className={styles.cTh}>Type</Th>
                    <Th className={styles.cTh}>Start Date</Th>
                    <Th className={styles.cTh}>End Date</Th>
                    <Th className={styles.cTh}>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {reportData.map((item) => (
                    <Tr>
                      <Td display='none'>{item.reportId}</Td>
                      <Td>{item.name}</Td>
                      <Td>{item.type}</Td>
                      <Td>{item.startDate}</Td>
                      <Td>{item.endDate}</Td>
                      <Td>
                        {item.status === 1
                          ? 'Unsolved'
                          : item.status === 2
                          ? 'Solved'
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
        )}
      </List>
    </Box>
  );
}

export default SoftwarePage;
