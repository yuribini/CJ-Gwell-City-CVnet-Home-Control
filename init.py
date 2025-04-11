def setup(hass, config):
    conf = config.get("cvnet")
    if conf is None:
        _LOGGER.error("cvnet 설정이 없습니다.")
        return False

    base_url = conf.get("base_url")
    name     = conf.get("name", "CVNet Controller")

    hass.data["cvnet"] = {
        "base_url": base_url,
        "name": name,
    }

    _LOGGER.info("CVNet 통합 (%s) 로드 완료: %s", name, base_url)
    return True