import { Box, ListItem , List, Text, Table,  Thead,  Tbody, Tr,  Th,  Td,  TableCaption,  TableContainer, Flex, Spacer, IconButton, useDisclosure } from '@chakra-ui/react';
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
  GridItem
} from '@chakra-ui/react'
import Link from 'next/link';
import styles from '@/styles/pm.module.css';
import {ArrowForwardIcon} from '@chakra-ui/icons'
import { FaEdit, FaTrash , FaPlus } from 'react-icons/fa';
import { AiOutlineEye, AiFillEye } from 'react-icons/ai';
import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
// import { BACK_END_PORT } from '../../env'; 

function SoftwarePage() {
  //
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [formData, setFormData] = useState({
    name: '',
    account: '',
    ipAddress: '',
    macAddress: '',
    manufacturer: '',
    model: '',
    serialNumber: '',
    lastScan: '',
    status: '',
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  //


  return (
    <Box className={styles.bodybox}>
        <List>
            <ListItem className={styles.list}><Link href="/pmpages/pmhome" _hover={{ textDecor: 'underline' }} className={styles.listitem}>Home</Link><ArrowForwardIcon margin={1}></ArrowForwardIcon>Management Software</ListItem>
            <ListItem className={styles.list}>
              <Flex>
                <Text fontSize='2xl'>Management Software</Text>
                <Spacer/>
                <Box>
                  <IconButton
                    aria-label="Add"
                    icon={<FaPlus />}
                    colorScheme="gray" // Choose an appropriate color
                    marginRight={1}
                    onClick={onOpen}
                  />                  
                  <IconButton
                    aria-label="Edit"
                    icon={<FaEdit />}
                    colorScheme="gray" // Choose an appropriate color
                    marginRight={1}
                  />
                  <IconButton
                    aria-label="Delete"
                    icon={<FaTrash />}
                    colorScheme="gray" // Choose an appropriate color
                  />
                </Box>
              </Flex>     
            </ListItem>
            <ListItem className={styles.list}>
            <TableContainer>
                <Table variant='simple'>
                  <TableCaption>Total 3 softwares</TableCaption>
                  <Thead>
                    <Tr>
                      <Th isNumeric>Software ID</Th>
                      <Th>Device</Th>
                      <Th>Name</Th>
                      <Th>Publisher</Th>
                      <Th>Version</Th>
                      <Th>Release</Th>
                      <Th>OS</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td isNumeric>1</Td>
                      <Td>pm laptop</Td>
                      <Td>Android Studio</Td>
                      <Td>Google</Td>
                      <td>2021.3</td>
                      <td>2021 2021.3 x64</td>
                      <td>Windows</td>
                    </Tr>
                    <Tr>
                      <Td isNumeric>2</Td>
                      <Td>pm laptop</Td>
                      <Td>Figma</Td>
                      <Td>Figma</Td>
                      <td>116.13.3</td>
                      <td>116.13.3 x64</td>
                      <td>Windows</td>
                    </Tr>
                    <Tr>
                      <Td isNumeric>3</Td>
                      <Td>pm laptop</Td>
                      <Td>IntelliJ IDEA</Td>
                      <Td>JetBrains</Td>
                      <td>223.8214.52</td>
                      <td>2022 223.8214.52 Community x64</td>
                      <td>Windows</td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
            </ListItem>
        </List>
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          closeOnOverlayClick={false}
          size="lg"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add New Asset</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={8}>
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input name="name" value={formData.name} onChange={handleInputChange} />
                </FormControl>
                <FormControl>
                <FormLabel>IP Address</FormLabel>
                <Input
                  name="ipAddress"
                  value={formData.ipAddress}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Manufacturer</FormLabel>
                <Input
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Serial Number</FormLabel>
                <Input
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleInputChange}
                />
              </FormControl>
                {/* Add more fields for the first column */}
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Account</FormLabel>
                  <Input name="account" value={formData.account} onChange={handleInputChange} />
                </FormControl>
                <FormControl>
                <FormLabel>MAC Address</FormLabel>
                <Input
                  name="macAddress"
                  value={formData.macAddress}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Model</FormLabel>
                <Input
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Last Successful Scan</FormLabel>
                <Input
                  name="lastScan"
                  value={formData.lastScan}
                  onChange={handleInputChange}
                />
              </FormControl>
                {/* Add more fields for the second column */}
              </GridItem>
            </Grid>     
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' mr={3}>
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
    </Box>
  )
}


export default SoftwarePage;
