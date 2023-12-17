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
  FormErrorMessage,
  Center,
  InputLeftAddon,
  Textarea,
  InputGroup,
  Stack,
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
  Image,
} from '@chakra-ui/react';
import { Alert, AlertIcon } from '@chakra-ui/react';
import axios from 'axios';
import Link from 'next/link';
import styles from '@/styles/pm.module.css';
import { ArrowForwardIcon, DeleteIcon, RepeatIcon } from '@chakra-ui/icons';
import { FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import React from 'react';
import { BACK_END_PORT } from '../../../env';
import Pagination from '@/components/pagination';
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
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [formData, setFormData] = useState(defaultData);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQuerySw, setSearchQuerySw] = useState('');
  const [searchQueryAnti, setSearchQueryAnti] = useState('');
  const [searchQueryHw, setSearchQueryHw] = useState('');
  const [searchQueryTb, setSearchQueryTb] = useState('');
  const [filteredAppData, setFilteredAppData] = useState([]);
  const [filteredHwData, setFilteredHwData] = useState([]);
  const [filteredSwData, setFilteredSwData] = useState([]);
  const [filteredAntiData, setFilteredAntiData] = useState([]);
  const [filteredIssueData, setFilteredIssueData] = useState([]);
  const [Issues, setIssues] = useState([]);
  const [Apps, setApps] = useState([]);
  const [Hardware, setHardware] = useState([]);
  const [Software, setSoftware] = useState([]);
  const [isSuccess, setIsSuccess] = useState('');
  const notificationTimeout = 2000;
  const [showOptions, setShowOptions] = useState(false);
  const [showOptionsSw, setShowOptionsSw] = useState(false);
  const [showOptionsHw, setShowOptionsHw] = useState(false);
  const [showOptionsAnti, setShowOptionsAnti] = useState(false);
  const [appId, setAppId] = useState([]);
  const [detail, setDetail] = useState(null);
  const [selectedOptionActive, setSelectedOptionActive] = useState('');
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [os, setOs] = useState('');
  const [osversion, setOsversion] = useState('');
  const [imagesState, setImages] = useState([]);
  const [error, setError] = useState('');
  const [image, setImage] = useState([]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomedIndex, setZoomedIndex] = useState(null);
  const [isHovered, setIsHovered] = useState(null);
  const [mode, setMode] = useState('Application');
  const allowedExtensions = ['jpg', 'png'];

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
        if (accountDataDecode.roleId !== 1) {
          router.push('/page405');
        }
        setAccount(accountDataDecode);
      }
    }
  }, []);

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

  const handleFileChangeU = (e) => {
    const files = e.target.files;

    if (files) {
      const newImages = Array.from(files).map((file) => {
        const extension = file.name.split('.').pop().toLowerCase();

        if (allowedExtensions.includes(extension)) {
          const reader = new FileReader();

          reader.onload = () => {
            setImage((prevImages) => [
              ...(Array.isArray(prevImages) ? prevImages : []), // Kiểm tra và sử dụng prevImages nếu là mảng, nếu không sử dụng mảng trống
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

      // Kiểm tra và sử dụng prevImages nếu là mảng, nếu không sử dụng mảng trống
      setImage((prevImages) => [
        ...(Array.isArray(prevImages) ? prevImages : []).filter(
          (img) => img && img.dataURL,
        ),
        ...newImages.filter(Boolean),
      ]);
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

  const handleRemoveImageU = (index) => {
    setImage((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });
    setError('');
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleSearchInputChangeHw = (e) => {
    setSearchQueryHw(e.target.value);
  };
  const handleSearchInputChangeSw = (e) => {
    setSearchQuerySw(e.target.value);
  };
  const handleSearchInputChangeAnti = (e) => {
    setSearchQueryAnti(e.target.value);
  };

  const handleSearchTbInputChange = (e) => {
    setSearchQueryTb(e.target.value);
  };

  //cut text descriptions
  const trimTextToMaxWidth = (text, maxWidth) => {
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

  const [deadline, setDeadline] = useState();

  const handleDeadline = (e) => {
    const { value } = e.target;
    setDeadline(value);
    setFormData({ ...formData, endDate: value });
    setIsFirst({ ...isFirst, endDate: false });
  };

  const handleInputChange = (e) => {
    console.log(isFirst);
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

  //pagination

  const itemPerPage = 5;
  const [dynamicList, setDynamicList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  // filteredIssueData;
  const handleChangePage = (page) => {
    setCurrentPage(page);
    let newList = [];
    for (let i = (page - 1) * itemPerPage; i < page * itemPerPage; i++) {
      if (filteredIssueData[i]) {
        newList.push(filteredIssueData[i]);
      }
    }
    setDynamicList(newList);
  };
  const totalPages = filteredIssueData ? filteredIssueData?.length : 0;

  //lọc
  const filteIssue = () => {
    handleSearchInputChangeHw;
    const query = searchQueryTb.toLowerCase();
    const filteredData = Issues.filter((item) => {
      const title = item.title.toLowerCase();
      const appName = Apps.find(
        (appItem) => appItem.appId === item.appId,
      )?.name.toLowerCase();
      return title.includes(query) || appName.includes(query);
    });
    setFilteredIssueData(filteredData);
  };

  useEffect(() => {
    filteIssue();
  }, [searchQueryTb, Issues]);

  useEffect(() => {
    if (filteredIssueData.length) {
      handleChangePage(1);
    } else {
      setDynamicList([]);
    }
  }, [filteredIssueData]);

  const filterApps = () => {
    const query = searchQuery.toLowerCase();

    const filteredData = Apps.filter((item) => {
      const name = item.name.toLowerCase();
      const os = item.os.toLowerCase();
      const version = item.osversion.toLowerCase();

      // Check if the query matches either name or OS
      return (
        name.includes(query) || os.includes(query) || version.includes(query)
      );
    });

    setFilteredAppData(filteredData);
  };
  useEffect(() => {
    filterApps();
  }, [searchQuery]);
  const filterHardware = () => {
    const query = searchQueryHw.toLowerCase();

    const filteredData = Hardware.filter((item) => {
      const model = item.model.toLowerCase();
      const cpu = item.cpu.toLowerCase();
      const gpu = item.gpu.toLowerCase();

      // Check if the query matches either name or OS
      return (
        model.includes(query) || cpu.includes(query) || gpu.includes(query)
      );
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
      const name = item.name.toLowerCase();
      const os = item.os.toLowerCase();
      const version = item.version.toLowerCase();

      // Check if the query matches either name or OS
      return (
        name.includes(query) || os.includes(query) || version.includes(query)
      );
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
      const name = item.name.toLowerCase();
      const os = item.os.toLowerCase();
      const version = item.version.toLowerCase();

      // Check if the query matches either name or OS
      return (
        name.includes(query) || os.includes(query) || version.includes(query)
      );
    });

    setFilteredAntiData(filteredData);
  };
  useEffect(() => {
    filterAntivirus();
  }, [searchQueryAnti]);

  const handleSelectAppName = (app) => {
    setSearchQuery(`${app.name}-${app.os}-${app.osversion}`);
    setAppId([app.appId]);
    setShowOptions(false);
    setFormData((prevFormData) => ({
      ...prevFormData,
      title: 'Application-' + app.name,
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
      title: 'Application-' + item.os + '-' + item.osversion,
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
        title: 'Hardware-' + item.model,
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
      }

      // Remove duplicate appIds (if any)
      const uniqueAppIds = [...new Set(appIds)];

      // Set the state with the unique appIds
      setAppId(uniqueAppIds);
      setShowOptionsHw(false);
      setFormData((prevFormData) => ({
        ...prevFormData,
        title: 'Hardware-' + item.cpu,
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
        title: 'Hardware-' + item.gpu,
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
        title: 'Software-' + item.name + '-' + item.version,
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
        title: 'Antivirus-' + item.name + '-' + item.version,
      }));
    } catch (error) {
      console.log('Error in handleSelectAntiName:', error);
      // Handle error if needed
    }
  };
  console.log('4:' + appId);

  //end

  //detail
  const setDetails = (item) => {
    setDetail(item);
  };

  const handleDetail = () => {
    setIsOpenDetail(true);
  };

  const uniqueStatuses = [...new Set(Issues.map((st) => st.status))];

  const sortedIssue = uniqueStatuses.sort((a, b) =>
    a === detail?.status ? -1 : b === detail?.status ? 1 : 0,
  );

  const defaultStatuses = [1, 2, 3, 4];

  const getStatusLabel = (status) => {
    switch (status) {
      case 1:
        return 'Unsolve';
      case 2:
        return 'Solved';
      case 3:
        return 'Deleted';
      case 4:
        return 'Cancel';
      default:
        return '';
    }
  };

  const selectedLabels = sortedIssue.map((status) => getStatusLabel(status));

  const defaultOptions = defaultStatuses
    .filter((status) => !selectedLabels.includes(getStatusLabel(status)))
    .map((status) => (
      <option key={status} value={status}>
        {getStatusLabel(status)}
      </option>
    ));

  const convertToISODate = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };
  //End

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

  useEffect(() => {
    if (detail?.reportId) {
      const url = `http://localhost:5001/api/Image/list_Images_by_Report/${detail.reportId}`;

      fetch(url, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((data) => {
          setImage(data);
        })
        .catch((error) => {
          console.error('Lỗi:', error);
        });
    }
  }, [detail?.reportId]);

  const fetchDataAndUpdateState = () => {
    const url = 'http://localhost:5001/api/Report/ReportsByType/Issue';
    fetch(url, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          const filteredData = data.filter((item) => item.status === 1);
          setIssues(filteredData);
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

  const handleDeleteClick = (index, event) => {
    event.stopPropagation(); // Ngăn chặn sự kiện lan toả lên các phần tử cha
    handleRemoveImageU(index);
  };

  const handleDeleteClick_Add = (index, event) => {
    event.stopPropagation(); // Ngăn chặn sự kiện lan toả lên các phần tử cha
    handleRemoveImage(index);
  };

  const toggleMode = (e) => {
    setMode(e.target.value);
    console.log(mode);
  };

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

  useEffect(() => {
    if (detail) {
      setIsFirst({
        title: true,
        description: true,
        endDate: true,
        searchQuerySw: true,
        searchQueryAnti: true,
        searchQueryHw: true,
        searchQueryTb: true,
        searchQuery: true,
      });
      setTitle(detail?.title?.trim());
      setFormData({ ...formData, endDate: convertToISODate(detail?.end_Date) });
      setDescription(detail?.description?.trim());
    }
  }, [detail]);

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

  const handleUpdate = async () => {
    const url = `http://localhost:5001/api/Report/UpdateReport/${detail.reportId}`;
    const endDate = document.getElementsByName('endDate')[0].value;
    const accId = account?.accId;
    const dateParts = endDate.split('-');

    if (!endDate || !title || !description) {
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

    let formattedDate = '';
    if (dateParts.length === 3) {
      formattedDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
    } else {
      console.error('Ngày không hợp lệ.');
    }

    const formData = new FormData();
    formData.append('AppId', detail.appId);
    formData.append('UpdaterID', accId);
    formData.append(
      'Title',
      title.trim() === '' ? detail.title.trim() : title.trim(),
    );
    formData.append(
      'Description',
      description.trim() === ''
        ? detail.description.trim()
        : description.trim(),
    );
    formData.append('Type', 'Issue');
    formData.append('Start_Date', formattedDate);
    formData.append('End_Date', formattedDate);
    formData.append(
      'Status',
      selectedOptionActive === '' ? detail.status : selectedOptionActive,
    );

    if (Array.isArray(image) && image.length !== 0) {
      const fileObjects = await Promise.all(
        image.map(async (image) => {
          // Tạo một Blob từ dataURL
          if (image.dataURL) {
            const blob = dataURLtoBlob(image.dataURL);
            return new File([blob], image.fileName, { type: blob.type });
          } else {
            // Giữ nguyên ảnh khi dataURL không xác định
            const fullImagePath = `/images/${image.image1}`;
            const blob = await fetch(fullImagePath).then((res) => res.blob());
            return new File([blob], image.fileName, { type: blob.type });
          }
        }),
      );
      fileObjects.forEach((file, index) => {
        formData.append(`Images`, file);
      });
    } else {
      formData.append(`Images`, ' ');
    }

    try {
      const response = await axios.put(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setIsSuccess('true');
      setIsOpenDetail(false);
    } catch (error) {
      setIsSuccess('false');
      setIsOpenDetail(false);
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
              {isSuccess === 'true' ? (
                <ToastCustom
                  title={'Your request successfully!'}
                  description={''}
                  status={'success'}
                />
              ) : null}
              {isSuccess === 'false' ? (
                <ToastCustom
                  title={'Error processing your request.'}
                  description={''}
                  status={'error'}
                />
              ) : null}
            </Text>
          </ListItem>
          <ListItem className={styles.list}>
            <Flex>
              <Text fontSize='2xl'>
                Issue management -{' '}
                <Link
                  href='/adminpages/issueManager'
                  style={{ color: '#4d9ffe', textDecoration: 'none' }}
                >
                  List all issue
                </Link>
              </Text>
              <Spacer />
              <InputGroup style={{ paddingTop: '', width: '35%' }}>
                <InputLeftAddon
                  pointerEvents='none'
                  children='Title / Application'
                />
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
                  Open issue
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
                      Show {dynamicList.length}/{filteredIssueData.length}{' '}
                      result(s)
                    </Text>{' '}
                    <Pagination
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
                    <Th className={styles.cTh}>Title</Th>
                    <Th style={{ textAlign: 'left' }} className={styles.cTh}>
                      Description
                    </Th>
                    <Th className={styles.cTh}>Application</Th>
                    <Th className={styles.cTh}>Start Date</Th>
                    <Th className={styles.cTh}>Deadline</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {dynamicList?.map((issue, index) => (
                    <Tr key={issue.id}>
                      <Td style={{ width: '5%' }}>{index + 1}</Td>
                      <Td>
                        <Button
                          color={'blue'}
                          variant='link'
                          onClick={() => {
                            handleDetail();
                            setDetails(issue);
                          }}
                        >
                          {issue.title}
                        </Button>
                      </Td>
                      <Td
                        style={{ width: '45%' }}
                        onClick={() => {
                          handleDetail();
                          setDetails(issue);
                        }}
                      >
                        {trimTextToMaxWidth(issue.description.trim(), 400)}
                      </Td>
                      <Td>
                        {
                          Apps.find((appItem) => appItem.appId === issue.appId)
                            ?.name
                        }
                      </Td>
                      <Td style={{ width: '10%' }}>{issue.start_Date}</Td>
                      <Td style={{ width: '7%' }}> {issue.end_Date}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </ListItem>
        </List>
        <Modal
          isOpen={isOpenDetail}
          onClose={() => setIsOpenDetail(false)}
          closeOnOverlayClick={false}
          size='lg'
        >
          <ModalOverlay />
          <ModalContent maxW='1100px'>
            <ModalHeader>Update issue</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={8}>
              <Grid
                style={{ marginTop: '5px' }}
                templateColumns='repeat(3, 1fr)'
                gap={4}
              >
                <GridItem colSpan={1}>
                  <Flex alignItems='center'>
                    <FormLabel>Status</FormLabel>
                    <Select
                      style={{ backgroundColor: 'white' }}
                      value={selectedOptionActive}
                      onChange={(e) => {
                        setSelectedOptionActive(e.target.value);
                      }}
                    >
                      {sortedIssue.map((status) => (
                        <option key={status} value={status}>
                          {status === 1
                            ? 'Unsolve'
                            : status === 2
                            ? 'Solved'
                            : status === 3
                            ? 'Deleted'
                            : status === 4
                            ? 'Cancel'
                            : 'Unknow'}
                        </option>
                      ))}
                      {defaultOptions}
                    </Select>
                  </Flex>
                </GridItem>
                <GridItem colSpan={1}>
                  <FormControl
                    isRequired
                    isInvalid={isFirst?.title ? false : !title ? true : false}
                  >
                    <Flex alignItems='center'>
                      <FormLabel>Title</FormLabel>
                      <Stack gap={0}>
                        <Input
                          id='title'
                          style={{ backgroundColor: 'white' }}
                          defaultValue={detail?.title.trim()}
                          // value={title}
                          onChange={(e) => {
                            setTitle(e.target.value);
                            setIsFirst({ ...isFirst, title: false });
                          }}
                        />
                        {(isFirst?.title ? false : !title ? true : false) && (
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
                    isRequired
                    isInvalid={
                      isFirst?.endDate
                        ? false
                        : !formData?.endDate
                        ? true
                        : false
                    }
                  >
                    <Flex alignItems='center'>
                      <FormLabel>Deadline</FormLabel>
                      <Stack gap={0}>
                        <Input
                          style={{
                            marginLeft: '-7px',
                            backgroundColor: 'white',
                          }}
                          type='date'
                          name='endDate'
                          defaultValue={
                            detail ? convertToISODate(detail.end_Date) : ''
                          }
                          onChange={handleInputChange}
                        />
                        {(isFirst?.endDate
                          ? false
                          : !formData?.endDate
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
                isRequired
                isInvalid={
                  isFirst?.description ? false : !description ? true : false
                }
              >
                <FormLabel>Description</FormLabel>
                <Stack>
                  <Textarea
                    id='description'
                    defaultValue={detail?.description.trim()}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setIsFirst({ ...isFirst, description: false });
                    }}
                    width='100%'
                    minH={40}
                  />
                  {(isFirst?.description
                    ? false
                    : !description
                    ? true
                    : false) && (
                    <FormErrorMessage>Description is required</FormErrorMessage>
                  )}
                </Stack>
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
                      onChange={handleFileChangeU}
                      multiple
                    />
                  </Flex>
                  {Array.isArray(image) && image.length !== 0 && (
                    <Box display='flex' flexWrap='wrap' gap={4}>
                      {image.map((image, index) => (
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
                            src={image.dataURL || `/images/${image.image1}`}
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
                                  handleDeleteClick(index, event)
                                }
                                _hover={{ color: 'black ' }}
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
                        <div
                          className='modal-overlay'
                          onClick={handleZoomClose}
                        >
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
                                    src={
                                      image[zoomedIndex]?.dataURL ||
                                      `/images/${image[zoomedIndex]?.image1}`
                                    }
                                    alt={`${zoomedIndex}`}
                                  />
                                </Box>
                              </ModalBody>
                            </ModalContent>
                          </Modal>
                        </div>
                      )}
                    </Box>
                  )}
                  {error && <Text color='red'>{error}</Text>}
                </GridItem>
              </Grid>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={handleUpdate}>
                Save
              </Button>
              <Button
                onClick={() => (
                  setIsOpenDetail(false), setFormData(defaultData)
                )}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

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
                  <Flex alignItems=''>
                    <Select value={mode} onChange={toggleMode} width='140px'>
                      <option value='Application'>Application</option>
                      <option value='Hardware'>Hardware</option>
                      <option value='Software'>Software</option>
                      <option value='Antivirus'>Antivirus</option>
                    </Select>
                    <div
                      style={{
                        position: 'relative',
                        display: 'inline-block',
                        backgroundColor: 'white',
                        width: '300px',
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
                            w={300}
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
                            <div
                              style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                width: '270px',
                                border: '2px solid whitesmoke',
                                background: '#fff',
                                zIndex: 1,
                                borderRadius: '5px',
                              }}
                            >
                              {filteredAppData.map((app) => (
                                <Box
                                  key={app.appId}
                                  style={{ padding: '8px', cursor: 'pointer' }}
                                >
                                  <Flex>
                                    <Text
                                      className={styles.listitem}
                                      onClick={() => handleSelectAppName(app)}
                                    >
                                      {app.name.trim()}
                                    </Text>
                                    <Spacer />
                                    <Text
                                      className={styles.listitem}
                                      onClick={() => handleSelectAppOs(app)}
                                    >
                                      {app.os.trim()} - {app.osversion.trim()}
                                    </Text>
                                  </Flex>
                                </Box>
                              ))}
                            </div>
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
                            w={300}
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
                            <div
                              style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                width: '600px',
                                border: '2px solid whitesmoke',
                                background: '#fff',
                                zIndex: 1,
                                borderRadius: '5px',
                              }}
                            >
                              {filteredHwData.map((item) => (
                                <Box
                                  key={item.assetId}
                                  style={{ padding: '8px', cursor: 'pointer' }}
                                >
                                  <Flex>
                                    <Text
                                      className={styles.listitem}
                                      onClick={() => handleSelectHwModel(item)}
                                    >
                                      {item.model.trim()}
                                    </Text>
                                    <Spacer />
                                    <Text
                                      className={styles.listitem}
                                      onClick={() => handleSelectHwCPU(item)}
                                    >
                                      {item.cpu.trim()}
                                    </Text>
                                    <Spacer />
                                    <Text
                                      className={styles.listitem}
                                      onClick={() => handleSelectHwGPU(item)}
                                    >
                                      {item.gpu.trim()}
                                    </Text>
                                  </Flex>
                                </Box>
                              ))}
                            </div>
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
                            <div
                              style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                width: '300px',
                                border: '2px solid whitesmoke',
                                background: '#fff',
                                zIndex: 1,
                                borderRadius: '5px',
                              }}
                            >
                              {filteredSwData.map((item) => (
                                <Box
                                  key={item.softwareId}
                                  style={{ padding: '8px', cursor: 'pointer' }}
                                >
                                  <Text
                                    className={styles.listitem}
                                    onClick={() => handleSelectSwName(item)}
                                  >
                                    {item.name.trim()} - {item.version.trim()} -{' '}
                                    {item.os.trim()}
                                  </Text>
                                </Box>
                              ))}
                            </div>
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
                            <div
                              style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                width: '300px',
                                border: '2px solid whitesmoke',
                                background: '#fff',
                                zIndex: 1,
                                borderRadius: '5px',
                              }}
                            >
                              {filteredAntiData.map((item) => (
                                <Box
                                  key={item.softwareId}
                                  style={{ padding: '8px', cursor: 'pointer' }}
                                >
                                  <Text
                                    className={styles.listitem}
                                    onClick={() => handleSelectAntiName(item)}
                                  >
                                    {item.name.trim()} - {item.version.trim()} -{' '}
                                    {item.os.trim()}
                                  </Text>
                                </Box>
                              ))}
                            </div>
                          )}
                        </FormControl>
                      )}
                    </div>
                  </Flex>
                </GridItem>
                <GridItem colSpan={1}>
                  <FormControl
                    isInvalid={
                      isFirst?.title ? false : !formData.title ? true : false
                    }
                    isRequired
                  >
                    <Flex alignItems=''>
                      <FormLabel>Title</FormLabel>
                      <Stack alignItems={'start'} gap={0}>
                        <Input
                          placeholder='Title'
                          name='title'
                          value={formData.title}
                          onChange={handleInputChange}
                          style={{ backgroundColor: 'white' }}
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
                    <Flex alignItems='' justifyContent={'space-evenly'}>
                      <FormLabel>Deadline</FormLabel>
                      <Stack gap={0}>
                        <Input
                          style={{
                            marginLeft: '-7px',
                            backgroundColor: 'white',
                          }}
                          type='date'
                          name='endDate'
                          value={deadline}
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
