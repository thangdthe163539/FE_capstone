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
import Header2 from '@/components/layouts/Header/index2';
//
const defaultData = {
  appId: '',
  deviceId: '',
  name: '',
  version: '',
  publisher: '',
  type: '',
  installDate: '',
  status: '',
};

function SecurityPage() {
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

  useEffect(() => {
    // Access localStorage on the client side
    const storedSoftware = localStorage.getItem('software');

    if (storedSoftware) {
      const softwareDataDecode = JSON.parse(storedSoftware);
      if (!softwareDataDecode) {
        // router.push('http://localhost:3000');
      } else {
        setSoftware(softwareDataDecode);
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
  const [softwareData, setSoftwareData] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredReportData, setFilteredReportData] = useState([]);
  const toast = useToast();
  //
  //
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BACK_END_PORT}/api/Report/GetReportsForAppAndType/` +
            software.appId +
            `/Issue`,
        );
        setData(response.data); // Assuming the API returns an array of objects
        const response2 = await axios.get(
          `${BACK_END_PORT}/api/v1/App/list_App_by_user/` + account.accId,
        );
        setSoftwareData(response2.data); // Assuming the API returns an array of objects

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
    if (data.length > 0 && softwareData.length > 0) {
      const mergedData = data.map((report) => {
        const software = softwareData.find((sw) => sw.appId === report.appId);
        return {
          ...report,
          name: software.name ? software.name : report.appId,
        };
      });
      setReportData(mergedData);
      // console.log(reportData);
    }
  }, [data, softwareData]);
  // Filter function to search for assets
  const filterAssets = () => {
    const query = searchQuery.toLowerCase();
    const filteredData = reportData.filter((item) => {
      const name = item.name.toLowerCase();
      const type = item.type.toLowerCase();
      return name.includes(query) || type.includes(query);
    });
    setFilteredReportData(filteredData);
  };

  // Update filtered data whenever the search query changes
  useEffect(() => {
    filterAssets();
  }, [searchQuery, reportData]);

  //
  const handleStatusChange = async (item, e) => {
    try {
      // Replace 'YOUR_API_ENDPOINT_HERE' with your actual API endpoint
      const response = await axios.put(
        `${BACK_END_PORT}/api/Report/UpdateReport/` + item.reportId,
        {
          // appId: item.appId,
          description: item.description,
          type: item.type,
          // startDate: item.startDate,
          endDate: item.endDate.toString(),
          status: e.target.value,
        },
      );
      console.log('Data saved:', response.data);
      const newDataResponse = await axios.get(
        `${BACK_END_PORT}/api/Report/GetReportsForAppAndType/` +
          software.appId +
          `/Issue`,
      );
      setData(newDataResponse.data);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  // Handle search input change
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };
  //
  const handleDetail = (item) => {
    localStorage.setItem('report', JSON.stringify(item));
    // console.log(localStorage.getItem('deviceId'));
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
          <Link href='/pmpages/Issue' className={styles.listitem}>
            Issue
          </Link>
          <ArrowForwardIcon margin={1}></ArrowForwardIcon>List Issue
        </ListItem>
        <ListItem className={styles.list}>
          <Flex>
            <Text fontSize='2xl'>Issue</Text>
            <Spacer />
            <Input
              type='text'
              value={searchQuery}
              onChange={handleSearchInputChange}
              placeholder='Search'
              w={300}
              mr={1}
            />
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
                  filteredReportData.filter(
                    (item) => item.type === 'Issue' || item.type === 'Risk',
                  ).length
                }{' '}
                reports
              </TableCaption>
              <Thead>
                <Tr>
                  <Th className={styles.cTh}>No</Th>
                  <Th className={styles.cTh}>Software</Th>
                  <Th className={styles.cTh}>Title</Th>
                  <Th className={styles.cTh}>Start Date</Th>
                  <Th className={styles.cTh}>End Date</Th>
                  <Th className={styles.cTh}>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredReportData
                  .filter(
                    (item) => item.type === 'Issue' || item.type === 'Risk',
                  )
                  .map((item, index) => (
                    <Tr key={item.reportId}>
                      <Td display='none'>{item.reportId}</Td>
                      <Td>{index + 1}</Td>
                      <Td className={styles.listitem}>
                        <Link
                          href={'/pmpages/IssueDetail'}
                          onClick={() => handleDetail(item)}
                        >
                          {item.name}
                        </Link>
                      </Td>
                      <Td>{item.title}</Td>
                      <Td>{item.start_Date}</Td>
                      <Td>{item.end_Date}</Td>
                      <Td>
                        <Select
                          name='status'
                          value={item?.status}
                          onChange={(e) => handleStatusChange(item, e)} // Add onChange handler
                          border='none'
                        >
                          <option value='1'>Unsolved</option>
                          <option value='2'>Solved</option>
                          <option value='3'>Deleted</option>
                        </Select>
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </TableContainer>
        </ListItem>
      </List>
    </Box>
  );
}

export default SecurityPage;
