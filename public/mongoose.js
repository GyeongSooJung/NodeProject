// 사용자 등록 시
  document.getElementById('company-join').addEventListener('submit', async (e) => {
   await e.preventDefault();
    const CNU = e.target.CNU.value;
    const CNA = e.target.CNA.value;
    const PW = e.target.PW.value;
    const PN = e.target.PN.value;
    const MN = e.target.MN.value;
    const NA = e.target.NA.value;
    if (!CNU) {
      return alert('Input your COMPANY NUMBER');
    }
    if (!CNA) {
      return alert('Input your COMPANY NAME');
    }
      if (!PW) {
      return alert('Input your PASSWORD');
    }
      if (!PN) {
      return alert('Input your PHONE NUMBER');
    }
      if (!MN) {
      return alert('Input your MOBILE NUMBER');
    }
      if (!NA) {
      return alert('Input Your NAME');
    }
   /* try {
      await axios.post('/company/join');
    } catch (err) {
      console.error(err);
    }
      e.target.CNU.value = "";
      e.target.CNA.value = "";
      e.target.PW.value = "";
      e.target.PN.value = "";
      e.target.MN.value = "";
      e.target.NA.value = "";
   */   
  });



