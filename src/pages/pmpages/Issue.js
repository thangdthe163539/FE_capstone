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
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { BACK_END_PORT } from '../../../env';
import Header2 from '@/components/layouts/Header/index2';
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BACK_END_PORT}/api/v1/App/list_App_by_user/` + account?.accId,
        );
        setData(response.data); // Assuming the API returns an array of objects
        // const response2 = await axios.get(
        //   `${BACK_END_PORT}/api/v1/Device/list_device_with_user` +
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
            const response2 = await axios.get(
              `${BACK_END_PORT}/api/Report/GetReportsForAppAndType/` +
                software?.appId +
                `/Issue`,
            );
            const reports = response2.data;
            const count1 = reports
              .filter(
                (report) => report.type === 'Issue' || report.type === 'Risk',
              )
              .filter((report) => report.status === 2).length;
            const count2 = reports
              .filter(
                (report) => report.type === 'Issue' || report.type === 'Risk',
              )
              .filter((report) => report.status === 1).length;
            return {
              ...software,
              done: count1 || 0, // Use '0' if count is falsy (including undefined)
              doing: count2 || 0, // Use '0' if count is falsy (including undefined)
            };
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
                  filteredSoftwareData.filter(
                    (item) => item.status === 1 || item.status === 2,
                  ).length
                }{' '}
                softwares
              </TableCaption>
              <Thead>
                <Tr>
                  <Th display='none'>Software ID</Th>
                  <Th className={styles.cTh}>No</Th>
                  <Th className={styles.cTh}>Name</Th>
                  <Th className={styles.cTh}>Versions</Th>
                  <Th className={styles.cTh}>Release</Th>
                  <Th className={styles.cTh}>Solved Issue</Th>
                  <Th className={styles.cTh}>Unsolved Issue</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredSoftwareData
                  .filter((item) => item.status === 1 || item.status === 2)
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
                          href={'/pmpages/ListIssue'}
                          onClick={() => handleDetail(item)}
                        >
                          {item.name}
                        </Link>
                      </Td>
                      <Td>{item.version}</Td>
                      <Td>{item.release}</Td>
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
