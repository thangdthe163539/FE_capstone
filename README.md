1. Setup cài đặt và tài liệu nextjs : https://nextjs.org/docs
2. Sau khi cài xong npm i để cài đặt các thư viện đã sử dụng trong package.json
3. Sử dụng charkaUI để tạo giao diện : https://chakra-ui.com/getting-started
4. Sửa lại endpoint của backend trong file .env
5. Sửa lại các endpoint gọi hàm ngoài ra các biến paramsData sẽ chứa data gửi đi cho be xử lí ví dụ  tại src/pages/index.js function handleLoginAccount sẽ có dạng const response = axios.post(`${BACK_END_PORT}/endpoint`, {paramsData}); trong đó endpoint là đường dẫn đến be, port be sửa trong env, paramsData dữ liệu gửi cho be xử lí
6. CSS được chứa trong folders styles ở root sẽ có cách viết giống scss
Sau khi đã xong chạy lệnh : npm run dev để vào môi trường dev
P/: Nếu muốn chạy production thì phải chạy npm run build rồi chạy npm run start 
npm install
install firebase@10.5.0
npm install react-modal
npm install antd @ant-design/icons