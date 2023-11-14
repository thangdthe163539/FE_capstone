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
  Grid,
  GridItem,
} from '@chakra-ui/react';
import {
  Alert,
  AlertIcon,
} from '@chakra-ui/react'

import Link from 'next/link';
import styles from '@/styles/pm.module.css';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { FaPlus } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const defaultData = {
  reportId: '',
  softwareId: '',
  type: '',
  description: '',
  startDate: '',
  endDate: '',
  status: '',
};

function IssuePage() {
  const router = useRouter();
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [formData, setFormData] = useState(defaultData);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryTb, setSearchQueryTb] = useState('');
  const [filteredAppData, setfilteredAppData] = useState([]);
  const [filteredAppAddData, setfilteredAppAddData] = useState([]);
  const [Apps, setApps] = useState([]);
  const [Issues, setIssues] = useState([]);
  const [isSuccess, setIsSuccess] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [appId, setAppId] = useState('');
  const notificationTimeout = 2000;

  const handleIssuerDetails = (appId) => {
    router.push(`issueDetailsManage?appId=${appId}`);
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchTbInputChange = (e) => {
    setSearchQueryTb(e.target.value);
  };

  useEffect(() => {
    const url = 'http://localhost:5001/api/Report/ReportsByType/issues';
    fetch(url, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        setIssues(data);
      })
      .catch(error => {
        console.error('Lỗi:', error);
      });
  }, []);


  useEffect(() => {
    const url = 'http://localhost:5001/api/v1/App/ListApps';
    fetch(url, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        setApps(data);
      })
      .catch(error => {
        console.error('Lỗi:', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const countIssue = (appId) => {
    const occurrences = Issues.filter(item => item.appId === appId);
    return occurrences.length;
  };


  //lọc
  const filteApp = () => {
    const query = searchQueryTb.toLowerCase();
    const filteredData = Apps.filter((item) => {
      const name = item.name.toLowerCase();
      const publisher = item.publisher.toLowerCase();
      const version = item.version.toLowerCase();
      const release = item.release.toLowerCase();
      const os = item.os.toLowerCase();
      const osversion = item.osversion.toLowerCase();
      return name.includes(query) || publisher.includes(query) || version.includes(query) || release.includes(query) || os.includes(query) || osversion.includes(query);
    });
    setfilteredAppData(filteredData);
  };


  useEffect(() => {
    filteApp();
  }, [searchQueryTb, Apps]);

  const filteAppAdd = () => {
    const query = searchQuery.toLowerCase();
    const filteredData = Apps.filter((item) => {
      const name = item.name.toLowerCase();
      const os = item.os.toLowerCase();
      const version = item.osversion.toLowerCase();
      return name.includes(query) || os.includes(query) || version.includes(query);
    });
    setfilteredAppAddData(filteredData);
  };

  useEffect(() => {
    filteAppAdd();
  }, [searchQuery, Apps]);
  //END

  const handleSaveAdd = () => {
    const url = 'http://localhost:5001/api/Report/CreateReport';

    const Id = parseInt(appId);
    const desc = document.getElementById('description').value;
    const title = document.getElementById('title').value;
    const endDate = document.getElementsByName('endDate')[0].value;
    const dateParts = endDate.split('-');
    let formattedDate = '';
    if (dateParts.length === 3) {
      formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    } else {
      console.error('Ngày không hợp lệ.');
    }
    console.log(appId);
    const data = {
      appId: Id,
      title: title,
      description: desc,
      type: 'issues',
      end_Date: formattedDate,
      status: 2
    };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (response.ok) {
          setIsSuccess("true");
          setIsOpenAdd(false);
        } else {
          setIsSuccess("false");
          setIsOpenAdd(false);
        }
      })
      .catch(error => {
        setIsSuccess("false");
        setIsOpenAdd(false);
        console.error('Lỗi:', error);
      });
  };

  useEffect(() => {
    if (isSuccess) {
      const hideNotification = setTimeout(() => {
        setIsSuccess('');
        window.location.reload();
      }, notificationTimeout);

      return () => {
        clearTimeout(hideNotification);
      };
    }
  }, [isSuccess]);
  return (
    <Box className={styles.bodybox}>
      <List>
        <ListItem className={styles.list}>
          <Link href='/adminpages/adminhome' className={styles.listitem}>
            Home
          </Link>
          <ArrowForwardIcon margin={1}></ArrowForwardIcon>Issues Management
          <Text className={styles.alert}>
            {isSuccess === 'true' && (
              <Alert status='success'>
                <AlertIcon />
                Your request successfully!
              </Alert>
            )}
            {isSuccess === 'false' && (
              <Alert status='error' style={{ width: '350px' }}>
                <AlertIcon />
                Error processing your request.
              </Alert>
            )}
          </Text>
        </ListItem>
        <ListItem className={styles.list}>
          <Flex>
            <Text fontSize='2xl'>Issues Management -  <Link href='/adminpages/issuehome' style={{ color: '#4d9ffe', textDecoration: 'none' }}>
              List Issues
            </Link></Text>
            <Spacer />
            <Input
              type='text'
              value={searchQueryTb}
              onChange={handleSearchTbInputChange}
              placeholder='Search'
              w={300}
              mr={1}
            />
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
            <Table
              variant='striped'
              colorScheme='gray'
              className={styles.cTable}
            >
              <TableCaption>
                Total {filteredAppData.reduce((total, app) => total + countIssue(app.appId), 0)} issues
              </TableCaption>
              <Thead>
                <Tr>
                  <Th className={styles.cTh}>No</Th>
                  <Th className={styles.cTh}>Application</Th>
                  <Th className={styles.cTh}>Release</Th>
                  <Th className={styles.cTh}>OS</Th>
                  <Th className={styles.cTh}>Version</Th>
                  <Th className={styles.cTh}>Publisher</Th>
                  <Th className={styles.cTh}>Status</Th>
                  <Th className={styles.cTh}>Quantity</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredAppData.map((app, index) => (
                  countIssue(app.appId) !== 0 && (
                    <Tr key={app.id}>
                      <Td>{index + 1}</Td>
                      <Td>
                        <Button color={'blue'} variant='link' onClick={() => handleIssuerDetails(app.appId)}>
                          {app.name.trim()}
                        </Button>
                      </Td>
                      <Td>{app.release.trim()}</Td>
                      <Td>{app.os.trim()}</Td>
                      <Td>{app.osversion.trim()}</Td>
                      <Td>{app.publisher.trim()}</Td>
                      <Td>Active</Td>
                      <Td>{countIssue(app.appId)}</Td>
                    </Tr>
                  )
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </ListItem>
      </List>
      <Modal
        isOpen={isOpenAdd}
        onClose={() => (setIsOpenAdd(false), setFormData(defaultData))}
        closeOnOverlayClick={false}
        size='lg'
      >
        <ModalOverlay />
        <ModalContent maxW="1100px">
          <ModalHeader>Create New Issue</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8}>
            <Grid templateColumns='repeat(3, 1fr)' gap={8}>
              <GridItem colSpan={1}>
                <Input
                  name='softwareID'
                  value={formData.softwareId}
                  onChange={handleInputChange}
                  display='none'
                />
                <Flex alignItems="center">
                  <FormLabel style={{ marginRight: '1rem' }}>Application</FormLabel>
                  <div style={{ position: 'relative', display: 'inline-block', backgroundColor: 'whitesmoke', width: '300px' }}>
                    <Input
                      type='text'
                      style={{ backgroundColor: 'whitesmoke, width: 270px' }}
                      value={searchQuery}
                      onChange={(e) => {
                        handleSearchInputChange(e);
                        setShowOptions(e.target.value !== '');
                      }}
                      placeholder='Name - Os - Version'
                      w={300}
                      mr={1}
                    />
                    {showOptions && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        width: '300px',
                        border: '2px solid whitesmoke',
                        background: '#fff',
                        zIndex: 1,
                        borderRadius: '5px'
                      }}>
                        {filteredAppAddData.map((app) => (
                          <div
                            key={app.appId}
                            style={{ padding: '8px', cursor: 'pointer' }}
                            onClick={() => {
                              setSearchQuery(`${app.name.trim()} - ${app.os.trim()} - ${app.osversion.trim()}`);
                              setAppId(app.appId);
                            }}
                          >
                            {app.name.trim()} - {app.os.trim()} - {app.osversion.trim()}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Flex>
              </GridItem>
              <GridItem colSpan={1}>
                <Flex alignItems="center">
                  <FormLabel>Title</FormLabel>
                  <Input id='title' placeholder='Title' style={{ backgroundColor: 'whitesmoke' }}
                  />
                </Flex>
              </GridItem>
              <GridItem colSpan={1}>
                <Flex alignItems="center">
                  <FormLabel>EndDate</FormLabel>
                  <Input
                    style={{ marginLeft: '-7px', backgroundColor: 'whitesmoke' }}
                    type="date"
                    name='endDate'
                    onChange={handleInputChange}
                  />
                </Flex>
              </GridItem>
            </Grid>
            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                id='description'
                placeholder='Description...'
                width='100%'
                minH={40}
              />
            </FormControl>
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

export default IssuePage;
