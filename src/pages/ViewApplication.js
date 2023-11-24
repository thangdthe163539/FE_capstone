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
import { VStack, HStack, Image } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';
import styles from '@/styles/pm.module.css';
import axios from 'axios';
import { BACK_END_PORT } from '../../env';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

const defaultData = {
  accId: '',
  appId: '',
  reportId: '',
  title: '',
  description: '',
  type: '',
  start_Date: '',
  end_Date: '',
  status: '',
};

function ApplicationPage() {
  const [data, setData] = useState([]);
  const [dataAcc, setDataAcc] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(defaultData);
  const [selectedApp, setSelectedApp] = useState(defaultData);
  const [isShowFeedback, setIsShowFeedback] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BACK_END_PORT}/api/v1/App/ListApps`,
        );
        setData(response.data); // Assuming the API returns an array of objects
        const response2 = await axios.get(
          `${BACK_END_PORT}/api/v1/Account/ListAccount`,
        );
        setDataAcc(response2.data); // Assuming the API returns an array of objects
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      // Replace 'YOUR_API_ENDPOINT_HERE' with your actual API endpoint
      const response = await axios.post(
        `${BACK_END_PORT}/api/Report/CreateReport`,
        {
          assetId: device.assetId,
          softwareId: formData.softwareId,
          licenseKey: formData.licenseKey,
          startDate: formData.startDate,
          time: formData.time,
          status: 1,
        },
      );
      console.log('Data saved:', response.data);
      setIsOpenAdd(false); // Close the modal after successful save
      setFormData(defaultDataLicense);
      setSelectedRow1(new Set());
      // Reload new data for the table
      // const newDataResponse = await axios.get(
      //   `${BACK_END_PORT}/api/v1/App/ListApps`,
      // );
      // setData(newDataResponse.data);
      // const response2 = await axios.get(
      //   `${BACK_END_PORT}/api/v1/License/list_Licenses_by_Asset/` +
      //     device.assetId,
      // );
      // setDataLicense(response2.data);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // console.log(formData);
  };
  return (
    <Box className={styles.bodybox}>
      <List>
        <ListItem className={styles.list}>
          <Box
            style={{
              backgroundImage: `url('https://www.netsolutions.com/assets/images/software-dev-hub-banner-img.webp')`, // Thay đổi đường dẫn đến hình ảnh của bạn
              backgroundSize: 'cover', // Để tự động điều chỉnh kích thước ảnh cho phù hợp với phần tử
              backgroundRepeat: 'no-repeat', // Không lặp lại hình ảnh
              backgroundPosition: 'center', // Hiển thị ảnh tại giữa phần tử
              height: '200px',
            }}
            className={styles.homeBody + ' ' + inter.className}
          >
            <Box
              style={{
                letterSpacing: '1px',
                fontSize: '15px',
                color: 'white',
                marginLeft: '4%',
                padding: '40px',
              }}
            >
              <Text fontSize='24px' fontWeight='bold'>
                SoftTrack
              </Text>
              <Text>Advanced software asset management solution</Text>
              <Text>
                that helps you track, control, and optimize software licenses
              </Text>
              <Text>
                {' '}
                with ease, ensuring compliance and cost efficiency for your
                organization.
              </Text>
            </Box>
          </Box>
        </ListItem>
        <ListItem>
          <Center>
            <Grid templateColumns='repeat(2, 1fr)' gap={4} mt={5}>
              {data.map((item) => (
                <Box
                  key={item.id}
                  borderWidth='1px'
                  borderRadius='lg'
                  overflow='hidden'
                  p={4}
                  width='300px'
                  boxShadow='md'
                >
                  <Flex>
                    <Image
                      src='https://theproductmanager.b-cdn.net/wp-content/uploads/sites/4/2022/05/PRD-Keyword-software-development-life-cycle_Featured-Image-1280x720.png'
                      alt=''
                      boxSize='100px'
                      objectFit='cover'
                      mb={2}
                    />
                    <Spacer />
                    <Box>
                      <Text fontSize='lg' fontWeight='bold' mb={2}>
                        {item.name}
                      </Text>
                      <HStack justify='space-between' mt={8}>
                        <Text
                          className={styles.listitem}
                          onClick={() => (
                            setIsShowFeedback(true), setSelectedApp(item)
                          )}
                        >
                          Send Feedback
                        </Text>
                      </HStack>
                    </Box>
                  </Flex>
                </Box>
              ))}
            </Grid>
          </Center>
        </ListItem>
      </List>
      <Modal // Modal add new asset
        isOpen={isShowFeedback}
        onClose={() => setIsShowFeedback(false)}
        closeOnOverlayClick={false}
        size='lg'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Asset</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8}>
            <Grid templateColumns='repeat(2, 1fr)' gap={4}>
              <GridItem>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    name='name'
                    value={selectedApp.name}
                    onChange={handleInputChange}
                    disabled
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Title</FormLabel>
                  <Input
                    name='title'
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </FormControl>
              </GridItem>
            </Grid>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input
                name='description'
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleSave}>
              Save
            </Button>
            <Button onClick={() => setIsShowFeedback(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
export default ApplicationPage;
