import { Flex, Button, Box } from '@chakra-ui/react';
import { Pagination } from 'antd';

function PaginationCustom({ current, onChange, total, pageSize, ...props }) {
  const itemRender = (_, type, originalElement) => {
    if (type === 'prev') {
      return <a>Previous</a>;
    }
    if (type === 'next') {
      return <a>Next</a>;
    }
    return originalElement;
  };
  return (
    <Box {...props}>
      <Pagination
        current={current}
        onChange={onChange}
        total={total}
        pageSize={pageSize ? pageSize : 10}
        itemRender={itemRender}
      />
    </Box>
  );
}

export default PaginationCustom;
