import logging
import requests
import voluptuous as vol

from homeassistant.components.fan import (
    FanEntity,
    SUPPORT_SET_SPEED,
    PLATFORM_SCHEMA
)
from homeassistant.util.percentage import (
    int_states_in_range,
    ranged_value_to_percentage,
    percentage_to_ranged_value,
)
import homeassistant.helpers.config_validation as cv

_LOGGER = logging.getLogger(__name__)

# API 엔드포인트 경로
API_CONTROL_PATH = "/api/control"
API_STATUS_PATH = "/api/status"

# 팬 속도 등급 (1: 약, 2: 중, 3: 강)
SPEED_RANGE = (1, 3)

PLATFORM_SCHEMA = vol.Schema({
    vol.Required("base_url"): cv.string,    # https://bd-gwell.uasis.com
})

def setup_platform(hass, config, add_entities, discovery_info=None):
    base_url = config["base_url"]
    add_entities([CVNetFan(base_url)], True)

class CVNetFan(FanEntity):
    def __init__(self, base_url):
        self._base_url = base_url.rstrip("/")  # 끝에 슬래시 제거
        self._state = False
        self._name = "CVNet Ventilator"
        self._percentage = 0
        self._speed = 0
        self._kitchen_link = False
        self._bathroom_link = False

    @property
    def name(self):
        return self._name

    @property
    def is_on(self):
        return self._state

    @property
    def percentage(self):
        """팬 속도 백분율 반환"""
        return ranged_value_to_percentage(SPEED_RANGE, self._speed) if self._state else 0

    @property
    def speed_count(self):
        """사용 가능한 속도 수 반환"""
        return int_states_in_range(SPEED_RANGE)

    @property
    def supported_features(self):
        """지원되는 기능 반환"""
        return SUPPORT_SET_SPEED

    @property
    def extra_state_attributes(self):
        """추가 속성 반환"""
        return {
            "kitchen_link": self._kitchen_link,
            "bathroom_link": self._bathroom_link
        }

    def set_percentage(self, percentage):
        """팬 속도 설정"""
        if percentage == 0:
            self.turn_off()
            return

        # 백분율을 실제 속도(1-3)로 변환
        speed = int(percentage_to_ranged_value(SPEED_RANGE, percentage))
        
        url = f"{self._base_url}{API_CONTROL_PATH}"
        payload = {
            "device": "ventilator",
            "action": "control",
            "control_type": "fan",
            "wind_power": str(speed),
            "kitchen_relation": "1" if self._kitchen_link else "0",
            "bath_relation": "1" if self._bathroom_link else "0"
        }
        
        try:
            r = requests.post(url, json=payload, timeout=5)
            r.raise_for_status()
            self._speed = speed
            self._state = True
        except requests.RequestException as e:
            _LOGGER.error("환기장치 속도 설정 요청 실패 (%s): %s", url, e)

    def turn_on(self, percentage=None, **kwargs):
        """환기장치 켜기"""
        if percentage is not None:
            self.set_percentage(percentage)
            return

        # 기본 속도 설정 (중간)
        self.set_percentage(50)

    def turn_off(self, **kwargs):
        """환기장치 끄기"""
        url = f"{self._base_url}{API_CONTROL_PATH}"
        payload = {
            "device": "ventilator",
            "action": "control",
            "control_type": "fan",
            "wind_power": "0",
            "kitchen_relation": "1" if self._kitchen_link else "0",
            "bath_relation": "1" if self._bathroom_link else "0"
        }
        
        try:
            r = requests.post(url, json=payload, timeout=5)
            r.raise_for_status()
            self._state = False
            self._speed = 0
        except requests.RequestException as e:
            _LOGGER.error("환기장치 끄기 요청 실패 (%s): %s", url, e)

    def update(self):
        """상태 업데이트"""
        url = f"{self._base_url}{API_STATUS_PATH}?device=ventilator"
        try:
            r = requests.get(url, timeout=5)
            r.raise_for_status()
            data = r.json()
            
            # 풍량 상태
            wind_power = int(data.get("wind_power", "0"))
            self._speed = wind_power
            self._state = wind_power > 0
            
            # 주방/욕실 연동 상태
            self._kitchen_link = data.get("kitchen_relation", "0") == "1"
            self._bathroom_link = data.get("bath_relation", "0") == "1"
            
        except requests.RequestException as e:
            _LOGGER.error("환기장치 상태 조회 실패 (%s): %s", url, e)
