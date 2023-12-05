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
} from '@chakra-ui/react';

import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import Link from 'next/link';
import styles from '@/styles/pm.module.css';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';
import Pagination from '@/components/pagination';

function ReportPage() {
  const itemPerPage = 5;
  const [Apps, setApps] = useState([]);
  const [Asset, setAsset] = useState([]);
  const [Feedback, setFeedback] = useState([]);
  const [Issue, setIssue] = useState([]);
  const [Library, setLibrary] = useState([]);
  const [License, setLicense] = useState([]);
  const [Software, setSoftware] = useState([]);
  const [User, setUser] = useState([]);
  const [dynamicListAs, setDynamicListAs] = useState([]);
  const [dynamicListFb, setDynamicListFb] = useState([]);
  const [dynamicListIs, setDynamicListIs] = useState([]);
  const [dynamicListLib, setDynamicListLib] = useState([]);
  const [dynamicListLic, setDynamicListLic] = useState([]);
  const [dynamicListSw, setDynamicListSw] = useState([]);
  const [dynamicListUs, setDynamicListUs] = useState([]);
  const [dynamicList, setDynamicList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Apps ? Apps?.length : 0;
  const totalPagesAs = Asset ? Asset?.length : 0;
  const totalPagesFb = Feedback ? Feedback?.length : 0;
  const totalPagesIs = Issue ? Issue?.length : 0;
  const totalPagesLib = Library ? Library?.length : 0;
  const totalPagesLic = License ? License?.length : 0;
  const totalPagesSw = Software ? Software?.length : 0;
  const totalPagesUs = User ? User?.length : 0;

  useEffect(() => {
    if (Apps.length) {
      handleChangePage(1);
    } else {
      setDynamicList([])
    }
  }, [Apps]);

  useEffect(() => {
    if (Asset.length) {
      handleChangePageAs(1);
    }
  }, [Asset]);

  useEffect(() => {
    if (Feedback.length) {
      handleChangePageFb(1);
    }
  }, [Feedback]);

  useEffect(() => {
    if (Issue.length) {
      handleChangePageIs(1);
    }
  }, [Issue]);

  useEffect(() => {
    if (Library.length) {
      handleChangePageLib(1);
    }
  }, [Library]);

  useEffect(() => {
    if (License.length) {
      handleChangePageLic(1);
    }
  }, [License]);

  useEffect(() => {
    if (Software.length) {
      handleChangePageSw(1);
    }
  }, [Software]);

  useEffect(() => {
    if (User.length) {
      handleChangePageUs(1);
    }
  }, [User]);

  const handleChangePage = (page) => {
    setCurrentPage(page);
    let newList = [];
    for (let i = (page - 1) * itemPerPage; i < page * itemPerPage; i++) {
      if (Apps[i]) {
        newList.push(Apps[i]);
      }
    }
    setDynamicList(newList);
  };

  const handleChangePageAs = (page) => {
    setCurrentPage(page);
    let newList = [];
    for (let i = (page - 1) * itemPerPage; i < page * itemPerPage; i++) {
      if (Asset[i]) {
        newList.push(Asset[i]);
      }
    }
    setDynamicListAs(newList);
  };

  const handleChangePageFb = (page) => {
    setCurrentPage(page);
    let newList = [];
    for (let i = (page - 1) * itemPerPage; i < page * itemPerPage; i++) {
      if (Feedback[i]) {
        newList.push(Feedback[i]);
      }
    }
    setDynamicListFb(newList);
  };

  const handleChangePageIs = (page) => {
    setCurrentPage(page);
    let newList = [];
    for (let i = (page - 1) * itemPerPage; i < page * itemPerPage; i++) {
      if (Issue[i]) {
        newList.push(Issue[i]);
      }
    }
    setDynamicListIs(newList);
  };

  const handleChangePageLib = (page) => {
    setCurrentPage(page);
    let newList = [];
    for (let i = (page - 1) * itemPerPage; i < page * itemPerPage; i++) {
      if (Library[i]) {
        newList.push(Library[i]);
      }
    }
    setDynamicListLib(newList);
  };

  const handleChangePageLic = (page) => {
    setCurrentPage(page);
    let newList = [];
    for (let i = (page - 1) * itemPerPage; i < page * itemPerPage; i++) {
      if (License[i]) {
        newList.push(License[i]);
      }
    }
    setDynamicListLic(newList);
  };

  const handleChangePageSw = (page) => {
    setCurrentPage(page);
    let newList = [];
    for (let i = (page - 1) * itemPerPage; i < page * itemPerPage; i++) {
      if (Software[i]) {
        newList.push(Software[i]);
      }
    }
    setDynamicListSw(newList);
  };

  const handleChangePageUs = (page) => {
    setCurrentPage(page);
    let newList = [];
    for (let i = (page - 1) * itemPerPage; i < page * itemPerPage; i++) {
      if (User[i]) {
        newList.push(User[i]);
      }
    }
    setDynamicListUs(newList);
  };

  useEffect(() => {
    const url = 'http://localhost:5001/api/App/ListApps';
    fetch(url, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        const sortedData = data.sort((a, b) => {
          if (a.status === 1 && b.status !== 1) {
            return -1;
          } else if (a.status !== 1 && b.status === 1) {
            return 1;
          }
        });
        setApps(sortedData);
      })
      .catch((error) => {
        console.error('Lỗi:', error);
      });
  }, []);

  useEffect(() => {
    const url = 'http://localhost:5001/api/Asset/ListAssets';
    fetch(url, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        const sortedData = data.sort((a, b) => {
          if (a.status === 1 && b.status !== 1) {
            return -1;
          } else if (a.status !== 1 && b.status === 1) {
            return 1;
          }
        });
        setAsset(sortedData);
      })
      .catch((error) => {
        console.error('Lỗi:', error);
      });
  }, []);

  useEffect(() => {
    const url = 'http://localhost:5001/api/Report/ReportsByType/Feedback';
    fetch(url, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        const sortedData = data.sort((a, b) => {
          if (a.status === 1 && b.status !== 1) {
            return -1;
          } else if (a.status !== 1 && b.status === 1) {
            return 1;
          } else if (a.status === 1 && b.status === 1) {
            const dateA = new Date(a.start_Date.split('/').reverse().join('-'));
            const dateB = new Date(b.start_Date.split('/').reverse().join('-'));

            return dateA.getTime() - dateB.getTime();
          }
        });
        setFeedback(sortedData);
      })
      .catch((error) => {
        console.error('Lỗi:', error);
      });
  }, []);

  useEffect(() => {
    const url = 'http://localhost:5001/api/Report/ReportsByType/Issue';
    fetch(url, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        const sortedData = data.sort((a, b) => {
          if (a.status === 1 && b.status !== 1) {
            return -1;
          } else if (a.status !== 1 && b.status === 1) {
            return 1;
          } else if (a.status === 1 && b.status === 1) {
            const dateA = new Date(a.start_Date.split('/').reverse().join('-'));
            const dateB = new Date(b.start_Date.split('/').reverse().join('-'));

            return dateA.getTime() - dateB.getTime();
          }
        });
        setIssue(sortedData);
      })
      .catch((error) => {
        console.error('Lỗi:', error);
      });
  }, []);

  useEffect(() => {
    const url = 'http://localhost:5001/api/Library/ListLibraries';
    fetch(url, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        const sortedData = data.sort((a, b) => {
          if (a.status === 1 && b.status !== 1) {
            return -1;
          } else if (a.status !== 1 && b.status === 1) {
            return 1;
          }
        });
        setLibrary(sortedData);
      })
      .catch((error) => {
        console.error('Lỗi:', error);
      });
  }, []);

  useEffect(() => {
    const url = 'http://localhost:5001/api/License/ListLicenses';
    fetch(url, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        const sortedData = data.sort((a, b) => {
          if (a.status === 1 && b.status !== 1) {
            return -1;
          } else if (a.status !== 1 && b.status === 1) {
            return 1;
          }
        });
        setLicense(sortedData);
      })
      .catch((error) => {
        console.error('Lỗi:', error);
      });
  }, []);

  useEffect(() => {
    const url = 'http://localhost:5001/api/Software/ListSoftwares';
    fetch(url, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        const sortedData = data.sort((a, b) => {
          if (a.status === 1 && b.status !== 1) {
            return -1;
          } else if (a.status !== 1 && b.status === 1) {
            return 1;
          }
        });
        setSoftware(sortedData);
      })
      .catch((error) => {
        console.error('Lỗi:', error);
      });
  }, []);

  useEffect(() => {
    const url = 'http://localhost:5001/api/Account/ListAccount';
    fetch(url, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        const sortedData = data.sort((a, b) => {
          if (a.status === 1 && b.status !== 1) {
            return -1;
          } else if (a.status !== 1 && b.status === 1) {
            return 1;
          }
        });
        setUser(sortedData);
      })
      .catch((error) => {
        console.error('Lỗi:', error);
      });
  }, []);

  return (
    <Box className={styles.bodybox}>
      <List>
        <ListItem className={styles.list}>
          <Link href='/adminpages/adminhome' className={styles.listitem}>
            Home
          </Link>
          <ArrowForwardIcon margin={1}></ArrowForwardIcon>Report
        </ListItem>
        <ListItem className={styles.list}>
          <Text fontSize='2xl'>Report</Text>
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
              Application
            </Tab>
            <Tab
              className={styles.tab}
              _selected={{
                color: '#4d9ffe',
                borderBottom: '1px solid #4d9ffe',
              }}
            >
              Asset
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
              Library
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
              Software
            </Tab>
            <Tab
              className={styles.tab}
              _selected={{
                color: '#4d9ffe',
                borderBottom: '1px solid #4d9ffe',
              }}
            >
              User
            </Tab>
          </TabList>

          <TabPanels>

            <TabPanel>
              <ListItem className={styles.list}>
              <Flex marginBottom={5}>
                  <Text color={'blue.400'}>Active:</Text>
                  <Text style={{marginLeft: '5px'}}>{Apps.filter(feedback => feedback.status === 1).length}</Text>
                  <Text style={{marginLeft: '20px'}} color={'blue.400'}>Inactive:</Text>
                  <Text style={{marginLeft: '5px'}}>{Apps.filter(feedback => feedback.status === 2).length}</Text>
                  <Text style={{marginLeft: '20px'}} color={'blue.400'}>Locked:</Text>
                  <Text style={{marginLeft: '5px'}}>{Apps.filter(feedback => feedback.status === 3).length}</Text>
                </Flex>
                <TableContainer>
                  <Table
                    variant='striped'
                    colorScheme='gray'
                    className={styles.cTable}
                  >
                    <TableCaption className={styles.cTableCaption}>
                      <Flex alignItems={'center'} justifyContent={'space-between'}>
                        <Text>
                          Show {dynamicList.length}/{Apps.length} result(s)
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
                        <Th className={styles.cTh} width='5px'>
                          No
                        </Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Name</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Version</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Release</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Type</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Os</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>OsVersion</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Language</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Database</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {dynamicList.map((app, index) => (
                        <Tr key={app.appId}>
                          <Td style={{ width: '5px' }}>{index + 1}</Td>
                          <Td style={{ textAlign: 'center' }}>{app.name}</Td>
                          <Td style={{ textAlign: 'center' }}>{app.version}</Td>
                          <Td style={{ textAlign: 'center' }}>{app.release}</Td>
                          <Td style={{ textAlign: 'center' }}>{app.type}</Td>
                          <Td style={{ textAlign: 'center' }}>{app.os}</Td>
                          <Td style={{ textAlign: 'center' }}>{app.osversion}</Td>
                          <Td style={{ textAlign: 'center' }}>{app.language}</Td>
                          <Td style={{ textAlign: 'center' }}>{app.db}</Td>
                          <Td style={{ width: '10%', textAlign: 'center' }}>
                            {app.status === 1
                              ? 'Active'
                              : app.status === 2
                                ? 'Inactive'
                                : 'Locked'}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </ListItem>
            </TabPanel>

            <TabPanel>
              <ListItem className={styles.list}>
              <Flex marginBottom={5}>
                  <Text color={'blue.400'}>Active:</Text>
                  <Text style={{marginLeft: '5px'}}>{Asset.filter(feedback => feedback.status === 1).length}</Text>
                  <Text style={{marginLeft: '20px'}} color={'blue.400'}>Inactive:</Text>
                  <Text style={{marginLeft: '5px'}}>{Asset.filter(feedback => feedback.status === 2).length}</Text>
                  <Text style={{marginLeft: '20px'}} color={'blue.400'}>Locked:</Text>
                  <Text style={{marginLeft: '5px'}}>{Asset.filter(feedback => feedback.status === 3).length}</Text>
                </Flex>
                <TableContainer>
                  <Table
                    variant='striped'
                    colorScheme='gray'
                    className={styles.cTable}
                  >
                    <TableCaption className={styles.cTableCaption}>
                      <Flex alignItems={'center'} justifyContent={'space-between'}>
                        <Text>
                          Show {dynamicListAs.length}/{Asset.length} result(s)
                        </Text>{' '}
                        <Pagination
                          current={currentPage}
                          onChange={handleChangePageAs}
                          total={totalPagesAs}
                          pageSize={itemPerPage}
                        />
                      </Flex>
                    </TableCaption>
                    <Thead>
                      <Tr>
                        <Th className={styles.cTh} width='5px'>
                          No
                        </Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Name</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Cpu</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Ram</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Memory</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>IpAddress</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Bandwidth</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Model</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {dynamicListAs.map((item, index) => (
                        <Tr key={item.assetId}>
                          <Td style={{ width: '5px' }}>{index + 1}</Td>
                          <Td style={{ textAlign: 'center' }}>{item.name}</Td>
                          <Td style={{ textAlign: 'center' }}>{item.cpu}</Td>
                          <Td style={{ textAlign: 'center' }}>{item.ram}</Td>
                          <Td style={{ textAlign: 'center' }}>{item.memory}</Td>
                          <Td style={{ textAlign: 'center' }}>{item.ipAddress}</Td>
                          <Td style={{ textAlign: 'center' }}>{item.bandwidth}</Td>
                          <Td style={{ textAlign: 'center' }}>{item.model}</Td>
                          <Td style={{ width: '10%', textAlign: 'center' }}>
                            {item.status === 1
                              ? 'Active'
                              : item.status === 2
                                ? 'Inactive'
                                : 'Locked'}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </ListItem>
            </TabPanel>

            <TabPanel>
              <ListItem className={styles.list}>
                <Flex marginBottom={5}>
                  <Text color={'blue.400'}>Unsolve:</Text>
                  <Text style={{marginLeft: '5px'}}>{Feedback.filter(feedback => feedback.status === 1).length}</Text>
                  <Text style={{marginLeft: '20px'}} color={'blue.400'}>Solved:</Text>
                  <Text style={{marginLeft: '5px'}}>{Feedback.filter(feedback => feedback.status === 2).length}</Text>
                  <Text style={{marginLeft: '20px'}} color={'blue.400'}>Deleted:</Text>
                  <Text style={{marginLeft: '5px'}}>{Feedback.filter(feedback => feedback.status === 3).length}</Text>
                  <Text style={{marginLeft: '20px'}} color={'blue.400'}>Cancel:</Text>
                  <Text style={{marginLeft: '5px'}}>{Feedback.filter(feedback => feedback.status === 4).length}</Text>
                </Flex>
                <TableContainer>
                  <Table
                    variant='striped'
                    colorScheme='gray'
                    className={styles.cTable}
                  >
                    <TableCaption className={styles.cTableCaption}>
                      <Flex alignItems={'center'} justifyContent={'space-between'}>
                        <Text>
                          Show {dynamicListFb.length}/{Feedback.length} result(s)
                        </Text>{' '}
                        <Pagination
                          current={currentPage}
                          onChange={handleChangePageFb}
                          total={totalPagesFb}
                          pageSize={itemPerPage}
                        />
                      </Flex>
                    </TableCaption>
                    <Thead>
                      <Tr>
                        <Th className={styles.cTh} width='5px'>
                          No
                        </Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Title</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Application</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>CreateBy</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>StartDate</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Deadline</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {dynamicListFb.map((item, index) => (
                        <Tr key={item.reportId}>
                          <Td style={{ width: '5px' }}>{index + 1}</Td>
                          <Td style={{ textAlign: 'center' }}>{item.title}</Td>
                          <Td style={{ textAlign: 'center' }}>{
                            Apps.find((appItem) => appItem.appId === item.appId)
                              ?.name
                          }</Td>
                          <Td style={{ textAlign: 'center' }}>{item.emailSend}</Td>
                          <Td style={{ textAlign: 'center' }}>{item.start_Date}</Td>
                          <Td style={{ textAlign: 'center' }}>{item.end_Date}</Td>
                          <Td style={{ width: '10%', textAlign: 'center' }}>
                            {item.status === 1
                              ? 'Unsolve'
                              : item.status === 2
                                ? 'Solved'
                                : item.status === 3
                                  ? 'Deleted' : 'Cancel'}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </ListItem>
            </TabPanel>

            <TabPanel>
              <ListItem className={styles.list}>
              <Flex marginBottom={5}>
                  <Text color={'blue.400'}>Unsolve:</Text>
                  <Text style={{marginLeft: '5px'}}>{Issue.filter(feedback => feedback.status === 1).length}</Text>
                  <Text style={{marginLeft: '20px'}} color={'blue.400'}>Solved:</Text>
                  <Text style={{marginLeft: '5px'}}>{Issue.filter(feedback => feedback.status === 2).length}</Text>
                  <Text style={{marginLeft: '20px'}} color={'blue.400'}>Deleted:</Text>
                  <Text style={{marginLeft: '5px'}}>{Issue.filter(feedback => feedback.status === 3).length}</Text>
                  <Text style={{marginLeft: '20px'}} color={'blue.400'}>Cancel:</Text>
                  <Text style={{marginLeft: '5px'}}>{Issue.filter(feedback => feedback.status === 4).length}</Text>
                </Flex>
                <TableContainer>
                  <Table
                    variant='striped'
                    colorScheme='gray'
                    className={styles.cTable}
                  >
                    <TableCaption className={styles.cTableCaption}>
                      <Flex alignItems={'center'} justifyContent={'space-between'}>
                        <Text>
                          Show {dynamicListIs.length}/{Issue.length} result(s)
                        </Text>{' '}
                        <Pagination
                          current={currentPage}
                          onChange={handleChangePageIs}
                          total={totalPagesIs}
                          pageSize={itemPerPage}
                        />
                      </Flex>
                    </TableCaption>
                    <Thead>
                      <Tr>
                        <Th className={styles.cTh} width='5px'>
                          No
                        </Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Title</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Application</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>CreateBy</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>StartDate</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Deadline</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {dynamicListIs.map((item, index) => (
                        <Tr key={item.reportId}>
                          <Td style={{ width: '5px' }}>{index + 1}</Td>
                          <Td style={{ textAlign: 'center' }}>{item.title}</Td>
                          <Td style={{ textAlign: 'center' }}>{
                            Apps.find((appItem) => appItem.appId === item.appId)
                              ?.name
                          }</Td>
                          <Td style={{ textAlign: 'center' }}>{item.emailSend}</Td>
                          <Td style={{ textAlign: 'center' }}>{item.start_Date}</Td>
                          <Td style={{ textAlign: 'center' }}>{item.end_Date}</Td>
                          <Td style={{ width: '10%', textAlign: 'center' }}>
                            {item.status === 1
                              ? 'Unsolve'
                              : item.status === 2
                                ? 'Solved'
                                : item.status === 3
                                  ? 'Deleted' : 'Cancel'}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </ListItem>
            </TabPanel>

            <TabPanel>
              <ListItem className={styles.list}>
              <Flex marginBottom={5}>
                  <Text color={'blue.400'}>Closed source license:</Text>
                  <Text style={{marginLeft: '5px'}}>{Library.filter(feedback => feedback.status === 1).length}</Text>
                  <Text style={{marginLeft: '20px'}} color={'blue.400'}>Open source license:</Text>
                  <Text style={{marginLeft: '5px'}}>{Library.filter(feedback => feedback.status === 2).length}</Text>
                </Flex>
                <TableContainer>
                  <Table
                    variant='striped'
                    colorScheme='gray'
                    className={styles.cTable}
                  >
                    <TableCaption className={styles.cTableCaption}>
                      <Flex alignItems={'center'} justifyContent={'space-between'}>
                        <Text>
                          Show {dynamicListLib.length}/{Library.length} result(s)
                        </Text>{' '}
                        <Pagination
                          current={currentPage}
                          onChange={handleChangePageLib}
                          total={totalPagesLib}
                          pageSize={itemPerPage}
                        />
                      </Flex>
                    </TableCaption>
                    <Thead>
                      <Tr>
                        <Th className={styles.cTh} width='5px'>
                          No
                        </Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Name</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Application</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Publisher</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>LibraryKey</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>StartDate</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Time</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Type</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {dynamicListLib.map((item, index) => (
                        <Tr key={item.libraryId}>
                          <Td style={{ width: '5px' }}>{index + 1}</Td>
                          <Td style={{ textAlign: 'center' }}>{item.name}</Td>
                          <Td style={{ textAlign: 'center' }}>{
                            Apps.find((appItem) => appItem.appId === item.appId)
                              ?.name
                          }</Td>
                          <Td style={{ textAlign: 'center' }}>{item.publisher}</Td>
                          <Td style={{ textAlign: 'center' }}>{item.libraryKey}</Td>
                          <Td style={{ textAlign: 'center' }}>{item.start_Date}</Td>
                          <Td style={{ textAlign: 'center' }}>{item.time} months</Td>
                          <Td style={{ width: '10%', textAlign: 'center' }}>
                            {item.status === 1
                              ? 'Closed source license '
                              : item.status === 2
                                ? ' Open source license'
                                : 'Not Determined'}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </ListItem>
            </TabPanel>

            {/* license */}
            <TabPanel>
              <ListItem className={styles.list}>
              <Flex marginBottom={5}>
                  <Text color={'blue.400'}>Closed source license:</Text>
                  <Text style={{marginLeft: '5px'}}>{License.filter(feedback => feedback.status === 1).length}</Text>
                  <Text style={{marginLeft: '20px'}} color={'blue.400'}>Open source license:</Text>
                  <Text style={{marginLeft: '5px'}}>{License.filter(feedback => feedback.status === 2).length}</Text>
                </Flex>
                <TableContainer>
                  <Table
                    variant='striped'
                    colorScheme='gray'
                    className={styles.cTable}
                  >
                    <TableCaption className={styles.cTableCaption}>
                      <Flex alignItems={'center'} justifyContent={'space-between'}>
                        <Text>
                          Show {dynamicListLic.length}/{License.length} result(s)
                        </Text>{' '}
                        <Pagination
                          current={currentPage}
                          onChange={handleChangePageLic}
                          total={totalPagesLic}
                          pageSize={itemPerPage}
                        />
                      </Flex>
                    </TableCaption>
                    <Thead>
                      <Tr>
                        <Th className={styles.cTh} width='5px'>
                          No
                        </Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>LibraryKey</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>StartDate</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Time</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Type</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {dynamicListLic.map((item, index) => (
                        <Tr key={item.licenseId}>
                          <Td style={{ width: '5px' }}>{index + 1}</Td>
                          <Td style={{ textAlign: 'center' }}>{item.licenseKey}</Td>
                          <Td style={{ textAlign: 'center' }}>{item.start_Date}</Td>
                          <Td style={{ textAlign: 'center' }}>{item.time} months</Td>
                          <Td style={{ width: '10%', textAlign: 'center' }}>
                            {item.status === 1
                              ? 'Closed source license '
                              : item.status === 2
                                ? ' Open source license'
                                : 'Not Determined'}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </ListItem>
            </TabPanel>

            <TabPanel>
              <ListItem className={styles.list}>
              <Flex marginBottom={5}>
                  <Text color={'blue.400'}>Active:</Text>
                  <Text style={{marginLeft: '5px'}}>{Software.filter(feedback => feedback.status === 1).length}</Text>
                  <Text style={{marginLeft: '20px'}} color={'blue.400'}>Inactive:</Text>
                  <Text style={{marginLeft: '5px'}}>{Software.filter(feedback => feedback.status === 2).length}</Text>
                  <Text style={{marginLeft: '20px'}} color={'blue.400'}>Locked:</Text>
                  <Text style={{marginLeft: '5px'}}>{Software.filter(feedback => feedback.status === 3).length}</Text>
                </Flex>
                <TableContainer>
                  <Table
                    variant='striped'
                    colorScheme='gray'
                    className={styles.cTable}
                  >
                    <TableCaption className={styles.cTableCaption}>
                      <Flex alignItems={'center'} justifyContent={'space-between'}>
                        <Text>
                          Show {dynamicListSw.length}/{Software.length} result(s)
                        </Text>{' '}
                        <Pagination
                          current={currentPage}
                          onChange={handleChangePageSw}
                          total={totalPagesSw}
                          pageSize={itemPerPage}
                        />
                      </Flex>
                    </TableCaption>
                    <Thead>
                      <Tr>
                        <Th className={styles.cTh} width='5px'>
                          No
                        </Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Name</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Publisher</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Version</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Release</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Type</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Os</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {dynamicListSw.map((item, index) => (
                        <Tr key={item.appId}>
                          <Td style={{ width: '5px' }}>{index + 1}</Td>
                          <Td style={{ textAlign: 'center' }}>{item.name}</Td>
                          <Td style={{ textAlign: 'center' }}>{item.publisher}</Td>
                          <Td style={{ textAlign: 'center' }}>{item.version}</Td>
                          <Td style={{ textAlign: 'center' }}>{item.release}</Td>
                          <Td style={{ textAlign: 'center' }}>{item.type}</Td>
                          <Td style={{ textAlign: 'center' }}>{item.os}</Td>
                          <Td style={{ width: '10%', textAlign: 'center' }}>
                            {item.status === 1
                              ? 'Active'
                              : item.status === 2
                                ? 'Inactive'
                                : 'Locked'}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </ListItem>
            </TabPanel>

            <TabPanel>
              <ListItem className={styles.list}>
              <Flex marginBottom={5}>
                  <Text color={'blue.400'}>Active:</Text>
                  <Text style={{marginLeft: '5px'}}>{User.filter(feedback => feedback.status === 1).length}</Text>
                  <Text style={{marginLeft: '20px'}} color={'blue.400'}>Inactive:</Text>
                  <Text style={{marginLeft: '5px'}}>{User.filter(feedback => feedback.status === 2).length}</Text>
                  <Text style={{marginLeft: '20px'}} color={'blue.400'}>Locked:</Text>
                  <Text style={{marginLeft: '5px'}}>{User.filter(feedback => feedback.status === 3).length}</Text>
                </Flex>
                <TableContainer>
                  <Table
                    variant='striped'
                    colorScheme='gray'
                    className={styles.cTable}
                  >
                    <TableCaption className={styles.cTableCaption}>
                      <Flex alignItems={'center'} justifyContent={'space-between'}>
                        <Text>
                          Show {dynamicListUs.length}/{User.length} result(s)
                        </Text>{' '}
                        <Pagination
                          current={currentPage}
                          onChange={handleChangePageUs}
                          total={totalPagesUs}
                          pageSize={itemPerPage}
                        />
                      </Flex>
                    </TableCaption>
                    <Thead>
                      <Tr>
                        <Th className={styles.cTh} width='5px'>
                          No
                        </Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Name</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Email</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>RoleName</Th>
                        <Th style={{ textAlign: 'center' }} className={styles.cTh}>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {dynamicListUs.map((item, index) => (
                        <Tr key={item.appId}>
                          <Td style={{ width: '5px' }}>{index + 1}</Td>
                          <Td style={{ textAlign: 'center' }}>{item.name}</Td>
                          <Td style={{ textAlign: 'center' }}>{item.email}</Td>
                          <Td style={{ textAlign: 'center' }}>{item.roleName}</Td>
                          <Td style={{ width: '10%', textAlign: 'center' }}>
                            {item.status === 1
                              ? 'Active'
                              : item.status === 2
                                ? 'Inactive'
                                : 'Locked'}
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
    </Box>
  );
}
export default ReportPage;
