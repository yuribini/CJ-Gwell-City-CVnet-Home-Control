import logging
import requests
import voluptuous as vol

from homeassistant.components.climate import (
    ClimateEntity,
    PLATFORM_SCHEMA,
    HVACMode,
    ClimateEntityFeature,
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

PLATFORM_SCHEMA = vol.Schema({
    vol.Required("base_url"): cv.string,    # https://bd-gwell.uasis.com
    vol.Required("number"): cv.string,      # 난방 번호
    vol.Optional("min_temp", default=5): cv.positive_int,
    vol.Optional("max_temp", default=40): cv.positive_int,
})

def setup_platform(hass, config, add_entities, discovery_info=None):
    base_url = config["base_url"]
    number = config["number"]
    min_temp = config["min_temp"]
    max_temp = config["max_temp"]
    add_entities([CVNetHeating(base_url, number, min_temp, max_temp)], True)

class CVNetHeating(ClimateEntity):
    def __init__(self, base_url, number, min_temp, max_temp):
        self._base_url = base_url.rstrip("/")  # 끝에 슬래시 제거
        self._number = number
        self._state = False
        self._name = f"CVNet Heating {number}"
        self._hvac_mode = HVACMode.OFF
        self._target_temperature = 22
        self._current_temperature = None
        self._min_temp = min_temp
        self._max_temp = max_temp

    @property
    def name(self):
        return self._name

    @property
    def supported_features(self):
        return ClimateEntityFeature.TARGET_TEMPERATURE

    @property
    def temperature_unit(self):
        return TEMP_CELSIUS

    @property
    def hvac_modes(self):
        return [HVACMode.OFF, HVACMode.HEAT]

    @property
    def hvac_mode(self):
        return self._hvac_mode

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
            "device": "heating",
            "action": "control",
            "number": self._number,
            "onoff": "1",
            "temp": str(temperature)
        }
        
        try:
            r = requests.post(url, json=payload, timeout=5)
            r.raise_for_status()
            self._target_temperature = temperature
            self._hvac_mode = HVACMode.HEAT
        except requests.RequestException as e:
            _LOGGER.error("난방 온도 설정 요청 실패 (%s): %s", url, e)

    def set_hvac_mode(self, hvac_mode):
        """난방 모드 설정"""
        if hvac_mode == HVACMode.OFF:
            self.turn_off()
        elif hvac_mode == HVACMode.HEAT:
            self.turn_on()

    def turn_on(self):
        """난방 켜기"""
        url = f"{self._base_url}{API_CONTROL_PATH}"
        payload = {
            "device": "heating",
            "action": "control",
            "number": self._number,
            "onoff": "1",
            "temp": str(self._target_temperature)
        }
        
        try:
            r = requests.post(url, json=payload, timeout=5)
            r.raise_for_status()
            self._hvac_mode = HVACMode.HEAT
        except requests.RequestException as e:
            _LOGGER.error("난방 켜기 요청 실패 (%s): %s", url, e)

    def turn_off(self):
        """난방 끄기"""
        url = f"{self._base_url}{API_CONTROL_PATH}"
        payload = {
            "device": "heating",
            "action": "control",
            "number": self._number,
            "onoff": "0"
        }
        
        try:
            r = requests.post(url, json=payload, timeout=5)
            r.raise_for_status()
            self._hvac_mode = HVACMode.OFF
        except requests.RequestException as e:
            _LOGGER.error("난방 끄기 요청 실패 (%s): %s", url, e)

    def update(self):
        """상태 업데이트"""
        url = f"{self._base_url}{API_STATUS_PATH}?device=heating&number={self._number}"
        try:
            r = requests.get(url, timeout=5)
            r.raise_for_status()
            data = r.json()
            
            # 전원 상태
            onoff = data.get("onoff", "0")
            self._hvac_mode = HVACMode.HEAT if onoff == "1" else HVACMode.OFF
            
            # 온도 설정
            self._target_temperature = int(data.get("temp", 22))
            
            # 현재 온도 (있는 경우)
            if "current_temp" in data:
                self._current_temperature = int(data.get("current_temp"))
            
        except requests.RequestException as e:
            _LOGGER.error("난방 상태 조회 실패 (%s): %s", url, e)
