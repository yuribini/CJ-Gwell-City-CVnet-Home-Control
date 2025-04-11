"""CVNet 통합 구성요소."""
import logging

from homeassistant.core import HomeAssistant
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_NAME, CONF_BASE_URL
import homeassistant.helpers.config_validation as cv
import voluptuous as vol

_LOGGER = logging.getLogger(__name__)
DOMAIN = "cvnet"

CONFIG_SCHEMA = vol.Schema(
    {
        DOMAIN: vol.Schema(
            {
                vol.Required(CONF_BASE_URL): cv.string,
                vol.Optional(CONF_NAME, default="CVNet Controller"): cv.string,
            }
        )
    },
    extra=vol.ALLOW_EXTRA,
)

PLATFORMS = ["switch", "light", "climate", "fan"]

def setup(hass: HomeAssistant, config):
    """CVNet 통합 구성요소 설정."""
    conf = config.get(DOMAIN)
    if conf is None:
        _LOGGER.error("cvnet 설정이 없습니다.")
        return False

    base_url = conf.get(CONF_BASE_URL)
    name = conf.get(CONF_NAME, "CVNet Controller")

    hass.data[DOMAIN] = {
        CONF_BASE_URL: base_url,
        CONF_NAME: name,
    }

    _LOGGER.info("CVNet 통합 (%s) 로드 완료: %s", name, base_url)
    return True

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry):
    """구성 항목에서 설정."""
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = entry.data

    for platform in PLATFORMS:
        hass.async_create_task(
            hass.config_entries.async_forward_entry_setup(entry, platform)
        )

    return True

async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry):
    """구성 항목 제거 시 언로드."""
    unloaded = all(
        await asyncio.gather(
            *[
                hass.config_entries.async_forward_entry_unload(entry, platform)
                for platform in PLATFORMS
            ]
        )
    )
    if unloaded:
        hass.data[DOMAIN].pop(entry.entry_id)

    return unloaded
