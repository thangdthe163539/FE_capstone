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
import PaginationCustom from '@/components/pagination';
//
const defaultData = {
  appId: '',
  assetId: '',
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
  const [dynamicFilteredReportData, setDynamicFilteredReportData] = useState(
    [],
  );
  //pagination
  const itemPerPage = 6;
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
    setDynamicFilteredReportData(
      filteredData.filter((item) => item.type === 'Issue'),
    );
  };
  // Function to get the current date and set it for the endDate field
  const getCurrentDateString = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Update filtered data whenever the search query changes
  useEffect(() => {
    filterAssets();
  }, [searchQuery, reportData]);
  //
  const [imagesState, setImages] = useState([]);

  // console.log(imagesState);
  function dataURLtoBlob(dataURL) {
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  }

  const fileObjects = imagesState.map((image) => {
    // Tạo một Blob từ dataURL
    const blob = dataURLtoBlob(image.dataURL);
    // Tạo một File từ Blob
    return new File([blob], image.fileName, { type: blob.type });
    [];
  });

  //
  const handleStatusChange = async (item, e) => {
    setFormData(item);
    console.log(formData);
    // if (formData.status === 1) {
    //   // If status is 1, set endDate to an empty string
    //   setFormData({
    //     ...formData,
    //     endDate: null, // Empty string
    //   });
    // } else {
    //   // If status is not 1, set endDate to the current date
    //   const currentDate = getCurrentDateString();
    //   setFormData({
    //     ...formData,
    //     endDate: currentDate, // Empty string
    //   });
    // }
    const submitData = new FormData();
    try {
      fileObjects.forEach((file) => {
        submitData.append(`Images`, file);
      });
      submitData.append('AppId', formData?.appId);
      submitData.append('Title', formData?.title);
      submitData.append('Description', formData?.description);
      submitData.append('Type', formData?.type);
      submitData.append('Start_Date', formData?.start_Date);
      submitData.append('End_Date', formData?.end_Date);
      submitData.append('Status', e.target.value);
      // Replace 'YOUR_API_ENDPOINT_HERE' with your actual API endpoint
      const response = await axios.put(
        `${BACK_END_PORT}/api/Report/UpdateReport/` + formData.appId,
        submitData,
      );
      console.log('Data saved:', response.data);
      toast({
        title: 'Edit Report',
        description: 'The report has been successfully edited.',
        status: 'success',
        duration: 3000, // Duration in milliseconds
        isClosable: true,
      });
      router.push('/pmpages/ListIssue');
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
    // console.log(localStorage.getItem('assetId'));
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
                  <Th className={styles.cTh}>No</Th>
                  <Th className={styles.cTh}>Application</Th>
                  <Th className={styles.cTh}>Title</Th>
                  <Th className={styles.cTh}>Start Date</Th>
                  <Th className={styles.cTh}>End Date</Th>
                  <Th className={styles.cTh}>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dynamicList.map((item, index) => (
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
