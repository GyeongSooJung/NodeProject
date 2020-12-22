# mk_dokenly
MK소독기 서버 서비스 시스템


### DB 스키마 및 개발문서
https://docs.google.com/spreadsheets/d/1XDCxqrZE_kpGdcvnYWkym-wPEX0W4s33HznFVBNgwEE/edit?usp=sharing

### Git 저장소 위치
https://github.com/here4you81/mk_dokenly


### 개발서버
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

### 공지 사항
* Cloug9 소스의 README.md 파일을 자주 확인하세요.
* 변경사항의 담당자는 Excel 파일을 참고하여 주세요.


### 주요 변경 사항
* 2020-12-09일 MK 소독기 서버 서비스 시스템의 Git 저장소가 탄생했습니다.
* 회원가입 페이지 및 로그인 페이지 추가(12.2 ~ 12.7)
* 회원정보 수정 및 비밀번호 변경페이지 추가(12.8 ~ 12.9)
* PW찾기 페이지 추가(12.14 ~ 12.15)
* 로그인 전 원페이지 추가
* 체크박스를 통한 일괄처리 기능 추가
* 한국어 패치 및 전체적인 디자인 통일
* 관리자 페이지 추가(~ 12.22)

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
