import { Box, Stack, Text, Flex } from '@chakra-ui/react';
import {
  AiOutlineTeam,
  AiOutlineAppstore,
  AiFillFolderOpen,
  AiFillDatabase,
  AiOutlineQuestionCircle,
  AiOutlineFileText,
} from 'react-icons/ai';

function CardItem({ title, statitic }) {
  const styleIcons = { width: '100px', height: '100px', fontWeight: '400' };
  return (
    <Box border={'1px solid'} w={'290px'} h={'132px'}>
      <Flex m={'0 auto'} height={'100%'} justifyContent={'space-around'}>
        <Flex alignItems={'center'}>
          {title == 'Users' ? (
            <AiOutlineTeam style={styleIcons} />
          ) : title == 'Applications' ? (
            <AiOutlineAppstore style={styleIcons} />
          ) : title == 'Assets' ? (
            <AiFillFolderOpen style={styleIcons} />
          ) : title == 'Softwares' ? (
            <AiFillDatabase style={styleIcons} />
          ) : title == 'Issues' ? (
            <AiOutlineQuestionCircle style={styleIcons} />
          ) : (
            <AiOutlineFileText style={styleIcons} />
          )}
        </Flex>
        <Stack
          margin={'0 26px'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Text fontSize={'20px'} fontWeight={'500'}>
            {title}
          </Text>
          <Text fontSize={'28px'} fontWeight={'500'}>
            {statitic}
          </Text>
        </Stack>
      </Flex>
    </Box>
  );
}

export default CardItem;
