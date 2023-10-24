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

function AssetsPage() {
  // console.log(BACK_END_PORT);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    // Access localStorage on the client side
    const storedAccount = localStorage.getItem('account');
    if (storedAccount) {
      setAccount(JSON.parse(storedAccount));
    } else {
      router.push('http://localhost:3000');
    }
  }, []);
  //
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [data, setData] = useState([]);
  const [accData, setAccData] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDeviceData, setFilteredDeviceData] = useState([]);
  //
  //
  //
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BACK_END_PORT}/api/v1/Device`);
        setData(response.data); // Assuming the API returns an array of objects
        const response2 = await axios.get(
          `${BACK_END_PORT}/api/v1/Account/ListAccount`,
        );
        setAccData(response2.data); // Assuming the API returns an array of objects
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    if (data.length > 0 && accData.length > 0) {
      const mergedData = data.map((device) => {
        const account = accData.find((acc) => acc.accId === device.accId);
        return {
          ...device,
          accName: account ? account.account1 : 'Unknown Account',
        };
      });
      setDeviceData(mergedData);
    }
  }, [data, accData]);
  // Filter function to search for assets
  const filterAssets = () => {
    const query = searchQuery.toLowerCase();
    const filteredData = deviceData.filter((item) => {
      const name = item.name.toLowerCase();
      const account = item.accName.toLowerCase();
      const manufacturer = item.manufacturer.toLowerCase();
      return (
        name.includes(query) ||
        account.includes(query) ||
        manufacturer.includes(query)
      );
    });
    setFilteredDeviceData(filteredData);
  };

  // Update filtered data whenever the search query changes
  useEffect(() => {
    filterAssets();
  }, [searchQuery, deviceData]);

  // Handle search input change
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };
  //
  const handleDetail = (item) => {
    localStorage.setItem('deviceId', JSON.stringify(item.deviceId));
    // console.log(localStorage.getItem('deviceId'));
  };
  //
  return (
    <Box className={styles.bodybox}>
      <List>
        <ListItem className={styles.list}>
          <Link
            href='/userpages/userhome'
            _hover={{ textDecor: 'underline' }}
            className={styles.listitem}
          >
            Home
          </Link>
          <ArrowForwardIcon margin={1}></ArrowForwardIcon>Assets
        </ListItem>
        <ListItem className={styles.list}>
          <Flex>
            <Text fontSize='2xl'>Assets</Text>
            <Spacer />
            <Input
              type='text'
              value={searchQuery}
              onChange={handleSearchInputChange}
              placeholder='Search'
              w={300}
            />
          </Flex>
        </ListItem>
        <ListItem className={styles.list}>
          <TableContainer>
            <Table variant='simple'>
              <TableCaption>
                Total {filteredDeviceData.length} assets
              </TableCaption>
              <Thead>
                <Tr>
                  <Th></Th>
                  <Th>Account</Th>
                  <Th>Name</Th>
                  <Th>IP Address</Th>
                  <Th>MAC Address</Th>
                  <Th>Manufacturer</Th>
                  <Th>Model</Th>
                  <Th>Serial Number</Th>
                  <Th>Last Successfull Scan</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredDeviceData.map((item) => (
                  <Tr>
                    <Td>
                      <Button
                        bg='none'
                        border='1px solid gray'
                        w='5'
                        h='10'
                        onClick={() => handleDetail(item)}
                      >
                        <Link href='/userpages/assetdetail'>
                          <Icon as={ViewIcon}></Icon>
                        </Link>
                      </Button>
                    </Td>
                    <Td display='none'>{item.deviceId}</Td>
                    <Td>{item.accName}</Td>
                    <Td>{item.name}</Td>
                    <Td>{item.ipAddress}</Td>
                    <Td>{item.macAddress}</Td>
                    <Td>{item.manufacturer}</Td>
                    <Td>{item.model}</Td>
                    <Td>{item.serialNumber}</Td>
                    <Td>{item.lastSuccessfullScan}</Td>
                    <Td>{item.status ? 'Active' : 'Disabled'}</Td>
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

export default AssetsPage;
