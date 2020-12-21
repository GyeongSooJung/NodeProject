const moment=require('moment');

console.log(moment(Date.now()).diff(moment(Date.now()+9000000000000),'days'));
