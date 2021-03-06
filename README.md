# mk_dokenly
MK소독기 서버 서비스 시스템


### DB 스키마 및 개발문서
https://docs.google.com/spreadsheets/d/1XDCxqrZE_kpGdcvnYWkym-wPEX0W4s33HznFVBNgwEE/edit?usp=sharing

### Git 저장소 위치
https://github.com/here4you81/mk_dokenly


### 개발서버(DB/Web)
* DB
  - 퍼블릭IP : 52.79.91.12:9003
  - 프라이빗IP : 172.26.6.34:9003
* Web
  - www.cleanoasis.net
    + 3.36.183.74
    + 3.36.183.74:9002 (cloud9)
  - 테스트개발서버(허병철)
    + 18.140.74.102
    + 18.140.74.102:9002 (cloud9)
    + 18.140.74.102:9003 (MongoDB)

http://52.79.245.187:9005/
http://13.125.32.71:8008/
#### App을 위한 Cloud9
http://13.125.32.71:9003/
id : admin
pw : root


### 사용법
본 README.md 파일을 통해 팀원들과 소통하시기 바랍니다.
서버 시스템 개발과 관련한 공지사항은 하단의 공지 사항 부분에, 그리고 소스코드의 주요 변경 사항은 하단의 주요 변경 사항에 추가하시기 바랍니다.
* README 마크다운 작성법: https://gist.github.com/ihoneymon/652be052a0727ad59601
* .env 파일 설정법
  - 기본설정
    + SESSION_SECRET = 세션 비밀키
    + COOKIE_SECRET = 쿠키 비밀키
    + PORT = 기본 웹포트 (ex. 80)
    + IP = 홈페이지 주소  (ex. http://1.23.45.678)
    + MONGO_ID = 몽고DB - 아이디
    + MONGO_PWD = 몽고DB - 비밀번호
    + MONGO_IP = 몽고DB - IP
    + MONGO_PORT = 몽고DB - PORT
  - 아임포트
    + imp_code = 아임포트 식별자 코드
    + imp_key = 아임포트 REST API 키
    + imp_secret = 아임포트 REST API 비밀키
  - 카카오 Developers
    + KAKAO = 카카오 개발자 API
  - 솔라피(SMS)
    + sol_key = 솔라피 REST API 키
    + sol_secret = 솔라피 REST API 비밀키
  - GMAIL
    + gmail = 구글 앱 비밀번호(app에서 구글 계정 사용을 위해)
  - QR코드 버전
    + publish_cat = QR코드 카테고리(버전)
  - 도로명주소api
    + juso = 도로명주소 API 승인키
  - imgBB(이미지 무료 호스팅)
    + imgBB = 무료 호스팅 API 키

### 공지 사항
* Cloug9 소스의 README.md 파일을 자주 확인하세요.
* 변경사항의 담당자는 Excel 파일을 참고하여 주세요.

### 정의
* 차량 등급 정의
  + 경차: 1, 소형: 2, 중형: 3, 대형: 4, SUV: 5, 승합: 6, 상용: 7, 전기: 8, 외제: 9
  - 준중형(아반테)은 소형으로 편입

### 주요 변경 사항
* 2020-12-09일 MK 소독기 서버 서비스 시스템의 Git 저장소가 탄생했습니다.
* 회원가입 페이지 및 로그인 페이지 추가(12.2 ~ 12.7) - 유대선
* 회원정보 수정 및 비밀번호 변경페이지 추가(12.8 ~ 12.9) - 유대선
* 장비 등록, 수정 페이지(~ 12.11) - 정경수
* 차량 등록, 수정 페이지(~ 12.11) - 허병철
* PW찾기 페이지 추가(12.14 ~ 12.15) - 유대선
* 로그인 전 원페이지 추가
* QR코드 페이지
* 작업자 승인 절차(~ 12.18) - 정경수
* 이메일 인증 시스템(~ 12.18) - 정경수
* 소독 이력 차트 페이지(~ 12.18) - 허병철
* 체크박스를 통한 일괄처리 기능 추가
* 한국어 패치 및 전체적인 디자인 통일
* 관리자 페이지 추가(~ 12.22) - 정경수
* 이메일 디자인 추가(~ 12.22) - 정경수
* 통계 페이지( ~ ) - 유대선
* 엑셀 파일 업로드 시스템( ~ ) - 허병철
* 회원 탈퇴 기능 - 정경수
* 사이드 메뉴 active 효과 - 허병철
* 브라우저별 일시 표현 - 허병철
* 엑셀 파일 업로드 조건 수정 - 정경수
* QR코드 링크 접속(어플 연동) - 허병철
* Index 페이지 내용 압축
* 리스트 index번호 및 내용 수정 - 정경수
* pagenation 수정 - 허병철
* 검색기능 수정 - 정경수
* 홈페이지 및 DB주소 .env파일로 연결 - 허병철
* QR코드 접속 시 타입 별 count 기능 - 허병철
* Node 서버 및 DB 서버 분리
* 결제 시스템 - 허병철, 정경수
* 장비 등록,수정 권한 AU가 Default 2, 사업주권한 1 에서 MK본사권한 0, Default 1, 사업주권한 2, 대리점권한 3 으로 변경되었습니다.(21.5.24)
* 소속과 권한에 따른 장비 - 박충범
  - 0: MK 관리자 - 모든장비 검색/사용
  - 1: 작업자(default) - 구매장비 검색/사용
  - 2: 사업주 - 구매장비 검색/사용/등록/갱신/삭제
  - 3: 대리점 - 모든장비 검색/
  

#### 메인 스크립트 소개
소스코드 root 디렉토리에 서버 운영에 유용한 스크립트들이 추가되고 있습니다.
* show_forever_list.sh: 현재 동작중인 forever 데몬의 리스트를 확인 가능
* show_log.sh: 현재 동작중인 서버의 로그 정보를 실시간으로 확인 가능

#### 폴더 소개
* /config : 환경변수가 저장되있는 폴더
* /public : 정적데이터(css 등)이 저장되있는 폴더
* /routes : html과 nodeJS간의 Router통신을 위한 폴더
* /schemas : MongoDB의 DB 스키마 및 DB 연결을 위한 폴더
* /views : html이 저장되어 있는 폴더

#### 공정 결과 노출
오아시스의 소독결과는 QR코드나 알림톡 등을 이용해서 외부로 노출할 수 있으며 이 때 사용되는 URL은 다음과 같다.
* 유입 path: QR코드나 알림톡을 통해 사용자가 접근하는 유입링크용 path => /inflow/
  - 기본 주소: http://cleanoasis.net/inflow/
  - 첫번째 link: http://cleanoasis.net/inflow/?cat=1

* 제공 path: QR코드나 알림톡을 통해 접근한 사용자에게 해당 페이지를 제공할 때 사용할 path => /publish/
  - 기본 주소: http://cleanoasis.net/publish/
