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
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { BACK_END_PORT } from '../../../env';
import Header2 from '@/components/layouts/Header/index2';
import PaginationCustom from '@/components/pagination';
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
  os: 'Window',
  description: '',
  download: '',
  docs: '',
  installDate: '',
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
          if (
            accountDataDecode.roleId !== 2 ||
            accountDataDecode.status !== 1
          ) {
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
  const [dynamicFilteredSoftwareData, setDynamicFilteredSoftwareData] =
    useState([]);
  const toast = useToast();
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

  //pagination
  const itemPerPage = 5;
  const [dynamicList, setDynamicList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  // filteredIssueData;
  const handleChangePage = (page) => {
    setCurrentPage(page);
    let newList = [];
    for (let i = (page - 1) * itemPerPage; i < page * itemPerPage; i++) {
      if (dynamicFilteredSoftwareData[i]) {
        newList.push(dynamicFilteredSoftwareData[i]);
      }
    }
    setDynamicList(newList);
  };
  const totalPages = dynamicFilteredSoftwareData
    ? dynamicFilteredSoftwareData?.length
    : 0;

  useEffect(() => {
    if (dynamicFilteredSoftwareData.length) {
      handleChangePage(1);
    } else {
      setDynamicList([]);
    }
  }, [dynamicFilteredSoftwareData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BACK_END_PORT}/api/App/list_App_by_user/` + account?.accId,
        );
        setData(response.data); // Assuming the API returns an array of objects
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
    if (account && account.accId) {
      fetchData();
    }
  }, [account]);
  //
  useEffect(() => {
    const fetchData = async () => {
      try {
        const mergedData = await Promise.all(
          data.map(async (software) => {
            try {
              const response2 = await axios.get(
                `${BACK_END_PORT}/api/Report/GetReportsForAppAndType/` +
                  software?.appId +
                  `/Issue`,
              );
              const reports = response2.data;
              const count1 = reports
                .filter(
                  (report) =>
                    report.type === 'Issue' || report.type === 'issue',
                )
                .filter((report) => report.status === 2).length;
              const count2 = reports
                .filter(
                  (report) =>
                    report.type === 'Issue' || report.type === 'issue',
                )
                .filter((report) => report.status === 1).length;
              return {
                ...software,
                done: count1 || 0, // Use '0' if count is falsy (including undefined)
                doing: count2 || 0, // Use '0' if count is falsy (including undefined)
              };
            } catch (error) {
              return {
                ...software,
                done: 0, // Use '0' if count is falsy (including undefined)
                doing: 0, // Use '0' if count is falsy (including undefined)
              };
            }
          }),
        );
        setSoftwareData(mergedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (data.length > 0) {
      fetchData();
    }
  }, [data]);

  // Filter function to search for assets
  const filterAssets = () => {
    const query = searchQuery?.toLowerCase();
    const filteredData = softwareData.filter((item) => {
      const name = item.name?.toLowerCase();
      if (name) {
        return name.includes(query);
      }
      return null;
    });
    setFilteredSoftwareData(filteredData);
    setDynamicFilteredSoftwareData(
      filteredData.filter((item) => item.status === 1 || item.status === 2),
    );
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

  return (
    <Box className={styles.bodybox}>
      <List>
        <ListItem className={styles.list}>
          <Link href='/pmpages/PoHome' className={styles.listitem}>
            Home
          </Link>
          <ArrowForwardIcon margin={1}></ArrowForwardIcon>Issue
        </ListItem>
        <ListItem className={styles.list}>
          <Text fontSize='2xl'>Issue</Text>
        </ListItem>
        <ListItem className={styles.list}>
          <Box>
            <InputGroup>
              <InputLeftAddon children='Name' />
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
                    Show {dynamicList.length}/
                    {dynamicFilteredSoftwareData.length} application(s)
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
                  <Th display='none'>Software ID</Th>
                  <Th className={styles.cTh} width='10px'>
                    No
                  </Th>
                  <Th className={styles.cTh}>Application</Th>
                  <Th className={styles.cTh}>Version</Th>
                  <Th className={styles.cTh}>OS</Th>
                  <Th className={styles.cTh}>OS Version</Th>
                  <Th className={styles.cTh}>Solved</Th>
                  <Th className={styles.cTh}>Unsolved</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dynamicList.map((item, index) => (
                  <Tr key={item.appId}>
                    <Td>{index + 1}</Td>
                    <Td className={styles.listitem}>
                      <Link
                        href={'/pmpages/ListIssue'}
                        onClick={() => handleDetail(item)}
                      >
                        {item.name ? item.name : 'N/A'}
                      </Link>
                    </Td>
                    <Td>{item.version ? item.version : 'N/A'}</Td>
                    <Td>{item.os ? item.os : 'N/A'}</Td>
                    <Td>{item.osversion ? item.osversion : 'N/A'}</Td>
                    <Td>{item.done}</Td>
                    <Td>{item.doing}</Td>
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

export default SoftwarePage;
