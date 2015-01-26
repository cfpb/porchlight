# -*- coding: utf-8 -*-

import sha
import random

import requests
import json

from django.utils import timezone

# These are mock sources for Repository data and value calculation

def mock_source(project_url):
    """
    Generate a mock random value data point.
    """
    # Get the current datetime, generate a SHA based on that, and then pick a
    # random value
    source_datetime = timezone.now()
    source_identifier_sha = sha.new("{:%d%m%Y-%H%M%S.%f}".format(source_datetime))
    source_identifier = source_identifier_sha.hexdigest()
    source_value = random.randint(0, 500)
    return (source_identifier, source_datetime, source_value)


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

