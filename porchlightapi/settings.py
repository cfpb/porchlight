# -*- coding: utf-8 -*-

from django.conf import settings

# These are used to populate choices on the Repository model.
# These should be choices pairs, with the python path first, then a
# human-readable descriptor.
PORCHLIGHT_UNDEPLOYED_SOURCES_DEFAULT = (
    ('porchlightapi.sources.random_source', 'Random Source'),
    ('porchlightapi.sources.github_source', 'Github Source'),
)
PORCHLIGHT_UNDEPLOYED_SOURCES = getattr(settings,
                                        'PORCHLIGHT_UNDEPLOYED_SOURCES',
                                        PORCHLIGHT_UNDEPLOYED_SOURCES_DEFAULT)

PORCHLIGHT_DEPLOYED_SOURCES_DEFAULT = (
    ('porchlightapi.sources.random_source', 'Random Source'),
    ('porchlightapi.sources.json_file_source', 'JSON File (defined in settings.py)'),
)
PORCHLIGHT_DEPLOYED_SOURCES = getattr(settings,
                                      'PORCHLIGHT_DEPLOYED_SOURCES',
                                      PORCHLIGHT_DEPLOYED_SOURCES_DEFAULT)

PORCHLIGHT_VALUE_CALCULATOR_DEFAULT = (
    ('porchlightapi.sources.difference_value_calculator', 'Difference Between Undeployed and Deployed Value'),
    ('porchlightapi.sources.undeployed_value_only_calculator', 'Undeployed Value Only'),
    ('porchlightapi.sources.incremental_undeployed_value_calculator', 'Incremental Undeployed Value (adds new value to prior value)'),
)
PORCHLIGHT_VALUE_CALCULATOR = getattr(settings,
                                      'PORCHLIGHT_VALUE_CALCULATOR',
                                      PORCHLIGHT_VALUE_CALCULATOR_DEFAULT)

PORCHLIGHT_JSON_FILE_DEFAULT = 'repos.json'
PORCHLIGHT_JSON_FILE = getattr(settings,
                               'PORCHLIGHT_JSON_FILE',
                               PORCHLIGHT_JSON_FILE_DEFAULT)



