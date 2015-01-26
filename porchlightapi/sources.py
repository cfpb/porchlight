# -*- coding: utf-8 -*-

import sha
import random

from django.utils import timezone

# These are mock sources for Repository data and value calculation

def mock_undeployed_source(project_url):
    """
    Generate a mock random undeployed value data point.
    """
    # Get the current datetime, generate a SHA based on that, and then pick a
    # random value
    undeployed_datetime = timezone.now()
    undeployed_identifier_sha = sha.new("{:%d%m%Y-%H%M%S.%f}".format(undeployed_datetime))
    undeployed_identifier = undeployed_identifier_sha.hexdigest()
    undeployed_value = random.randint(0, 500)
    return (undeployed_identifier, undeployed_datetime, undeployed_value)


def mock_deployed_source(project_url):
    """
    Generate a mock random deployed value data point.
    """
    # Get the current datetime, generate a SHA based on that, and then pick a
    # random value
    deployed_datetime = timezone.now()
    deployed_identifier_sha = sha.new("{:%d%m%Y-%H%M%S.%f}".format(deployed_datetime))
    deployed_identifier = deployed_identifier_sha.hexdigest()
    deployed_value = random.randint(0, 500)
    return (deployed_identifier, deployed_datetime, deployed_value)


def difference_value_calculator(undeployed_value_tuple, deployed_value_tuple):
    """
    Generate a value based on difference between given undeployed and deployed value.
    """
    return undeployed_value_tuple[2] - deployed_value_tuple[2]


def undeployed_value_only_calculator(undeployed_value_tuple, deployed_value_tuple):
    """
    Just return the undeployed value as the value.

    This calculator can be used when there will be no deployed value.
    """
    return undeployed_value_tuple[2]

