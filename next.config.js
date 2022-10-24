module.exports = {
    reactStrictMode: true,
    serverRuntimeConfig: {
        secret: 'THIS IS USED TO SIGN AND VERIFY JWT TOKENS, REPLACE IT WITH YOUR OWN SECRET, IT CAN BE ANY STRING'
    },
    publicRuntimeConfig: {
        apiUrl: process.env.NODE_ENV === 'development'              //phải dùng với cách chạy npm start, không áp dụng với npm run dev
            ? 'http://localhost:3000/api' // development api    
            : 'http://172.168.10.189:3000/api', // production api
        reportDocumentRoot: "./data/reports",                      // Thư mục chứa các file report. Không có kí tự / ở cuối.
        cmdHISBot:"date /T"
    }
}
