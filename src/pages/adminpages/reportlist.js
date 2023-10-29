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
  Textarea,
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
  reportId: '',
  softwareId: '',
  type: '',
  description: '',
  startDate: '',
  endDate: '',
  status: '',
};

function ReportPage() {
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
  });
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
        const response = await axios.get(`${BACK_END_PORT}/api/Report`);
        setData(response.data); // Assuming the API returns an array of objects
        const response2 = await axios.get(
          `${BACK_END_PORT}/api/v1/Software/ListSoftware`,
        );
        setSoftwareData(response2.data); // Assuming the API returns an array of objects

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

  // Handle search input change
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };
  //
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(formData);
  };
  // Function to get the current date and set it for the endDate field
  const getCurrentDateString = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  //
  const handleSaveAdd = async () => {
    try {
      // Replace 'YOUR_API_ENDPOINT_HERE' with your actual API endpoint
      const response = await axios.post(
        `${BACK_END_PORT}/api/Report/CreateReport`,
        {
          softwareId: formData.softwareId,
          description: formData.description,
          type: formData.type,
          startDate: getCurrentDateString(),
          endDate: formData.endDate,
          status: 1,
          // deviceId: formData.deviceId,
        },
      );
      console.log('Data saved:', response.data);
      setIsOpenAdd(false); // Close the modal after successful save
      setFormData(defaultData);
      setSelectedRow(new Set());
      // Reload new data for the table
      const newDataResponse = await axios.get(
        `${BACK_END_PORT}/api/Report` + account.accId,
      );
      setData(newDataResponse.data);
    } catch (error) {
      console.error('Error saving data:', error);
    }
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
          <Link href='/adminpages/adminhome' className={styles.listitem}>
            Home
          </Link>
          <ArrowForwardIcon margin={1}></ArrowForwardIcon>Reports Management
        </ListItem>
        <ListItem className={styles.list}>
          <Flex>
            <Text fontSize='2xl'>Reports Management</Text>
            <Spacer />
            <Input
              type='text'
              value={searchQuery}
              onChange={handleSearchInputChange}
              placeholder='Search'
              w={300}
              mr={1}
            />
            <Box>
              <IconButton
                aria-label='Add'
                icon={<FaPlus />}
                colorScheme='gray' // Choose an appropriate color
                marginRight={1}
                onClick={() => setIsOpenAdd(true)}
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
              <TableCaption>
                Total {filteredReportData.length} reports
              </TableCaption>
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
                {filteredReportData.map((item) => (
                  <Tr>
                    <Td display='none'>{item.reportId}</Td>
                    <Td className={styles.listitem}>
                      <Link
                        href={'/adminpages/reportdetail'}
                        onClick={() => handleDetail(item)}
                      >
                        {item.name}
                      </Link>
                    </Td>
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
      </List>

      <Modal // Modal add new software
        isOpen={isOpenAdd}
        onClose={() => (setIsOpenAdd(false), setFormData(defaultData))}
        closeOnOverlayClick={false}
        size='lg'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Report</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8}>
            <Grid templateColumns='repeat(2, 1fr)' gap={4}>
              <Input
                name='softwareID'
                value={formData.softwareId}
                onChange={handleInputChange}
                display='none'
              />
              <GridItem>
                <FormControl>
                  <FormLabel>Software</FormLabel>
                  <Select
                    name='softwareId'
                    value={formData.softwareId}
                    onChange={handleInputChange}
                  >
                    {softwareData
                      .filter((item) => item.status === 1)
                      .map((item) => (
                        <option key={item.softwareId} value={item.softwareId}>
                          {item.name}
                        </option>
                      ))}
                  </Select>
                </FormControl>
                {/* Add more fields for the first column */}
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Type</FormLabel>
                  <Select
                    name='type'
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    <option value='Issue'>Issue</option>
                    <option value='Risk'>Risk</option>
                    <option value='Feedback'>Feedback</option>
                  </Select>
                </FormControl>
                {/* Add more fields for the second column */}
              </GridItem>
            </Grid>
            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                name='description'
                placeholder='Decription...'
                width='100%'
                minH={40}
                value={formData.description}
                onChange={handleInputChange}
              />
            </FormControl>
            {/* Additional fields can be added to the respective columns */}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleSaveAdd}>
              Save
            </Button>
            <Button
              onClick={() => (setIsOpenAdd(false), setFormData(defaultData))}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default ReportPage;
