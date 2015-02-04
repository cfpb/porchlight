# -*- coding: utf-8 -*-

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

