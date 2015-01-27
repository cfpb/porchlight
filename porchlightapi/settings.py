# -*- coding: utf-8 -*-

from django.conf import settings

# These are used to populate choices on the Repository model.
# These should be choices pairs, with the python path first, then a
# human-readable descriptor.
PORCHLIGHT_UNDEPLOYED_SOURCES_DEFAULT = (
    ('porchlightapi.sources.random_undeployed_source', 'Random Undeployed Source'),
)
PORCHLIGHT_UNDEPLOYED_SOURCES = getattr(settings,
                                        'PORCHLIGHT_UNDEPLOYED_SOURCES',
                                        PORCHLIGHT_UNDEPLOYED_SOURCES_DEFAULT)

PORCHLIGHT_DEPLOYED_SOURCES_DEFAULT = (
    ('porchlightapi.sources.random_deployed_source', 'Random Deployed Source'),
)
PORCHLIGHT_DEPLOYED_SOURCES = getattr(settings,
                                      'PORCHLIGHT_DEPLOYED_SOURCES',
                                      PORCHLIGHT_DEPLOYED_SOURCES_DEFAULT)

PORCHLIGHT_VALUE_CALCULATOR_DEFAULT = (
    ('porchlightapi.sources.difference_value_calculator', 'Difference Between Undeployed and Deployed Value'),
    ('porchlightapi.sources.undeployed_value_only_calculator', 'Undeployed Value Only'),
)
PORCHLIGHT_VALUE_CALCULATOR = getattr(settings,
                                      'PORCHLIGHT_VALUE_CALCULATOR',
                                      PORCHLIGHT_VALUE_CALCULATOR_DEFAULT)



