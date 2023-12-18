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
  InputGroup,
  InputLeftAddon,
  Tooltip,
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
  FormErrorMessage,
  FormLabel,
  Input,
  Button,
  Select,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import Link from 'next/link';
import styles from '@/styles/pm.module.css';
import { ArrowForwardIcon, ViewIcon } from '@chakra-ui/icons';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { BACK_END_PORT } from '../../../env';
import PaginationCustom from '@/components/pagination';
import Header2 from '@/components/layouts/Header/index2';
//
const defaultData = {
  appId: '',
  assetId: '',
  libraryId: '',
  name: '',
  os: 'Windows',
  version: '',
  publisher: '',
  type: '',
  installDate: '',
  status: '',
};
const defaultData2 = {
  appId: '',
  libraryId: '',
  name: '',
  publisher: '',
  libraryKey: '',
  start_Date: new Date().toISOString().split('T')[0],
  time: '',
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
      try {
        const accountDataDecode = JSON.parse(storedAccount);
        if (!accountDataDecode) {
          router.push('/page405');
        } else {
          if (accountDataDecode.roleId !== 2 || accountDataDecode.status == 3) {
            router.push('/page405');
          } else if (accountDataDecode.status == 2) {
            router.push('/ViewApplication');
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
  const [software, setSoftware] = useState();

  //
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenAddLi, setIsOpenAddLi] = useState(false);
  const [isOpenEditLi, setIsOpenEditLi] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenDeleteLi, setIsOpenDeleteLi] = useState(false);
  const [formData, setFormData] = useState([]);
  const [formData1, setFormData1] = useState(defaultData2);
  const [formData2, setFormData2] = useState(defaultData);
  const [formData3, setFormData3] = useState(defaultData2);
  const [formData4, setFormData4] = useState(defaultData2);
  const [feedbackData, setFeedbackData] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [softwareData, setSoftwareData] = useState([]);
  const [appData, setAppData] = useState({});
  const [reportData, setReportData] = useState([]);
  const [libraryData, setLibraryData] = useState([]);
  const [listAllAsset, setListAllAsset] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModalAdd, setShowModalAdd] = useState(true);
  const [searchAddQuery, setSearchAddQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQuery1, setSearchQuery1] = useState('');
  const [searchQuery2, setSearchQuery2] = useState('');
  const [searchQuery3, setSearchQuery3] = useState('');
  const [filteredDeviceData, setFilteredDeviceData] = useState([]);
  const [filteredLibraryData, setFilteredLibraryData] = useState([]);
  const [filteredAllAssetData, setFilteredAllAssetData] = useState([]);
  const [filteredAllIssueData, setFilteredAllIssueData] = useState([]);
  const [filteredAllFeedbackData, setFilteredAllFeedbackData] = useState([]);
  const [filterStatus1, setFilterStatus1] = useState(-1);
  const [filterStatus2, setFilterStatus2] = useState(-1);
  const [filterStatus3, setFilterStatus3] = useState(-1);
  const [selectedRow, setSelectedRow] = useState(new Set());
  const [selectedRow1, setSelectedRow1] = useState(new Set());
  const [isButtonDisabled, setButtonDisabled] = useState(true);
  const [isButtonDisabled1, setButtonDisabled1] = useState(true);
  const [invalidFields, setInvalidFields] = useState([]);
  const [invalidFields1, setInvalidFields1] = useState([]);
  const [invalidFields2, setInvalidFields2] = useState([]);
  const [invalidFields3, setInvalidFields3] = useState([]);
  const [invalidFields4, setInvalidFields4] = useState([]);
  const [showEditApp, setShowEditApp] = useState(true);
  const toast = useToast();
  //
  //pagination filteredDeviceData
  const [filteredDeviceDataDynamic, setFilteredDeviceDataDynamic] = useState(
    [],
  );
  const itemPerPage = 6;
  const [dynamicList1, setDynamicList1] = useState([]);
  const [currentPage1, setCurrentPage1] = useState(1);
  // filteredIssueData;
  const handleChangePage1 = (page) => {
    setCurrentPage1(page);
    let newList = [];
    for (let i = (page - 1) * itemPerPage; i < page * itemPerPage; i++) {
      if (filteredDeviceDataDynamic[i]) {
        newList.push(filteredDeviceDataDynamic[i]);
      }
    }
    setDynamicList1(newList);
  };

  const totalPages1 = filteredDeviceDataDynamic
    ? filteredDeviceDataDynamic?.length
    : 0;

  useEffect(() => {
    if (filteredDeviceDataDynamic.length) {
      handleChangePage1(1);
    } else {
      setDynamicList1([]);
    }
  }, [filteredDeviceDataDynamic]);

  //

  //pagination filteredLibrary
  const [filteredLibraryDataDynamic, setFilteredLibraryDataDynamic] = useState(
    [],
  );
  const [dynamicList2, setDynamicList2] = useState([]);
  const [currentPage2, setCurrentPage2] = useState(1);
  // filteredIssueData;
  const handleChangePage2 = (page) => {
    setCurrentPage2(page);
    let newList = [];
    for (let i = (page - 1) * itemPerPage; i < page * itemPerPage; i++) {
      if (filteredLibraryDataDynamic[i]) {
        newList.push(filteredLibraryDataDynamic[i]);
      }
    }
    setDynamicList2(newList);
  };

  const totalPages2 = filteredLibraryDataDynamic
    ? filteredLibraryDataDynamic?.length
    : 0;

  useEffect(() => {
    if (filteredLibraryDataDynamic.length) {
      handleChangePage2(1);
    } else {
      setDynamicList2([]);
    }
  }, [filteredLibraryDataDynamic]);

  //

  //pagination filteredIssue
  const [filteredAllIssueDataDynamic, setFilteredAllIssueDataDynamic] =
    useState([]);
  const [dynamicList3, setDynamicList3] = useState([]);
  const [currentPage3, setCurrentPage3] = useState(1);
  // filteredIssueData;
  const handleChangePage3 = (page) => {
    setCurrentPage3(page);
    let newList = [];
    for (let i = (page - 1) * itemPerPage; i < page * itemPerPage; i++) {
      if (filteredAllIssueDataDynamic[i]) {
        newList.push(filteredAllIssueDataDynamic[i]);
      }
    }
    setDynamicList3(newList);
  };

  const totalPages3 = filteredAllIssueDataDynamic
    ? filteredAllIssueDataDynamic?.length
    : 0;

  useEffect(() => {
    if (filteredAllIssueDataDynamic.length) {
      handleChangePage3(1);
    } else {
      setDynamicList3([]);
    }
  }, [filteredAllIssueDataDynamic]);

  //

  //pagination filteredFeedback
  const [filteredAllFeedbackDataDynamic, setFilteredAllFeedbackDataDynamic] =
    useState([]);
  const [dynamicList4, setDynamicList4] = useState([]);
  const [currentPage4, setCurrentPage4] = useState(1);
  // filteredIssueData;
  const handleChangePage4 = (page) => {
    setCurrentPage4(page);
    let newList = [];
    for (let i = (page - 1) * itemPerPage; i < page * itemPerPage; i++) {
      if (filteredAllFeedbackDataDynamic[i]) {
        newList.push(filteredAllFeedbackDataDynamic[i]);
      }
    }
    setDynamicList4(newList);
  };

  const totalPages4 = filteredAllFeedbackDataDynamic
    ? filteredAllFeedbackDataDynamic?.length
    : 0;

  useEffect(() => {
    if (filteredAllFeedbackDataDynamic.length) {
      handleChangePage4(1);
    } else {
      setDynamicList4([]);
    }
  }, [filteredAllFeedbackDataDynamic]);

  //

  //pagination AddIssue
  const [filteredAllAssetDataDynamic, setFilteredAllAssetDataDynamic] =
    useState([]);
  const [dynamicList5, setDynamicList5] = useState([]);
  const [currentPage5, setCurrentPage5] = useState(1);
  // filteredIssueData;
  const handleChangePage5 = (page) => {
    setCurrentPage5(page);
    let newList = [];
    for (let i = (page - 1) * itemPerPage; i < page * itemPerPage; i++) {
      if (filteredAllAssetDataDynamic[i]) {
        newList.push(filteredAllAssetDataDynamic[i]);
      }
    }
    setDynamicList5(newList);
  };

  const totalPages5 = filteredAllAssetDataDynamic
    ? filteredAllAssetDataDynamic?.length
    : 0;

  useEffect(() => {
    if (filteredAllAssetDataDynamic.length) {
      handleChangePage5(1);
    } else {
      setDynamicList5([]);
    }
  }, [filteredAllAssetDataDynamic]);

  //
  //
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    validateInputs();
    setAppData({ ...appData, [name]: value });
    // console.log(formData);
  };
  const handleInputChange1 = (e) => {
    const { name, value } = e.target;
    validateInputs1();
    setFormData1({ ...formData1, [name]: value });
    // console.log(formData1);
  };
  const handleInputChange2 = (e) => {
    const { name, value } = e.target;
    validateInputs2();
    setFormData2({ ...formData2, [name]: value });
    // console.log(formData2);
  };
  const handleInputChange3 = (e) => {
    const { name, value } = e.target;
    validateInputs3();
    setFormData3({ ...formData3, [name]: value });
    // console.log(formData2);
  };
  const handleInputChange4 = (e) => {
    const { name, value } = e.target;
    validateInputs4();
    setFormData4({ ...formData4, [name]: value });
    // console.log(formData4);
  };
  const validateInputs = () => {
    const requiredFields = [
      'name',
      'publisher',
      'osversion',
      'description',
      'language',
      'db',
      'description',
    ];
    const errors = [];

    for (const field of requiredFields) {
      if (!appData[field]) {
        errors.push(field);
      }
    }

    // Update state to mark fields as invalid
    setInvalidFields(errors);

    return errors;
  };
  const validateInputs1 = () => {
    const requiredFields = ['name', 'publisher', 'libraryKey', 'time'];
    const errors = [];

    for (const field of requiredFields) {
      if (!formData1[field] && !(formData1[field] === 0)) {
        errors.push(field);
      }
    }
    // Update state to mark fields as invalid
    setInvalidFields1(errors);
    return errors;
  };
  const validateInputs2 = () => {
    const requiredFields = [
      'name',
      'manufacturer',
      'cpu',
      'ram',
      'memory',
      'version',
    ];
    const errors = [];

    for (const field of requiredFields) {
      if (!formData2[field]) {
        errors.push(field);
      }
    }

    // Update state to mark fields as invalid
    setInvalidFields2(errors);

    return errors;
  };
  const validateInputs3 = () => {
    const requiredFields = [
      'name',
      'publisher',
      'libraryKey',
      'start_Date',
      'time',
    ];
    const errors = [];

    for (const field of requiredFields) {
      if (!formData3[field]) {
        errors.push(field);
      }
    }

    // Update state to mark fields as invalid
    setInvalidFields3(errors);

    return errors;
  };
  const validateInputs4 = () => {
    const requiredFields = [
      'name',
      'manufacturer',
      'cpu',
      'ram',
      'memory',
      'version',
    ];
    const errors = [];

    for (const field of requiredFields) {
      if (!formData4[field]) {
        errors.push(field);
      }
    }

    // Update state to mark fields as invalid
    setInvalidFields4(errors);

    return errors;
  };
  //
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      console.log('Selected File:', selectedFile);
      // You can perform actions with the selected file here
    }
  };
  const handleSearchAddInputChange = (e) => {
    setSearchAddQuery(e.target.value);
  };
  const assetIdsInAsset = deviceData?.map((device) => device?.assetId);
  //
  const handleEditApp = async () => {
    // Validate inputs before saving
    const validationErrors = validateInputs();
    if (validationErrors.length > 0) {
      // You can handle validation errors as needed
      console.error('Validation Errors:', validationErrors);
      return;
    }
    try {
      // Replace 'YOUR_API_ENDPOINT_HERE' with your actual API endpoint
      const response = await axios.put(
        `${BACK_END_PORT}/api/App/UpdateApplication/` + software.appId,
        {
          // accId: account.accId,
          name: appData.name,
          publisher: appData.publisher,
          version: appData.version,
          release: appData.release,
          type: appData.type,
          os: appData.os,
          osversion: appData.osversion,
          description: appData.description,
          download: appData.download,
          docs: appData.docs,
          language: appData.language,
          db: appData.db,
          status: appData.status,
        },
      );
      console.log('Data saved:', response.data);
      setShowEditApp(true); // Close the modal after successful save
      // Reload new data for the table
      const newDataResponse = await axios.get(
        `${BACK_END_PORT}/api/App/get_App_by_Id/` + software.appId,
      );
      setAppData(newDataResponse.data);
      toast({
        title: 'Application Updated',
        description: 'The application has been successfully updated.',
        status: 'success',
        duration: 3000, // Duration in milliseconds
        isClosable: true,
      });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  //
  const handleSaveAdd = async (item) => {
    try {
      // Replace 'YOUR_API_ENDPOINT_HERE' with your actual API endpoint
      const curDate = new Date();
      const currentDateOnly = new Date(
        curDate.getFullYear(),
        curDate.getMonth(),
        curDate.getDate(),
      );
      const response = await axios.post(
        `${BACK_END_PORT}/api/Asset_App/CreateAssetApplication`,
        {
          assetId: item.assetId,
          appId: software.appId,
          installDate: formatDate(currentDateOnly),
          status: 1,
        },
      );
      console.log('Data saved:', response.data);
      setIsOpenAdd(false); // Close the modal after successful save
      setShowModalAdd(true);
      setFormData4(defaultData);
      // setSelectedRow1(null);
      // Reload new data for the table
      const newDataResponse = await axios.get(
        `${BACK_END_PORT}/api/Asset/list_Asset_by_App/` + software?.appId,
      );
      setDeviceData(newDataResponse.data);
      toast({
        title: 'Asset Added',
        description: 'The asset has been successfully added.',
        status: 'success',
        duration: 3000, // Duration in milliseconds
        isClosable: true,
      });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  const handleSaveCreate = async () => {
    // Validate inputs before saving
    const validationErrors = validateInputs4();
    if (validationErrors.length > 0) {
      // You can handle validation errors as needed
      console.error('Validation Errors:', validationErrors);
      return;
    }
    try {
      // Replace 'YOUR_API_ENDPOINT_HERE' with your actual API endpoint
      const curDate = new Date();
      const currentDateOnly = new Date(
        curDate.getFullYear(),
        curDate.getMonth(),
        curDate.getDate(),
      );
      const response = await axios.post(
        `${BACK_END_PORT}/api/Asset/CreateAsset`,
        {
          name: formData4.name,
          cpu: formData4.cpu,
          gpu: formData4.gpu !== null ? formData4.gpu : 'null',
          ram: formData4.ram,
          memory: formData4.memory,
          os: formData4.os,
          version: formData4.version,
          ipAddress: formData4.ipAddress,
          bandwidth: formData4.bandwidth,
          manufacturer: formData4.manufacturer,
          model: formData4.model !== null ? formData4.model : 'null',
          serialNumber: formData4.serialNumber,
          lastSuccesfullScan: formatDate(currentDateOnly),
          status: 1,
        },
      );
      console.log('Data saved:', response.data);
      setShowModalAdd(true);
      setIsOpenAdd(true);
      setFormData4(defaultData);
      // Reload new data for the table
      const newDataResponse = await axios.get(
        `${BACK_END_PORT}/api/Asset/list_Asset_by_App/` + software?.appId,
      );
      setDeviceData(newDataResponse.data);
      toast({
        title: 'Asset Created',
        description: 'The asset has been successfully created.',
        status: 'success',
        duration: 3000, // Duration in milliseconds
        isClosable: true,
      });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  const handleSaveEditAsset = async () => {
    // Validate inputs before saving
    const validationErrors = validateInputs2();
    if (validationErrors.length > 0) {
      // You can handle validation errors as needed
      console.error('Validation Errors:', validationErrors);
      return;
    }
    try {
      // Replace 'YOUR_API_ENDPOINT_HERE' with your actual API endpoint
      const curDate = new Date();
      const response = await axios.put(
        `${BACK_END_PORT}/api/Asset/UpdateAsset/` + formData2.assetId,
        {
          name: formData2.name,
          cpu: formData2.cpu,
          gpu: formData2.gpu,
          ram: formData2.ram,
          memory: formData2.memory,
          os: formData2.os,
          version: formData2.version,
          ipAddress: formData2.ipAddress,
          bandwidth: formData2.bandwidth,
          manufacturer: formData2.manufacturer,
          model: formData2.model,
          serialNumber: formData2.serialNumber,
          lastSuccesfullScan: curDate,
          status: formData2.status,
        },
      );
      console.log('Data saved:', response.data);
      setIsOpenEdit(false); // Close the modal after successful save
      setFormData2(defaultData);
      setButtonDisabled(true);
      setSelectedRow(new Set());
      // Reload new data for the table
      const newDataResponse = await axios.get(
        `${BACK_END_PORT}/api/Asset/list_Asset_by_App/` + software?.appId,
      );
      setDeviceData(newDataResponse.data);
      toast({
        title: 'Asset Updated',
        description: 'The asset has been successfully updated.',
        status: 'success',
        duration: 3000, // Duration in milliseconds
        isClosable: true,
      });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  const handleDelete = async () => {
    try {
      await axios.delete(
        `${BACK_END_PORT}/api/Asset_App/DeleteAssetApplication/` +
          formData2.assetId +
          `/` +
          software.appId,
      );
      setIsOpenDelete(false); // Close the "Confirm Delete" modal
      setSelectedRow(new Set());
      setButtonDisabled(true);

      // Reload the data for the table after deletion
      const newDataResponse = await axios.get(
        `${BACK_END_PORT}/api/Asset/list_Asset_by_App/` + software?.appId,
      );
      setDeviceData(newDataResponse.data);
      toast({
        title: 'Asset Deleted',
        description: 'The asset has been successfully deleted.',
        status: 'success',
        duration: 3000, // Duration in milliseconds
        isClosable: true,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleSaveAddLi = async () => {
    // Validate inputs before saving
    const validationErrors = validateInputs3();
    if (validationErrors.length > 0) {
      // You can handle validation errors as needed
      console.error('Validation Errors:', validationErrors);
      return;
    }
    try {
      // Replace 'YOUR_API_ENDPOINT_HERE' with your actual API endpoint
      let status;
      if (formData3.time == 0 || formData3.time == '0') {
        status = 2;
      } else {
        status = 1;
      }
      const response = await axios.post(
        `${BACK_END_PORT}/api/Library/CreateLibrary`,
        {
          appId: software.appId,
          name: formData3.name,
          publisher: formData3.publisher,
          libraryKey: formData3.libraryKey,
          start_Date: formData3.start_Date,
          time: formData3.time,
          status: status,
        },
      );
      console.log('Data saved:', response.data);
      setIsOpenAddLi(false); // Close the modal after successful save
      setFormData3(defaultData2);
      setButtonDisabled1(true);
      setSelectedRow1(null);
      // Reload new data for the table
      const newDataResponse = await axios.get(
        `${BACK_END_PORT}/api/Library/ListLibrariesByApp/` + software?.appId,
      );
      setLibraryData(newDataResponse.data);
      toast({
        title: 'License Created',
        description: 'The license has been successfully created.',
        status: 'success',
        duration: 3000, // Duration in milliseconds
        isClosable: true,
      });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  const handleSaveEditLi = async () => {
    // Validate inputs before saving
    const validationErrors = validateInputs1();
    if (validationErrors.length > 0) {
      // You can handle validation errors as needed
      console.error('Validation Errors:', validationErrors);
      return;
    }
    try {
      // Replace 'YOUR_API_ENDPOINT_HERE' with your actual API endpoint
      let status;
      if (formData1.time == 0 || formData1.time == '0') {
        status = 2;
      } else {
        status = 1;
      }
      const response = await axios.put(
        `${BACK_END_PORT}/api/Library/UpdateLibrary/` + formData1.libraryId,
        {
          appId: software.appId,
          name: formData1.name,
          publisher: formData1.publisher,
          libraryKey: formData1.libraryKey,
          start_Date: formData1.start_Date,
          time: formData1.time,
          status: status,
        },
      );
      console.log('Data saved:', response.data);
      setIsOpenEditLi(false); // Close the modal after successful save
      setButtonDisabled1(true);
      setFormData1(defaultData2);
      setSelectedRow1(null);
      // Reload new data for the table
      const newDataResponse = await axios.get(
        `${BACK_END_PORT}/api/Library/ListLibrariesByApp/` + software?.appId,
      );
      setLibraryData(newDataResponse.data);
      toast({
        title: 'License Updated',
        description: 'The license has been successfully updated.',
        status: 'success',
        duration: 3000, // Duration in milliseconds
        isClosable: true,
      });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  const handleDeleteLi = async () => {
    try {
      const response = await axios.put(
        `${BACK_END_PORT}/api/Library/UpdateLibrary/` + formData1.libraryId,
        {
          appId: software.appId,
          name: formData1.name,
          publisher: formData1.publisher,
          libraryKey: formData1.libraryKey,
          start_Date: formData1.start_Date,
          time: formData1.time,
          status: 3,
        },
      );
      setIsOpenDeleteLi(false); // Close the "Confirm Delete" modal
      setSelectedRow1(null);
      setButtonDisabled1(true);
      // Reload the data for the table after deletion
      const newDataResponse = await axios.get(
        `${BACK_END_PORT}/api/Library/ListLibrariesByApp/` + software?.appId,
      );
      setLibraryData(newDataResponse.data);
      toast({
        title: 'License Deleted',
        description: 'The license has been successfully deleted.',
        status: 'success',
        duration: 3000, // Duration in milliseconds
        isClosable: true,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };
  //
  const handleRowClick = (item) => {
    if (selectedRow === item.assetId) {
      setSelectedRow(null); // Unselect the row if it's already selected
      setFormData2(defaultData);
      setButtonDisabled(true);
    } else {
      setSelectedRow(item.assetId);
      setFormData2(item);
      setButtonDisabled(false);
    }
  };
  const handleRowClick1 = (item) => {
    if (selectedRow1 === item.libraryId) {
      setSelectedRow1(null); // Unselect the row if it's already selected
      setFormData1(defaultData2);
      setButtonDisabled1(true);
    } else {
      setSelectedRow1(item.libraryId);
      setFormData1(item);
      setFormData1((prevFormData) => {
        return {
          ...prevFormData,
          start_Date: convertToISODate(prevFormData.start_Date),
        };
      });
      setButtonDisabled1(false);
    }
  };
  //
  useEffect(() => {
    const data = localStorage.getItem('software');
    if (data) {
      const softwareDataDecode = JSON.parse(data);
      if (!softwareDataDecode) {
        // router.push('/pmpages/assetlist');
      } else {
        setSoftware(softwareDataDecode);
      }
    }
  }, []);
  //
  useEffect(() => {
    const fetchData = async () => {
      try {
        try {
          const response = await axios.get(
            `${BACK_END_PORT}/api/Report/GetReportsForAppAndType/` +
              software?.appId +
              `/Issue`,
          );
          setReportData(response.data); // Assuming the API returns an array of objects
        } catch (error) {
          setReportData([]);
        }
        try {
          const response2 = await axios.get(
            `${BACK_END_PORT}/api/Asset/list_Asset_by_App/` + software?.appId,
          );
          setDeviceData(response2.data); // Assuming the API returns an array of objects
        } catch (error) {
          setDeviceData([]);
        }
        try {
          const response3 = await axios.get(
            `${BACK_END_PORT}/api/App/list_App_by_user/` + account?.accId,
          );
          setSoftwareData(response3.data);
        } catch (error) {
          setSoftwareData([]);
        }
        try {
          const response4 = await axios.get(
            `${BACK_END_PORT}/api/Report/GetReportsForAppAndType/` +
              software?.appId +
              `/Feedback`,
          );
          setFeedbackData(response4.data); // Assuming the API returns an array of objects
        } catch (error) {
          setFeedbackData([]);
        }
        try {
          const response5 = await axios.get(
            `${BACK_END_PORT}/api/Library/ListLibrariesByApp/` +
              software?.appId,
          );
          setLibraryData(response5.data);
        } catch (error) {
          setLibraryData([]);
        }
        try {
          const response6 = await axios.get(
            `${BACK_END_PORT}/api/App/get_App_by_Id/` + software?.appId,
          );
          setAppData(response6.data[0]);
        } catch (error) {
          setAppData([]);
        }
        try {
          const response7 = await axios.get(
            `${BACK_END_PORT}/api/Asset/ListAssets`,
          );
          setListAllAsset(response7.data);
        } catch (error) {
          setAppData([]);
        }
        setLoading(false);
      } catch (error) {
        //console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [software, account, showEditApp]);

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleSearchInputChange1 = (e) => {
    setSearchQuery1(e.target.value);
  };
  const handleSearchInputChange2 = (e) => {
    setSearchQuery2(e.target.value);
  };
  const handleSearchInputChange3 = (e) => {
    setSearchQuery3(e.target.value);
  };
  // Filter function to search for assets
  const filterAssets = () => {
    const query = searchQuery.toLowerCase();
    const filteredData = deviceData.filter((item) => {
      const name = item?.name.toLowerCase();
      const model = item?.model.toLowerCase();
      const manufacturer = item?.manufacturer.toLowerCase();
      return (
        name.includes(query) ||
        model.includes(query) ||
        manufacturer.includes(query)
      );
    });
    setFilteredDeviceData(filteredData);
    setFilteredDeviceDataDynamic(
      filteredData.filter((item) =>
        filterStatus3 !== -1 ? item.status === filterStatus3 : true,
      ),
    );
  };
  const filterLibrary = () => {
    const query = searchQuery1.toLowerCase();
    const filteredData = libraryData.filter((item) => {
      const name = item?.name.toLowerCase();
      const publisher = item?.publisher.toLowerCase();
      return name.includes(query) || publisher.includes(query);
    });
    setFilteredLibraryData(filteredData);
    setFilteredLibraryDataDynamic(
      filteredData.filter((item) => item.status != 3),
    );
  };
  const filterAssets1 = () => {
    const query = searchAddQuery.toLowerCase();
    const filteredData = listAllAsset
      .filter((item) => item.status != 3)
      .filter((item) => {
        const name = item?.name.toLowerCase();
        const manufacturer = item?.manufacturer.toLowerCase();
        return name.includes(query) || manufacturer.includes(query);
      });
    setFilteredAllAssetData(filteredData);
    setFilteredAllAssetDataDynamic(
      filteredData
        .filter((item) => !assetIdsInAsset.includes(item.assetId))
        .filter((item) => item.status !== 3),
    );
  };
  const filterIssue = () => {
    const query = searchQuery2.toLowerCase();
    const filteredData = reportData.filter((item) => {
      const title = item?.title.toLowerCase();
      return title.includes(query);
    });
    setFilteredAllIssueData(filteredData);
    setFilteredAllIssueDataDynamic(
      filteredData.filter((item) =>
        filterStatus1 !== -1 ? item.status === filterStatus1 : true,
      ),
    );
  };
  const filterFeedback = () => {
    const query = searchQuery3.toLowerCase();
    const filteredData = feedbackData.filter((item) => {
      const title = item?.title.toLowerCase();
      return title.includes(query);
    });
    setFilteredAllFeedbackData(filteredData);
    setFilteredAllFeedbackDataDynamic(
      filteredData.filter((item) =>
        filterStatus2 !== -1 ? item.status === filterStatus2 : true,
      ),
    );
  };
  // Update filtered data whenever the search query changes
  useEffect(() => {
    if (deviceData.length || isOpenAdd || showModalAdd) {
      filterAssets1();
    }
  }, [isOpenAdd, searchAddQuery, listAllAsset, showModalAdd]);
  // Update filtered data whenever the search query changes
  useEffect(() => {
    if (deviceData.length || isOpenAdd) {
      filterAssets();
    }
  }, [searchQuery, deviceData, isOpenAdd, filterStatus3]);
  useEffect(() => {
    filterLibrary();
  }, [searchQuery1, libraryData]);
  useEffect(() => {
    filterIssue();
  }, [searchQuery2, reportData, filterStatus1]);
  useEffect(() => {
    filterFeedback();
  }, [searchQuery3, feedbackData, filterStatus2]);
  //

  const handleDetail = (item) => {
    localStorage.setItem('device', JSON.stringify(item));
    // console.log(localStorage.getItem('assetId'));
  };
  function calculateEndDate(startDate, months) {
    if (months !== 0) {
      if (startDate) {
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
      } else {
        return months;
      }
    } else {
      return 'No limited time';
    }
  }
  const convertToISODate = (dateString) => {
    if (dateString) {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month}-${day}`;
    }
    return null; // or handle the case where dateString is undefined
  };
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };
  //cut text descriptions
  const trimTextToMaxWidth = (text, maxWidth) => {
    if (!text) {
      return null; // or return an appropriate fallback value
    }

    const words = text.split(' ');

    let currentWidth = 0;
    let trimmedWords = [];

    for (let i = 0; i < words.length; i++) {
      const wordWidth = words[i].length * 7;

      if (currentWidth + wordWidth <= maxWidth) {
        trimmedWords.push(words[i]);
        currentWidth += wordWidth;
      } else {
        break;
      }
    }

    const trimmedText = trimmedWords.join(' ');

    return (
      <span>
        {trimmedText}
        <span style={{ color: 'blue', fontSize: '15px' }}>
          {words.length > trimmedWords.length ? ' ...' : ''}
        </span>
      </span>
    );
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
          <Link href='/pmpages/Application' className={styles.listitem}>
            Application
          </Link>
          <ArrowForwardIcon margin={1}></ArrowForwardIcon>
          {software?.name}
        </ListItem>
        <ListItem className={styles.list}>
          <Text fontSize='2xl'>{software?.name}</Text>
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
              Summary
            </Tab>
            <Tab
              className={styles.tab}
              _selected={{
                color: '#4d9ffe',
                borderBottom: '1px solid #4d9ffe',
              }}
            >
              Asset (physical/virtual machine)
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
            <Tab
              className={styles.tab}
              _selected={{
                color: '#4d9ffe',
                borderBottom: '1px solid #4d9ffe',
              }}
            >
              Issue
            </Tab>
            <Tab
              className={styles.tab}
              _selected={{
                color: '#4d9ffe',
                borderBottom: '1px solid #4d9ffe',
              }}
            >
              Feedback
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {showEditApp ? (
                <Center>
                  <Box
                    borderWidth='1px'
                    borderRadius='lg'
                    p={4}
                    boxShadow='md'
                    width='fit-content'
                  >
                    <TableContainer>
                      <Table>
                        <Tbody>
                          <Tr className={styles.borderTop}>
                            <Td className={styles.text2}>Name:</Td>
                            <Td
                              className={`${styles.text3} ${styles.borderRight}`}
                            >
                              {appData?.name ? appData?.name : 'N/A'}
                            </Td>
                            <Td className={styles.text2}>Version:</Td>
                            <Td
                              className={`${styles.text3} ${styles.borderRight}`}
                            >
                              {appData?.version ? appData?.version : 'N/A'}
                            </Td>
                            <Td className={styles.text2}>OS:</Td>
                            <Td className={`${styles.text3}`}>
                              {appData?.os ? appData?.os : 'N/A'}
                            </Td>
                          </Tr>
                          <Tr>
                            <Td className={styles.text2}>Publisher:</Td>
                            <Td
                              className={`${styles.text3} ${styles.borderRight}`}
                            >
                              {appData?.publisher ? appData?.publisher : 'N/A'}
                            </Td>
                            <Td className={styles.text2}>Release:</Td>
                            <Td
                              className={`${styles.text3} ${styles.borderRight}`}
                            >
                              {appData?.release ? appData?.release : 'N/A'}
                            </Td>
                            <Td className={styles.text2}>OS Version:</Td>
                            <Td className={`${styles.text3}`}>
                              {appData?.osversion ? appData?.osversion : 'N/A'}
                            </Td>
                          </Tr>
                          <Tr>
                            <Td className={styles.text2}>Programming:</Td>
                            <Td
                              className={`${styles.text3} ${styles.borderRight}`}
                            >
                              {appData?.language ? appData?.language : 'N/A'}
                            </Td>
                            <Td className={styles.text2}>Database:</Td>
                            <Td
                              className={`${styles.text3} ${styles.borderRight}`}
                            >
                              {appData?.db ? appData?.db : 'N/A'}
                            </Td>
                            <Td className={styles.text2}>Status:</Td>
                            <Td className={`${styles.text3}`}>
                              {appData?.status === 1
                                ? 'Active'
                                : appData?.status === 2
                                ? 'Inactive'
                                : appData?.status === 3
                                ? 'Deleted'
                                : 'Unknown'}
                            </Td>
                          </Tr>
                          <Tr className={styles.borderTop}>
                            <Td className={styles.text2}>Download link:</Td>
                            <Td colSpan='5' className={`${styles.text3}`}>
                              {appData?.download ? appData?.download : 'N/A'}
                            </Td>
                          </Tr>
                          <Tr className={styles.borderTop}>
                            <Td className={styles.text2}>Document link:</Td>
                            <Td colSpan='5' className={`${styles.text3}`}>
                              {appData?.docs ? appData?.docs : 'N/A'}
                            </Td>
                          </Tr>
                          <Tr className={styles.borderTop}>
                            <Td className={styles.text2}>Description:</Td>
                            <Td colSpan='5' className={`${styles.text3}`}>
                              {trimTextToMaxWidth(
                                appData?.description
                                  ? appData?.description
                                  : 'N/A',
                                800,
                              )}
                            </Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </TableContainer>
                    <Button
                      colorScheme='gray'
                      mt={3}
                      onClick={() => setShowEditApp(false)}
                    >
                      Edit
                    </Button>
                  </Box>
                </Center>
              ) : (
                <Center>
                  <Box
                    borderWidth='1px'
                    borderRadius='lg'
                    p={4}
                    boxShadow='md'
                    width='fit-content'
                  >
                    <TableContainer>
                      <Table>
                        <Tbody>
                          <Tr className={styles.borderTop}>
                            <Td className={styles.text2}>
                              <FormControl isRequired>
                                <FormLabel> Name:</FormLabel>
                              </FormControl>
                            </Td>
                            <Td className={styles.borderRight}>
                              <FormControl
                                isRequired
                                isInvalid={invalidFields.includes('name')}
                              >
                                <Input
                                  name='name'
                                  value={appData?.name}
                                  onChange={handleInputChange}
                                  className={styles.text3}
                                />
                                <Flex>
                                  <Spacer />
                                  <FormErrorMessage>
                                    Name is required!
                                  </FormErrorMessage>
                                </Flex>
                              </FormControl>
                            </Td>
                            <Td className={styles.text2}>
                              <FormControl>
                                <FormLabel>Version:</FormLabel>
                              </FormControl>
                            </Td>
                            <Td className={styles.borderRight}>
                              <Input
                                name='version'
                                value={appData?.version}
                                onChange={handleInputChange}
                                className={styles.text3}
                              />
                            </Td>
                            <Td className={styles.text2}>
                              <FormControl>
                                <FormLabel>OS:</FormLabel>
                              </FormControl>
                            </Td>
                            <Td>
                              <Select
                                name='os'
                                value={appData?.os}
                                onChange={handleInputChange}
                                className={styles.text3}
                              >
                                <option value='Windows'>Windows</option>
                                <option value='macOS'>macOS</option>
                                <option value='Linux'>Linux</option>
                                <option value='Android'>Android</option>
                                <option value='iOS'>iOS</option>
                              </Select>
                            </Td>
                          </Tr>
                          <Tr>
                            <Td className={styles.text2}>
                              <FormControl isRequired>
                                <FormLabel>Publisher:</FormLabel>
                              </FormControl>
                            </Td>
                            <Td className={styles.borderRight}>
                              <FormControl
                                isRequired
                                isInvalid={invalidFields.includes('publisher')}
                              >
                                <Input
                                  name='publisher'
                                  value={appData?.publisher}
                                  onChange={handleInputChange}
                                  className={styles.text3}
                                />
                                <Flex>
                                  <Spacer />
                                  <FormErrorMessage>
                                    Publisher is required!
                                  </FormErrorMessage>
                                </Flex>
                              </FormControl>
                            </Td>
                            <Td className={styles.text2}>
                              <FormControl>
                                <FormLabel>Release:</FormLabel>
                              </FormControl>
                            </Td>
                            <Td className={styles.borderRight}>
                              <Input
                                name='release'
                                value={appData?.release}
                                onChange={handleInputChange}
                                className={styles.text3}
                              />
                            </Td>
                            <Td className={styles.text2}>
                              <FormControl isRequired>
                                <FormLabel>OS Version:</FormLabel>
                              </FormControl>
                            </Td>
                            <Td>
                              <FormControl
                                isRequired
                                isInvalid={invalidFields.includes('osversion')}
                              >
                                <Input
                                  name='osversion'
                                  value={appData?.osversion}
                                  onChange={handleInputChange}
                                  className={styles.text3}
                                />
                                <Flex>
                                  <Spacer />
                                  <FormErrorMessage>
                                    OS Version is required!
                                  </FormErrorMessage>
                                </Flex>
                              </FormControl>
                            </Td>
                          </Tr>
                          <Tr>
                            <Td className={styles.text2}>
                              <FormControl isRequired>
                                <FormLabel>Programming:</FormLabel>
                              </FormControl>
                            </Td>
                            <Td className={styles.borderRight}>
                              <FormControl
                                isRequired
                                isInvalid={invalidFields.includes('language')}
                              >
                                <Input
                                  name='language'
                                  value={appData?.language}
                                  onChange={handleInputChange}
                                  className={styles.text3}
                                />
                                <Flex>
                                  <Spacer />
                                  <FormErrorMessage>
                                    Programming is required!
                                  </FormErrorMessage>
                                </Flex>
                              </FormControl>
                            </Td>
                            <Td className={styles.text2}>
                              <FormControl isRequired>
                                <FormLabel>Database:</FormLabel>
                              </FormControl>
                            </Td>
                            <Td className={styles.borderRight}>
                              <FormControl
                                isRequired
                                isInvalid={invalidFields.includes('db')}
                              >
                                <Input
                                  name='db'
                                  value={appData?.db}
                                  onChange={handleInputChange}
                                  className={styles.text3}
                                />
                                <Flex>
                                  <Spacer />
                                  <FormErrorMessage>
                                    Database is required!
                                  </FormErrorMessage>
                                </Flex>
                              </FormControl>
                            </Td>
                            <Td className={styles.text2}>
                              <FormControl>
                                <FormLabel>Status:</FormLabel>
                              </FormControl>
                            </Td>
                            <Td>
                              <Select
                                name='status'
                                value={appData?.status}
                                onChange={handleInputChange}
                                className={styles.text3}
                              >
                                <option value='1'>Active</option>
                                <option value='2'>Inactive</option>
                                <option value='3'>Deleted</option>
                              </Select>
                            </Td>
                          </Tr>
                          <Tr className={styles.borderTop}>
                            <Td className={styles.text2}>
                              <FormControl>
                                <FormLabel>Download link:</FormLabel>
                              </FormControl>
                            </Td>
                            <Td colSpan='5'>
                              <Input
                                name='download'
                                value={appData?.download}
                                onChange={handleInputChange}
                                className={styles.text3}
                              />
                            </Td>
                          </Tr>
                          <Tr className={styles.borderTop}>
                            <Td className={styles.text2}>
                              <FormControl>
                                <FormLabel>Document link:</FormLabel>
                              </FormControl>
                            </Td>
                            <Td colSpan='5'>
                              <Input
                                name='docs'
                                value={appData?.docs}
                                onChange={handleInputChange}
                                className={styles.text3}
                              />
                            </Td>
                          </Tr>
                          <Tr className={styles.borderTop}>
                            <Td className={styles.text2}>
                              <FormControl isRequired>
                                <FormLabel>Description:</FormLabel>
                              </FormControl>
                            </Td>
                            <Td colSpan='5'>
                              <FormControl
                                isRequired
                                isInvalid={invalidFields.includes(
                                  'description',
                                )}
                              >
                                <Input
                                  name='description'
                                  value={appData?.description}
                                  onChange={handleInputChange}
                                  className={styles.text3}
                                />
                                <Flex>
                                  <Spacer />
                                  <FormErrorMessage>
                                    Description is required!
                                  </FormErrorMessage>
                                </Flex>
                              </FormControl>
                            </Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </TableContainer>
                    <Button
                      colorScheme='blue'
                      mt={3}
                      mr={2}
                      onClick={handleEditApp}
                    >
                      Save
                    </Button>
                    <Button
                      colorScheme='gray'
                      mt={3}
                      onClick={() => (
                        setShowEditApp(true), setInvalidFields([])
                      )}
                    >
                      Back
                    </Button>
                  </Box>
                </Center>
              )}
            </TabPanel>
            <TabPanel>
              <ListItem className={styles.list} pt={0}>
                <Flex>
                  <Box>
                    <InputGroup>
                      <InputLeftAddon children='Name / Manufacturer / Model' />
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
                  <Box>
                    <InputGroup>
                      <InputLeftAddon children='Status' />
                      <Select
                        name='status'
                        value={filterStatus3}
                        onChange={(e) =>
                          setFilterStatus3(Number(e.target.value))
                        }
                      >
                        <option value='-1'>All</option>
                        <option value='1'>Active</option>
                        <option value='2'>Inactive</option>
                      </Select>
                    </InputGroup>
                  </Box>
                  <Spacer />
                  <Box>
                    <Tooltip label='Create'>
                      <IconButton
                        aria-label='Add'
                        icon={<FaPlus />}
                        colorScheme='gray' // Choose an appropriate color
                        marginRight={1}
                        onClick={() => setIsOpenAdd(true)}
                      />
                    </Tooltip>
                    <Tooltip label='Edit'>
                      <IconButton
                        aria-label='Edit'
                        icon={<FaEdit />}
                        colorScheme='gray' // Choose an appropriate color
                        marginRight={1}
                        onClick={() => setIsOpenEdit(true)}
                        isDisabled={isButtonDisabled}
                      />
                    </Tooltip>
                    <Tooltip label='Delete'>
                      <IconButton
                        aria-label='Delete'
                        icon={<FaTrash />}
                        colorScheme='gray' // Choose an appropriate color
                        onClick={() => setIsOpenDelete(true)}
                        isDisabled={isButtonDisabled}
                      />
                    </Tooltip>
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
                      <Flex
                        alignItems={'center'}
                        justifyContent={'space-between'}
                      >
                        <Text>
                          Show {dynamicList1.length}/
                          {filteredDeviceDataDynamic.length} asset(s)
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
                        <Th className={styles.cTh}>Manufacturer</Th>
                        <Th className={styles.cTh}>Model</Th>
                        <Th className={styles.cTh}>Serial number</Th>
                        <Th className={styles.cTh}>Last updated</Th>
                        <Th className={styles.cTh}>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {dynamicList1.map((item, index) => (
                        <Tr
                          key={item.assetId}
                          color={selectedRow === item.assetId ? 'red' : 'black'}
                          onClick={() => handleRowClick(item)}
                        >
                          <Td>{index + 1}</Td>
                          <Td className={styles.listitem}>
                            <Link
                              href={'/pmpages/AssetDetail'}
                              onClick={() => handleDetail(item)}
                            >
                              {item.name ? item.name : 'N/A'}
                            </Link>
                          </Td>
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
              <ListItem className={styles.list} pt={0}>
                <Flex>
                  <Box>
                    <InputGroup>
                      <InputLeftAddon children='Name / Publisher' />
                      <Input
                        type='text'
                        value={searchQuery1}
                        onChange={handleSearchInputChange1}
                        placeholder='search...'
                        w={300}
                        mr={1}
                      />
                    </InputGroup>
                  </Box>
                  <Spacer />
                  <Box>
                    <Tooltip label='Create'>
                      <IconButton
                        aria-label='Add'
                        icon={<FaPlus />}
                        colorScheme='gray' // Choose an appropriate color
                        marginRight={1}
                        onClick={() => setIsOpenAddLi(true)}
                      />
                    </Tooltip>
                    <Tooltip label='Edit'>
                      <IconButton
                        aria-label='Edit'
                        icon={<FaEdit />}
                        colorScheme='gray' // Choose an appropriate color
                        marginRight={1}
                        onClick={() => setIsOpenEditLi(true)}
                        isDisabled={isButtonDisabled1}
                      />
                    </Tooltip>
                    <Tooltip label='Delete'>
                      <IconButton
                        aria-label='Delete'
                        icon={<FaTrash />}
                        colorScheme='gray' // Choose an appropriate color
                        onClick={() => setIsOpenDeleteLi(true)}
                        isDisabled={isButtonDisabled1}
                      />
                    </Tooltip>
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
                      <Flex
                        alignItems={'center'}
                        justifyContent={'space-between'}
                      >
                        <Text>
                          Show {dynamicList2.length}/
                          {filteredLibraryDataDynamic.length} license(s)
                        </Text>
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
                        <Th className={styles.cTh}>Publisher</Th>
                        <Th className={styles.cTh}>License key</Th>
                        <Th className={styles.cTh}>Start date</Th>
                        <Th className={styles.cTh}>End date</Th>
                        <Th className={styles.cTh}>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {dynamicList2.map((item, index) => (
                        <Tr
                          cursor={'pointer'}
                          key={item.libraryId}
                          color={
                            selectedRow1 === item.libraryId ? 'red' : 'black'
                          }
                          onClick={() => handleRowClick1(item)}
                        >
                          <Td>{index + 1}</Td>
                          <Td>{item.name ? item.name : 'N/A'}</Td>
                          <Td>{item.publisher ? item.publisher : 'N/A'}</Td>
                          <Td>{item.libraryKey ? item.libraryKey : 'N/A'}</Td>
                          <Td>{item.start_Date ? item.start_Date : 'N/A'}</Td>
                          <Td>
                            {calculateEndDate(item.start_Date, item.time)}
                          </Td>
                          <Td>
                            {item.status === 1
                              ? 'Close source license'
                              : 'Open source license'}
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
                      <InputLeftAddon children='Title' />
                      <Input
                        type='text'
                        value={searchQuery2}
                        onChange={handleSearchInputChange2}
                        placeholder='search...'
                        w={300}
                        mr={1}
                      />
                    </InputGroup>
                  </Box>
                  <Box>
                    <InputGroup>
                      <InputLeftAddon children='Status' />
                      <Select
                        name='status'
                        value={filterStatus1}
                        onChange={(e) =>
                          setFilterStatus1(Number(e.target.value))
                        }
                      >
                        <option value='-1'>All</option>
                        <option value='1'>Unsolved</option>
                        <option value='2'>Solved</option>
                        <option value='3'>Deleted</option>
                        <option value='4'>Canceled</option>
                      </Select>
                    </InputGroup>
                  </Box>
                </Flex>
              </ListItem>
              <ListItem className={styles.list} pt={0}>
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
                          Show {dynamicList3.length}/
                          {filteredAllIssueDataDynamic.length} issue(s)
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
                        <Th className={styles.cTh} width='10px'>
                          No
                        </Th>
                        <Th className={styles.cTh}>Title</Th>
                        <Th className={styles.cTh}>Start date</Th>
                        <Th className={styles.cTh}>Deadline</Th>
                        <Th className={styles.cTh}>Closed date</Th>
                        <Th className={styles.cTh}>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {dynamicList3.map((item, index) => (
                        <Tr key={item.reportId}>
                          <Td>{index + 1}</Td>
                          <Td>{item.title ? item.title : 'N/A'}</Td>
                          <Td>{item.start_Date ? item.start_Date : 'N/A'}</Td>
                          <Td>{item.end_Date ? item.end_Date : 'N/A'}</Td>
                          <Td>
                            {item.closedDate !== null
                              ? item.closedDate
                              : 'In processing'}
                          </Td>
                          <Td>
                            {item.status === 1
                              ? 'Unsolved'
                              : item.status === 2
                              ? 'Solved'
                              : item.status === 3
                              ? 'Deleted'
                              : item.status === 4
                              ? 'Canceled'
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
                      <InputLeftAddon children='Title' />
                      <Input
                        type='text'
                        value={searchQuery3}
                        onChange={handleSearchInputChange3}
                        placeholder='search...'
                        w={300}
                        mr={1}
                      />
                    </InputGroup>
                  </Box>
                  <Box>
                    <InputGroup>
                      <InputLeftAddon children='Status' />
                      <Select
                        name='status'
                        value={filterStatus2}
                        onChange={(e) =>
                          setFilterStatus2(Number(e.target.value))
                        }
                      >
                        <option value='-1'>All</option>
                        <option value='1'>Unsolved</option>
                        <option value='2'>Solved</option>
                        <option value='3'>Deleted</option>
                        <option value='4'>Canceled</option>
                      </Select>
                    </InputGroup>
                  </Box>
                </Flex>
              </ListItem>
              <ListItem className={styles.list} pt={0}>
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
                          Show {dynamicList4.length}/
                          {filteredAllFeedbackDataDynamic.length} feedback(s)
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
                        <Th className={styles.cTh}>Title</Th>
                        <Th className={styles.cTh}>Start date</Th>
                        <Th className={styles.cTh}>Closed date</Th>
                        <Th className={styles.cTh}>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {dynamicList4.map((item, index) => (
                        <Tr key={item.reportId}>
                          <Td>{index + 1}</Td>
                          <Td>{item.title ? item.title : 'N/A'}</Td>
                          <Td>{item.start_Date ? item.start_Date : 'N/A'}</Td>
                          <Td>
                            {item.closedDate !== null
                              ? item.closedDate
                              : 'In processing'}
                          </Td>
                          <Td>
                            {item.status === 1
                              ? 'Unsolved'
                              : item.status === 2
                              ? 'Solved'
                              : item.status === 3
                              ? 'Deleted'
                              : item.status === 4
                              ? 'Canceled'
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

      <Modal // Modal add new asset
        isOpen={isOpenAdd}
        onClose={() => (
          setIsOpenAdd(false),
          setShowModalAdd(true),
          setFormData4(defaultData),
          setInvalidFields4([])
        )}
        closeOnOverlayClick={false}
        size='6x1'
      >
        <ModalOverlay />
        <ModalContent w={showModalAdd ? 'fit-content' : '70vw'} maxW='100vw'>
          <ModalHeader>
            {showModalAdd ? 'Add asset' : 'Create new asset'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8}>
            {showModalAdd ? (
              <Box>
                <Box ml={6} mb={4}>
                  <Flex>
                    <InputGroup>
                      <InputLeftAddon children='Name / Manufacturer' />
                      <Input
                        type='text'
                        value={searchAddQuery}
                        onChange={handleSearchAddInputChange}
                        placeholder='search asset'
                        w={300}
                        mr={1}
                      />
                    </InputGroup>
                    <Tooltip label='Create new asset'>
                      <Button
                        aria-label='Add'
                        colorScheme='gray' // Choose an appropriate color
                        marginRight={1}
                        onClick={() => setShowModalAdd(false)}
                      >
                        Create
                      </Button>
                    </Tooltip>
                  </Flex>
                </Box>
                <TableContainer>
                  <Table simple>
                    <TableCaption>
                      <Flex
                        alignItems={'center'}
                        justifyContent={'space-between'}
                      >
                        <Text>
                          Show {dynamicList5.length}/
                          {filteredAllAssetDataDynamic.length} asset(s)
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
                        <Th className={styles.cTh}>Add</Th>
                        <Th className={styles.cTh}>Name</Th>
                        <Th className={styles.cTh}>Manufacturer</Th>
                        <Th className={styles.cTh}>Model</Th>
                        <Th className={styles.cTh}>CPU</Th>
                        <Th className={styles.cTh}>GPU</Th>
                        <Th className={styles.cTh}>RAM</Th>
                        <Th className={styles.cTh}>Storage</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {dynamicList5.map((item) => (
                        <Tr key={item.assetId}>
                          <Td>
                            <IconButton
                              aria-label='Add'
                              icon={<FaPlus />}
                              colorScheme='gray' // Choose an appropriate color
                              onClick={() => handleSaveAdd(item)}
                            />
                          </Td>
                          <Td>{item.name ? item.name : 'N/A'}</Td>
                          <Td>
                            {item.manufacturer ? item.manufacturer : 'N/A'}
                          </Td>
                          <Td>{item.model ? item.model : 'N/A'}</Td>
                          <Td>{item.cpu ? item.cpu : 'N/A'}</Td>
                          <Td>{item.gpu ? item.gpu : 'N/A'}</Td>
                          <Td>{item.ram ? item.ram + 'GB' : 'N/A'}</Td>
                          <Td>{item.memory ? item.memory + 'GB' : 'N/A'}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
            ) : (
              <>
                <Grid templateColumns='repeat(3, 1fr)' gap={4}>
                  <GridItem>
                    <FormControl
                      isRequired
                      isInvalid={invalidFields4.includes('name')}
                    >
                      <Flex>
                        <FormLabel>Name</FormLabel>
                        <Spacer />
                        <FormErrorMessage mt={-2}>
                          Name is required!
                        </FormErrorMessage>
                      </Flex>
                      <Input
                        name='name'
                        value={formData4.name}
                        onChange={handleInputChange4}
                        required
                      />
                    </FormControl>
                    <FormControl
                      isRequired
                      isInvalid={invalidFields4.includes('manufacturer')}
                      className={styles.formInput}
                    >
                      <Flex>
                        <FormLabel>Manufacturer</FormLabel>
                        <Spacer />
                        <FormErrorMessage mt={-2}>
                          Manufacturer is required!
                        </FormErrorMessage>
                      </Flex>
                      <Input
                        name='manufacturer'
                        value={formData4.manufacturer}
                        onChange={handleInputChange4}
                      />
                    </FormControl>
                    <FormControl className={styles.formInput}>
                      <FormLabel>Model</FormLabel>
                      <Input
                        name='model'
                        value={formData4.model}
                        onChange={handleInputChange4}
                      />
                    </FormControl>
                    <FormControl className={styles.formInput}>
                      <FormLabel>Serial Number</FormLabel>
                      <Input
                        name='serialNumber'
                        value={formData4.serialNumber}
                        onChange={handleInputChange4}
                      />
                    </FormControl>
                    {/* Add more fields for the first column */}
                  </GridItem>
                  <GridItem>
                    <FormControl
                      isRequired
                      isInvalid={invalidFields4.includes('cpu')}
                    >
                      <Flex>
                        <FormLabel>CPU</FormLabel>
                        <Spacer />
                        <FormErrorMessage mt={-2}>
                          CPU is required!
                        </FormErrorMessage>
                      </Flex>
                      <Input
                        name='cpu'
                        value={formData4.cpu}
                        onChange={handleInputChange4}
                      />
                    </FormControl>
                    <FormControl className={styles.formInput}>
                      <FormLabel>GPU</FormLabel>
                      <Input
                        name='gpu'
                        value={formData4.gpu}
                        onChange={handleInputChange4}
                      />
                    </FormControl>
                    <FormControl
                      isRequired
                      isInvalid={invalidFields4.includes('ram')}
                      className={styles.formInput}
                    >
                      <Flex>
                        <FormLabel>RAM</FormLabel>
                        <Spacer />
                        <FormErrorMessage mt={-2}>
                          RAM is required!
                        </FormErrorMessage>
                      </Flex>
                      <Input
                        name='ram'
                        value={formData4.ram}
                        onChange={handleInputChange4}
                      />
                    </FormControl>
                    <FormControl
                      isRequired
                      isInvalid={invalidFields4.includes('memory')}
                      className={styles.formInput}
                    >
                      <Flex>
                        <FormLabel>Storage</FormLabel>
                        <Spacer />
                        <FormErrorMessage mt={-2}>
                          Storage is required!
                        </FormErrorMessage>
                      </Flex>
                      <Input
                        name='memory'
                        value={formData4.memory}
                        onChange={handleInputChange4}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl>
                      <FormLabel>Operation System</FormLabel>
                      <Select
                        name='os'
                        value={formData4.os}
                        onChange={handleInputChange4}
                      >
                        <option value='Windows'>Windows</option>
                        <option value='macOS'>macOS</option>
                        <option value='Linux'>Linux</option>
                        <option value='Android'>Android</option>
                        <option value='iOS'>iOS</option>
                      </Select>
                    </FormControl>
                    <FormControl
                      isRequired
                      isInvalid={invalidFields4.includes('version')}
                      className={styles.formInput}
                    >
                      <Flex>
                        <FormLabel>Version</FormLabel>
                        <Spacer />
                        <FormErrorMessage mt={-2}>
                          Version is required!
                        </FormErrorMessage>
                      </Flex>
                      <Input
                        name='version'
                        value={formData4.version}
                        onChange={handleInputChange4}
                      />
                    </FormControl>
                    <FormControl className={styles.formInput}>
                      <FormLabel>IP Address</FormLabel>
                      <Input
                        name='ipAddress'
                        value={formData4.ipAddress}
                        onChange={handleInputChange4}
                      />
                    </FormControl>
                    <FormControl className={styles.formInput}>
                      <FormLabel>Bandwidth</FormLabel>
                      <Input
                        name='bandwidth'
                        value={formData4.bandwidth}
                        onChange={handleInputChange4}
                      />
                    </FormControl>
                    {/* Add more fields for the second column */}
                  </GridItem>
                </Grid>
                {/* Additional fields can be added to the respective columns */}
              </>
            )}
          </ModalBody>
          <ModalFooter>
            {showModalAdd ? (
              <>
                <Button
                  onClick={() => (
                    setIsOpenAdd(false),
                    setFormData4(defaultData),
                    setShowModalAdd(true)
                  )}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button colorScheme='blue' mr={3} onClick={handleSaveCreate}>
                  Save
                </Button>
                <Button
                  onClick={() => (
                    setShowModalAdd(true),
                    setFormData4(defaultData),
                    setInvalidFields4([])
                  )}
                >
                  Back
                </Button>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal // Modal add new library
        isOpen={isOpenAddLi}
        onClose={() => (
          setIsOpenAddLi(false),
          setFormData3(defaultData2),
          setInvalidFields3([])
        )}
        closeOnOverlayClick={false}
        size='xl'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add new license</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8}>
            <Grid templateColumns='repeat(2, 1fr)' gap={4}>
              <GridItem>
                <FormControl
                  isRequired
                  isInvalid={invalidFields3.includes('name')}
                >
                  <Flex>
                    <FormLabel>Name</FormLabel>
                    <Spacer />
                    <FormErrorMessage mt={-2}>
                      Name is required!
                    </FormErrorMessage>
                  </Flex>
                  <Input
                    name='name'
                    value={formData3.name}
                    onChange={handleInputChange3}
                    required
                  />
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={invalidFields3.includes('publisher')}
                  className={styles.formInput}
                >
                  <Flex>
                    <FormLabel>Publisher</FormLabel>
                    <Spacer />
                    <FormErrorMessage mt={-2}>
                      Publisher is required!
                    </FormErrorMessage>
                  </Flex>
                  <Input
                    name='publisher'
                    value={formData3.publisher}
                    onChange={handleInputChange3}
                    required
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl
                  isRequired
                  isInvalid={invalidFields3.includes('libraryKey')}
                >
                  <Flex>
                    <FormLabel>License key</FormLabel>
                    <Spacer />
                    <FormErrorMessage mt={-2}>
                      License key is required!
                    </FormErrorMessage>
                  </Flex>
                  <Input
                    name='libraryKey'
                    value={formData3.libraryKey}
                    onChange={handleInputChange3}
                    required
                  />
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={invalidFields3.includes('start_Date')}
                  className={styles.formInput}
                >
                  <Flex>
                    <FormLabel>Start date</FormLabel>
                    <Spacer />
                    <FormErrorMessage mt={-2}>
                      Start date is required!
                    </FormErrorMessage>
                  </Flex>
                  <Input
                    name='start_Date'
                    value={formData3.start_Date}
                    onChange={handleInputChange3}
                    type='date'
                    required
                  />
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={invalidFields3.includes('time')}
                  className={styles.formInput}
                >
                  <Flex>
                    <FormLabel>Time</FormLabel>
                    <Spacer />
                    <FormErrorMessage mt={-2}>
                      Time is required!
                    </FormErrorMessage>
                  </Flex>
                  <Input
                    name='time'
                    value={formData3.time}
                    onChange={handleInputChange3}
                    type='number'
                    required
                  />
                </FormControl>
              </GridItem>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleSaveAddLi}>
              Save
            </Button>
            <Button
              onClick={() => (
                setIsOpenAddLi(false),
                setFormData3(defaultData2),
                setInvalidFields3([])
              )}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal // Modal edit library
        isOpen={isOpenEditLi}
        onClose={() => (setIsOpenEditLi(false), setInvalidFields1([]))}
        closeOnOverlayClick={false}
        size='xl'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit license</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8}>
            <Grid templateColumns='repeat(2, 1fr)' gap={4}>
              <GridItem>
                <FormControl
                  isRequired
                  isInvalid={invalidFields1.includes('name')}
                >
                  <Flex>
                    <FormLabel>Name</FormLabel>
                    <Spacer />
                    <FormErrorMessage mt={-2}>
                      Name is required!
                    </FormErrorMessage>
                  </Flex>
                  <Input
                    name='name'
                    value={formData1.name}
                    onChange={handleInputChange1}
                    required
                  />
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={invalidFields1.includes('publisher')}
                  className={styles.formInput}
                >
                  <Flex>
                    <FormLabel>Publisher</FormLabel>
                    <Spacer />
                    <FormErrorMessage mt={-2}>
                      Publisher is required!
                    </FormErrorMessage>
                  </Flex>
                  <Input
                    name='publisher'
                    value={formData1.publisher}
                    onChange={handleInputChange1}
                    required
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl
                  isRequired
                  isInvalid={invalidFields1.includes('libraryKey')}
                >
                  <Flex>
                    <FormLabel>License key</FormLabel>
                    <Spacer />
                    <FormErrorMessage mt={-2}>
                      License key is required!
                    </FormErrorMessage>
                  </Flex>
                  <Input
                    name='libraryKey'
                    value={formData1.libraryKey}
                    onChange={handleInputChange1}
                    required
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Start date</FormLabel>
                  <Input
                    name='start_Date'
                    value={formData1.start_Date}
                    onChange={handleInputChange1}
                    type='date'
                    required
                  />
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={invalidFields1.includes('time')}
                  className={styles.formInput}
                >
                  <Flex>
                    <FormLabel>Time</FormLabel>
                    <Spacer />
                    <FormErrorMessage mt={-2}>
                      Time is required!
                    </FormErrorMessage>
                  </Flex>
                  <Input
                    name='time'
                    value={formData1.time}
                    onChange={handleInputChange1}
                    type='number'
                    required
                  />
                </FormControl>
              </GridItem>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleSaveEditLi}>
              Save
            </Button>
            <Button
              onClick={() => (setIsOpenEditLi(false), setInvalidFields1([]))}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal //Modal edit asset
        isOpen={isOpenEdit}
        onClose={() => (setIsOpenEdit(false), setInvalidFields2([]))}
        closeOnOverlayClick={false}
        size='4x1'
      >
        <ModalOverlay />
        <ModalContent w='60ws'>
          <ModalHeader>Edit asset</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8}>
            <Grid templateColumns='repeat(3, 1fr)' gap={4}>
              <Input
                name='assetId'
                value={formData2.assetId}
                onChange={handleInputChange2}
                display='none'
              />
              <GridItem>
                <FormControl
                  isRequired
                  isInvalid={invalidFields2.includes('name')}
                >
                  <Flex>
                    <FormLabel>Name</FormLabel>
                    <Spacer />
                    <FormErrorMessage mt={-2}>
                      Name is required!
                    </FormErrorMessage>
                  </Flex>
                  <Input
                    name='name'
                    value={formData2.name}
                    onChange={handleInputChange2}
                    required
                  />
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={invalidFields2.includes('manufacturer')}
                  className={styles.formInput}
                >
                  <Flex>
                    <FormLabel>Manufacturer</FormLabel>
                    <Spacer />
                    <FormErrorMessage mt={-2}>
                      Manufacturer is required!
                    </FormErrorMessage>
                  </Flex>
                  <Input
                    name='manufacturer'
                    value={formData2.manufacturer}
                    onChange={handleInputChange2}
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Model</FormLabel>
                  <Input
                    name='model'
                    value={formData2.model}
                    onChange={handleInputChange2}
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Serial Number</FormLabel>
                  <Input
                    name='serialNumber'
                    value={formData2.serialNumber}
                    onChange={handleInputChange2}
                  />
                </FormControl>
                {/* Add more fields for the first column */}
              </GridItem>
              <GridItem>
                <FormControl
                  isRequired
                  isInvalid={invalidFields2.includes('cpu')}
                >
                  <Flex>
                    <FormLabel>CPU</FormLabel>
                    <Spacer />
                    <FormErrorMessage mt={-2}>
                      CPU is required!
                    </FormErrorMessage>
                  </Flex>
                  <Input
                    name='cpu'
                    value={formData2.cpu}
                    onChange={handleInputChange2}
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>GPU</FormLabel>
                  <Input
                    name='gpu'
                    value={formData2.gpu}
                    onChange={handleInputChange2}
                  />
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={invalidFields2.includes('ram')}
                  className={styles.formInput}
                >
                  <Flex>
                    <FormLabel>RAM</FormLabel>
                    <Spacer />
                    <FormErrorMessage mt={-2}>
                      RAM is required!
                    </FormErrorMessage>
                  </Flex>
                  <Input
                    name='ram'
                    value={formData2.ram}
                    onChange={handleInputChange2}
                    type='number'
                  />
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={invalidFields2.includes('memory')}
                  className={styles.formInput}
                >
                  <Flex>
                    <FormLabel>Storage</FormLabel>
                    <Spacer />
                    <FormErrorMessage mt={-2}>
                      Storage is required!
                    </FormErrorMessage>
                  </Flex>
                  <Input
                    name='memory'
                    value={formData2.memory}
                    onChange={handleInputChange2}
                    type='number'
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Operation System</FormLabel>
                  <Select
                    name='os'
                    value={formData2.os}
                    onChange={handleInputChange2}
                  >
                    <option value='Windows'>Windows</option>
                    <option value='macOS'>macOS</option>
                    <option value='Linux'>Linux</option>
                    <option value='Android'>Android</option>
                    <option value='iOS'>iOS</option>
                  </Select>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={invalidFields2.includes('version')}
                  className={styles.formInput}
                >
                  <Flex>
                    <FormLabel>Version</FormLabel>
                    <Spacer />
                    <FormErrorMessage mt={-2}>
                      Version is required!
                    </FormErrorMessage>
                  </Flex>
                  <Input
                    name='version'
                    value={formData2.version}
                    onChange={handleInputChange2}
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>IP Address</FormLabel>
                  <Input
                    name='ipAddress'
                    value={formData2.ipAddress}
                    onChange={handleInputChange2}
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Bandwidth</FormLabel>
                  <Input
                    name='bandwidth'
                    value={formData2.bandwidth}
                    onChange={handleInputChange2}
                  />
                </FormControl>
                {/* Add more fields for the second column */}
              </GridItem>
            </Grid>
            {/* Additional fields can be added to the respective columns */}
            <FormControl className={styles.formInput}>
              <FormLabel>Status</FormLabel>
              <Select
                name='status'
                value={formData2.status}
                onChange={handleInputChange2}
              >
                <option value='1'>Active</option>
                <option value='2'>Inactive</option>
                {/* <option value='3'>Deleted</option> */}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleSaveEditAsset}>
              Save
            </Button>
            <Button
              onClick={() => (setIsOpenEdit(false), setInvalidFields2([]))}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal //modal delete asset
        isOpen={isOpenDelete}
        onClose={() => setIsOpenDelete(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete this asset?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={handleDelete}>
              Delete
            </Button>
            <Button onClick={() => setIsOpenDelete(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal //modal delete library
        isOpen={isOpenDeleteLi}
        onClose={() => setIsOpenDeleteLi(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete this license?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={handleDeleteLi}>
              Delete
            </Button>
            <Button onClick={() => setIsOpenDeleteLi(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default SoftwarePage;
