const SocketIO = require('socket.io');
const Company = require('./schemas/company');
const Device = require('./schemas/device');
const Car = require('./schemas/car');
const Worker = require('./schemas/worker');
const History = require('./schemas/history');
const QR = require('./schemas/qr');
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
    
    socket.interval = setInterval( async ()=> {
      
      const socket_device = await Device.find({});
      const socket_car = await Car.find({});
      const socket_worker = await Worker.find({});
      const socket_history = await History.find({});
      const socket_qr = await QR.find({});
      
      socket.emit('newDevice', socket_device);
      socket.emit('newCar', socket_car);
      socket.emit('newWorker', socket_worker);
      socket.emit('newHistory', socket_history);
      socket.emit('newQR', socket_qr);
      
    }, 60000);
    
  });
};
