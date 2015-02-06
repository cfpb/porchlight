# -*- coding: utf-8 -*-
from porchlightapi.models import Repository, ValueDataPoint


def difference_value_calculator(repository, undeployed_value_tuple, deployed_value_tuple):
    """
    Generate a value based on difference between given undeployed and deployed value.
    """
    return undeployed_value_tuple[2] - deployed_value_tuple[2]


def undeployed_value_only_calculator(repository, undeployed_value_tuple, deployed_value_tuple):
    """
    Just return the undeployed value as the value.

    This calculator can be used when there will be no deployed value.
    """
    return undeployed_value_tuple[2]


def incremental_value_calculator(repository, undeployed_value_tuple, deployed_value_tuple):
    """
    Add the undeployed value to the previous data point's value, if one exists.
    """
    # If the undeployed SHA is the same as the deployed SHA, the value
    # differential is 0.
    if undeployed_value_tuple[0] == deployed_value_tuple[0]:
        return 0

    # Otherwise Get previous value so we can increment it up by the value
    # of the current commit.
    try:
        last_datapoint = repository.datapoints.all()[0]
    except IndexError:
        return undeployed_value_tuple[2]

    return last_datapoint.value + undeployed_value_tuple[2]

