# Node.js v21.7.1 기반 이미지 사용
FROM node:21.7.1

# 작업 디렉토리 설정
WORKDIR /usr/app

# package.json과 yarn.lock 파일 복사
COPY package.json yarn.lock ./

# 의존성 설치
RUN yarn install

# 프로젝트 파일 복사 (현재 디렉토리의 모든 것을 컨테이너의 작업 디렉토리로 복사)
COPY . .

# 애플리케이션 포트 노출 (Nest.js 기본 포트는 3000)
EXPOSE 3000

# 애플리케이션 실행
# CMD ["yarn", "start:prod"]
