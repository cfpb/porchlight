# -*- coding: utf-8 -*-

import sha
import random

from django.utils import timezone

# These are mock sources for Repository data and value calculation

def random_source(repository):
    """
    Generate a random undeployed value data point.
    """
    # Get the current datetime, generate a SHA based on that, and then pick a
    # random value
    datetime = timezone.now()
    identifier_sha = sha.new("{:%d%m%Y-%H%M%S.%f}".format(datetime))
    identifier = identifier_sha.hexdigest()
    value = random.randint(0, 500)
    return (identifier, datetime, value)

