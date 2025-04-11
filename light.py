import logging
import requests
import voluptuous as vol

from homeassistant.components.light import (
    LightEntity, 
    ATTR_BRIGHTNESS,
    SUPPORT_BRIGHTNESS,
    COLOR_MODE_BRIGHTNESS,
)
import homeassistant.helpers.config_validation as cv

_LOGGER = logging.getLogger(__name__)

# API 엔드포인트 경로
API_CONTROL_PATH = "/api/control"
API_STATUS_PATH = "/api/status"

PLATFORM_SCHEMA = vol.Schema({
    vol.Required("base_url"): cv.string,    # https://bd-gwell.uasis.com
    vol.Required("zone"): cv.string,        # 조명 구역 번호
    vol.Required("number"): cv.string,      # 조명 번호
})

def setup_platform(hass, config, add_entities, discovery_info=None):
    base_url = config["base_url"]
    zone = config["zone"]
    number = config["number"]
    add_entities([CVNetLight(base_url, zone, number)], True)

class CVNetLight(LightEntity):
    def __init__(self, base_url, zone, number):
        self._base_url = base_url.rstrip("/")  # 끝에 슬래시 제거
        self._zone = zone
        self._number = number
        self._state = False
        self._brightness = 255  # 밝기 기본값 (0-255)
        self._name = f"CVNet Light Zone {zone} Num {number}"
        self._supported_features = SUPPORT_BRIGHTNESS
        self._attr_color_mode = COLOR_MODE_BRIGHTNESS
        self._attr_supported_color_modes = {COLOR_MODE_BRIGHTNESS}

    @property
    def name(self):
        return self._name

    @property
    def is_on(self):
        return self._state

    @property
    def brightness(self):
        return self._brightness

    @property
    def supported_features(self):
        return self._supported_features

    def turn_on(self, **kwargs):
        """조명 켜기 및 밝기 조절"""
        url = f"{self._base_url}{API_CONTROL_PATH}"
        
        # 밝기 값이 제공된 경우 처리 (0-255를 0-100으로 변환)
        if ATTR_BRIGHTNESS in kwargs:
            brightness_pct = int(kwargs[ATTR_BRIGHTNESS] / 255 * 100)
            payload = {
                "device": "light", 
                "action": "dimming", 
                "zone": self._zone, 
                "number": self._number, 
                "brightness": brightness_pct
            }
            self._brightness = kwargs[ATTR_BRIGHTNESS]
        else:
            # 단순 전원 켜기
            payload = {
                "device": "light", 
                "action": "on", 
                "zone": self._zone, 
                "number": self._number
            }
        
        try:
            r = requests.post(url, json=payload, timeout=5)
            r.raise_for_status()
            self._state = True
        except requests.RequestException as e:
            _LOGGER.error("조명 켜기/밝기 조절 요청 실패 (%s): %s", url, e)

    def turn_off(self, **kwargs):
        """조명 끄기"""
        url = f"{self._base_url}{API_CONTROL_PATH}"
        payload = {
            "device": "light", 
            "action": "off", 
            "zone": self._zone, 
            "number": self._number
        }
        
        try:
            r = requests.post(url, json=payload, timeout=5)
            r.raise_for_status()
            self._state = False
        except requests.RequestException as e:
            _LOGGER.error("조명 끄기 요청 실패 (%s): %s", url, e)

    def update(self):
        """상태 업데이트"""
        url = f"{self._base_url}{API_STATUS_PATH}?device=light&zone={self._zone}&number={self._number}"
        try:
            r = requests.get(url, timeout=5)
            r.raise_for_status()
            data = r.json()
            self._state = data.get("state", False)
            
            # 밝기 정보가 있는 경우 (0-100에서 0-255로 변환)
            if "brightness" in data:
                self._brightness = int(data["brightness"] / 100 * 255)
        except requests.RequestException as e:
            _LOGGER.error("조명 상태 조회 실패 (%s): %s", url, e)
