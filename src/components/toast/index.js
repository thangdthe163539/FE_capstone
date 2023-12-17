import { useToast } from '@chakra-ui/react';

function ToastCustom({ title, status, description }) {
  const toast = useToast();
  return toast({
    title: title,
    description: description,
    status: status,
    duration: 4000,
    isClosable: true,
  });
}

export default ToastCustom;
