import logging
import requests
import voluptuous as vol

from homeassistant.components.switch import SwitchEntity
import homeassistant.helpers.config_validation as cv

_LOGGER = logging.getLogger(__name__)

# JS에서 확인한 endpoint path만 남기고, base_url 과 합쳐서 요청할 것
API_CONTROL_PATH = "/api/control"
API_STATUS_PATH  = "/api/status"

PLATFORM_SCHEMA = vol.Schema({
    vol.Required("base_url"): cv.string,    # https://bd-gwell.uasis.com
    vol.Required("device"):   cv.string,    # light, ac, vent 등
})

def setup_platform(hass, config, add_entities, discovery_info=None):
    base_url = config["base_url"]
    device   = config["device"]
    add_entities([CVNetSwitch(base_url, device)], True)

class CVNetSwitch(SwitchEntity):
    def __init__(self, base_url, device):
        self._base_url = base_url.rstrip("/")     # 끝에 슬래시 제거
        self._device   = device
        self._state    = False
        self._name     = f"CVNet {device.capitalize()}"

    @property
    def name(self):
        return self._name

    @property
    def is_on(self):
        return self._state

    def turn_on(self, **kwargs):
        url = f"{self._base_url}{API_CONTROL_PATH}"
        payload = {"device": self._device, "action": "on"}
        try:
            r = requests.post(url, json=payload, timeout=5)
            r.raise_for_status()
            self._state = True
        except requests.RequestException as e:
            _LOGGER.error("ON 요청 실패 (%s): %s", url, e)

    def turn_off(self, **kwargs):
        url = f"{self._base_url}{API_CONTROL_PATH}"
        payload = {"device": self._device, "action": "off"}
        try:
            r = requests.post(url, json=payload, timeout=5)
            r.raise_for_status()
            self._state = False
        except requests.RequestException as e:
            _LOGGER.error("OFF 요청 실패 (%s): %s", url, e)

    def update(self):
        url = f"{self._base_url}{API_STATUS_PATH}?device={self._device}"
        try:
            r = requests.get(url, timeout=5)
            r.raise_for_status()
            data = r.json()
            self._state = data.get("state", False)
        except requests.RequestException as e:
            _LOGGER.error("상태 조회 실패 (%s): %s", url, e)