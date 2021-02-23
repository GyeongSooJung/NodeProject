# mk_dokenly
MK소독기 서버 서비스 시스템


### DB 스키마 및 개발문서
https://docs.google.com/spreadsheets/d/1XDCxqrZE_kpGdcvnYWkym-wPEX0W4s33HznFVBNgwEE/edit?usp=sharing

### Git 저장소 위치
https://github.com/here4you81/mk_dokenly


### 개발서버(DB/Web)
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
  - PORT = 기본 웹포트 (ex. 80)
  - IP = 홈페이지 주소  (ex. http://1.23.45.678)
  - MONGO_IP = mongodb://각 개발IP/admin (ex. mongodb://1.23.45.678:1111/admin)

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
* QR코드 링크 접속(어플 연동) - 허병철
* Index 페이지 내용 압축
* 홈페이지 및 DB주소 .env파일로 연결 - 허병철

#### 메인 스크립트 소개
소스코드 root 디렉토리에 서버 운영에 유용한 스크립트들이 추가되고 있습니다.
* show_forever_list.sh: 현재 동작중인 forever 데몬의 리스트를 확인 가능
* show_log.sh: 현재 동작중인 서버의 로그 정보를 실시간으로 확인 가능
* 

#### 폴더 소개
* /config : 환경변수가 저장되있는 폴더
* /public : 정적데이터(css 등)이 저장되있는 폴더
* /routes : html과 nodeJS간의 Router통신을 위한 폴더
* /schemas : MongoDB의 DB 스키마 및 DB 연결을 위한 폴더
* /views : html이 저장되어 있는 폴더
