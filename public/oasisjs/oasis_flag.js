window.addEventListener('load', function() {
	// 언어 변경시 국기 변환 기능
	// 쿠키 언어 찾기
	var lang = getCookie('lang');
	
	// 현재 페이지 찾기
	var path = document.location.pathname.toString();
	var cut =  path.split('/');
	
	// 바꿀 div들 선언
	var quote1 = document.getElementById('quote1');
	var quote2 = document.getElementById('quote2');
	var quote3 = document.getElementById('quote3');
	var oasis_flow = document.getElementById('oasis_flow');
	var personalModal = document.getElementById('personalModal');
	
	if(lang == 'ko') {
		if (cut[1] == 'register') {
			personalModal.innerHTML = "<p></p>"+
									"<p class='ls2 lh6 bs5 ts4'><em class='emphasis'>주식회사 엠케이</em>은(는) 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하고 개인정보와 관련한 이용자의 고충을 원활하게 처리할 수 있도록 다음과 같은 처리방침을 두고 있습니다.</p>"+
									"<p class='ls2 lh6 bs5 ts4'><em class='emphasis'>주식회사 엠케이('오아시스')</em> 은(는) 회사는 개인정보처리방침을 개정하는 경우 웹사이트 공지사항(또는 개별공지)을 통하여 공지할 것입니다.</p>"+
									"<p class='ls2'>○ 본 방침은부터 <em class='emphasis'>2020</em>년 <em class='emphasis'>2</em>월 <em class='emphasis'>1</em>일부터 시행됩니다.</p><br>"+
									"<p class='lh6 bs4'><strong>1. 개인정보의 처리 목적 <em class='emphasis'>주식회사 엠케이('www.cleanoasis.net'이하 '오아시스')</em>은(는) 개인정보를 다음의 목적을 위해 처리합니다. 처리한 개인정보는 다음의 목적이외의 용도로는 사용되지 않으며 이용 목적이 변경될 시에는 사전동의를 구할 예정입니다.</strong></p>"+
									"<ul class='list_indent2 mgt10'>"+
									    "<p class='ls2'>가. 홈페이지 회원가입 및 관리</p>"+
									    "<p class='ls2'>회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리 등을 목적으로 개인정보를 처리합니다.</p><br>"+
									"</ul>"+
									"<p class='sub_p mgt30'><strong>2. 개인정보 파일 현황<br></strong></p>"+
									"<ul class='list_indent2 mgt10'>"+
									    "<li class='tt'><b>1. 개인정보 파일명 : 오아시스</b></li>"+
									    "<li>개인정보 항목 : 이메일, 휴대전화번호, 비밀번호, 로그인ID, 회사전화번호, 부서, 회사명, 서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보, 사업자번호 및 회사주소</li>"+
									    "<li>수집방법 : 홈페이지</li>"+
									    "<li>보유근거 : 홈페이지 회원정보 수집 등에 관한 기록</li>"+
									    "<li>보유기간 : 3년</li>"+
									    "<li>관련법령 : 신용정보의 수집/처리 및 이용 등에 관한 기록 : 3년</li>"+
									"</ul><br><br>"+
									"<p class='lh6 bs4'><strong>3. 개인정보의 처리 및 보유 기간</strong><br><br>① <em class='emphasis'>주식회사 엠케이('오아시스')</em>은(는) 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집시에 동의 받은 개인정보 보유,이용기간 내에서 개인정보를 처리,보유합니다.<br><br>② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.</p>"+
									"<ul class='list_indent2 mgt10'>"+
									    "<li class='tt'>1.&lt;홈페이지 회원가입 및 관리&gt;</li>"+
									    "<li class='tt'>&lt;홈페이지 회원가입 및 관리&gt;와 관련한 개인정보는 수집.이용에 관한 동의일로부터&lt;3년&gt;까지 위 이용목적을 위하여 보유.이용됩니다.</li>"+
									    "<li>보유근거 : 홈페이지 회원정보 수집 등에 관한 기록</li>"+
									    "<li>관련법령 : 신용정보의 수집/처리 및 이용 등에 관한 기록 : 3년</li>"+
									    "<li>예외사유 : </li>"+
									"</ul>"+
									"<p class='lh6 bs4'><strong>4. 정보주체와 법정대리인의 권리·의무 및 그 행사방법 이용자는 개인정보주체로써 다음과 같은 권리를 행사할 수 있습니다.</strong></p>"+
									"<p class='ls2'>① 정보주체는 주식회사 엠케이에 대해 언제든지 개인정보 열람,정정,삭제,처리정지 요구 등의 권리를 행사할 수 있습니다.</p>"+
									"<p class='sub_p'>② 제1항에 따른 권리 행사는주식회사 엠케이에 대해 개인정보 보호법 시행령 제41조제1항에 따라 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 주식회사 엠케이은(는) 이에 대해 지체 없이 조치하겠습니다.</p>"+
									"<p class='sub_p'>③ 제1항에 따른 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수 있습니다. 이 경우 개인정보 보호법 시행규칙 별지 제11호 서식에 따른 위임장을 제출하셔야 합니다.</p>"+
									"<p class='sub_p'>④ 개인정보 열람 및 처리정지 요구는 개인정보보호법 제35조 제5항, 제37조 제2항에 의하여 정보주체의 권리가 제한 될 수 있습니다.</p>"+
									"<p class='sub_p'>⑤ 개인정보의 정정 및 삭제 요구는 다른 법령에서 그 개인정보가 수집 대상으로 명시되어 있는 경우에는 그 삭제를 요구할 수 없습니다.</p>"+
									"<p class='sub_p'>⑥ 주식회사 엠케이은(는) 정보주체 권리에 따른 열람의 요구, 정정·삭제의 요구, 처리정지의 요구 시 열람 등 요구를 한 자가 본인이거나 정당한 대리인인지를 확인합니다.</p><br><br>"+
									"<p class='lh6 bs4'><strong>5. 처리하는 개인정보의 항목 작성 </strong><br><br> ① <em class='emphasis'>주식회사 엠케이('www.cleanoasis.net'이하 '오아시스')</em>은(는) 다음의 개인정보 항목을 처리하고 있습니다.</p>"+
									"<ul class='list_indent2 mgt10'>"+
									    "<li class='tt'>1&lt;홈페이지 회원가입 및 관리&gt;</li>"+
									    "<li>필수항목 : 이메일, 휴대전화번호, 비밀번호, 로그인ID, 이름, 회사전화번호, 부서, 회사명, 서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보, 사업자번호 및 회사주소</li>"+
									    "<li>- 선택항목 : </li>"+
									"</ul><br><br>"+
									"<p class='lh6 bs4'><strong>6. 개인정보의 파기<em class='emphasis'>주식회사 엠케이('오아시스')</em>은(는) 원칙적으로 개인정보 처리목적이 달성된 경우에는 지체없이 해당 개인정보를 파기합니다. 파기의 절차, 기한 및 방법은 다음과 같습니다.</strong></p>"+
									"<p class='ls2'>-파기절차<br>이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져(종이의 경우 별도의 서류) 내부 방침 및 기타 관련 법령에 따라 일정기간 저장된 후 혹은 즉시 파기됩니다. 이 때, DB로 옮겨진 개인정보는 법률에 의한 경우가 아니고서는 다른 목적으로 이용되지 않습니다.<br><br>-파기기한<br>이용자의 개인정보는 개인정보의 보유기간이 경과된 경우에는 보유기간의 종료일로부터 5일 이내에, 개인정보의 처리 목적 달성, 해당 서비스의 폐지, 사업의 종료 등 그 개인정보가 불필요하게 되었을 때에는 개인정보의 처리가 불필요한 것으로 인정되는 날로부터 5일 이내에 그 개인정보를 파기합니다.</p>"+
									"<p class='sub_p mgt10'>-파기방법</p>"+
									"<p class='sub_p'>전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다.</p>종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다<p></p><br><br>"+
									"<p class='lh6 bs4'><strong>7. 개인정보 자동 수집 장치의 설치•운영 및 거부에 관한 사항</strong></p>"+
									"<p class='ls2'>① 주식회사 엠케이 은 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 ‘쿠키(cookie)’를 사용합니다 .② 쿠키는 웹사이트를 운영하는데 이용되는 서버(http)가 이용자의 컴퓨터 브라우저에게 보내는 소량의 정보이며 이용자들의 PC 컴퓨터내의 하드디스크에 저장되기도 합니다.<br><br>가. 쿠키의 사용 목적 : 이용자가 방문한 각 서비스와 웹 사이트들에 대한 방문 및 이용형태, 인기 검색어, 보안접속 여부, 등을 파악하여 이용자에게 최적화된 정보 제공을 위해 사용됩니다.<br>나. 쿠키의 설치•운영 및 거부 : 웹브라우저 상단의 도구&gt;인터넷 옵션&gt;개인정보 메뉴의 옵션 설정을 통해 쿠키 저장을 거부 할 수 있습니다.<br>다. 쿠키 저장을 거부할 경우 맞춤형 서비스 이용에 어려움이 발생할 수 있습니다.</p>"+
									"<p class='sub_p mgt30'><strong>8. 개인정보 보호책임자 작성 </strong></p>"+
									"<p class='sub_p mgt10'> ① <span class='colorLightBlue'>주식회사 엠케이(‘www.cleanoasis.net’이하 ‘오아시스)</span> 은(는) 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>"+
									"<ul class='list_indent2 mgt10'>"+
									    "<li class='tt'>▶ 개인정보 보호책임자 </li>"+
									    "<li>성명 :변무영</li>"+
									    "<li>직책 :대표</li>"+
									    "<li>직급 :대표</li>"+
									    "<li>연락처 :01023452379, bmyfile@gmail.com, </li>"+
									"</ul>"+
									"<p class='sub_p'>※ 개인정보 보호 담당부서로 연결됩니다.</p>"+
									"<p> </p>"+
									"<ul class='list_indent2 mgt10'>"+
									    "<li class='tt'>▶ 개인정보 보호 담당부서</li>"+
									    "<li>부서명 :개발팀</li>"+
									    "<li>담당자 :박충범</li>"+
									    "<li>연락처 :01029206090, park.choongbum@gmail.com, </li>"+
									"</ul>"+
									"<p class='sub_p'>② 정보주체께서는 주식회사 엠케이(‘www.cleanoasis.net’이하 ‘오아시스) 의 서비스(또는 사업)을 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당부서로 문의하실 수 있습니다. 주식회사 엠케이(‘www.cleanoasis.net’이하 ‘오아시스) 은(는) 정보주체의 문의에 대해 지체 없이 답변 및 처리해드릴 것입니다.</p>"+
									"<p class='sub_p mgt30'><strong>9. 개인정보 처리방침 변경 </strong></p>"+
									"<p class='sub_p mgt10'>①이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.</p><br><br>"+
									"<p class='lh6 bs4'><strong>10. 개인정보의 안전성 확보 조치 <em class='emphasis'>주식회사 엠케이('오아시스')</em>은(는) 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에 필요한 기술적/관리적 및 물리적 조치를 하고 있습니다.</strong></p>"+
									"<p class='sub_p mgt10'>1. 정기적인 자체 감사 실시<br> 개인정보 취급 관련 안정성 확보를 위해 정기적(분기 1회)으로 자체 감사를 실시하고 있습니다.<br><br>2. 개인정보 취급 직원의 최소화 및 교육<br> 개인정보를 취급하는 직원을 지정하고 담당자에 한정시켜 최소화 하여 개인정보를 관리하는 대책을 시행하고 있습니다.<br><br>3. 내부관리계획의 수립 및 시행<br> 개인정보의 안전한 처리를 위하여 내부관리계획을 수립하고 시행하고 있습니다.<br><br>4. 해킹 등에 대비한 기술적 대책<br> &lt;<em class='emphasis'>주식회사 엠케이</em>&gt;('<em class='emphasis'>오아시스</em>')은 해킹이나 컴퓨터 바이러스 등에 의한 개인정보 유출 및 훼손을 막기 위하여 보안프로그램을 설치하고 주기적인 갱신·점검을 하며 외부로부터 접근이 통제된 구역에 시스템을 설치하고 기술적/물리적으로 감시 및 차단하고 있습니다.<br><br>5. 개인정보의 암호화<br> 이용자의 개인정보는 비밀번호는 암호화 되어 저장 및 관리되고 있어, 본인만이 알 수 있으며 중요한 데이터는 파일 및 전송 데이터를 암호화 하거나 파일 잠금 기능을 사용하는 등의 별도 보안기능을 사용하고 있습니다.<br><br>6. 접속기록의 보관 및 위변조 방지<br> 개인정보처리시스템에 접속한 기록을 최소 6개월 이상 보관, 관리하고 있으며, 접속 기록이 위변조 및 도난, 분실되지 않도록 보안기능 사용하고 있습니다.<br><br>7. 개인정보에 대한 접근 제한<br> 개인정보를 처리하는 데이터베이스시스템에 대한 접근권한의 부여,변경,말소를 통하여 개인정보에 대한 접근통제를 위하여 필요한 조치를 하고 있으며 침입차단시스템을 이용하여 외부로부터의 무단 접근을 통제하고 있습니다.<br><br>8. 문서보안을 위한 잠금장치 사용<br> 개인정보가 포함된 서류, 보조저장매체 등을 잠금장치가 있는 안전한 장소에 보관하고 있습니다.<br><br>9. 비인가자에 대한 출입 통제<br> 개인정보를 보관하고 있는 물리적 보관 장소를 별도로 두고 이에 대해 출입통제 절차를 수립, 운영하고 있습니다.<br><br></p>"+
									"<p></p>";
		}
		else if(cut[1] == '' || cut[1] == 'index') {
			quote1.src = '../assets/img/quote1.png';
			quote2.src = '../assets/img/quote2.png';
			quote3.src = '../assets/img/quote3.png';
			oasis_flow.src = '../assets/img/oasis_flow.png';
		}
	}
	else if(lang == 'en') {
		if (cut[1] == 'register') {
			personalModal.innerHTML = "<p></p>"+
								    "<p class='ls2 lh6 bs5 ts4'>According to the Personal Information Protection Act, <em class='emphasis'>MK Co., Ltd.</em> has the following policies to protect users' personal information, protect their rights and interests, and to smoothly deal with their grievances related to personal information.</p>"+
								    "<p class='ls2 lh6 bs5 ts4'> When <em class='emphasis'>MK Co., Ltd.('OASIS')</em> revises its personal information processing policy, it will announce it through website announcements (or individual announcements).</p>"+
								    "<p class='ls2'>○ This policy will take effect on <em class='emphasis'>February 1, 2020.</em></p><br>"+
								    "<p class='lh6 bs4'><strong>1. Purpose of processing personal information MK Co., Ltd. processes personal information for the following purposes: The processed personal information will not be used for any purpose other than the following purposes, and prior consent will be sought if the purpose of use is changed.</strong></p>"+
								    "<ul class='list_indent2 mgt10'>"+
								        "<p class='ls2'>A. Register and manage membership on the homepage</p>"+
								        "<p class='ls2'>Personal information is processed for the purpose of confirming the intention of membership, identifying and certifying oneself according to the provision of membership service, and maintaining and managing membership.</p><br>"+
								    "</ul>"+
								    "<p class='sub_p mgt30'><strong>2. Privacy File Status <br></strong></p>"+
								    "<ul class='list_indent2 mgt10'>"+
								        "<li class='tt'><b>1. Personal information file name : OASIS</b></li>"+
								        "<li>Personal Information Item : Email, mobile phone number, password, login ID, company phone number, department, company name, service usage record, access log, cookie, access IP information, business number and company address</li>"+
								        "<li>Collection method : website</li>"+
								        "<li>Grounds for holding : Records on the collection, etc. of membership information on the website</li>"+
								        "<li>Retention period : 3years</li>"+
								        "<li>Related Acts and subordinate statutes : Records on the collection, processing, use, etc. of credit information : 3years</li>"+
								    "</ul><br><br>"+
								    "<p class='lh6 bs4'><strong>3. Processing and retention period of personal information</strong><br><br>① MK Co., Ltd. ('OASIS') processes and retains personal information within the period of personal information retention and use under the Act or the period of personal information collected by the information subject.<br><br> The period of processing and holding each personal information is as follows.</p>"+
								    "<ul class='list_indent2 mgt10'>"+
								        "<li class='tt'>1.&lt;Register and manage membership on the homepage&gt;</li>"+
								        "<li class='tt'>&lt;Personal information related to homepage membership registration and management &gt; is collected.Retained for the purpose of use up to three years from the date of consent for use.It's used.</li>"+
								        "<li>Grounds for holding : Records on the collection, etc. of membership information on the website</li>"+
								        "<li>Related Acts and subordinate statutes : Records on the collection, processing, use, etc. of credit information : 3years</li>"+
								        "<li>Reasons for exception : </li>"+
								    "</ul>"+
								    "<p class='lh6 bs4'><strong>4. The rights and obligations of the information subject and the legal representative and the users of the method of exercise may exercise the following rights as a personal information entity:</strong></p>"+
								    "<p class='ls2'>① The information subject may exercise the right to perusal, correction, deletion, and suspension of processing of personal time.</p>"+
								    "<p class='sub_p'>② The exercise of rights under paragraph (1) may be carried out in writing, e-mail, simulation transmission (FAX), etc. under Article 41 (1) of the Enforcement Decree of the Personal Information Protection Act, and MK Co., Ltd. will take action without delay.</p>"+
								    "<p class='sub_p'>③ The exercise of rights under paragraph (1) may be conducted through an agent, such as a legal representative of the information subject or a delegated person. In such cases, a letter of attorney under attached Form 11 of the Enforcement Rules of the Personal Information Protection Act shall be submitted.</p>"+
								    "<p class='sub_p'>④ The right of the information subject may be restricted pursuant to Article 35 (5) and Article 37 (2) of the Personal Information Protection Act to request the suspension of personal information permission and processing.</p>"+
								    "<p class='sub_p'>⑤ A request for correction or deletion of personal information shall not be requested if other statutes specify that personal information is collected.</p>"+
								    "<p class='sub_p'>⑥ MK Co., Ltd. verifies whether the person who made the request is himself or his or her right to view the information subject, request for correction or deletion, and request for perusal upon request for suspension of processing.</p><br><br>"+
								    "<p class='lh6 bs4'><strong>5. Creating items in your personal information that you process </strong><br><br> ① MK Co., Ltd. ('www.cleanoasis.net' and 'OASIS') processes the following personal information items:</p>"+
								    "<ul class='list_indent2 mgt10'>"+
								        "<li class='tt'>1&lt;Register and manage membership on the homepage&gt;</li>"+
								        "<li>Required Items : e-mail, mobile phone number, password, login ID, name, company phone number, department, company name, service usage record, access log, cookie, access IP information, business number and company address</li>"+
								    "</ul><br><br>"+
								    "<p class='lh6 bs4'><strong>6. destruction of personal information In principle, MK Co., Ltd. ('OASIS') will destroy such personal information without delay if the purpose of processing personal information has been achieved. Procedure, due date, and method of destruction are as follows.</strong></p>"+
								    "<p class='ls2'>-Destruction procedure<br>The information entered by the user is transferred to a separate DB after achieving the purpose (in case of paper, separate documents) and is stored for a certain period of time in accordance with the internal policy and other related laws and regulations. At this time, personal information transferred to DB is not used for any other purpose unless it is under the law.<br><br>"+
								    "-Destruction Date<br>If the user's personal information has expired, the user's personal information shall be destroyed within 5 days from the end of the retention period, and if the personal information becomes unnecessary, such as achieving the purpose of personal information, abolition of the service, or termination of the project.</p>"+
								    "<p class='sub_p mgt10'>-Destruction Method</p>"+
								    "<p class='sub_p'>Information in the form of electronic files uses technological methods that cannot play records.Personal information printed on </p> paper is shredded with a shredder or destroyed through incineration.<p></p><br><br>"+
								    "<p class='lh6 bs4'><strong>7. Installation of automated information collection operations and matters concerning the denial of individuals.</strong></p>"+
								    "<p class='ls2'>① MK Co., Ltd. uses 'cookie' to store and recall information to provide individual customized services.② Cookies are a small amount of information that the server (http) used to run the website sends to the user's computer browser and can also be stored on the user's PC computer's hard disk."+
								    "<br><br>A. Purpose of use of cookies : It is used to provide optimized information to users by identifying the types of visits and use, popular search terms, security access, etc. to each service and website visited by users.<br>B. Installation • Operation and Rejection of Cookies: Tools at the top of your web browser You can reject the save of cookies through the Options settings in the Internet Options Privacy menu.<br>C. Refusing to store cookies can cause difficulties in using customized services.</p>"+
								    "<p class='sub_p mgt30'><strong>8. Preparation of a personal information protection officer </strong></p>"+
								    "<p class='sub_p mgt10'> ① MK Co., Ltd. (www.cleanoasis.net) (OASIS) is responsible for the overall handling of personal information and designates a person in charge of personal information protection to handle complaints and remedy damages related to personal information processing.</p>"+
								    "<ul class='list_indent2 mgt10'>"+
								        "<li class='tt'>▶ Person in charge of personal information protection </li>"+
								        "<li>Name : Mooyeong Byeon</li>"+
								        "<li>official responsibilities :CEO</li>"+
								        "<li>position : CEO</li>"+
								        "<li>contact information :01023452379, bmyfile@gmail.com, </li>"+
								    "</ul>"+
								    "<p class='sub_p'>※ You are connected to the privacy department.</p>"+
								    "<p> </p>"+
								    "<ul class='list_indent2 mgt10'>"+
								        "<li class='tt'>▶ Department in charge of personal information protection</li>"+
								        "<li>Department name : R&D Team</li>"+
								        "<li>The person in charge : Choong bum Back</li>"+
								        "<li>contact information :01029206090, park.choongbum@gmail.com, </li>"+
								    "</ul>"+
								    "<p class='sub_p'>② The information subject may contact the personal information protection manager and the department in charge of personal information protection, handling complaints, and relief of damages caused by using the service (or business) of MK Co., Ltd. (www.cleanoasis.net)."+
								    " MK Co., Ltd. (www.cleanoasis.net) and 'OASIS' will respond and process information subject inquiries without delay.</p>"+
								    "<p class='sub_p mgt30'><strong>9. Change the privacy statement </strong></p>"+
								    "<p class='sub_p mgt10'>①This personal information processing policy shall be applied from the date of implementation, and if there is an addition, deletion, or correction of the changes under the Act and the policy, it will be notified 7 days before the change is implemented.</p><br><br>"+
								    "<p class='lh6 bs4'><strong>10. Measures to secure the safety of personal information<br> According to Article 29 of the Privacy Act, MK Co., Ltd. ('OASIS') takes technical, administrative and physical measures necessary to ensure safety as follows:</strong></p>"+
								    "<p class='sub_p mgt10'>1. Conduct regular self-audits<br> Conduct regular self-audits<br><br>2. Minimize and educate employees handling personal information<br> Measures are implemented to manage personal information by designating employees who handle personal information and minimizing them only to those in charge."+
								    "<br><br>3. Establishment and implementation of an internal management plan<br> Internal management plans are established and implemented to ensure safe processing of personal information.<br><br>4. Relative to the technical measures such as hacking. <br> MK Co., Ltd. installs security programs, updates, checks, and installs systems in areas where access is restricted from outside, technically and physically, to prevent personal information leakage or damage caused by hacking or computer viruses."+
								    "<br><br>5. Encryption of personal information<br> The user's personal information is encrypted and stored and managed, so only he/she knows it, and important data uses separate security functions such as encrypting file and transfer data or using file locking."+
								    "<br><br>6. Storage of access records and prevention of forgery<br> We keep and manage records accessed to the personal information processing system for at least six months, and use security features to prevent records from being tampered with, stolen, or lost."+
								    "<br><br>7. Restrict access to personal information<br> By granting, changing, and canceling access to the database system that processes personal information, the company takes necessary measures to control access to personal information and controls unauthorized access from outside using the intrusion prevention system."+
								    "<br><br>8. Using locks for document security<br> Documents containing personal information, auxiliary storage media, etc. are stored in a safe place with locks.<br><br>9. access control to unauthorized persons<br> The company establishes and operates access control procedures for the physical storage area where personal information is stored.<br><br></p>"+
								    "<p></p>";
		}
		else if(cut[1] == '' || cut[1] == 'index') {
			quote1.src = '../assets/img/quote1_en.png';
			quote2.src = '../assets/img/quote2_en.png';
			quote3.src = '../assets/img/quote3_en.png';
			oasis_flow.src = '../assets/img/oasis_flow_en.png';
		}
	}
	else {
		if (cut[1] == 'register') {
			personalModal.innerHTML = "<p></p>"+
									"<p class='ls2 lh6 bs5 ts4'><em class='emphasis'>주식회사 엠케이</em>은(는) 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하고 개인정보와 관련한 이용자의 고충을 원활하게 처리할 수 있도록 다음과 같은 처리방침을 두고 있습니다.</p>"+
									"<p class='ls2 lh6 bs5 ts4'><em class='emphasis'>주식회사 엠케이('오아시스')</em> 은(는) 회사는 개인정보처리방침을 개정하는 경우 웹사이트 공지사항(또는 개별공지)을 통하여 공지할 것입니다.</p>"+
									"<p class='ls2'>○ 본 방침은부터 <em class='emphasis'>2020</em>년 <em class='emphasis'>2</em>월 <em class='emphasis'>1</em>일부터 시행됩니다.</p><br>"+
									"<p class='lh6 bs4'><strong>1. 개인정보의 처리 목적 <em class='emphasis'>주식회사 엠케이('www.cleanoasis.net'이하 '오아시스')</em>은(는) 개인정보를 다음의 목적을 위해 처리합니다. 처리한 개인정보는 다음의 목적이외의 용도로는 사용되지 않으며 이용 목적이 변경될 시에는 사전동의를 구할 예정입니다.</strong></p>"+
									"<ul class='list_indent2 mgt10'>"+
									    "<p class='ls2'>가. 홈페이지 회원가입 및 관리</p>"+
									    "<p class='ls2'>회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리 등을 목적으로 개인정보를 처리합니다.</p><br>"+
									"</ul>"+
									"<p class='sub_p mgt30'><strong>2. 개인정보 파일 현황<br></strong></p>"+
									"<ul class='list_indent2 mgt10'>"+
									    "<li class='tt'><b>1. 개인정보 파일명 : 오아시스</b></li>"+
									    "<li>개인정보 항목 : 이메일, 휴대전화번호, 비밀번호, 로그인ID, 회사전화번호, 부서, 회사명, 서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보, 사업자번호 및 회사주소</li>"+
									    "<li>수집방법 : 홈페이지</li>"+
									    "<li>보유근거 : 홈페이지 회원정보 수집 등에 관한 기록</li>"+
									    "<li>보유기간 : 3년</li>"+
									    "<li>관련법령 : 신용정보의 수집/처리 및 이용 등에 관한 기록 : 3년</li>"+
									"</ul><br><br>"+
									"<p class='lh6 bs4'><strong>3. 개인정보의 처리 및 보유 기간</strong><br><br>① <em class='emphasis'>주식회사 엠케이('오아시스')</em>은(는) 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집시에 동의 받은 개인정보 보유,이용기간 내에서 개인정보를 처리,보유합니다.<br><br>② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.</p>"+
									"<ul class='list_indent2 mgt10'>"+
									    "<li class='tt'>1.&lt;홈페이지 회원가입 및 관리&gt;</li>"+
									    "<li class='tt'>&lt;홈페이지 회원가입 및 관리&gt;와 관련한 개인정보는 수집.이용에 관한 동의일로부터&lt;3년&gt;까지 위 이용목적을 위하여 보유.이용됩니다.</li>"+
									    "<li>보유근거 : 홈페이지 회원정보 수집 등에 관한 기록</li>"+
									    "<li>관련법령 : 신용정보의 수집/처리 및 이용 등에 관한 기록 : 3년</li>"+
									    "<li>예외사유 : </li>"+
									"</ul>"+
									"<p class='lh6 bs4'><strong>4. 정보주체와 법정대리인의 권리·의무 및 그 행사방법 이용자는 개인정보주체로써 다음과 같은 권리를 행사할 수 있습니다.</strong></p>"+
									"<p class='ls2'>① 정보주체는 주식회사 엠케이에 대해 언제든지 개인정보 열람,정정,삭제,처리정지 요구 등의 권리를 행사할 수 있습니다.</p>"+
									"<p class='sub_p'>② 제1항에 따른 권리 행사는주식회사 엠케이에 대해 개인정보 보호법 시행령 제41조제1항에 따라 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 주식회사 엠케이은(는) 이에 대해 지체 없이 조치하겠습니다.</p>"+
									"<p class='sub_p'>③ 제1항에 따른 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수 있습니다. 이 경우 개인정보 보호법 시행규칙 별지 제11호 서식에 따른 위임장을 제출하셔야 합니다.</p>"+
									"<p class='sub_p'>④ 개인정보 열람 및 처리정지 요구는 개인정보보호법 제35조 제5항, 제37조 제2항에 의하여 정보주체의 권리가 제한 될 수 있습니다.</p>"+
									"<p class='sub_p'>⑤ 개인정보의 정정 및 삭제 요구는 다른 법령에서 그 개인정보가 수집 대상으로 명시되어 있는 경우에는 그 삭제를 요구할 수 없습니다.</p>"+
									"<p class='sub_p'>⑥ 주식회사 엠케이은(는) 정보주체 권리에 따른 열람의 요구, 정정·삭제의 요구, 처리정지의 요구 시 열람 등 요구를 한 자가 본인이거나 정당한 대리인인지를 확인합니다.</p><br><br>"+
									"<p class='lh6 bs4'><strong>5. 처리하는 개인정보의 항목 작성 </strong><br><br> ① <em class='emphasis'>주식회사 엠케이('www.cleanoasis.net'이하 '오아시스')</em>은(는) 다음의 개인정보 항목을 처리하고 있습니다.</p>"+
									"<ul class='list_indent2 mgt10'>"+
									    "<li class='tt'>1&lt;홈페이지 회원가입 및 관리&gt;</li>"+
									    "<li>필수항목 : 이메일, 휴대전화번호, 비밀번호, 로그인ID, 이름, 회사전화번호, 부서, 회사명, 서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보, 사업자번호 및 회사주소</li>"+
									    "<li>- 선택항목 : </li>"+
									"</ul><br><br>"+
									"<p class='lh6 bs4'><strong>6. 개인정보의 파기<em class='emphasis'>주식회사 엠케이('오아시스')</em>은(는) 원칙적으로 개인정보 처리목적이 달성된 경우에는 지체없이 해당 개인정보를 파기합니다. 파기의 절차, 기한 및 방법은 다음과 같습니다.</strong></p>"+
									"<p class='ls2'>-파기절차<br>이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져(종이의 경우 별도의 서류) 내부 방침 및 기타 관련 법령에 따라 일정기간 저장된 후 혹은 즉시 파기됩니다. 이 때, DB로 옮겨진 개인정보는 법률에 의한 경우가 아니고서는 다른 목적으로 이용되지 않습니다.<br><br>-파기기한<br>이용자의 개인정보는 개인정보의 보유기간이 경과된 경우에는 보유기간의 종료일로부터 5일 이내에, 개인정보의 처리 목적 달성, 해당 서비스의 폐지, 사업의 종료 등 그 개인정보가 불필요하게 되었을 때에는 개인정보의 처리가 불필요한 것으로 인정되는 날로부터 5일 이내에 그 개인정보를 파기합니다.</p>"+
									"<p class='sub_p mgt10'>-파기방법</p>"+
									"<p class='sub_p'>전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다.</p>종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다<p></p><br><br>"+
									"<p class='lh6 bs4'><strong>7. 개인정보 자동 수집 장치의 설치•운영 및 거부에 관한 사항</strong></p>"+
									"<p class='ls2'>① 주식회사 엠케이 은 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 ‘쿠키(cookie)’를 사용합니다 .② 쿠키는 웹사이트를 운영하는데 이용되는 서버(http)가 이용자의 컴퓨터 브라우저에게 보내는 소량의 정보이며 이용자들의 PC 컴퓨터내의 하드디스크에 저장되기도 합니다.<br><br>가. 쿠키의 사용 목적 : 이용자가 방문한 각 서비스와 웹 사이트들에 대한 방문 및 이용형태, 인기 검색어, 보안접속 여부, 등을 파악하여 이용자에게 최적화된 정보 제공을 위해 사용됩니다.<br>나. 쿠키의 설치•운영 및 거부 : 웹브라우저 상단의 도구&gt;인터넷 옵션&gt;개인정보 메뉴의 옵션 설정을 통해 쿠키 저장을 거부 할 수 있습니다.<br>다. 쿠키 저장을 거부할 경우 맞춤형 서비스 이용에 어려움이 발생할 수 있습니다.</p>"+
									"<p class='sub_p mgt30'><strong>8. 개인정보 보호책임자 작성 </strong></p>"+
									"<p class='sub_p mgt10'> ① <span class='colorLightBlue'>주식회사 엠케이(‘www.cleanoasis.net’이하 ‘오아시스)</span> 은(는) 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>"+
									"<ul class='list_indent2 mgt10'>"+
									    "<li class='tt'>▶ 개인정보 보호책임자 </li>"+
									    "<li>성명 :변무영</li>"+
									    "<li>직책 :대표</li>"+
									    "<li>직급 :대표</li>"+
									    "<li>연락처 :01023452379, bmyfile@gmail.com, </li>"+
									"</ul>"+
									"<p class='sub_p'>※ 개인정보 보호 담당부서로 연결됩니다.</p>"+
									"<p> </p>"+
									"<ul class='list_indent2 mgt10'>"+
									    "<li class='tt'>▶ 개인정보 보호 담당부서</li>"+
									    "<li>부서명 :개발팀</li>"+
									    "<li>담당자 :박충범</li>"+
									    "<li>연락처 :01029206090, park.choongbum@gmail.com, </li>"+
									"</ul>"+
									"<p class='sub_p'>② 정보주체께서는 주식회사 엠케이(‘www.cleanoasis.net’이하 ‘오아시스) 의 서비스(또는 사업)을 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당부서로 문의하실 수 있습니다. 주식회사 엠케이(‘www.cleanoasis.net’이하 ‘오아시스) 은(는) 정보주체의 문의에 대해 지체 없이 답변 및 처리해드릴 것입니다.</p>"+
									"<p class='sub_p mgt30'><strong>9. 개인정보 처리방침 변경 </strong></p>"+
									"<p class='sub_p mgt10'>①이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.</p><br><br>"+
									"<p class='lh6 bs4'><strong>10. 개인정보의 안전성 확보 조치 <em class='emphasis'>주식회사 엠케이('오아시스')</em>은(는) 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에 필요한 기술적/관리적 및 물리적 조치를 하고 있습니다.</strong></p>"+
									"<p class='sub_p mgt10'>1. 정기적인 자체 감사 실시<br> 개인정보 취급 관련 안정성 확보를 위해 정기적(분기 1회)으로 자체 감사를 실시하고 있습니다.<br><br>2. 개인정보 취급 직원의 최소화 및 교육<br> 개인정보를 취급하는 직원을 지정하고 담당자에 한정시켜 최소화 하여 개인정보를 관리하는 대책을 시행하고 있습니다.<br><br>3. 내부관리계획의 수립 및 시행<br> 개인정보의 안전한 처리를 위하여 내부관리계획을 수립하고 시행하고 있습니다.<br><br>4. 해킹 등에 대비한 기술적 대책<br> &lt;<em class='emphasis'>주식회사 엠케이</em>&gt;('<em class='emphasis'>오아시스</em>')은 해킹이나 컴퓨터 바이러스 등에 의한 개인정보 유출 및 훼손을 막기 위하여 보안프로그램을 설치하고 주기적인 갱신·점검을 하며 외부로부터 접근이 통제된 구역에 시스템을 설치하고 기술적/물리적으로 감시 및 차단하고 있습니다.<br><br>5. 개인정보의 암호화<br> 이용자의 개인정보는 비밀번호는 암호화 되어 저장 및 관리되고 있어, 본인만이 알 수 있으며 중요한 데이터는 파일 및 전송 데이터를 암호화 하거나 파일 잠금 기능을 사용하는 등의 별도 보안기능을 사용하고 있습니다.<br><br>6. 접속기록의 보관 및 위변조 방지<br> 개인정보처리시스템에 접속한 기록을 최소 6개월 이상 보관, 관리하고 있으며, 접속 기록이 위변조 및 도난, 분실되지 않도록 보안기능 사용하고 있습니다.<br><br>7. 개인정보에 대한 접근 제한<br> 개인정보를 처리하는 데이터베이스시스템에 대한 접근권한의 부여,변경,말소를 통하여 개인정보에 대한 접근통제를 위하여 필요한 조치를 하고 있으며 침입차단시스템을 이용하여 외부로부터의 무단 접근을 통제하고 있습니다.<br><br>8. 문서보안을 위한 잠금장치 사용<br> 개인정보가 포함된 서류, 보조저장매체 등을 잠금장치가 있는 안전한 장소에 보관하고 있습니다.<br><br>9. 비인가자에 대한 출입 통제<br> 개인정보를 보관하고 있는 물리적 보관 장소를 별도로 두고 이에 대해 출입통제 절차를 수립, 운영하고 있습니다.<br><br></p>"+
									"<p></p>";
		}
		else if(cut[1] == '' || cut[1] == 'index') {
			quote1.src = '../assets/img/quote1.png';
			quote2.src = '../assets/img/quote2.png';
			quote3.src = '../assets/img/quote3.png';
			oasis_flow.src = '../assets/img/oasis_flow.png';
		}
	}
});