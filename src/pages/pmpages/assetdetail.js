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
  FormLabel,
  Input,
  Button,
  Select,
  Grid,
  GridItem,
  Checkbox,
  ScrollView,
  Switch,
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
import {
  ArrowForwardIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@chakra-ui/icons';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { AiOutlineEye, AiFillEye } from 'react-icons/ai';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { BACK_END_PORT } from '../../../env';
import PaginationCustom from '@/components/pagination';

function AssetDetailPage() {
  //
  const defaultData = {
    licenseId: '',
    softwareId: '',
    assetId: '',
    licenseKey: '',
    startDate: '',
    time: '0',
    status_License: '',
    name: '',
    version: '',
    release: '',
    installDate: '',
    publisher: '',
    type: 'Desktop App',
    os: 'Windows',
    status_AssetSoftware: '',
  };

  const router = useRouter();
  const [device, setDevice] = useState();
  const [account, setAccount] = useState();
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenEditAsset, setIsOpenEditAsset] = useState(false);
  const [isOpenEditLi, setIsOpenEditLi] = useState(false);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [formData, setFormData] = useState(defaultData);
  const [formData1, setFormData1] = useState(defaultData);
  const [formData2, setFormData2] = useState(defaultData);
  const [formData3, setFormData3] = useState(defaultData);
  const [data, setData] = useState([]);
  const [assetData, setAssetData] = useState([]);
  const [dataLicense, setDataLicense] = useState([]);
  const [listLicense, setListLicense] = useState([]);
  const [listAllSoftware, setListAllSoftware] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchAppQuery, setSearchAppQuery] = useState('');
  const [searchAppQuery1, setSearchAppQuery1] = useState('');
  const [searchLiQuery, setSearchLiQuery] = useState('');
  const [searchAddQuery, setSearchAddQuery] = useState('');
  const [showModalTable, setShowModalTable] = useState(true);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showEditAsset, setShowEditAsset] = useState(true);
  const [haveLicense, setHaveLicense] = useState(true);
  const toast = useToast();
  const [selectedRow1, setSelectedRow1] = useState(new Set());
  const [selectedRow2, setSelectedRow2] = useState(new Set());
  const [selectedRow3, setSelectedRow3] = useState(new Set());
  const [isButtonDisabled1, setButtonDisabled1] = useState(true);
  const [isButtonDisabled2, setButtonDisabled2] = useState(true);
  const [isButtonDisabled3, setButtonDisabled3] = useState(true);
  const [filteredSoftwareData, setFilteredSoftwareData] = useState([]);
  const [filteredAntivirusData, setFilteredAntivirusData] = useState([]);
  const [filteredLicenseData, setFilteredLicenseData] = useState([]);
  const [filteredAllSoftwareData, setFilteredAllSoftwareData] = useState([]);
  const [software, setSoftware] = useState();
  const [isAntivirus, setIsAntivirus] = useState(false);
  //pagination software data
  const itemPerPage = 6;
  const [filteredSoftwareDataDynamic, setFilteredSoftwareDataDynamic] =
    useState([]);
  const [dynamicList1, setDynamicList1] = useState([]);
  const [currentPage1, setCurrentPage1] = useState(1);
  // filteredIssueData;
  const handleChangePage1 = (page) => {
    setCurrentPage1(page);
    let newList = [];
    for (let i = (page - 1) * itemPerPage; i < page * itemPerPage; i++) {
      if (filteredSoftwareDataDynamic[i]) {
        newList.push(filteredSoftwareDataDynamic[i]);
      }
    }
    setDynamicList1(newList);
  };

  const totalPages1 = filteredSoftwareDataDynamic
    ? filteredSoftwareDataDynamic?.length
    : 0;

  useEffect(() => {
    if (filteredSoftwareDataDynamic.length) {
      handleChangePage1(1);
    } else {
      setDynamicList1([]);
    }
  }, [filteredSoftwareDataDynamic]);

  //

  //pagination anti virus
  const [filteredAntivirusDataDynamic, setFilteredAntivirusDataDynamic] =
    useState([]);
  const [dynamicList2, setDynamicList2] = useState([]);
  const [currentPage2, setCurrentPage2] = useState(1);
  // filteredIssueData;
  const handleChangePage2 = (page) => {
    setCurrentPage2(page);
    let newList = [];
    for (let i = (page - 1) * itemPerPage; i < page * itemPerPage; i++) {
      if (filteredAntivirusDataDynamic[i]) {
        newList.push(filteredAntivirusDataDynamic[i]);
      }
    }
    setDynamicList2(newList);
  };

  const totalPages2 = filteredAntivirusDataDynamic
    ? filteredAntivirusDataDynamic?.length
    : 0;

  useEffect(() => {
    if (filteredAntivirusDataDynamic.length) {
      handleChangePage2(1);
    } else {
      setDynamicList2([]);
    }
  }, [filteredAntivirusDataDynamic]);

  //

  //pagination lisence
  const [filteredLicenseDataDynamic, setFilteredLicenseDataDynamic] = useState(
    [],
  );
  const [dynamicList3, setDynamicList3] = useState([]);
  const [currentPage3, setCurrentPage3] = useState(1);
  // filteredIssueData;
  const handleChangePage3 = (page) => {
    setCurrentPage3(page);
    let newList = [];
    for (let i = (page - 1) * itemPerPage; i < page * itemPerPage; i++) {
      if (filteredLicenseDataDynamic[i]) {
        newList.push(filteredLicenseDataDynamic[i]);
      }
    }
    setDynamicList3(newList);
  };

  const totalPages3 = filteredLicenseDataDynamic
    ? filteredLicenseDataDynamic?.length
    : 0;

  useEffect(() => {
    if (filteredLicenseDataDynamic.length) {
      handleChangePage3(1);
    } else {
      setDynamicList3([]);
    }
  }, [filteredLicenseDataDynamic]);

  //

  //pagination add software
  const [filteredAllSoftwareDataDynamic, setFilteredAllSoftwareDataDynamic] =
    useState([]);
  const [dynamicList4, setDynamicList4] = useState([]);
  const [currentPage4, setCurrentPage4] = useState(1);
  // filteredIssueData;
  const handleChangePage4 = (page) => {
    setCurrentPage4(page);
    let newList = [];
    for (let i = (page - 1) * itemPerPage; i < page * itemPerPage; i++) {
      if (filteredAllSoftwareDataDynamic[i]) {
        newList.push(filteredAllSoftwareDataDynamic[i]);
      }
    }
    setDynamicList4(newList);
  };

  const totalPages4 = filteredAllSoftwareDataDynamic
    ? filteredAllSoftwareDataDynamic?.length
    : 0;

  useEffect(() => {
    if (filteredAllSoftwareDataDynamic.length) {
      handleChangePage4(1);
    } else {
      setDynamicList4([]);
    }
  }, [filteredAllSoftwareDataDynamic]);

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
  useEffect(() => {
    const deviceData = localStorage.getItem('device');
    if (deviceData) {
      const deviceDataDecode = JSON.parse(deviceData);
      if (!deviceDataDecode) {
        // router.push('/pmpages/assetlist');
      } else {
        setDevice(deviceDataDecode);
      }
    }
  }, []);
  //
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // console.log(formData);
  };
  const handleInputChange1 = (e) => {
    const { name, value } = e.target;
    setFormData1({ ...formData1, [name]: value });
    // console.log(formData1);
  };

  const handleInputChange2 = (e) => {
    const { name, value } = e.target;
    setFormData2({ ...formData2, [name]: value });
    // console.log(formData2);
  };
  const handleInputChange3 = (e) => {
    const { name, value } = e.target;
    setFormData3({ ...formData3, [name]: value });
    // console.log(formData);
  };
  const handleInputChange4 = (e) => {
    const { name, value } = e.target;
    setAssetData({ ...assetData, [name]: value });
    // console.log(formData);
  };
  const handleSearchAppInputChange = (e) => {
    setSearchAppQuery(e.target.value);
  };
  const handleSearchAppInputChange1 = (e) => {
    setSearchAppQuery1(e.target.value);
  };
  const handleSearchAddInputChange = (e) => {
    setSearchAddQuery(e.target.value);
  };
  const handleSearchLiInputChange = (e) => {
    setSearchLiQuery(e.target.value);
  };
  const handleRowClick1 = (item) => {
    if (selectedRow1 === item.softwareId) {
      setSelectedRow1(null); // Unselect the row if it's already selected
      setFormData1(defaultData);
      setButtonDisabled1(true);
    } else {
      setSelectedRow1(item.softwareId);
      setFormData1(item);
      setButtonDisabled1(false);
    }
  };
  const handleRowClick2 = (item) => {
    if (selectedRow2 === item.licenseId) {
      setSelectedRow2(null); // Unselect the row if it's already selected
      setFormData2(defaultData);
      setButtonDisabled2(true);
    } else {
      setSelectedRow2(item.licenseId);
      setFormData2(item);
      setFormData2((prevFormData) => {
        return {
          ...prevFormData,
          start_Date: convertToISODate(prevFormData.start_Date),
        };
      });
      setButtonDisabled2(false);
    }
  };
  const handleRowClick3 = (item) => {
    if (selectedRow3 === item.softwareId) {
      setSelectedRow3(null); // Unselect the row if it's already selected
      setFormData(defaultData);
      setButtonDisabled3(true);
    } else {
      setSelectedRow3(item.softwareId);
      setFormData1(item);
      setButtonDisabled3(false);
    }
  };
  const handleSwitchChange = () => {
    setHaveLicense((prevHaveLicense) => !prevHaveLicense);
  };

  //all button handle

  const handleSaveCreate = async () => {
    try {
      // Replace 'YOUR_API_ENDPOINT_HERE' with your actual API endpoint
      const curDate = new Date();
      const currentDateOnly = new Date(
        curDate.getFullYear(),
        curDate.getMonth(),
        curDate.getDate(),
      );
      const formattedStartDate = formatDate(formData.start_Date);
      let status;
      if (formData.time == 0 || formData.time == '0') {
        status = 2;
      } else {
        status = 1;
      }
      const response = await axios.post(
        `${BACK_END_PORT}/api/Software/CreateSoftware`,
        {
          name: formData.name,
          publisher: formData.publisher,
          version: formData.version,
          release: formData.release,
          type: formData.type,
          os: formData.os,
          status: status,
        },
      );
      console.log('Data saved:', response.data);
      setIsOpenAdd(true); // Close the modal after successful save
      setShowModalAdd(false);
      setShowModalTable(true);
      setFormData(defaultData);
      // setSelectedRow1(new Set());
      // Reload new data for the table
      const newDataResponse = await axios.get(
        `${BACK_END_PORT}/api/Software/list_Softwares_by_Asset/` +
          device.assetId,
      );
      setData(newDataResponse.data);
      const response2 = await axios.get(
        `${BACK_END_PORT}/api/License/list_Licenses_by_Asset/` + device.assetId,
      );
      setDataLicense(response2.data);
      toast({
        title: 'Software Created',
        description: 'The software has been successfully created.',
        status: 'success',
        duration: 3000, // Duration in milliseconds
        isClosable: true,
      });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  //
  const handleSaveAdd = async () => {
    try {
      // Replace 'YOUR_API_ENDPOINT_HERE' with your actual API endpoint
      const curDate = new Date();
      const currentDateOnly = new Date(
        curDate.getFullYear(),
        curDate.getMonth(),
        curDate.getDate(),
      );
      let status;
      if (formData1.time == 0 || formData1.time == '0') {
        status = 2;
      } else {
        status = 1;
      }
      const response = await axios.post(
        `${BACK_END_PORT}/api/Software_Asset/CreateWithHaveLicense`,
        {
          assetId: device.assetId,
          softwareId: formData1.softwareId,
          installDate: currentDateOnly,
          status_AssetSoftware: 1,
          ...(haveLicense
            ? {
                licenseKey: formData1.licenseKey,
                start_Date: formatDate(formData1.start_Date),
                time: formData1.time,
                status_License: status,
              }
            : {
                licenseKey: 'string',
                start_Date: 'string',
                time: -1,
                status_License: 0,
              }),
        },
      );
      console.log('Data saved:', response.data);
      setIsOpenAdd(false); // Close the modal after successful save
      setHaveLicense(true);
      setShowModalAdd(false);
      setShowModalTable(true);
      setFormData(defaultData);
      // setSelectedRow1(new Set());
      // Reload new data for the table
      const newDataResponse = await axios.get(
        `${BACK_END_PORT}/api/Software/list_Softwares_by_Asset/` +
          device.assetId,
      );
      setData(newDataResponse.data);
      const response2 = await axios.get(
        `${BACK_END_PORT}/api/License/list_Licenses_by_Asset/` + device.assetId,
      );
      setDataLicense(response2.data);
      toast({
        title: 'Software Added',
        description: 'The software has been successfully added.',
        status: 'success',
        duration: 3000, // Duration in milliseconds
        isClosable: true,
      });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  //
  const handleEditAsset = async () => {
    try {
      // Replace 'YOUR_API_ENDPOINT_HERE' with your actual API endpoint
      const curDate = new Date();
      const response = await axios.put(
        `${BACK_END_PORT}/api/Asset/UpdateAsset/` + assetData.assetId,
        {
          name: assetData.name,
          cpu: assetData.cpu,
          gpu: assetData.gpu,
          ram: assetData.ram,
          memory: assetData.memory,
          os: assetData.os,
          version: assetData.version,
          ipAddress: assetData.ipAddress,
          bandwidth: assetData.bandwidth,
          manufacturer: assetData.manufacturer,
          model: assetData.model,
          serialNumber: assetData.serialNumber,
          lastSuccesfullScan: curDate,
          status: assetData.status,
        },
      );
      console.log('Data saved:', response.data);
      setIsOpenEditAsset(false); // Close the modal after successful save
      setShowEditAsset(true); // Close the modal after successful save
      // Reload new data for the table
      const newDataResponse = await axios.get(
        `${BACK_END_PORT}/api/Asset/GetAssetsById/` + device?.assetId,
      );
      setAssetData(newDataResponse.data);
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
  //
  const handleSaveEdit = async () => {
    try {
      // Replace 'YOUR_API_ENDPOINT_HERE' with your actual API endpoint
      const response = await axios.put(
        `${BACK_END_PORT}/api/License/UpdateLicense/` + formData2.licenseId,
        {
          // assetId: device.assetId,
          // softwareId: formData.softwareId,
          // licenseId: formData2.licenseId,
          licenseKey: formData2.licenseKey,
          startDate: formData2.startDate,
          time: formData2.time,
          status: formData2.time !== 0 ? 1 : 2,
        },
      );
      console.log('Data saved:', response.data);
      setIsOpenEditLi(false); // Close the modal after successful save
      setFormData2(defaultData);
      setSelectedRow2(null);
      setButtonDisabled2(true);
      // Reload new data for the table
      const newDataResponse = await axios.get(
        `${BACK_END_PORT}/api/Software/list_Softwares_by_Asset/` +
          device.assetId,
      );
      setData(newDataResponse.data);
      const response2 = await axios.get(
        `${BACK_END_PORT}/api/License/list_Licenses_by_Asset/` + device.assetId,
      );
      setDataLicense(response2.data);
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
  //
  const handleDelete = async () => {
    try {
      await axios.delete(
        `${BACK_END_PORT}/api/Software_Asset/DeleteAssetSoftware/` +
          device.assetId +
          `/` +
          formData1.softwareId,
      );
      setIsOpenDelete(false); // Close the "Confirm Delete" modal
      setSelectedRow1(null);
      setButtonDisabled1(true);
      // Reload the data for the table after deletion
      const response = await axios.get(
        `${BACK_END_PORT}/api/Software/list_Softwares_by_Asset/` +
          device.assetId,
      );
      setData(response.data); // Assuming the API returns an array of objects
      const response2 = await axios.get(
        `${BACK_END_PORT}/api/License/list_Licenses_by_Asset/` + device.assetId,
      );
      setDataLicense(response2.data);
      toast({
        title: 'Software Deleted',
        description: 'The software has been successfully deleted.',
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
  const handleEditSoftware = async () => {
    try {
      // Replace 'YOUR_API_ENDPOINT_HERE' with your actual API endpoint
      const response = await axios.put(
        `${BACK_END_PORT}/api/Software/UpdateSoftware/` + formData1.softwareId,
        {
          name: formData1.name,
          publisher: formData1.publisher,
          version: formData1.version,
          release: formData1.release,
          type: formData1.type,
          os: formData1.os,
          status: formData1.status,
        },
      );
      console.log('Data saved:', response.data);
      setIsOpenEdit(false); // Close the modal after successful save
      setFormData1(defaultData);
      setButtonDisabled1(true);
      setSelectedRow1(null);
      // Reload new data for the table
      const newDataResponse = await axios.get(
        `${BACK_END_PORT}/api/Software/list_Softwares_by_Asset/` +
          device.assetId,
      );
      setData(newDataResponse.data);
      toast({
        title: 'Software Updated',
        description: 'The software has been successfully updated.',
        status: 'success',
        duration: 3000, // Duration in milliseconds
        isClosable: true,
      });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  //End button handle
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        try {
          const response = await axios.get(
            `${BACK_END_PORT}/api/Software/list_Softwares_by_Asset/` +
              device.assetId,
          );
          setData(response.data); // Assuming the API returns an array of objects
        } catch (error) {
          setData([]);
        }
        try {
          const response2 = await axios.get(
            `${BACK_END_PORT}/api/License/list_Licenses_by_Asset/` +
              device.assetId,
          );
          setDataLicense(response2.data);
        } catch (error) {
          setDataLicense([]);
        }
        try {
          const response3 = await axios.get(
            `${BACK_END_PORT}/api/Software/ListSoftwares`,
          );
          setListAllSoftware(response3.data);
        } catch (error) {
          setListAllSoftware([]);
        }
        try {
          const response4 = await axios.get(
            `${BACK_END_PORT}/api/Asset/GetAssetsById/` + device.assetId,
          );
          setAssetData(response4.data[0]);
        } catch (error) {
          setAssetData([]);
        }
        setLoading(true);
      } catch (error) {
        // console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    if (device?.assetId && account?.accId) {
      fetchData();
    }
  }, [device, account, showEditAsset, isOpenEditAsset]);
  //
  const softwareIdsInAsset = data?.map((software) => software?.softwareId);
  //
  useEffect(() => {
    if (data.length > 0 && dataLicense.length > 0) {
      const mergedData = dataLicense.map((license) => {
        const software = data.find(
          (sw) => sw.softwareId === license.softwareId,
        );
        return {
          ...license,
          name: software?.name ? software?.name : license.softwareId,
        };
      });
      setListLicense(mergedData);
    }
  }, [data, dataLicense]);
  //

  // filter search asset data
  const filterSoftware = () => {
    const query = searchAppQuery.toLowerCase();
    const filteredData = data
      .filter((item) => item.type != 'Antivirus' && item.status != 3)
      .filter((item) => {
        const name = item?.name.toLowerCase();
        const publisher = item?.publisher.toLowerCase();
        return name.includes(query) || publisher.includes(query);
      });
    setFilteredSoftwareData(filteredData);
    setFilteredSoftwareDataDynamic(filteredData);
  };
  // Update filtered data whenever the search query changes
  useEffect(() => {
    filterSoftware();
  }, [searchAppQuery, data]);
  const filterAntivirus = () => {
    const query = searchAppQuery1.toLowerCase();
    const filteredData = data
      .filter((item) => item.type == 'Antivirus' && item.status != 3)
      .filter((item) => {
        const name = item?.name.toLowerCase();
        const publisher = item?.publisher.toLowerCase();
        return name.includes(query) || publisher.includes(query);
      });
    setFilteredAntivirusData(filteredData);
    setFilteredAntivirusDataDynamic(filteredData);
  };
  // Update filtered data whenever the search query changes
  useEffect(() => {
    filterAntivirus();
  }, [searchAppQuery1, data]);
  // filter search add asset data
  const filterAssets = () => {
    const query = searchAddQuery.toLowerCase();
    const filteredData = listAllSoftware
      .filter((item) =>
        isAntivirus ? item.type === 'Antivirus' : item.type !== 'Antivirus',
      )
      .filter((item) => item.status != 3)
      .filter((item) => {
        const name = item?.name.toLowerCase();
        const publisher = item?.publisher.toLowerCase();
        return name.includes(query) || publisher.includes(query);
      });
    setFilteredAllSoftwareData(filteredData);
    setFilteredAllSoftwareDataDynamic(
      filteredData
        .filter((item) => !softwareIdsInAsset.includes(item.softwareId))
        .filter((item) =>
          isAntivirus ? item.type === 'Antivirus' : item.type !== 'Antivirus',
        )
        .filter(
          (item) =>
            item.status !== 3 &&
            item.os &&
            device.os &&
            device.os.toLowerCase().includes(item.os.toLowerCase()),
        ),
    );
  };
  // Update filtered data whenever the search query changes
  useEffect(() => {
    if (listAllSoftware.length || isOpenAdd || showModalTable) {
      filterAssets();
    }
  }, [
    isOpenAdd,
    searchAddQuery,
    listAllSoftware,
    showModalTable,
    showModalAdd,
  ]);
  //
  const filterLicense = () => {
    const query = searchLiQuery.toLowerCase();
    const filteredData = listLicense.filter((item) => {
      try {
        const name = item?.name.toLowerCase();
        return name.includes(query);
      } catch (error) {
        return null;
      }
    });
    setFilteredLicenseData(filteredData);
    setFilteredLicenseDataDynamic(filteredData);
  };
  // Update filtered data whenever the search query changes
  useEffect(() => {
    filterLicense();
  }, [searchLiQuery, listLicense]);
  //
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
  const formatDate = (dateString) => {
    if (dateString) {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    }
    return null; // or handle the case where dateString is undefined
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
          <Link href='/pmpages/ApplicationDetail' className={styles.listitem}>
            {software?.name}
          </Link>
          <ArrowForwardIcon margin={1}></ArrowForwardIcon>
          {device?.name}
        </ListItem>
        <ListItem className={styles.list}>
          <Text fontSize='2xl'>{device?.name}</Text>
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
              System
            </Tab>
            <Tab
              className={styles.tab}
              _selected={{
                color: '#4d9ffe',
                borderBottom: '1px solid #4d9ffe',
              }}
            >
              Hardware
            </Tab>
            <Tab
              className={styles.tab}
              _selected={{
                color: '#4d9ffe',
                borderBottom: '1px solid #4d9ffe',
              }}
            >
              System
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
              Antivirus
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
                            {assetData?.name ? assetData?.name : 'N/A'}
                          </Td>
                          <Td className={styles.text2}>Manufacturer:</Td>
                          <Td
                            className={`${styles.text3} ${styles.borderRight}`}
                          >
                            {assetData?.manufacturer
                              ? assetData?.manufacturer
                              : 'N/A'}
                          </Td>
                          <Td className={styles.text2}>Model:</Td>
                          <Td
                            className={`${styles.text3} ${styles.borderRight}`}
                          >
                            {assetData?.model ? assetData?.model : 'N/A'}
                          </Td>
                          <Td className={styles.text2}>Serial number:</Td>
                          <Td className={`${styles.text3}`}>
                            {assetData?.serialNumber
                              ? assetData?.serialNumber
                              : 'N/A'}
                          </Td>
                        </Tr>
                        <Tr>
                          <Td className={styles.text2}>OS:</Td>
                          <Td
                            className={`${styles.text3} ${styles.borderRight}`}
                          >
                            {assetData?.os ? assetData?.os : 'N/A'}
                          </Td>

                          <Td className={styles.text2}>Version:</Td>
                          <Td
                            className={`${styles.text3} ${styles.borderRight}`}
                          >
                            {assetData?.version ? assetData?.version : 'N/A'}
                          </Td>

                          <Td className={styles.text2}>Status:</Td>
                          <Td
                            className={`${styles.text3} ${styles.borderRight}`}
                          >
                            {assetData?.status === 1
                              ? 'Active'
                              : assetData?.status === 2
                              ? 'Inactive'
                              : assetData?.status === 3
                              ? 'Deleted'
                              : 'Unknown'}
                          </Td>
                          <Td className={styles.text2}>Last updated:</Td>
                          <Td className={`${styles.text3}`}>
                            {assetData?.lastSuccesfullScan
                              ? assetData?.lastSuccesfullScan
                              : 'N/A'}
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </TableContainer>
                  <Button
                    colorScheme='gray'
                    mt={3}
                    onClick={() => setIsOpenEditAsset(true)}
                  >
                    Edit
                  </Button>
                </Box>
              </Center>
            </TabPanel>
            <TabPanel>
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
                          <Td className={styles.text2}>CPU:</Td>
                          <Td
                            className={`${styles.text3} ${styles.borderRight}`}
                          >
                            {assetData?.cpu}
                          </Td>
                          <Td className={styles.text2}>GPU:</Td>
                          <Td className={`${styles.text3}`}>
                            {assetData?.gpu}
                          </Td>
                        </Tr>
                        <Tr>
                          <Td className={styles.text2}>RAM:</Td>
                          <Td
                            className={`${styles.text3} ${styles.borderRight}`}
                          >
                            {assetData?.ram}GB
                          </Td>
                          <Td className={styles.text2}>Storage:</Td>
                          <Td className={`${styles.text3}`}>
                            {assetData?.memory}GB
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </TableContainer>
                  <Button
                    colorScheme='gray'
                    mt={3}
                    onClick={() => setIsOpenEditAsset(true)}
                  >
                    Edit
                  </Button>
                </Box>
              </Center>
            </TabPanel>
            <TabPanel>
              {showEditAsset ? (
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
                        <Thead>
                          <Tr>
                            <Th
                              className={`${styles.cTh} ${styles.borderRight}`}
                              colSpan={4}
                              textAlign='center'
                            >
                              System
                            </Th>
                            <Th
                              className={styles.cTh}
                              colSpan={2}
                              textAlign='center'
                            >
                              Hardware
                            </Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          <Tr className={styles.borderTop}>
                            <Td className={styles.text2}>Name:</Td>
                            <Td
                              className={`${styles.text3} ${styles.borderRight}`}
                            >
                              {assetData?.name ? assetData?.name : 'N/A'}
                            </Td>
                            <Td className={styles.text2}>OS:</Td>
                            <Td
                              className={`${styles.text3} ${styles.borderRight}`}
                            >
                              {assetData?.os ? assetData?.os : 'N/A'}
                            </Td>
                            <Td className={styles.text2}>CPU:</Td>
                            <Td className={`${styles.text3}`}>
                              {assetData?.cpu ? assetData?.cpu : 'N/A'}
                            </Td>
                          </Tr>
                          <Tr>
                            <Td className={styles.text2}>Manufacturer:</Td>
                            <Td
                              className={`${styles.text3} ${styles.borderRight}`}
                            >
                              {assetData?.manufacturer
                                ? assetData?.manufacturer
                                : 'N/A'}
                            </Td>
                            <Td className={styles.text2}>Version:</Td>
                            <Td
                              className={`${styles.text3} ${styles.borderRight}`}
                            >
                              {assetData?.version ? assetData?.version : 'N/A'}
                            </Td>
                            <Td className={styles.text2}>GPU:</Td>
                            <Td className={`${styles.text3}`}>
                              {assetData?.gpu ? assetData?.gpu : 'N/A'}
                            </Td>
                          </Tr>
                          <Tr>
                            <Td className={styles.text2}>Model:</Td>
                            <Td
                              className={`${styles.text3} ${styles.borderRight}`}
                            >
                              {assetData?.model ? assetData?.model : 'N/A'}
                            </Td>
                            <Td className={styles.text2}>Last updated:</Td>
                            <Td
                              className={`${styles.text3} ${styles.borderRight}`}
                            >
                              {assetData?.lastSuccesfullScan
                                ? assetData?.lastSuccesfullScan
                                : 'N/A'}
                            </Td>
                            <Td className={styles.text2}>RAM:</Td>
                            <Td className={`${styles.text3}`}>
                              {assetData?.ram}GB
                            </Td>
                          </Tr>
                          <Tr>
                            <Td className={styles.text2}>Serial number:</Td>
                            <Td
                              className={`${styles.text3} ${styles.borderRight}`}
                            >
                              {assetData?.serialNumber
                                ? assetData?.serialNumber
                                : 'N/A'}
                            </Td>
                            <Td className={styles.text2}>Status:</Td>
                            <Td
                              className={`${styles.text3} ${styles.borderRight}`}
                            >
                              {assetData?.status === 1
                                ? 'Active'
                                : assetData?.status === 2
                                ? 'Inactive'
                                : assetData?.status === 3
                                ? 'Deleted'
                                : 'Unknown'}
                            </Td>
                            <Td className={styles.text2}>Storage:</Td>
                            <Td className={`${styles.text3}`}>
                              {assetData?.memory ? assetData?.memory : 'N/A'}GB
                            </Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </TableContainer>
                    <Button
                      colorScheme='gray'
                      mt={3}
                      onClick={() => setShowEditAsset(false)}
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
                        <Thead>
                          <Tr>
                            <Th
                              className={`${styles.cTh} ${styles.borderRight}`}
                              colSpan={4}
                              textAlign='center'
                            >
                              System
                            </Th>
                            <Th
                              className={styles.cTh}
                              colSpan={2}
                              textAlign='center'
                            >
                              Hardware
                            </Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          <Tr className={styles.borderTop}>
                            <Td className={styles.text2}>Name:</Td>
                            <Td className={styles.borderRight}>
                              <Input
                                value={assetData?.name}
                                name='name'
                                onChange={handleInputChange4}
                                className={`${styles.text3}`}
                              />
                            </Td>
                            <Td className={styles.text2}>OS:</Td>
                            <Td className={styles.borderRight}>
                              <Select
                                name='os'
                                value={assetData?.os}
                                onChange={handleInputChange4}
                                className={`${styles.text3}`}
                              >
                                <option value='Windows'>Windows</option>
                                <option value='macOS'>macOS</option>
                                <option value='Linux'>Linux</option>
                                <option value='Android'>Android</option>
                                <option value='iOS'>iOS</option>
                              </Select>
                            </Td>
                            <Td className={styles.text2}>CPU:</Td>
                            <Td>
                              <Input
                                value={assetData?.cpu}
                                name='cpu'
                                onChange={handleInputChange4}
                                className={`${styles.text3}`}
                              />
                            </Td>
                          </Tr>
                          <Tr>
                            <Td className={styles.text2}>Manufacturer:</Td>
                            <Td className={styles.borderRight}>
                              <Input
                                value={assetData?.manufacturer}
                                name='manufacturer'
                                onChange={handleInputChange4}
                                className={`${styles.text3}`}
                              />
                            </Td>
                            <Td className={styles.text2}>Version:</Td>
                            <Td className={styles.borderRight}>
                              <Input
                                value={assetData?.version}
                                name='version'
                                onChange={handleInputChange4}
                                className={`${styles.text3}`}
                              />
                            </Td>
                            <Td className={styles.text2}>GPU:</Td>
                            <Td>
                              <Input
                                value={assetData?.gpu}
                                name='gpu'
                                onChange={handleInputChange4}
                                className={`${styles.text3}`}
                              />
                            </Td>
                          </Tr>
                          <Tr>
                            <Td className={styles.text2}>Model:</Td>
                            <Td className={styles.borderRight}>
                              <Input
                                value={assetData?.model}
                                name='model'
                                onChange={handleInputChange4}
                                className={`${styles.text3}`}
                              />
                            </Td>
                            <Td className={styles.text2}>Last updated:</Td>
                            <Td className={styles.borderRight}>
                              <Input
                                value={assetData?.lastSuccesfullScan}
                                name='lastSuccesfullScan'
                                onChange={handleInputChange4}
                                className={`${styles.text3}`}
                                disabled
                              />
                            </Td>
                            <Td className={styles.text2}>RAM:</Td>
                            <Td>
                              <Input
                                value={assetData?.ram}
                                name='ram'
                                onChange={handleInputChange4}
                                className={`${styles.text3}`}
                              />
                            </Td>
                          </Tr>
                          <Tr>
                            <Td className={styles.text2}>Serial number:</Td>
                            <Td className={styles.borderRight}>
                              <Input
                                value={assetData?.serialNumber}
                                name='serialNumber'
                                onChange={handleInputChange4}
                                className={`${styles.text3}`}
                              />
                            </Td>
                            <Td className={styles.text2}>Status:</Td>
                            <Td className={styles.borderRight}>
                              <Select
                                name='status'
                                value={assetData?.status}
                                onChange={handleInputChange4}
                                className={`${styles.text3}`}
                              >
                                <option value='1'>Active</option>
                                <option value='2'>Inactive</option>
                              </Select>
                            </Td>
                            <Td className={styles.text2}>Storage:</Td>
                            <Td>
                              <Input
                                value={assetData?.memory}
                                name='memory'
                                onChange={handleInputChange4}
                                className={`${styles.text3}`}
                              />
                            </Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </TableContainer>
                    <Button
                      colorScheme='blue'
                      mt={3}
                      mr={2}
                      onClick={handleEditAsset}
                    >
                      Save
                    </Button>
                    <Button
                      colorScheme='gray'
                      mt={3}
                      onClick={() => setShowEditAsset(true)}
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
                      <InputLeftAddon children='Name / Publisher' />
                      <Input
                        type='text'
                        value={searchAppQuery}
                        onChange={handleSearchAppInputChange}
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
                        onClick={() => (
                          setIsOpenAdd(true), setIsAntivirus(false)
                        )}
                      />
                    </Tooltip>
                    <Tooltip label='Edit'>
                      <IconButton
                        aria-label='Edit'
                        icon={<FaEdit />}
                        colorScheme='gray' // Choose an appropriate color
                        marginRight={1}
                        onClick={() => setIsOpenEdit(true)}
                        isDisabled={isButtonDisabled1}
                      />
                    </Tooltip>
                    <Tooltip label='Delete'>
                      <IconButton
                        aria-label='Delete'
                        icon={<FaTrash />}
                        colorScheme='gray' // Choose an appropriate color
                        onClick={() => setIsOpenDelete(true)}
                        isDisabled={isButtonDisabled1}
                      />
                    </Tooltip>
                  </Box>
                </Flex>
              </ListItem>
              <ListItem className={styles.list}>
                <TableContainer>
                  <Table variant='striped' colorScheme='gray'>
                    <TableCaption>
                      <Flex
                        alignItems={'center'}
                        justifyContent={'space-between'}
                      >
                        <Text>
                          Total {filteredSoftwareDataDynamic.length} software(s)
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
                        <Th className={styles.cTh}>Publisher</Th>
                        <Th className={styles.cTh}>Versions</Th>
                        <Th className={styles.cTh}>Release</Th>
                        <Th className={styles.cTh}>Type</Th>
                        <Th className={styles.cTh}>Install Date</Th>
                        {/* <Th className={styles.cTh}>Status</Th> */}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {dynamicList1.map((item, index) => (
                        <Tr
                          cursor={'pointer'}
                          key={item.softwareId}
                          color={
                            selectedRow1 === item.softwareId ? 'red' : 'black'
                          } // Change background color for selected rows
                          onClick={() => handleRowClick1(item)}
                        >
                          <Td>{index + 1}</Td>
                          <Td>{item.name ? item.name : 'N/A'}</Td>
                          <Td>{item.publisher ? item.publisher : 'N/A'}</Td>
                          <Td>{item.version ? item.version : 'N/A'}</Td>
                          <Td>{item.release ? item.release : 'N/A'}</Td>
                          <Td>{item.type ? item.type : 'N/A'}</Td>
                          <Td>{item.installDate ? item.installDate : 'N/A'}</Td>
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
                      <InputLeftAddon children='Name / Publisher' />
                      <Input
                        type='text'
                        value={searchAppQuery1}
                        onChange={handleSearchAppInputChange1}
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
                        onClick={() => (
                          setIsOpenAdd(true), setIsAntivirus(true)
                        )}
                      />
                    </Tooltip>
                    <Tooltip label='Edit'>
                      <IconButton
                        aria-label='Edit'
                        icon={<FaEdit />}
                        colorScheme='gray' // Choose an appropriate color
                        marginRight={1}
                        onClick={() => setIsOpenEdit(true)}
                        isDisabled={isButtonDisabled3}
                      />
                    </Tooltip>
                    <Tooltip label='Delete'>
                      <IconButton
                        aria-label='Delete'
                        icon={<FaTrash />}
                        colorScheme='gray' // Choose an appropriate color
                        onClick={() => setIsOpenDelete(true)}
                        isDisabled={isButtonDisabled3}
                      />
                    </Tooltip>
                  </Box>
                </Flex>
              </ListItem>
              <ListItem className={styles.list} pt={0}>
                <TableContainer>
                  <Table variant='striped' colorScheme='gray'>
                    <TableCaption>
                      <Flex
                        alignItems={'center'}
                        justifyContent={'space-between'}
                      >
                        <Text>
                          Total {filteredAntivirusDataDynamic.length}{' '}
                          antivirus(es)
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
                        <Th className={styles.cTh}>Versions</Th>
                        <Th className={styles.cTh}>Release</Th>
                        <Th className={styles.cTh}>Install Date</Th>
                        {/* <Th className={styles.cTh}>Status</Th> */}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {dynamicList2.map((item, index) => (
                        <Tr
                          cursor={'pointer'}
                          key={item.softwareId}
                          color={
                            selectedRow3 === item.softwareId ? 'red' : 'black'
                          } // Change background color for selected rows
                          onClick={() => handleRowClick3(item)}
                        >
                          <Td>{index + 1}</Td>
                          <Td>{item.name ? item.name : 'N/A'}</Td>
                          <Td>{item.publisher ? item.publisher : 'N/A'}</Td>
                          <Td>{item.version ? item.version : 'N/A'}</Td>
                          <Td>{item.release ? item.release : 'N/A'}</Td>
                          <Td>{item.installDate ? item.installDate : 'N/A'}</Td>
                          {/* <Td>{item.status ? 'No Issues' : 'Have Issues'}</Td> */}
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
                      <InputLeftAddon children='Software / Antivirus' />
                      <Input
                        type='text'
                        value={searchLiQuery}
                        onChange={handleSearchLiInputChange}
                        placeholder='search...'
                        w={300}
                        mr={1}
                      />
                    </InputGroup>
                  </Box>
                  <Spacer />
                  <Box>
                    <Tooltip label='Edit'>
                      <IconButton
                        aria-label='Edit'
                        icon={<FaEdit />}
                        colorScheme='gray' // Choose an appropriate color
                        marginRight={1}
                        onClick={() => setIsOpenEditLi(true)}
                        isDisabled={isButtonDisabled2}
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
                          Total {filteredLicenseDataDynamic.length} license(s)
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
                        <Th className={styles.cTh}>Software / Antivirus</Th>
                        <Th className={styles.cTh}>License Key</Th>
                        <Th className={styles.cTh}>Start Date</Th>
                        <Th className={styles.cTh}>End Date</Th>
                        <Th className={styles.cTh}>Type</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {dynamicList3.map((item, index) => (
                        <Tr
                          cursor={'pointer'}
                          key={item.licenseId}
                          color={
                            selectedRow2 === item.licenseId ? 'red' : 'black'
                          } // Change background color for selected rows
                          onClick={() => handleRowClick2(item)}
                        >
                          <Td>{index + 1}</Td>
                          <Td>{item.name ? item.name : 'N/A'}</Td>
                          <Td>{item.licenseKey ? item.licenseKey : 'N/A'}</Td>
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
          </TabPanels>
        </Tabs>
      </List>

      <Modal //Modal edit asset
        isOpen={isOpenEditAsset}
        onClose={() => setIsOpenEditAsset(false)}
        closeOnOverlayClick={false}
        size='4x1'
      >
        <ModalOverlay />
        <ModalContent w='60ws'>
          <ModalHeader>Edit asset</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8}>
            <Grid templateColumns='repeat(3, 1fr)' gap={4}>
              <GridItem>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    name='name'
                    value={assetData.name}
                    onChange={handleInputChange4}
                    required
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Manufacturer</FormLabel>
                  <Input
                    name='manufacturer'
                    value={assetData.manufacturer}
                    onChange={handleInputChange4}
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Model</FormLabel>
                  <Input
                    name='model'
                    value={assetData.model}
                    onChange={handleInputChange4}
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Serial Number</FormLabel>
                  <Input
                    name='serialNumber'
                    value={assetData.serialNumber}
                    onChange={handleInputChange4}
                  />
                </FormControl>
                {/* Add more fields for the first column */}
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>CPU</FormLabel>
                  <Input
                    name='cpu'
                    value={assetData.cpu}
                    onChange={handleInputChange4}
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>GPU</FormLabel>
                  <Input
                    name='gpu'
                    value={assetData.gpu}
                    onChange={handleInputChange4}
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>RAM</FormLabel>
                  <Input
                    name='ram'
                    value={assetData.ram}
                    onChange={handleInputChange4}
                    type='number'
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Storage</FormLabel>
                  <Input
                    name='memory'
                    value={assetData.memory}
                    onChange={handleInputChange4}
                    type='number'
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Operation System</FormLabel>
                  <Select
                    name='os'
                    value={assetData.os}
                    onChange={handleInputChange4}
                  >
                    <option value='Windows'>Windows</option>
                    <option value='macOS'>macOS</option>
                    <option value='Linux'>Linux</option>
                    <option value='Android'>Android</option>
                    <option value='iOS'>iOS</option>
                  </Select>
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Version</FormLabel>
                  <Input
                    name='version'
                    value={assetData.version}
                    onChange={handleInputChange4}
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>IP Address</FormLabel>
                  <Input
                    name='ipAddress'
                    value={assetData.ipAddress}
                    onChange={handleInputChange4}
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Bandwidth</FormLabel>
                  <Input
                    name='bandwidth'
                    value={assetData.bandwidth}
                    onChange={handleInputChange4}
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
                value={assetData.status}
                onChange={handleInputChange4}
              >
                <option value='1'>Active</option>
                <option value='2'>Inactive</option>
                {/* <option value='3'>Deleted</option> */}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleEditAsset}>
              Save
            </Button>
            <Button onClick={() => setIsOpenEditAsset(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal //Modal edit license
        isOpen={isOpenEditLi}
        onClose={() => setIsOpenEditLi(false)}
        closeOnOverlayClick={false}
        size='lg'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit license</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8}>
            <Grid templateColumns='repeat(2, 1fr)' gap={4}>
              <GridItem>
                <FormControl>
                  <FormLabel>Software</FormLabel>
                  <Input
                    name='software'
                    value={
                      listAllSoftware.find(
                        (item) => item.softwareId === formData2?.softwareId,
                      )?.name
                    }
                    onChange={handleInputChange2}
                    isDisabled
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>License Key</FormLabel>
                  <Input
                    name='licenseKey'
                    value={formData2.licenseKey}
                    onChange={handleInputChange2}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Start Date</FormLabel>
                  <Input
                    name='startDate'
                    value={formData2.start_Date}
                    onChange={handleInputChange2}
                    type='date'
                    required
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Time</FormLabel>
                  <Input
                    name='time'
                    min={0}
                    value={formData2.time}
                    onChange={handleInputChange2}
                    type='number'
                  />
                </FormControl>
              </GridItem>
            </Grid>
            {/* Additional fields can be added to the respective columns */}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleSaveEdit}>
              Save
            </Button>
            <Button onClick={() => setIsOpenEditLi(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal // Modal add software
        isOpen={isOpenAdd}
        onClose={() => (
          setIsOpenAdd(false), setShowModalAdd(false), setShowModalTable(true)
        )}
        closeOnOverlayClick={false}
        size='6xl'
      >
        <ModalOverlay />
        <ModalContent
          w={
            showModalAdd
              ? 'fit-content'
              : showModalTable
              ? '100vw'
              : 'fit-content'
          }
        >
          <ModalHeader>
            {showModalAdd ? 'Create new software' : 'Add software'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8}>
            {showModalAdd ? (
              <>
                <Grid templateColumns='repeat(2, 1fr)' gap={4}>
                  <GridItem>
                    <FormControl>
                      <FormLabel>Name</FormLabel>
                      <Input
                        name='name'
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </FormControl>
                    <FormControl className={styles.formInput}>
                      <FormLabel>Version</FormLabel>
                      <Input
                        name='version'
                        value={formData.version}
                        onChange={handleInputChange}
                      />
                    </FormControl>
                    <FormControl className={styles.formInput}>
                      <FormLabel>Release</FormLabel>
                      <Input
                        name='release'
                        value={formData.release}
                        onChange={handleInputChange}
                      />
                    </FormControl>
                    {/* Add more fields for the first column */}
                  </GridItem>
                  <GridItem>
                    <FormControl>
                      <FormLabel>Publisher</FormLabel>
                      <Input
                        name='publisher'
                        value={formData.publisher}
                        onChange={handleInputChange}
                      />
                    </FormControl>
                    <FormControl className={styles.formInput}>
                      <FormLabel>Type</FormLabel>
                      <Select
                        name='type'
                        value={formData.type}
                        onChange={handleInputChange}
                      >
                        <option value='Web app'>Web app</option>
                        <option value='Desktop app'>Desktop app</option>
                        <option value='Service'>Service</option>
                        <option value='Antivirus'>Antivirus</option>
                      </Select>
                    </FormControl>
                    <FormControl className={styles.formInput}>
                      <FormLabel>OS</FormLabel>
                      <Select
                        name='os'
                        value={formData.os}
                        onChange={handleInputChange}
                      >
                        <option value='Windows'>Windows</option>
                        <option value='macOS'>macOS</option>
                        <option value='Linux'>Linux</option>
                        <option value='Android'>Android</option>
                        <option value='iOS'>iOS</option>
                      </Select>
                    </FormControl>
                    {/* Add more fields for the second column */}
                  </GridItem>
                </Grid>
              </>
            ) : showModalTable ? (
              <Box>
                <Box ml={6} mb={4}>
                  <Flex>
                    <InputGroup>
                      <InputLeftAddon children='Name / Publisher' />
                      <Input
                        type='text'
                        value={searchAddQuery}
                        onChange={handleSearchAddInputChange}
                        placeholder='search software'
                        w={300}
                        mr={1}
                      />
                    </InputGroup>
                    <Tooltip label='Create new software'>
                      <Button
                        aria-label='Add'
                        colorScheme='gray' // Choose an appropriate color
                        marginRight={1}
                        onClick={() => setShowModalAdd(true)}
                      >
                        Create
                      </Button>
                    </Tooltip>
                  </Flex>
                </Box>
                <TableContainer>
                  <Table variant='simple'>
                    <TableCaption>
                      <PaginationCustom
                        current={currentPage4}
                        onChange={handleChangePage4}
                        total={totalPages4}
                        pageSize={itemPerPage}
                      />
                    </TableCaption>
                    <Thead>
                      <Tr>
                        <Th className={styles.cTh} width='10px'>
                          Add
                        </Th>
                        <Th className={styles.cTh}>Name</Th>
                        <Th className={styles.cTh}>Publisher</Th>
                        <Th className={styles.cTh}>Versions</Th>
                        <Th className={styles.cTh}>Release</Th>
                        <Th className={styles.cTh}>Type</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {dynamicList4.map((item) => (
                        <Tr key={item.softwareId}>
                          <Td>
                            <Tooltip label='Add software'>
                              <IconButton
                                aria-label='Add'
                                icon={<FaPlus />}
                                colorScheme='gray' // Choose an appropriate color
                                onClick={() => (
                                  setShowModalTable(false), setFormData1(item)
                                )}
                              />
                            </Tooltip>
                          </Td>
                          <Td>{item.name ? item.name : 'N/A'}</Td>
                          <Td>{item.publisher ? item.publisher : 'N/A'}</Td>
                          <Td>{item.version ? item.version : 'N/A'}</Td>
                          <Td>{item.release ? item.release : 'N/A'}</Td>
                          <Td>{item.type ? item.type : 'N/A'}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
            ) : (
              <>
                <Grid templateColumns='repeat(2, 1fr)' gap={4}>
                  <GridItem>
                    <FormControl>
                      <FormLabel>Software</FormLabel>
                      <Input
                        name='softwareId'
                        value={formData1.name}
                        onChange={handleInputChange1}
                        disabled
                      ></Input>
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl display='flex' alignItems='center'>
                      <FormLabel>Add software with license</FormLabel>
                      <Switch
                        defaultChecked={haveLicense}
                        size='md'
                        onChange={handleSwitchChange}
                        mt='-2px'
                      />
                    </FormControl>
                  </GridItem>
                </Grid>
                {haveLicense ? (
                  <Grid templateColumns='repeat(2, 1fr)' gap={4}>
                    <GridItem>
                      <FormControl className={styles.formInput}>
                        <FormLabel>License Key</FormLabel>
                        <Input
                          name='licenseKey'
                          value={formData1.licenseKey}
                          onChange={handleInputChange1}
                        />
                      </FormControl>
                    </GridItem>
                    <GridItem>
                      <FormControl className={styles.formInput}>
                        <FormLabel>Start Date</FormLabel>
                        <Input
                          name='start_Date'
                          value={formData1.start_Date}
                          onChange={handleInputChange1}
                          type='date'
                          required
                        />
                      </FormControl>
                      <FormControl className={styles.formInput}>
                        <FormLabel>Time</FormLabel>
                        <Input
                          min={0}
                          name='time'
                          value={formData1.time}
                          onChange={handleInputChange1}
                          type='number'
                        />
                      </FormControl>
                    </GridItem>
                  </Grid>
                ) : (
                  ''
                )}
              </>
            )}
          </ModalBody>
          <ModalFooter>
            {showModalAdd ? (
              <>
                <Button colorScheme='blue' mr={3} onClick={handleSaveCreate}>
                  Save
                </Button>
                <Button
                  onClick={() => (
                    setShowModalAdd(false), setShowModalTable(true)
                  )}
                >
                  Back
                </Button>
              </>
            ) : showModalTable ? (
              <>
                <Button onClick={() => setIsOpenAdd(false)}>Cancel</Button>
              </>
            ) : (
              <>
                <Button mr={3} colorScheme='blue' onClick={handleSaveAdd}>
                  Save
                </Button>
                <Button onClick={() => setShowModalTable(true)}>Back</Button>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal // Modal edit software
        isOpen={isOpenEdit}
        onClose={() => setIsOpenEdit(false)}
        closeOnOverlayClick={false}
        size='lg'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit software</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8}>
            <Grid templateColumns='repeat(2, 1fr)' gap={4}>
              <GridItem>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    name='name'
                    value={formData1.name}
                    onChange={(e) => handleInputChange1(e)}
                    required
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Version</FormLabel>
                  <Input
                    name='version'
                    value={formData1.version}
                    onChange={(e) => handleInputChange1(e)}
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Release</FormLabel>
                  <Input
                    name='release'
                    value={formData1.release}
                    onChange={(e) => handleInputChange1(e)}
                  />
                </FormControl>
                {/* Add more fields for the first column */}
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Publisher</FormLabel>
                  <Input
                    name='publisher'
                    value={formData1.publisher}
                    onChange={(e) => handleInputChange1(e)}
                  />
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>Type</FormLabel>
                  <Select
                    name='type'
                    value={formData1.type}
                    onChange={(e) => handleInputChange1(e)}
                  >
                    <option value='Web app'>Web app</option>
                    <option value='Desktop app'>Desktop app</option>
                    <option value='Service'>Service</option>
                    <option value='Antivirus'>Antivirus</option>
                  </Select>
                </FormControl>
                <FormControl className={styles.formInput}>
                  <FormLabel>OS</FormLabel>
                  <Select
                    name='os'
                    value={formData1.os}
                    onChange={(e) => handleInputChange1(e)}
                  >
                    <option value='Windows'>Windows</option>
                    <option value='macOS'>macOS</option>
                    <option value='Linux'>Linux</option>
                    <option value='Android'>Android</option>
                    <option value='iOS'>iOS</option>
                  </Select>
                </FormControl>
                {/* Add more fields for the second column */}
              </GridItem>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleEditSoftware}>
              Save
            </Button>
            <Button onClick={() => setIsOpenEdit(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal // modal delete software
        isOpen={isOpenDelete}
        onClose={() => setIsOpenDelete(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete this software?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={handleDelete}>
              Delete
            </Button>
            <Button onClick={() => setIsOpenDelete(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default AssetDetailPage;
