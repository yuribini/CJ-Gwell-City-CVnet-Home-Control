import logging
import requests
import voluptuous as vol

from homeassistant.components.climate import (
    ClimateEntity,
    PLATFORM_SCHEMA,
    HVACMode,
    ClimateEntityFeature,
    FAN_LOW, FAN_MEDIUM, FAN_HIGH, FAN_AUTO,
)
from homeassistant.const import (
    ATTR_TEMPERATURE,
    TEMP_CELSIUS,
)
import homeassistant.helpers.config_validation as cv

_LOGGER = logging.getLogger(__name__)

# API 엔드포인트 경로
API_CONTROL_PATH = "/api/control"
API_STATUS_PATH = "/api/status"

# 모드 매핑 (CVNet -> HomeAssistant)
HVAC_MODE_MAP = {
    "1": HVACMode.COOL,  # 냉방
    "2": HVACMode.HEAT,  # 난방
    "3": HVACMode.DRY,   # 제습
    "4": HVACMode.FAN_ONLY  # 송풍
}

# 모드 매핑 (HomeAssistant -> CVNet)
HVAC_MODE_MAP_REVERSE = {v: k for k, v in HVAC_MODE_MAP.items()}

# 팬 속도 매핑
FAN_MODE_MAP = {
    "1": FAN_LOW,
    "2": FAN_MEDIUM,
    "3": FAN_HIGH,
    "4": FAN_AUTO
}

# 팬 속도 매핑 (HomeAssistant -> CVNet)
FAN_MODE_MAP_REVERSE = {v: k for k, v in FAN_MODE_MAP.items()}

PLATFORM_SCHEMA = vol.Schema({
    vol.Required("base_url"): cv.string,    # https://bd-gwell.uasis.com
    vol.Required("number"): cv.string,      # 에어컨 번호
    vol.Optional("min_temp", default=18): cv.positive_int,
    vol.Optional("max_temp", default=30): cv.positive_int,
})

def setup_platform(hass, config, add_entities, discovery_info=None):
    base_url = config["base_url"]
    number = config["number"]
    min_temp = config["min_temp"]
    max_temp = config["max_temp"]
    add_entities([CVNetClimate(base_url, number, min_temp, max_temp)], True)

class CVNetClimate(ClimateEntity):
    def __init__(self, base_url, number, min_temp, max_temp):
        self._base_url = base_url.rstrip("/")  # 끝에 슬래시 제거
        self._number = number
        self._state = False
        self._name = f"CVNet AirCon {number}"
        self._hvac_mode = HVACMode.OFF
        self._target_temperature = 24
        self._current_temperature = None
        self._fan_mode = FAN_MEDIUM
        self._min_temp = min_temp
        self._max_temp = max_temp
        self._operation_mode = "1"  # 기본 냉방
        self._wind = "2"  # 기본 중풍

    @property
    def name(self):
        return self._name

    @property
    def supported_features(self):
        return ClimateEntityFeature.TARGET_TEMPERATURE | ClimateEntityFeature.FAN_MODE

    @property
    def temperature_unit(self):
        return TEMP_CELSIUS

    @property
    def hvac_modes(self):
        return [HVACMode.OFF, HVACMode.COOL, HVACMode.HEAT, HVACMode.DRY, HVACMode.FAN_ONLY]

    @property
    def hvac_mode(self):
        return self._hvac_mode

    @property
    def fan_modes(self):
        return [FAN_LOW, FAN_MEDIUM, FAN_HIGH, FAN_AUTO]

    @property
    def fan_mode(self):
        return self._fan_mode

    @property
    def current_temperature(self):
        return self._current_temperature

    @property
    def target_temperature(self):
        return self._target_temperature

    @property
    def min_temp(self):
        return self._min_temp

    @property
    def max_temp(self):
        return self._max_temp

    def set_temperature(self, **kwargs):
        """온도 설정"""
        if ATTR_TEMPERATURE not in kwargs:
            return
        
        temperature = int(kwargs[ATTR_TEMPERATURE])
        
        url = f"{self._base_url}{API_CONTROL_PATH}"
        payload = {
            "device": "aircon",
            "action": "control",
            "number": self._number,
            "running": "1",
            "operation": self._operation_mode,
            "wind": self._wind,
            "setting_temp": str(temperature)
        }
        
        try:
            r = requests.post(url, json=payload, timeout=5)
            r.raise_for_status()
            self._target_temperature = temperature
            self._hvac_mode = HVAC_MODE_MAP.get(self._operation_mode, HVACMode.COOL)
        except requests.RequestException as e:
            _LOGGER.error("에어컨 온도 설정 요청 실패 (%s): %s", url, e)

    def set_fan_mode(self, fan_mode):
        """팬 모드 설정"""
        wind = FAN_MODE_MAP_REVERSE.get(fan_mode, "2")  # 기본값은 중풍
        
        url = f"{self._base_url}{API_CONTROL_PATH}"
        payload = {
            "device": "aircon",
            "action": "control",
            "number": self._number,
            "running": "1",
            "operation": self._operation_mode,
            "wind": wind,
            "setting_temp": str(self._target_temperature)
        }
        
        try:
            r = requests.post(url, json=payload, timeout=5)
            r.raise_for_status()
            self._fan_mode = fan_mode
            self._wind = wind
        except requests.RequestException as e:
            _LOGGER.error("에어컨 팬 모드 설정 요청 실패 (%s): %s", url, e)

    def set_hvac_mode(self, hvac_mode):
        """에어컨 모드 설정"""
        if hvac_mode == HVACMode.OFF:
            self.turn_off()
            return
        
        operation = HVAC_MODE_MAP_REVERSE.get(hvac_mode, "1")  # 기본값은 냉방
        
        url = f"{self._base_url}{API_CONTROL_PATH}"
        payload = {
            "device": "aircon",
            "action": "control",
            "number": self._number,
            "running": "1",
            "operation": operation,
            "wind": self._wind,
            "setting_temp": str(self._target_temperature)
        }
        
        try:
            r = requests.post(url, json=payload, timeout=5)
            r.raise_for_status()
            self._hvac_mode = hvac_mode
            self._operation_mode = operation
        except requests.RequestException as e:
            _LOGGER.error("에어컨 모드 설정 요청 실패 (%s): %s", url, e)

    def turn_on(self):
        """에어컨 켜기"""
        url = f"{self._base_url}{API_CONTROL_PATH}"
        payload = {
            "device": "aircon",
            "action": "control",
            "number": self._number,
            "running": "1",
            "operation": self._operation_mode,
            "wind": self._wind,
            "setting_temp": str(self._target_temperature)
        }
        
        try:
            r = requests.post(url, json=payload, timeout=5)
            r.raise_for_status()
            self._hvac_mode = HVAC_MODE_MAP.get(self._operation_mode, HVACMode.COOL)
        except requests.RequestException as e:
            _LOGGER.error("에어컨 켜기 요청 실패 (%s): %s", url, e)

    def turn_off(self):
        """에어컨 끄기"""
        url = f"{self._base_url}{API_CONTROL_PATH}"
        payload = {
            "device": "aircon",
            "action": "control",
            "number": self._number,
            "running": "0"
        }
        
        try:
            r = requests.post(url, json=payload, timeout=5)
            r.raise_for_status()
            self._hvac_mode = HVACMode.OFF
        except requests.RequestException as e:
            _LOGGER.error("에어컨 끄기 요청 실패 (%s): %s", url, e)

    def update(self):
        """상태 업데이트"""
        url = f"{self._base_url}{API_STATUS_PATH}?device=aircon&number={self._number}"
        try:
            r = requests.get(url, timeout=5)
            r.raise_for_status()
            data = r.json()
            
            # 전원 상태
            running = data.get("running", "0")
            if running == "0":
                self._hvac_mode = HVACMode.OFF
            else:
                operation = data.get("operation", "1")
                self._operation_mode = operation
                self._hvac_mode = HVAC_MODE_MAP.get(operation, HVACMode.COOL)
            
            # 온도 설정
            self._target_temperature = int(data.get("setting_temp", 24))
            
            # 현재 온도 (있는 경우)
            if "current_temp" in data:
                self._current_temperature = int(data.get("current_temp"))
            
            # 팬 모드
            wind = data.get("wind", "2")
            self._wind = wind
            self._fan_mode = FAN_MODE_MAP.get(wind, FAN_MEDIUM)
            
        except requests.RequestException as e:
            _LOGGER.error("에어컨 상태 조회 실패 (%s): %s", url, e)
