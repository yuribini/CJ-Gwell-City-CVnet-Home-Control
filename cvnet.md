# CVNET 홈패드 API 문서

## API 개요
CVNET 홈패드는 HTTP와 WebSocket을 사용하여 기기들과 통신합니다:
1. HTTP: 초기 연결 및 기기 정보 조회
2. WebSocket: 실시간 기기 제어 및 상태 모니터링



## 인증 및 세션 관리

### 1. HTTP 세션
- 자동 로그인 체크
  ```
  POST: auto_login_check.do
  Parameters:
    - name: 요청 서블릿 이름
    - deviceId: 기기 고유 식별자 (device.uuid에서 하이픈 제거)
    - tokenId: FCM/푸시 서비스에서 발급받은 토큰
  Response:
    {
      "result": 1,
      "servlet_name": "device_info.do"
    }
  ```

- 로그인 요청
  ```
  POST: login.do
  Parameters:
    - id: 사용자 ID
    - password: 사용자 비밀번호
    - deviceId: 기기 고유 식별자
    - tokenId: FCM/푸시 서비스 토큰
  Response:
    {
      "result": 1,  // 성공: 1, 실패: 0
      "message": "성공/실패 메시지"
    }
  ```

### 2. WebSocket 인증
1. 연결 후 로그인 필요:
   ```javascript
   // 1. WEBSOCK_ADDRESS는 device_info.do 응답에서 받음
   wsClient = new vertx.EventBus(WEBSOCK_ADDRESS);
   
   // 2. 로그인 수행
   wsClient.login(id, 'cvnet', function(reply) {
     if (reply.result == true && reply.id == id) {
       // 3. 로그인 성공 시 이벤트 핸들러 등록
       wsClient.registerHandler(dev, handler);
       // 4. 상태 요청
       requestStatus();
     }
   });
   ```
2. 로그인 성공 시 응답:
   ```json
   {
     "result": true,
     "id": "사용자ID"
   }
   ```

### 3. 메시지 인증
모든 WebSocket 메시지는 다음 인증 정보를 포함해야 합니다:
- `id`: device_info.do 응답에서 받은 사용자 ID
- `remote_addr`: device_info.do 응답의 tcp_remote_addr

## API 명세

### 1. 기기 정보 조회

#### 1.1 난방 정보 조회
- **Endpoint**: `/cvnet/tablet/device_info.do`
- **Method**: POST
- **Content-Type**: application/x-www-form-urlencoded
- **Parameters**:
  ```
  type: "0x16" (난방)
  ```
- **Response**:
  ```json
  {
    "result": 1,
    "is_use": true,
    "contents": [
      {
        "number": 1,
        "title": "거실",
        "current_temp": 23,
        "setting_temp": 22
      }
    ],
    "websock_address": "웹소켓주소",
    "tcp_remote_addr": "원격주소",
    "id": "사용자ID"
  }
  ```

#### 1.2 에어컨 정보 조회
- **Endpoint**: `/cvnet/tablet/device_info.do`
- **Method**: POST
- **Content-Type**: application/x-www-form-urlencoded
- **Parameters**:
  ```
  type: "0x17" (에어컨)
  ```
- **Response**: 난방과 동일한 형식

#### 1.3 가스밸브 정보 조회
- **Endpoint**: `/cvnet/tablet/device_info.do`
- **Method**: POST
- **Content-Type**: application/x-www-form-urlencoded
- **Parameters**:
  ```
  type: "0x11" (가스밸브)
  ```
- **Response**:
  ```json
  {
    "result": 1,
    "is_use": true,
    "websock_address": "웹소켓주소",
    "tcp_remote_addr": "원격주소",
    "id": "사용자ID"
  }
  ```

### 2. 실시간 제어 (WebSocket)

#### 2.1 연결 설정
- WebSocket 연결은 vertx.EventBus를 통해 이루어집니다
- 연결 주소는 device_info.do 응답의 websock_address를 사용
- 연결 후 로그인 및 이벤트 핸들러 등록 필요

#### 2.2 난방 제어 메시지

1. **제어 요청**
```json
{
  "id": "사용자ID",
  "remote_addr": "원격주소",
  "request": "control",
  "number": "방번호",
  "onoff": "1|0",
  "temp": "설정온도"
}
```

2. **상태 응답**
```json
{
  "dev": 22,
  "contents": [{
    "number": 1,
    "current_temp": 23,
    "setting_temp": 21,
    "status": 1,
    "onoff": 1
  }],
  "ho": "2001",
  "dong": "0106"
}
```

#### 2.3 에어컨 제어 메시지

1. **제어 요청**
```json
{
  "id": "사용자ID",
  "remote_addr": "원격주소",
  "number": "방번호",
  "request": "control",
  "onoff": "1|0",
  "operation": "운전모드(0-3)",
  "wind": "바람세기(0-3)",
  "timer": "0",
  "running": "1|0",
  "setting_temp": "설정온도"
}
```

2. **상태 응답**
```json
{
  "number": "방번호",
  "onoff": 1,
  "current_temp": 23,
  "setting_temp": 21,
  "wind": 2,
  "operation": 1
}
```

3. **전체 제어 요청**
```json
{
  "id": "사용자ID",
  "remote_addr": "원격주소",
  "request": "control_all",
  "onoff": "1|0"
}
```

#### 2.4 가스밸브 제어 메시지

1. **상태 조회 요청**
```json
{
  "id": "사용자ID",
  "remote_addr": "원격주소",
  "request": "status"
}
```

2. **밸브 닫기 요청**
```json
{
  "id": "사용자ID",
  "remote_addr": "원격주소",
  "request": "control"
}
```

3. **상태 응답**
```json
{
  "status": "0x01",
  "onoff": 1  // 1: 열림, 0: 닫힘
}
```

### 3. 운전 모드 및 바람 세기

#### 3.1 운전 모드 (operation)
- 0: 자동
- 1: 냉방
- 2: 제습
- 3: 송풍

#### 3.2 바람 세기 (wind)
- 0: 자동
- 1: 약풍
- 2: 중풍
- 3: 강풍

### 4. 상태 코드
- `status: 0x01` - 정상
- `status: 0xFF` - 통신단절
- `status: 0xFE` - 주소에러

### 5. 기기별 특이사항

#### 5.1 가스밸브
- 가스밸브는 안전을 위해 열기 기능은 제공하지 않고, 닫기 기능만 제공됩니다
- 밸브가 열린 상태(onoff: 1)에서만 닫기 동작이 가능합니다
- 상태 변경 시 UI에서 시각적 피드백 제공:
  - 열림: 파란색 텍스트로 "가스열림" 표시
  - 닫힘: 주황색 텍스트로 "가스잠김" 표시

#### 5.2 에어컨/난방
- 온도 설정 범위: 18°C ~ 30°C
- 전체 제어 기능 제공 (전체 켜기/끄기)
- 각 방별 개별 제어 가능

## Home Assistant 연동 방법

CVNET 홈패드를 Home Assistant와 연동하기 위해 custom integration을 개발할 수 있습니다. 
다음은 연동을 위한 기본 접근 방법입니다:

### 1. 인증 및 세션 유지
```python
import requests
import json
import asyncio
from vertx_python_client import EventBus  # 별도 구현 필요

class CVNETHomepad:
    def __init__(self, host, username, password, device_id="0", token_id="0"):
        self.host = host
        self.username = username
        self.password = password
        self.device_id = device_id
        self.token_id = token_id
        self.session = requests.Session()
        self.ws_client = None
        self.user_id = None
        self.remote_addr = None
        self.ws_address = None

    async def login(self):
        # HTTP 로그인
        login_data = {
            "id": self.username,
            "password": self.password,
            "deviceId": self.device_id,
            "tokenId": self.token_id
        }
        response = self.session.post(f"{self.host}/cvnet/tablet/login.do", data=login_data)
        if response.json()["result"] != 1:
            raise Exception("로그인 실패")
        
        # 기기 정보 가져오기
        return await self.get_device_info()
        
    async def get_device_info(self, device_type="0x16"):  # 기본: 난방
        response = self.session.post(
            f"{self.host}/cvnet/tablet/device_info.do", 
            data={"type": device_type}
        )
        data = response.json()
        if data["result"] != 1:
            raise Exception("기기 정보 조회 실패")
            
        self.user_id = data["id"]
        self.remote_addr = data["tcp_remote_addr"]
        self.ws_address = data["websock_address"]
        return data
        
    async def connect_websocket(self):
        # WebSocket 연결 및 로그인
        self.ws_client = EventBus(self.ws_address)
        await self.ws_client.login(self.user_id, "cvnet")
        return self.ws_client
        
    async def control_heating(self, room_number, temperature, onoff=1):
        # 난방 제어 요청
        message = {
            "id": self.user_id,
            "remote_addr": self.remote_addr,
            "request": "control",
            "number": str(room_number),
            "onoff": str(onoff),
            "temp": str(temperature)
        }
        await self.ws_client.publish(message)
        
    async def control_gas_valve(self, close=True):
        # 가스밸브 제어 (안전상 닫기만 가능)
        if close:
            message = {
                "id": self.user_id,
                "remote_addr": self.remote_addr,
                "request": "control"
            }
            await self.ws_client.publish(message)
```

### 2. Home Assistant configuration.yaml 설정 예시
```yaml
sensor:
  - platform: cvnet_homepad
    host: https://bd-gwell.uasis.com
    username: !secret cvnet_username
    password: !secret cvnet_password
    scan_interval: 60  # 1분마다 상태 업데이트
    
climate:
  - platform: cvnet_homepad
    host: https://bd-gwell.uasis.com
    username: !secret cvnet_username
    password: !secret cvnet_password
    
switch:
  - platform: cvnet_homepad
    host: https://bd-gwell.uasis.com
    username: !secret cvnet_username
    password: !secret cvnet_password
    switches:
      - name: "가스밸브"
        device_type: "0x11"
```

### 3. 구현 시 주의사항
- WebSocket 연결 상태를 주기적으로 확인하고 끊어진 경우 재연결해야 합니다
- HTTP 세션이 만료된 경우 자동 로그인을 수행해야 합니다
- `vertx.EventBus` 클라이언트 구현이 필요합니다 (Python에서는 별도 라이브러리 필요)
- 연결 및 인증 정보 캐싱을 통해 불필요한 재인증을 방지해야 합니다
- 가스밸브는 안전상 닫기 기능만 사용하도록 구현합니다

## 구현 시 주의사항
- WebSocket 연결이 끊어진 경우 자동으로 재연결을 시도해야 합니다
- 제어 요청 후 5초 이내에 응답이 없으면 타임아웃 처리가 필요합니다
- 모든 온도 값은 섭씨(°C) 단위를 사용합니다
- 세션이 만료된 경우 자동 로그인을 시도합니다
- WebSocket 연결이 끊어진 경우 재연결 시 로그인 과정을 다시 수행해야 합니다
- CVNET 홈패드 API는 토큰 기반의 다단계 인증을 사용하므로 모든 인증 단계를 올바르게 처리해야 합니다