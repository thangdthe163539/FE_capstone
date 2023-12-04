import CardItem from '@/components/dashboard/card_item';
import { GroupLineChart } from '@/components/dashboard/chart';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

axios.defaults.baseURL = process.env.BACK_END_PORT || 'http://localhost:5001';

const labels = [
  'Jan',
  'Feb',
  'March',
  'April',
  'May',
  'June',
  'July',
  'Augh',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const formData = {
  labels,
  datasets: [
    {
      label: 'Issues',
      data: [],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      yAxisID: 'y',
    },
    {
      label: 'Feedbacks',
      data: [],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
      yAxisID: 'y1',
    },
  ],
};

const getDatabyMonth = (data = []) => {
  const countsByMonth = Array.from({ length: 12 }, () => 0);
  data.forEach((item) => {
    const [day, month, year] = item.start_Date.split('/');
    const parsedDate = new Date(`${year}-${month}-${day}`);
    const monthIndex = parsedDate.getMonth();
    countsByMonth[monthIndex]++;
  });
  return countsByMonth;
};

function Dashboard() {
  const [data, setData] = useState({
    account: 0,
    application: 0,
    asset: 0,
    software: 0,
    issue: 0,
    feedback: 0,
  });

  const [chartData, setChartData] = useState(formData);
  const getAllData = async () => {
    const [
      userResponse,
      applicationResponse,
      assetResponse,
      softwareResponse,
      issueResponse,
      feedbackResponse,
    ] = await Promise.all([
      axios.get('/api/v1/Account/ListAccount'),
      axios.get('api/v1/App/ListApps'),
      axios.get('api/v1/Asset/ListAssets'),
      axios.get('api/v1/Software/ListSoftwares'),
      axios.get('api/Report/ReportsByType/Issue'),
      axios.get('api/Report/ReportsByType/Feedback'),
    ]);
    let response = {
      account: 0,
      application: 0,
      asset: 0,
      software: 0,
      issue: 0,
      feedback: 0,
    };
    let chartDataResponse = {
      labels,
      datasets: [
        {
          label: 'Issues',
          data: [],
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          yAxisID: 'y',
        },
        {
          label: 'Feedbacks',
          data: [],
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          yAxisID: 'y1',
        },
      ],
    };
    if (userResponse?.status != '400' || userResponse?.status != '404') {
      response.account = userResponse?.data?.filter(
        (item) => item?.status == 1,
      )?.length;
    }
    if (
      applicationResponse?.status != '400' ||
      applicationResponse?.status != '404'
    ) {
      response.application = applicationResponse?.data?.filter(
        (item) => item?.status == 1,
      )?.length;
    }
    if (assetResponse?.status != '400' || assetResponse?.status != '404') {
      response.asset = assetResponse?.data?.filter(
        (item) => item?.status == 1,
      )?.length;
    }
    if (
      softwareResponse?.status != '400' ||
      softwareResponse?.status != '404'
    ) {
      response.software = softwareResponse?.data?.filter(
        (item) => item?.status == 1,
      )?.length;
    }
    if (issueResponse?.status != '400' || issueResponse?.status != '404') {
      const listIssueResponse = issueResponse?.data?.filter(
        (item) => item?.status != 3,
      );
      let issueChartData = getDatabyMonth(listIssueResponse);
      chartDataResponse.datasets[0].data = issueChartData;
      response.issue = listIssueResponse?.length;
    }
    if (
      feedbackResponse?.status != '400' ||
      feedbackResponse?.status != '404'
    ) {
      const listFeedbackResponse = feedbackResponse?.data?.filter(
        (item) => item?.status != 3,
      );
      let feedbackChartData = getDatabyMonth(listFeedbackResponse);
      chartDataResponse.datasets[1].data = feedbackChartData;
      response.feedback = listFeedbackResponse?.length;
    }
    setData(response);
    setChartData(chartDataResponse);
  };
  useEffect(() => {
    getAllData();
  }, []);
  return (
    <Stack p={5}>
      <Flex fontSize={'18px'} alignItems={'center'}>
        <Link
          href='/adminpages/adminhome'
          _hover={{ textDecor: 'underline' }}
          style={{ color: '#4d9ffe' }}
        >
          Home
        </Link>
        <ArrowForwardIcon
          margin={1}
          style={{ color: 'black', pointerEvents: 'none' }}
        />
        <Text>Dashboard</Text>
      </Flex>
      <hr />
      <Text fontSize='24px'>Dashboard</Text>
      <hr />
      <Flex justifyContent={'space-evenly'} m={'2% 0'}>
        <Stack>
          <Flex justifyContent={'space-between'}>
            <CardItem title={'Users'} statitic={data.account} />
            <CardItem title={'Applications'} statitic={data.application} />
            <CardItem title={'Assets'} statitic={data.asset} />
          </Flex>
          <Box
            border={'1px solid'}
            w={'1000px'}
            h={'378px'}
            mt={'3%'}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <GroupLineChart data={chartData} />
          </Box>
        </Stack>
        <Stack justifyContent={'space-between'}>
          <CardItem title={'Softwares'} statitic={data.software} />
          <CardItem title={'Issues'} statitic={data.issue} />
          <CardItem title={'Feedbacks'} statitic={data.feedback} />
        </Stack>
      </Flex>
    </Stack>
  );
}

export default Dashboard;
