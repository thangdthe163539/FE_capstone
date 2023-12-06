import {
    Box,
    Flex,
    UnorderedList,
    ListItem,
    Text,
    Spacer,
} from '@chakra-ui/react';
import styles from '@/styles/features.module.css';
import { Image } from '@chakra-ui/react'


function Feature() {
    return (
        <Box>
            <Text className={`${styles.title}`}>SoftTrack features</Text>
            <Flex className={`${styles.formSof}`} color='white'>
                <Box>
                    <Text className={`${styles.software}`}>Application</Text>
                    <Text className={`${styles.textSof}`}>
                        An application is a software or computer program developed to perform<br />
                        a specific set of functions or tasks. It can be used  solve a specific problem <br />
                        or provide the best user experience. Our application management program  <br />
                        is built to meet the specific needs of users:
                    </Text>
                    <Flex>
                        <UnorderedList className={`${styles.textList}`}>
                            <ListItem>Tracking</ListItem>
                            <ListItem>Feedback / Issue</ListItem>
                        </UnorderedList>
                        <UnorderedList style={{ marginLeft: '40%' }} className={`${styles.textList}`}>
                            <ListItem>Security</ListItem>
                            <ListItem>Cost reduction</ListItem>
                        </UnorderedList>
                    </Flex>
                </Box>
                <Spacer />
                <Box>
                    <Image className={`${styles.image}`} src="/image1.jpg" />
                </Box>
            </Flex>
            <Flex className={`${styles.formDe}`} color='white'>
                <Box>
                    <Image boxSize='350px' objectFit='cover' style={{ width: '550px', height: '300px' }} className={`${styles.image}`} src="/image.png" />
                </Box>
                <Box style={{ marginLeft: "13%" }}>
                    <Text className={`${styles.software}`}>Asset</Text>
                    <Text className={`${styles.textSof}`}>
                        Optimize the management of your software assets. With SoftTrack,<br />
                        you have the ability to effectively track and monitor software licenses,<br />
                        ensure regulatory compliance, and optimize costs across your organization.<br />
                    </Text>
                    <Flex>
                        <UnorderedList className={`${styles.textList}`}>
                            <ListItem>Feedback / Issue</ListItem>
                            <ListItem>Asset management</ListItem>
                        </UnorderedList>
                        <UnorderedList style={{ marginLeft: '40%' }} className={`${styles.textList}`}>
                            <ListItem>Security</ListItem>
                            <ListItem>Resources and tools</ListItem>
                        </UnorderedList>
                    </Flex>
                </Box>
            </Flex>
            <Flex className={`${styles.formSof}`} color='white'>
                <Box>
                    <Text className={`${styles.software}`}>Software</Text>
                    <Text className={`${styles.textSof}`}>
                        Software is an important part of the system, containing computer<br />
                        programs, source code, and related documents to perform specific<br />
                        functions. Our software is developed to meet technical, safety and <br />
                        high performance requirements.
                    </Text>
                    <Flex>
                        <UnorderedList className={`${styles.textList}`}>
                            <ListItem>Categorize and prioritize</ListItem>
                            <ListItem style={{ width: '250px' }}>Processing and resolution</ListItem>
                        </UnorderedList>
                        <UnorderedList style={{ marginLeft: '15%' }} className={`${styles.textList}`}>
                            <ListItem>Feedback / Issue</ListItem>
                            <ListItem style={{ width: '250px' }}>Continuous optimization</ListItem>
                        </UnorderedList>
                    </Flex>
                </Box>
                <Spacer />
                <Box>
                    <Image boxSize='350px' objectFit='cover' style={{ width: '550px', height: '300px' }} className={`${styles.image}`} src="/image3.png" />
                </Box>
            </Flex>
        </Box>
    );
}
export default Feature;
