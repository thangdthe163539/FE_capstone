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
  Center,
  InputLeftAddon,
  Spacer,
  InputGroup,
} from '@chakra-ui/react';
import { Input, Button } from '@chakra-ui/react';
import Link from 'next/link';
import styles from '@/styles/pm.module.css';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Pagination from '@/components/pagination';

function FeedbackPage() {
  const router = useRouter();
  const [searchQueryTb, setSearchQueryTb] = useState('');
  const [filteredAppData, setfilteredAppData] = useState([]);
  const [dynamicFilteredAppData, setDynamicFilteredAppData] = useState([]);
  const [Apps, setApps] = useState([]);
  const [Issues, setIssues] = useState([]);

  const notificationTimeout = 2000;

  useEffect(() => {
    // Access localStorage on the client side
    const storedAccount = localStorage.getItem('account');
    if (storedAccount) {
      try {
        const accountDataDecode = JSON.parse(storedAccount);
        if (!accountDataDecode) {
          // router.push('/page405');
        } else {
          if (accountDataDecode.roleId !== 1 || accountDataDecode.status == 3) {
            router.push('/page405');
          } else if (accountDataDecode.status == 2) {
            router.push('/ViewApplication');
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

  useEffect(() => {
    if (dynamicFilteredAppData.length) {
      handleChangePage(1);
    } else {
      setDynamicList([]);
    }
  }, [dynamicFilteredAppData]);

  const handleIssuerDetails = (appId) => {
    const encodedAppId = encodeURIComponent(appId);
    const randomParameter = Math.random().toString(36).substring(2);
    const url = `feedbackDetails?appId=${encodedAppId}&r=${randomParameter}`;
    router.push(url);
  };

  const handleSearchTbInputChange = (e) => {
    setSearchQueryTb(e.target.value);
  };

  useEffect(() => {
    const url = 'http://localhost:5001/api/Report/ReportsByType/Feedback';
    fetch(url, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        setIssues(data);
      })
      .catch((error) => {
        setIssues([]);
        console.error('Lỗi:', error);
      });
  }, []);

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

  const countIssue = (appId) => {
    if (Issues.length > 0) {
      const occurrences = Issues.filter((item) => item.appId === appId);
      return occurrences.length;
    } else {
      return 0;
    }
  };

  //lọc
  const filteApp = () => {
    const query = searchQueryTb.toLowerCase();
    const filteredData = Apps.filter((item) => {
      const name = item.name.toLowerCase();
      return name.includes(query);
    });
    setfilteredAppData(
      filteredData.filter((item) => countIssue(item.appId) !== 0),
    );
    setDynamicFilteredAppData(
      filteredData.filter((item) => countIssue(item.appId) !== 0),
    );
  };

  useEffect(() => {
    filteApp();
  }, [searchQueryTb, Apps, Issues]);

  return (
    <Box className={styles.bodybox}>
      <List>
        <ListItem className={styles.list}>
          <Link href='/adminpages/adminhome' className={styles.listitem}>
            Home
          </Link>
          <ArrowForwardIcon margin={1}></ArrowForwardIcon>Feedback management
        </ListItem>
        <ListItem className={styles.list}>
          <Flex>
            <Text fontSize='2xl'>
              Feedback management -{' '}
              <Link
                href='/adminpages/feedbackManager'
                style={{ color: '#4d9ffe', textDecoration: 'none' }}
              >
                List open feedback
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
          </Flex>
        </ListItem>
        <ListItem className={styles.list}>
          <TableContainer>
            <Center>
              <Text fontSize={30} mb={2}>
                All feedback
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
                    Show {dynamicList.length}/{filteredAppData.length} result(s)
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
                  <Th className={styles.cTh}>Application</Th>
                  <Th className={styles.cTh}>Release</Th>
                  <Th className={styles.cTh}>OS</Th>
                  <Th className={styles.cTh}>Os Version</Th>
                  <Th className={styles.cTh}>Language</Th>
                  <Th className={styles.cTh}>Database</Th>
                  <Th className={styles.cTh}>Publisher</Th>
                  <Th className={styles.cTh}>Status</Th>
                  <Th className={styles.cTh}>No.Feedback</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dynamicList.map(
                  (app, index) =>
                    countIssue(app.appId) !== 0 && (
                      <Tr key={app.appId}>
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
    </Box>
  );
}

export default FeedbackPage;
