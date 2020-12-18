const SocketIO = require('socket.io');
const Company = require('./schemas/company');
const Device = require('./schemas/device');
const Car = require('./schemas/car');
const Worker = require('./schemas/worker');
const History = require('./schemas/history');
const jwt = require('jsonwebtoken');
const secretObj = require("./config/jwt");

module.exports = (server) => {
  
  const io = SocketIO(server, { path: '/socket.io' });

  io.on('connection', (socket) => { // 웹소켓 연결 시
    const req = socket.request;
    
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('새로운 클라이언트 접속!', ip, socket.id, req.ip);
    socket.on('disconnect', () => { // 연결 종료 시
      console.log('클라이언트 접속 해제', ip, socket.id);
      
      clearInterval(socket.interval);
    });
    socket.on('error', (error) => { // 에러 시
      console.error(error);
    });
    
    
    socket.on('reply', (data) => { // 클라이언트로부터 메시지
      console.log(data);
    });
    
    
    // 10초마다 클라이언트로 메시지 전송
    /*
    socket.interval = setInterval(() => { 
      const socket_company = Company.find({"CID" :  });
      const socket_worker = Worker.find({});
      socket.emit('news', 'NODE 에서 HTML로 보내는 메세지');
    }, 10000);
    */
    
    socket.interval = setInterval( async ()=> {
      
      const socket_worker = await Worker.find({});
      const socket_history = await History.find({});
      
      console.log(socket_worker);
      socket.emit('newworker',socket_worker);
      socket.emit('newhistory',socket_history); 
      
    }, 10000);
    
  });
};
