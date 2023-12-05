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
import PaginationCustom from '@/components/pagination';
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

function FeedbackPage() {
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
  const [dynamicFilteredReportData, setDynamicFilteredReportData] = useState(
    [],
  );
  const toast = useToast();

  //pagination
  const itemPerPage = 8;
  const [dynamicList, setDynamicList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  // filteredIssueData;
  const handleChangePage = (page) => {
    setCurrentPage(page);
    let newList = [];
    for (let i = (page - 1) * itemPerPage; i < page * itemPerPage; i++) {
      if (dynamicFilteredReportData[i]) {
        newList.push(dynamicFilteredReportData[i]);
      }
    }
    setDynamicList(newList);
  };
  const totalPages = dynamicFilteredReportData
    ? dynamicFilteredReportData?.length
    : 0;

  useEffect(() => {
    if (dynamicFilteredReportData.length) {
      handleChangePage(1);
    }
  }, [dynamicFilteredReportData]);
  //
  //
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BACK_END_PORT}/api/Report/GetReportsForAppAndType/` +
            software.appId +
            `/Feedback`,
        );
        setData(response.data); // Assuming the API returns an array of objects
        const response2 = await axios.get(
          `${BACK_END_PORT}/api/App/list_App_by_user/` + account?.accId,
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
      console.log(reportData);
    }
  }, [data, softwareData]);
  // Filter function to search for assets
  const filterAssets = () => {
    const query = searchQuery.toLowerCase();
    const filteredData = reportData.filter((item) => {
      const name = item.name.toLowerCase();
      const title = item.title.toLowerCase();
      return name.includes(query) || title.includes(query);
    });
    setFilteredReportData(filteredData);
    setDynamicFilteredReportData(
      filteredData.filter((item) => item.type === 'Feedback'),
    );
  };

  // Update filtered data whenever the search query changes
  useEffect(() => {
    filterAssets();
  }, [searchQuery, reportData]);

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
          <Link href='/pmpages/Feedback' className={styles.listitem}>
            Feedback
          </Link>
          <ArrowForwardIcon margin={1}></ArrowForwardIcon>List Feedback
        </ListItem>
        <ListItem className={styles.list}>
          <Flex>
            <Text fontSize='2xl'>List Feedback</Text>
            <Spacer />
            <Box>
              <InputGroup>
                <InputLeftAddon children='Title' />
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
                    Show {dynamicList.length}/{dynamicFilteredReportData.length}{' '}
                    reports
                  </Text>{' '}
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
                  <Th className={styles.cTh}>Application</Th>
                  <Th className={styles.cTh}>Title</Th>
                  <Th className={styles.cTh}>Start date</Th>
                  <Th className={styles.cTh}>Deadline</Th>
                  <Th className={styles.cTh}>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dynamicFilteredReportData.map((item, index) => (
                  <Tr>
                    <Td display='none'>{item.reportId}</Td>
                    <Td>{index + 1}</Td>
                    <Td className={styles.listitem}>
                      <Link
                        href={'/pmpages/FeedbackDetail'}
                        onClick={() => handleDetail(item)}
                      >
                        {item.name}
                      </Link>
                    </Td>
                    <Td>{item.title}</Td>
                    <Td>{item.start_Date}</Td>
                    <Td>{item.end_Date}</Td>
                    <Td>
                      {item?.status == 1
                        ? 'Unsolved'
                        : item?.status == 2
                        ? 'Solved'
                        : item?.status == 3
                        ? 'Deleted'
                        : item?.status == 4
                        ? 'Canceled'
                        : 'Unknown'}
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

export default FeedbackPage;
