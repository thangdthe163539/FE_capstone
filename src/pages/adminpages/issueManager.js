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
  FormErrorMessage,
  Stack,
  TableContainer,
  Flex,
  Spacer,
  IconButton,
  Textarea,
  InputGroup,
  InputLeftAddon,
  Center,
  Select,
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
  Grid,
  GridItem,
  Image,
} from '@chakra-ui/react';
import { Alert, AlertIcon } from '@chakra-ui/react';
import axios from 'axios';
import Link from 'next/link';
import styles from '@/styles/pm.module.css';
import { ArrowForwardIcon, DeleteIcon, RepeatIcon } from '@chakra-ui/icons';
import { FaPlus } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import React from 'react';
import PaginationCustom from '@/components/pagination';
import { BACK_END_PORT } from '../../../env';
import ToastCustom from '@/components/toast';
const defaultData = {
  reportId: '',
  softwareId: '',
  accId: '',
  title: '',
  type: '',
  description: '',
  start_Date: '',
  end_Date: '',
  status: '',
};

function IssuePage() {
  const router = useRouter();
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [formData, setFormData] = useState(defaultData);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryTb, setSearchQueryTb] = useState('');
  const [filteredApp, setFilteredApp] = useState([]);
  const [dynamicFilteredAppData, setDynamicFilteredAppData] = useState([]);
  const [filteredAppAddData, setfilteredAppAddData] = useState([]);
  const [searchQuerySof, setSearchQuerySof] = useState('');
  const [filteredAppDataSof, setfilteredAppDataSof] = useState([]);
  const [showOptionsSof, setShowOptionsSof] = useState(false);
  const [Apps, setApps] = useState([]);
  const [Issues, setIssues] = useState([]);
  const [isSuccess, setIsSuccess] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [appId, setAppId] = useState('');
  const [imagesState, setImages] = useState([]);
  const [error, setError] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomedIndex, setZoomedIndex] = useState(null);
  const [isHovered, setIsHovered] = useState(null);
  const notificationTimeout = 2000;
  const allowedExtensions = ['jpg', 'png'];
  const [mode, setMode] = useState('Application');
  const [searchQueryHw, setSearchQueryHw] = useState('');
  const [searchQuerySw, setSearchQuerySw] = useState('');
  const [searchQueryAnti, setSearchQueryAnti] = useState('');
  const [showOptionsHw, setShowOptionsHw] = useState(false);
  const [showOptionsSw, setShowOptionsSw] = useState(false);
  const [showOptionsAnti, setShowOptionsAnti] = useState(false);
  const [filteredAppData, setFilteredAppData] = useState([]);
  const [filteredHwData, setFilteredHwData] = useState([]);
  const [filteredSwData, setFilteredSwData] = useState([]);
  const [filteredAntiData, setFilteredAntiData] = useState([]);
  const [Hardware, setHardware] = useState([]);
  const [Software, setSoftware] = useState([]);
  const [account, setAccount] = useState();
  const currentDate = new Date();
  const currentDateString = currentDate.toISOString().split('T')[0];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const uniqueSoftwareIds = new Set();
        const allSoftware = [];

        await Promise.all(
          Hardware.map(async (asset) => {
            try {
              const response2 = await axios.get(
                `${BACK_END_PORT}/api/Software/list_Softwares_by_Asset/` +
                  asset?.assetId,
              );
              // Filter out duplicate software based on assetID
              const uniqueSoftware = response2.data.filter((sw) => {
                if (!uniqueSoftwareIds.has(sw.softwareId)) {
                  uniqueSoftwareIds.add(sw.softwareId);
                  return true;
                }
                return false;
              });
              allSoftware.push(...uniqueSoftware);
            } catch (error) {
              console.log(error);
              return {
                // Handle error if needed
              };
            }
          }),
        );
        setSoftware(allSoftware);
      } catch (error) {
        setSoftware([]);
        console.error('Error fetching data:', error);
      }
    };

    if (Hardware.length > 0) {
      fetchData();
    }
  }, [Hardware]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const uniqueAssetIds = new Set();
        const allAssets = [];

        await Promise.all(
          Apps.filter((app) => app.status !== 3).map(async (app) => {
            try {
              const response2 = await axios.get(
                `${BACK_END_PORT}/api/Asset/list_Asset_by_App/` + app?.appId,
              );

              // Filter out duplicate assets based on device ID

              const uniqueAssets = response2.data.filter((asset) => {
                if (!uniqueAssetIds.has(asset.assetId)) {
                  uniqueAssetIds.add(asset.assetId);
                  return true;
                }
                return false;
              });
              // Accumulate unique assets for each app
              allAssets.push(...uniqueAssets);

              return {
                // No need to set assets here
              };
            } catch (error) {
              console.log(error);
              return {
                // Handle error if needed
              };
            }
          }),
        );

        setHardware(allAssets);
      } catch (error) {
        setHardware([]);
        console.error('Error fetching data:', error);
      }
    };

    if (Apps.length > 0) {
      fetchData();
    }
  }, [Apps]);

  const handleSearchInputChangeHw = (e) => {
    setSearchQueryHw(e.target.value);
  };

  const handleSearchInputChangeSw = (e) => {
    setSearchQuerySw(e.target.value);
  };

  const handleSearchInputChangeAnti = (e) => {
    setSearchQueryAnti(e.target.value);
  };

  const filterHardware = () => {
    const query = searchQueryHw.toLowerCase();

    const filteredData = Hardware.filter((item) => {
      const model = item?.model?.toLowerCase();
      const cpu = item?.cpu?.toLowerCase();
      const gpu = item?.gpu?.toLowerCase();
      // Check if the query matches either name or OS
      if (model || cpu || gpu) {
        return (
          model?.includes(query) || cpu?.includes(query) || gpu?.includes(query)
        );
      }
      return null;
    });

    setFilteredHwData(filteredData);
  };
  useEffect(() => {
    filterHardware();
  }, [searchQueryHw]);

  const filterSoftware = () => {
    const query = searchQuerySw.toLowerCase();

    const filteredData = Software.filter(
      (item) => item.type !== 'Antivirus',
    ).filter((item) => {
      const name = item?.name?.toLowerCase();
      const os = item?.os?.toLowerCase();
      const version = item?.version?.toLowerCase();
      if (name || os || version) {
        return (
          name?.includes(query) ||
          os?.includes(query) ||
          version?.includes(query)
        );
      }
      return null;
    });

    setFilteredSwData(filteredData);
  };
  useEffect(() => {
    filterSoftware();
  }, [searchQuerySw]);

  const filterAntivirus = () => {
    const query = searchQueryAnti.toLowerCase();

    const filteredData = Software.filter(
      (item) => item.type === 'Antivirus',
    ).filter((item) => {
      const name = item?.name?.toLowerCase();
      const os = item?.os?.toLowerCase();
      const version = item?.version?.toLowerCase();

      if (name || os || version) {
        return (
          name?.includes(query) ||
          os?.includes(query) ||
          version?.includes(query)
        );
      }
      return null;
    });

    setFilteredAntiData(filteredData);
  };
  useEffect(() => {
    filterAntivirus();
  }, [searchQueryAnti]);

  const toggleMode = (e) => {
    setMode(e.target.value);
    console.log(mode);
  };

  useEffect(() => {
    // Access sessionStorage on the client side
    const storedAccount = sessionStorage.getItem('account');
    if (storedAccount) {
      try {
        const accountDataDecode = JSON.parse(storedAccount);
        if (!accountDataDecode) {
          // router.push('/page405');
        } else {
          if (
            accountDataDecode.roleId !== 1 ||
            accountDataDecode.status !== 1
          ) {
            router.push('/page405');
          }
          setAccount(accountDataDecode);
        }
      } catch (error) {
        // router.push('/page405');
      }
    } else {
      router.push('/page405');
    }
  }, []);

  const filteAppSof = () => {
    const query = searchQuerySof.toLowerCase();

    // Sử dụng Set để theo dõi các giá trị đã xuất hiện
    const uniqueValues = new Set();

    const filteredData = Apps.filter((item) => {
      const os = item.os.toLowerCase();
      const version = item.osversion.toLowerCase();

      // Tạo một khóa duy nhất từ os và version
      const key = `${os}-${version}`;

      // Nếu giá trị đã tồn tại, bỏ qua
      if (uniqueValues.has(key)) {
        return false;
      }

      // Nếu không, thêm vào Set và giữ lại
      uniqueValues.add(key);
      return os.includes(query) || version.includes(query);
    });

    setfilteredAppDataSof(filteredData);
  };

  useEffect(() => {
    filteAppSof();
  }, [searchQuerySof]);

  const handleSelectAppName = (app) => {
    setSearchQuery(`${app.name}-${app.os}-${app.osversion}`);
    setAppId([app.appId]);
    setShowOptions(false);
    setFormData((prevFormData) => ({
      ...prevFormData,
      title: 'Application: ' + app.name,
    }));
  };

  const handleSelectAppOs = (item) => {
    setSearchQuery(`${item.os}-${item.osversion}`);
    const key = `${item.os.trim().toLowerCase()}-${item.osversion
      .trim()
      .toLowerCase()}`;
    const matchingAppIds = Apps.filter(
      (app) =>
        `${app.os.trim().toLowerCase()}-${app.osversion
          .trim()
          .toLowerCase()}` === key,
    ).map((app) => app.appId);
    setAppId(matchingAppIds);
    setShowOptions(false);
    setFormData((prevFormData) => ({
      ...prevFormData,
      title: 'Application: ' + item.os + '-' + item.osversion,
    }));
  };
  const handleSelectHwModel = async (item) => {
    setSearchQueryHw(`${item.model}`);

    try {
      // Array to store appIds
      let appIds = [];

      // Use for...of loop to iterate over each app
      for (const app of Apps) {
        try {
          const response = await axios.get(
            `${BACK_END_PORT}/api/Asset/list_Asset_by_App/` + app.appId,
          );

          // Extract appIds from the response data
          const matchingAppIds = response.data
            .filter((asset) => asset.model === item.model)
            .map((matchingAsset) => app.appId);

          // Add matchingAppIds to appIds
          appIds = appIds.concat(matchingAppIds);
        } catch (error) {
          console.log(`Error for appId ${app.appId}:`, error);
          // Handle error for the specific app if needed
        }
      }

      // Remove duplicate appIds (if any)
      const uniqueAppIds = [...new Set(appIds)];

      // Set the state with the unique appIds
      setAppId(uniqueAppIds);
      setShowOptionsHw(false);
      setFormData((prevFormData) => ({
        ...prevFormData,
        title: 'Hardware: ' + item.model,
      }));
    } catch (error) {
      console.log('Error in handleSelectHwName:', error);
      // Handle error if needed
    }
  };

  const handleSelectHwCPU = async (item) => {
    setSearchQueryHw(`${item.cpu}`);

    try {
      // Array to store appIds
      let appIds = [];

      // Use for...of loop to iterate over each app
      for (const app of Apps) {
        try {
          const response = await axios.get(
            `${BACK_END_PORT}/api/Asset/list_Asset_by_App/` + app.appId,
          );

          // Extract appIds from the response data
          const matchingAppIds = response.data
            .filter((asset) => asset.cpu === item.cpu)
            .map((matchingAsset) => app.appId);

          // Add matchingAppIds to appIds
          appIds = appIds.concat(matchingAppIds);
        } catch (error) {
          console.log(`Error for appId ${app.appId}:`, error);
          // Handle error for the specific app if needed
        }
      } // Remove duplicate appIds (if any)
      const uniqueAppIds = [...new Set(appIds)];

      // Set the state with the unique appIds
      setAppId(uniqueAppIds);
      setShowOptionsHw(false);
      setFormData((prevFormData) => ({
        ...prevFormData,
        title: 'Hardware: ' + item.cpu,
      }));
    } catch (error) {
      console.log('Error in handleSelectHwName:', error);
      // Handle error if needed
    }
  };
  const handleSelectHwGPU = async (item) => {
    setSearchQueryHw(`${item.gpu}`);

    try {
      // Array to store appIds
      let appIds = [];

      // Use for...of loop to iterate over each app
      for (const app of Apps) {
        try {
          const response = await axios.get(
            `${BACK_END_PORT}/api/Asset/list_Asset_by_App/` + app.appId,
          );

          // Extract appIds from the response data
          const matchingAppIds = response.data
            .filter((asset) => asset.gpu === item.gpu)
            .map((matchingAsset) => app.appId);

          // Add matchingAppIds to appIds
          appIds = appIds.concat(matchingAppIds);
        } catch (error) {
          console.log(`Error for appId ${app.appId}:`, error);
          // Handle error for the specific app if needed
        }
      }

      // Remove duplicate appIds (if any)
      const uniqueAppIds = [...new Set(appIds)];

      // Set the state with the unique appIds
      setAppId(uniqueAppIds);
      setShowOptionsHw(false);
      setFormData((prevFormData) => ({
        ...prevFormData,
        title: 'Hardware: ' + item.gpu,
      }));
    } catch (error) {
      console.log('Error in handleSelectHwName:', error);
      // Handle error if needed
    }
  };

  const handleSelectSwName = async (item) => {
    setSearchQuerySw(`${item.name}-${item.version}-${item.os}`);
    try {
      // Array to store appIds
      let appIds = [];

      // Use for...of loop to iterate over each app
      for (const app of Apps) {
        try {
          const response = await axios.get(
            `${BACK_END_PORT}/api/Asset/list_Asset_by_App/` + app.appId,
          );

          for (const asset of response.data) {
            // Extract appIds from the response data
            const response2 = await axios.get(
              `${BACK_END_PORT}/api/Software/list_Softwares_by_Asset/` +
                asset.assetId,
            );

            // Check if the list of software includes the target softwareId
            if (
              response2.data.some((sw) => sw.softwareId === item.softwareId)
            ) {
              // If there is a match, add the appId to appIds
              appIds.push(app.appId);
            }
          }
        } catch (error) {
          console.log(`Error for appId ${app.appId}:`, error);
          // Handle error for the specific app if needed
        }
      }

      // Remove duplicate appIds (if any)
      const uniqueAppIds = [...new Set(appIds)];

      // Set the state with the unique appIds
      setAppId(uniqueAppIds);
      setShowOptionsSw(false);
      setFormData((prevFormData) => ({
        ...prevFormData,
        title: 'Software: ' + item.name + '-' + item.version,
      }));
    } catch (error) {
      console.log('Error in handleSelectSwName:', error);
      // Handle error if needed
    }
  };

  const handleSelectAntiName = async (item) => {
    setSearchQueryAnti(`${item.name}-${item.version}-${item.os}`);
    try {
      // Array to store appIds
      let appIds = [];

      // Use for...of loop to iterate over each app
      for (const app of Apps) {
        try {
          const response = await axios.get(
            `${BACK_END_PORT}/api/Asset/list_Asset_by_App/` + app.appId,
          );

          for (const asset of response.data) {
            // Extract appIds from the response data
            const response2 = await axios.get(
              `${BACK_END_PORT}/api/Software/list_Softwares_by_Asset/` +
                asset.assetId,
            );

            // Check if the list of software includes the target softwareId
            if (
              response2.data.some((sw) => sw.softwareId === item.softwareId)
            ) {
              // If there is a match, add the appId to appIds
              appIds.push(app.appId);
            }
          }
        } catch (error) {
          console.log(`Error for appId ${app.appId}:`, error);
          // Handle error for the specific app if needed
        }
      }

      // Remove duplicate appIds (if any)
      const uniqueAppIds = [...new Set(appIds)];

      // Set the state with the unique appIds
      setAppId(uniqueAppIds);
      setShowOptionsAnti(false);
      setFormData((prevFormData) => ({
        ...prevFormData,
        title: 'Antivirus: ' + item.name + '-' + item.version,
      }));
    } catch (error) {
      console.log('Error in handleSelectAntiName:', error);
      // Handle error if needed
    }
  };
  // console.log('4:' + appId);

  //pagination
  const itemPerPage = 5;
  const [dynamicList, setDynamicList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  // filteredIssueData;
  const handleChangePage = (page) => {
    setCurrentPage(page);
    let newList = [];
    for (let i = (page - 1) * itemPerPage; i < page * itemPerPage; i++) {
      if (dynamicFilteredAppData[i]) {
        newList.push(dynamicFilteredAppData[i]);
      }
    }
    setDynamicList(newList);
  };
  const totalPages = dynamicFilteredAppData
    ? dynamicFilteredAppData?.length
    : 0;

  //image
  const handleFileChange = (e) => {
    const files = e.target.files;

    if (files) {
      const newImages = Array.from(files).map((file) => {
        const extension = file.name.split('.').pop().toLowerCase();

        if (allowedExtensions.includes(extension)) {
          const reader = new FileReader();

          reader.onload = () => {
            setImages((prevImages) => [
              ...prevImages,
              { fileName: file.name, dataURL: reader.result },
            ]);
            setError('');
          };

          reader.readAsDataURL(file);
        } else {
          setError('Invalid file type. Please select a JPG or PNG file.');
          return null;
        }
      });
    }
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });
    setError('');
  };

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

  const handleImageClick = (index) => {
    setZoomedIndex(index);
    setIsZoomed(true);
  };

  const handleZoomClose = () => {
    setIsZoomed(false);
    setZoomedIndex(null);
  };

  const handleImageMouseLeave = () => {
    setIsHovered(null);
  };

  const handleImageMouseEnter = (index, event) => {
    event.stopPropagation(); // Ngăn chặn sự kiện lan toả lên các phần tử cha
    setIsHovered(index);
  };

  const handleDeleteClick_Add = (index, event) => {
    event.stopPropagation(); // Ngăn chặn sự kiện lan toả lên các phần tử cha
    handleRemoveImage(index);
  };
  //End

  const handleIssuerDetails = (appId) => {
    const randomParameter = Math.random().toString(36).substring(2);
    const params = {
      appId: appId,
      softrack: randomParameter,
    };
    const encodedParams = btoa(JSON.stringify(params));
    const url = `issueDetailsManage?${encodedParams}`;
    router.push(url);
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchTbInputChange = (e) => {
    setSearchQueryTb(e.target.value);
  };

  useEffect(() => {
    const url = 'http://localhost:5001/api/App/ListApps';
    fetch(url, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        setApps(data);
      })
      .catch((error) => {
        console.error('Lỗi:', error);
      });
  }, []);

  const [deadline, setDeadline] = useState();

  const handleDeadline = (e) => {
    const { value } = e.target;
    setDeadline(value);
    setFormData({ ...formData, endDate: value });
    setIsFirst({ ...isFirst, endDate: false });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'title' || name === 'endDate') {
      setIsFirst({ ...isFirst, [name]: false });
    }
  };

  const [description2, setDescription2] = useState('');

  const handleChangeDescription = (e) => {
    setDescription2(e.target.value);
    setIsFirst({ ...isFirst, description: false });
  };

  const countIssue = (appId) => {
    const occurrences = Issues.filter((item) => item.appId === appId);
    // console.log(occurrences.length + '---issue by appId = ' + appId);
    return occurrences.length;
  };

  //lọc
  const filteApp = () => {
    const query = searchQueryTb.toLowerCase();
    const filteredData = Apps.filter((item) => {
      const name = item.name.toLowerCase();
      return name.includes(query);
    });
    setFilteredApp(filteredData.filter((item) => countIssue(item.appId) !== 0));
    setDynamicFilteredAppData(
      filteredData.filter((item) => countIssue(item.appId) !== 0),
    );
  };

  useEffect(() => {
    if (dynamicFilteredAppData.length) {
      handleChangePage(1);
    } else {
      setDynamicList([]);
    }
  }, [dynamicFilteredAppData]);

  useEffect(() => {
    filteApp();
  }, [searchQueryTb, Apps, Issues]);

  const filterApps = () => {
    const query = searchQuery.toLowerCase();

    const filteredData = Apps.filter((item) => {
      const name = item?.name?.toLowerCase();
      const os = item?.os?.toLowerCase();
      const version = item?.osversion?.toLowerCase();
      if (name || os || version) {
        return (
          name?.includes(query) ||
          os?.includes(query) ||
          version?.includes(query)
        );
      }
      return null;
    });

    setFilteredAppData(filteredData);
  };
  useEffect(() => {
    filterApps();
  }, [searchQuery]);
  //END

  const [os, setOs] = useState('');
  const [osversion, setOsversion] = useState('');

  const fetchDataAndUpdateState = () => {
    const url = 'http://localhost:5001/api/Report/ReportsByType/Issue';
    fetch(url, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setIssues(data);
        }
      })
      .catch((error) => {
        console.error('Lỗi:', error);
      });
  };

  useEffect(() => {
    fetchDataAndUpdateState();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      const hideNotification = setTimeout(() => {
        setIsSuccess('');
        fetchDataAndUpdateState();
      }, notificationTimeout);
      return () => {
        clearTimeout(hideNotification);
      };
    }
  }, [isSuccess]);

  const [isFirst, setIsFirst] = useState({
    title: true,
    description: true,
    endDate: true,
    searchQuerySw: true,
    searchQueryAnti: true,
    searchQueryHw: true,
    searchQueryTb: true,
    searchQuery: true,
  });

  const [toast, setToast] = useState(false);

  const handleSaveAdd = async () => {
    const url = 'http://localhost:5001/api/Report/CreateReport_appids';

    // const appIds = appId.join(',');
    const accId = account?.accId;
    const desc = description2;
    const title = formData.title;
    const endDate = deadline;
    if (!endDate || !title || !desc) {
      setToast(true);
      setTimeout(() => {
        setToast(false);
      }, 500);
      setIsFirst({
        title: false,
        description: false,
        endDate: false,
        searchQuerySw: false,
        searchQueryAnti: false,
        searchQueryHw: false,
        searchQueryTb: false,
        searchQuery: false,
      });
      return;
    }
    const dateParts = endDate.split('-');
    let formattedDate = '';
    if (dateParts.length === 3) {
      formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    } else {
      console.error('Ngày không hợp lệ.');
      return; // Nếu ngày không hợp lệ, thoát khỏi hàm
    }

    // Chuyển đổi imagesState thành một mảng các đối tượng giống với File
    const fileObjects = imagesState.map((image) => {
      // Tạo một Blob từ dataURL
      const blob = dataURLtoBlob(image.dataURL);
      // Tạo một File từ Blob
      return new File([blob], image.fileName, { type: blob.type });
      [];
    });
    // Sử dụng FormData để chứa dữ liệu và file
    const apiData = new FormData();
    appId.forEach((id) => {
      apiData.append('AppIds', id);
    });
    apiData.append('CreatorID', accId);
    apiData.append('Title', title);
    apiData.append('Description', desc);
    apiData.append('Type', 'Issue');
    apiData.append('Start_Date', formattedDate);
    apiData.append('End_Date', formattedDate);
    apiData.append('Status', 1);

    // Duyệt qua tất cả các đối tượng file và thêm chúng vào formData
    fileObjects.forEach((file, index) => {
      apiData.append(`Images`, file);
    });
    try {
      const response = await axios.post(url, apiData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setIsSuccess('true');
      setIsOpenAdd(false);
      setSearchQuery('');
      setFormData(defaultData);
    } catch (error) {
      setIsSuccess('false');
      setIsOpenAdd(false);
      console.error('Lỗi:', error);
    }
  };

  return (
    <>
      <Box className={styles.bodybox}>
        <List>
          <ListItem className={styles.list}>
            <Link href='/adminpages/adminhome' className={styles.listitem}>
              Home
            </Link>
            <ArrowForwardIcon margin={1}></ArrowForwardIcon>Issue management
            <Text className={styles.alert}>
              {isSuccess === 'true' && (
                <ToastCustom
                  title={'Your request successfully!'}
                  description={''}
                  status={'success'}
                />
              )}
              {isSuccess === 'false' && (
                <ToastCustom
                  title={'Error processing your request.'}
                  description={''}
                  status={'error'}
                />
              )}
            </Text>
          </ListItem>
          <ListItem className={styles.list}>
            <Flex>
              <Text fontSize='2xl'>
                Issue management -{' '}
                <Link
                  href='/adminpages/issuehome'
                  style={{ color: '#4d9ffe', textDecoration: 'none' }}
                >
                  List open issue
                </Link>
              </Text>
              <Spacer />
              <InputGroup style={{ paddingTop: '', width: '35%' }}>
                <InputLeftAddon pointerEvents='none' children='Application' />
                <Input
                  style={{ width: '100%' }}
                  type='text'
                  value={searchQueryTb}
                  onChange={handleSearchTbInputChange}
                  placeholder='Search'
                  w={300}
                  mr={1}
                />
              </InputGroup>
              <Box>
                <IconButton
                  aria-label='Add'
                  icon={<FaPlus />}
                  colorScheme='gray'
                  marginRight={1}
                  onClick={() => setIsOpenAdd(true)}
                />
              </Box>
            </Flex>
          </ListItem>
          <ListItem className={styles.list}>
            <TableContainer>
              <Center>
                <Text fontSize={30} mb={2}>
                  All issue
                </Text>
              </Center>
              <Table
                variant='striped'
                colorScheme='gray'
                className={styles.cTable}
              >
                <TableCaption>
                  <Flex alignItems={'center'} justifyContent={'space-between'}>
                    <Text>
                      Show {dynamicList.length}/{filteredAppData.length}{' '}
                      result(s)
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
                    <Th className={styles.cTh}>Release</Th>
                    <Th className={styles.cTh}>OS</Th>
                    <Th className={styles.cTh}>Os Version</Th>
                    <Th className={styles.cTh}>Language</Th>
                    <Th className={styles.cTh}>Database</Th>
                    <Th className={styles.cTh}>Publisher</Th>
                    <Th className={styles.cTh}>Status</Th>
                    <Th className={styles.cTh}>No.Issue</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {dynamicList.map(
                    (app, index) =>
                      countIssue(app.appId) !== 0 && (
                        <Tr key={app.id}>
                          <Td style={{ width: '5%' }}>{index + 1}</Td>
                          <Td>
                            <Button
                              color={'blue'}
                              variant='link'
                              onClick={() => handleIssuerDetails(app.appId)}
                            >
                              {app.name.trim()}
                            </Button>
                          </Td>
                          <Td>{app.release.trim()}</Td>
                          <Td>{app.os.trim()}</Td>
                          <Td>{app.osversion.trim()}</Td>
                          <Td>{app.language.trim()}</Td>
                          <Td>{app.db.trim()}</Td>
                          <Td>{app.publisher.trim()}</Td>
                          <Td>Active</Td>
                          <Td>{countIssue(app.appId)}</Td>
                        </Tr>
                      ),
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </ListItem>
        </List>
        <Modal
          isOpen={isOpenAdd}
          onClose={() => (
            setIsOpenAdd(false),
            setFormData(defaultData),
            setSearchQuery(''),
            setSearchQueryAnti(''),
            setSearchQueryHw(''),
            setSearchQuerySw(''),
            setMode('Application')
          )}
          closeOnOverlayClick={false}
          size='lg'
        >
          <ModalOverlay />
          <ModalContent maxW='1100px'>
            <ModalHeader>Create new issue</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={8}>
              <Grid templateColumns='repeat(3, 1fr)' gap={8}>
                <GridItem colSpan={1}>
                  <Flex alignItems='baseline'>
                    <Select value={mode} onChange={toggleMode} width='140px'>
                      <option value='Application'>Application</option>
                      <option value='Hardware'>Hardware</option>
                      <option value='Software'>Software</option>
                      <option value='Antivirus'>Antivirus</option>
                    </Select>
                    <Box
                      style={{
                        position: 'relative',
                        display: 'inline-block',
                        backgroundColor: 'white',
                      }}
                    >
                      {mode === 'Application' ? (
                        <FormControl
                          isInvalid={
                            isFirst?.searchQuery
                              ? false
                              : !searchQuery
                              ? true
                              : false
                          }
                          isRequired={true}
                        >
                          <Input
                            type='text'
                            style={{ backgroundColor: 'white', width: '270px' }}
                            value={searchQuery}
                            onChange={(e) => {
                              handleSearchInputChange(e);
                              setShowOptions(e.target.value !== '');
                              setIsFirst({ ...isFirst, searchQuery: false });
                            }}
                            placeholder={'Name - Os - Version'}
                            mr={1}
                          />
                          {(isFirst?.searchQuery
                            ? false
                            : !searchQuery
                            ? true
                            : false) && (
                            <FormErrorMessage mt={0}>
                              This field is required.
                            </FormErrorMessage>
                          )}
                          {showOptions && (
                            <Box
                              style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                width: 'fit-content',
                                maxHeight: '250px',
                                border: '2px solid whitesmoke',
                                background: '#fff',
                                zIndex: 1,
                                borderRadius: '5px',
                                overflow: 'auto',
                              }}
                            >
                              {filteredAppData.map((app) => (
                                <Box key={app.appId} style={{ padding: '5px' }}>
                                  <Grid templateColumns='repeat(2, 1fr)'>
                                    <GridItem
                                      className={styles.listitem}
                                      onClick={() => handleSelectAppName(app)}
                                    >
                                      {app.name?.trim()}
                                    </GridItem>
                                    <GridItem
                                      className={styles.listitem}
                                      onClick={() => handleSelectAppOs(app)}
                                    >
                                      {app.os?.trim()} - {app.osversion?.trim()}
                                    </GridItem>
                                  </Grid>
                                </Box>
                              ))}
                            </Box>
                          )}
                        </FormControl>
                      ) : mode === 'Hardware' ? (
                        <FormControl
                          isInvalid={
                            isFirst?.searchQueryHw
                              ? false
                              : !searchQueryHw
                              ? true
                              : false
                          }
                          isRequired={true}
                        >
                          <Input
                            type='text'
                            style={{ backgroundColor: 'white', width: '270px' }}
                            value={searchQueryHw}
                            onChange={(e) => {
                              handleSearchInputChangeHw(e);
                              setShowOptionsHw(e.target.value !== '');
                              setIsFirst({ ...isFirst, searchQueryHw: false });
                            }}
                            placeholder={'Model - CPU - GPU'}
                            mr={1}
                          />
                          {(isFirst?.searchQueryHw
                            ? false
                            : !searchQueryHw
                            ? true
                            : false) && (
                            <FormErrorMessage mt={0}>
                              This field is required.
                            </FormErrorMessage>
                          )}
                          {showOptionsHw && (
                            <Box
                              style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                width: '800px',
                                maxHeight: '250px',
                                border: '2px solid whitesmoke',
                                background: '#fff',
                                zIndex: 1,
                                borderRadius: '5px',
                                overflow: 'auto',
                              }}
                            >
                              {filteredHwData.map((item) => (
                                <Box
                                  key={item.assetId}
                                  style={{ padding: '5px' }}
                                >
                                  <Grid templateColumns='repeat(3, 1fr)'>
                                    <GridItem
                                      className={styles.listitem}
                                      onClick={() => handleSelectHwModel(item)}
                                    >
                                      {item.model?.trim()}
                                    </GridItem>
                                    <GridItem
                                      className={styles.listitem}
                                      onClick={() => handleSelectHwCPU(item)}
                                    >
                                      {item.cpu?.trim()}
                                    </GridItem>
                                    <GridItem
                                      className={styles.listitem}
                                      onClick={() => handleSelectHwGPU(item)}
                                    >
                                      {item.gpu?.trim()}
                                    </GridItem>
                                  </Grid>
                                </Box>
                              ))}
                            </Box>
                          )}
                        </FormControl>
                      ) : mode === 'Software' ? (
                        <FormControl
                          isInvalid={
                            isFirst?.searchQuerySw
                              ? false
                              : !searchQuerySw
                              ? true
                              : false
                          }
                          isRequired={true}
                        >
                          <Input
                            type='text'
                            style={{ backgroundColor: 'white', width: '270px' }}
                            value={searchQuerySw}
                            onChange={(e) => {
                              handleSearchInputChangeSw(e);
                              setShowOptionsSw(e.target.value !== '');
                              setIsFirst({ ...isFirst, searchQuerySw: false });
                            }}
                            placeholder={'Name - Version - Os'}
                            w={300}
                            mr={1}
                          />
                          {!searchQuerySw && (
                            <FormErrorMessage mt={0}>
                              This field is required.
                            </FormErrorMessage>
                          )}
                          {showOptionsSw && (
                            <Box
                              style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                width: '420px',
                                maxHeight: '250px',
                                border: '2px solid whitesmoke',
                                background: '#fff',
                                zIndex: 1,
                                borderRadius: '5px',
                                overflow: 'auto',
                              }}
                            >
                              {filteredSwData.map((item) => (
                                <Box
                                  key={item.softwareId}
                                  style={{ padding: '5px' }}
                                >
                                  <Text
                                    className={styles.listitem}
                                    onClick={() => handleSelectSwName(item)}
                                  >
                                    {item.name?.trim()} - {item.version?.trim()}{' '}
                                    - {item.os?.trim()}
                                  </Text>
                                </Box>
                              ))}
                            </Box>
                          )}
                        </FormControl>
                      ) : (
                        <FormControl
                          isInvalid={
                            isFirst?.searchQueryAnti
                              ? false
                              : !searchQueryAnti
                              ? true
                              : false
                          }
                          isRequired={true}
                        >
                          <Input
                            type='text'
                            style={{ backgroundColor: 'white', width: '270px' }}
                            value={searchQueryAnti}
                            onChange={(e) => {
                              handleSearchInputChangeAnti(e);
                              setShowOptionsAnti(e.target.value !== '');
                              setIsFirst({
                                ...isFirst,
                                searchQueryAnti: false,
                              });
                            }}
                            placeholder={'Name - Version - Os'}
                            w={300}
                            mr={1}
                          />
                          {(isFirst?.searchQueryAnti
                            ? false
                            : !searchQueryAnti
                            ? true
                            : false) && (
                            <FormErrorMessage mt={0}>
                              This field is required.
                            </FormErrorMessage>
                          )}
                          {showOptionsAnti && (
                            <Box
                              style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                width: '420px',
                                maxHeight: '250px',
                                border: '2px solid whitesmoke',
                                background: '#fff',
                                zIndex: 1,
                                borderRadius: '5px',
                                overflow: 'auto',
                              }}
                            >
                              {filteredAntiData.map((item) => (
                                <Box
                                  key={item.softwareId}
                                  style={{ padding: '5px' }}
                                >
                                  <Text
                                    className={styles.listitem}
                                    onClick={() => handleSelectAntiName(item)}
                                  >
                                    {item.name?.trim()} - {item.version?.trim()}{' '}
                                    - {item.os?.trim()}
                                  </Text>
                                </Box>
                              ))}
                            </Box>
                          )}
                        </FormControl>
                      )}
                    </Box>
                  </Flex>
                </GridItem>
                <GridItem colSpan={1}>
                  <FormControl
                    isInvalid={
                      isFirst?.title ? false : !formData.title ? true : false
                    }
                    isRequired
                  >
                    <Flex alignItems='baseline'>
                      <FormLabel>Title</FormLabel>
                      <Stack alignItems={'start'} gap={0}>
                        <Input
                          maxLength={255}
                          placeholder='Title'
                          name='title'
                          value={formData.title}
                          onChange={handleInputChange}
                          style={{ backgroundColor: 'white', width: '264px' }}
                        />
                        {(isFirst?.title
                          ? false
                          : !formData.title
                          ? true
                          : false) && (
                          <FormErrorMessage mt={0}>
                            Title is required
                          </FormErrorMessage>
                        )}
                      </Stack>
                    </Flex>
                  </FormControl>
                </GridItem>
                <GridItem colSpan={1}>
                  <FormControl
                    isInvalid={
                      isFirst?.endDate ? false : !deadline ? true : false
                    }
                    isRequired
                  >
                    <Flex alignItems='baseline'>
                      <FormLabel>Deadline</FormLabel>
                      <Stack gap={0}>
                        <Input
                          style={{
                            backgroundColor: 'white',
                            width: '100%',
                          }}
                          type='date'
                          name='endDate'
                          value={deadline}
                          min={currentDateString}
                          onChange={(e) => handleDeadline(e)}
                        />
                        {(isFirst?.endDate
                          ? false
                          : !deadline
                          ? true
                          : false) && (
                          <FormErrorMessage mt={0}>
                            Deadline is required
                          </FormErrorMessage>
                        )}
                      </Stack>
                    </Flex>
                  </FormControl>
                </GridItem>
              </Grid>
              <FormControl
                mt={4}
                isInvalid={
                  isFirst?.description ? false : !description2 ? true : false
                }
                isRequired
              >
                <FormLabel>Description</FormLabel>
                <Textarea
                  maxLength={1000}
                  id='description'
                  placeholder='Description...'
                  value={description2}
                  onChange={(e) => handleChangeDescription(e)}
                  width='100%'
                  minH={40}
                />
                {(isFirst?.description
                  ? false
                  : !description2
                  ? true
                  : false) && (
                  <FormErrorMessage>Description is required</FormErrorMessage>
                )}
              </FormControl>
              <br />
              <Grid templateColumns='repeat(1, 1fr)' gap={8}>
                <GridItem>
                  <Flex>
                    <FormLabel style={{ width: '50px' }}>Image</FormLabel>
                    <Input
                      style={{
                        width: '300px',
                        border: 'none',
                        textAlign: 'center',
                        height: '40px',
                      }}
                      id='file'
                      type='file'
                      onChange={handleFileChange}
                      multiple
                    />
                  </Flex>
                  <Box display='flex' flexWrap='wrap' gap={4}>
                    {imagesState.map((image, index) => (
                      <Box
                        key={index}
                        position='relative'
                        maxW='100px'
                        maxH='200px'
                        overflow='hidden'
                        onClick={() => handleImageClick(index)}
                        onMouseEnter={(event) =>
                          handleImageMouseEnter(index, event)
                        }
                        onMouseLeave={handleImageMouseLeave}
                      >
                        <Image
                          src={image.dataURL}
                          alt={`Selected Image ${index}`}
                          w='100%'
                          h='100%'
                          objectFit='cover'
                          _hover={{ cursor: 'pointer' }}
                        />
                        {isHovered === index && (
                          <>
                            <DeleteIcon
                              position='absolute'
                              top='5px'
                              color='black'
                              right='5px'
                              fontSize='15px'
                              variant='ghost'
                              onClick={(event) =>
                                handleDeleteClick_Add(index, event)
                              }
                              _hover={{ color: 'black' }}
                            />
                            <Text
                              position='absolute'
                              bottom='5px'
                              left='5px'
                              fontSize='10px'
                              color='white'
                            >
                              {image.fileName}
                            </Text>
                          </>
                        )}
                      </Box>
                    ))}
                    {isZoomed && (
                      <div className='modal-overlay' onClick={handleZoomClose}>
                        <Modal
                          isOpen={isZoomed}
                          onClose={handleZoomClose}
                          size='xl'
                          isCentered
                        >
                          <ModalOverlay />
                          <ModalContent>
                            <ModalBody>
                              <Box className='zoomed-image-container'>
                                <Image
                                  src={imagesState[zoomedIndex]?.dataURL}
                                  alt={`${zoomedIndex}`}
                                  w='100%' // Thiết lập kích thước modal sao cho đủ lớn
                                  h='100%'
                                  objectFit='contain'
                                />
                              </Box>
                            </ModalBody>
                          </ModalContent>
                        </Modal>
                      </div>
                    )}
                  </Box>
                  {error && <Text color='red'>{error}</Text>}
                </GridItem>
              </Grid>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={handleSaveAdd}>
                Save
              </Button>
              <Button
                onClick={() => (
                  setIsOpenAdd(false),
                  setFormData(defaultData),
                  setSearchQuery(''),
                  setSearchQueryAnti(''),
                  setSearchQueryHw(''),
                  setSearchQuerySw(''),
                  setMode('Application')
                )}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
      {toast ? (
        <ToastCustom
          title={'Some fields is empty'}
          description={'Please re-check the fields'}
          status='error'
        />
      ) : null}
    </>
  );
}

export default IssuePage;
