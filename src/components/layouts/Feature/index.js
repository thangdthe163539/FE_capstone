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
            <Text className={`${styles.title}`}>SoftTrack Features</Text>
            <Flex className={`${styles.formSof}`} color='white'>
                <Box>
                    <Text className={`${styles.software}`}>Software</Text>
                    <Text className={`${styles.textSof}`}>
                        Optimize the management of your software assets.<br />
                        With SoftTrack, you have the ability to effectively track <br />
                        and monitor software licenses, ensure regulatory compliance,<br />
                        and optimize costs across your organization.
                    </Text>
                    <Flex>
                        <UnorderedList className={`${styles.textList}`}>
                            <ListItem>Tracking</ListItem>
                            <ListItem>Monitoring</ListItem>
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
                    <Text className={`${styles.software}`}>Device</Text>
                    <Text className={`${styles.textSof}`}>
                        Device Management is an important part of organizing and navigating<br />
                        multiple devices within an organization or network. This is especially <br />
                        important in corporate environments, where security, operational<br />
                        efficiency, and IT infrastructure management need to be ensured.
                    </Text>
                    <Flex className={`${styles.textList}`}>
                        <UnorderedList>
                            <ListItem>Performance</ListItem>
                            <ListItem>Update software</ListItem>
                        </UnorderedList>
                        <UnorderedList style={{ marginLeft: '40%' }}>
                            <ListItem>Device registration</ListItem>
                            <ListItem>Troubleshooting</ListItem>
                        </UnorderedList>
                    </Flex>
                </Box>
            </Flex>
            <Flex className={`${styles.formSof}`} color='white'>
                <Box>
                    <Text className={`${styles.software}`}>Report/Issue-feedback</Text>
                    <Text className={`${styles.textSof}`}>
                        An important aspect in building and maintaining a system or product<br />
                        that is stable and continuously improving. This entails the process of<br />
                        organizing, tracking and resolving reports of incidents or feedback<br />
                        from you.
                    </Text>
                    <Flex>
                        <UnorderedList className={`${styles.textList}`}>
                            <ListItem>Collect and record</ListItem>
                            <ListItem>Categorize and prioritize</ListItem>
                            <ListItem style={{ width: '250px' }}>Processing and resolution</ListItem>
                        </UnorderedList>
                        <UnorderedList style={{ marginLeft: '15%' }} className={`${styles.textList}`}>
                            <ListItem>Feedback</ListItem>
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
