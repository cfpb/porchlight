# -*- coding: utf-8 -*-

from django.db import models

from porchlightapi import settings
from porchlightapi.utils import get_class_or_func


class Repository(models.Model):
    """
    A repository of code that is deployed that may or may not have
    unshipped value in the difference between the git repository and
    the deployment.

    The repository will have specific data source scripts associated. At
    collection time these scripts will run to collect the data used to
    calculate a value differential between what is deployed and
    undeployed, and this will data will be stored as a ValueDataPoint.

    There may not actually be a 'value' associated with the deployment,
    but simply an identifier and a datetime, and that's OK. The
    deployment value source and value calcualtor will simply have to
    understand each other.
    """
    class Meta:
        verbose_name_plural = 'Repositories'

    # XXX: I don't like 'URL' here, but this is our primary reference point
    url = models.URLField('Identifing URL', unique=True,
                          help_text='A URL, most likely Github, that is used as the unique identifier for this repository across undeployed and deployed sources.')

    name = models.CharField('Repository Name', max_length=200,
                            help_text='The human-friendly repository name.')
    project = models.CharField('Project', max_length=200,
                               help_text='The human-friendly project name that this repository belongs to.')

    # These are python callables that run to determine the deployed value and the
    # undeployed value of this
    deployed_value_source = models.CharField('Deployed Value Source',
                                choices=settings.PORCHLIGHT_DEPLOYED_SOURCES,
                                max_length=200,
                                help_text='This is a Python callable, defined in settings.py, that provides the deployed value for this repository.')
    undeployed_value_source = models.CharField('Undeployed Value Source',
                                choices=settings.PORCHLIGHT_UNDEPLOYED_SOURCES,
                                max_length=200,
                                help_text='This is a Python callable, defined in settings.py, that provides the undeployed value for this repository.')

    # This is a particular
    value_calculator = models.CharField('Value Calculator',
                                choices=settings.PORCHLIGHT_VALUE_CALCULATOR,
                                max_length=200,
                                help_text='This is a Python callable, defined in settings.py, that calculates the total unshipped value for this repository.')

    def __unicode__(self):
        return self.name

    def deployed_value(self):
        """
        Get and run the deployed_value_source.

        A undeployed_value_source callable should take the project URL
        as its only argument.

        A deployed_value_source callable should return a tuple containing:
            (deployment identifier, deployment datetime, value)

        Note: the datetime IS NOT the datetime that the callable is called.

        There may not actually be a 'value' associated with the deployment,
        but simply an identifier and a datetime, and that's OK. The
        deployment value source and value calcualtor will simply have to
        understand each other.
        """
        deployed_value_func = get_class_or_func(self.deployed_value_source)
        result = deployed_value_func(self)
        return result

    def undeployed_value(self):
        """
        Get and run the deployed_value_source.

        A undeployed_value_source callable should take the project URL
        as its only argument.

        A undeployed_value_source callable should return a tuple containing:
            (latest undeployed identifier, latest undeployed datetime, value)

        Note: the datetime IS NOT the datetime that the callable is called.
        """
        undeployed_value_func = get_class_or_func(self.undeployed_value_source)
        result = undeployed_value_func(self)
        return result

    def value(self, undeployed_value_tuple, deployed_value_tuple):
        """
        Get and run the value_calculator.

        A undeployed_value_source callable should take the value tuples
        as its arguments and return an integer value.
        """
        value_calculator_func = get_class_or_func(self.value_calculator)
        return value_calculator_func(self, undeployed_value_tuple, deployed_value_tuple)


class ValueDataPointManager(models.Manager):
    def create_datapoint(self, repository):
        """
        Create a ValueDataPoint from the given Repository. The data
        point will be populated using Repository.undeployed_value()
        and Repository.deployed_value().
        """
        # Get the value tuples
        undeployed_value = repository.undeployed_value()
        deployed_value = repository.deployed_value()

        # Calculate the value
        value = repository.value(undeployed_value, deployed_value)

        # Create the data point object
        datapoint = self.create(repository=repository,
                                 undeployed_identifier=undeployed_value[0],
                                 undeployed_datetime=undeployed_value[1],
                                 undeployed_value=undeployed_value[2],
                                 deployed_identifier=deployed_value[0],
                                 deployed_datetime=deployed_value[1],
                                 deployed_value=deployed_value[2],
                                 value=value)
        return datapoint

class ValueDataPoint(models.Model):
    """
    A value differntial calculation data point. This model captures the
    result of the undeployed and deployed value callables.

    There may not actually be a 'value' associated with the deployment,
    but simply an identifier and a datetime, and that's OK. The
    deployment value source and value calcualtor will simply have to
    understand each other.

    Yes, that paragraph is in here three times, but that's because it's
    important.
    """
    class Meta:
        ordering = ('-created',)

    objects = ValueDataPointManager()

    repository = models.ForeignKey('Repository', related_name='datapoints')
    created = models.DateTimeField('Datetime of Data Point Creation',
                                    auto_now_add=True, null=True)

    undeployed_identifier = models.CharField('Latest Undeployed Identifier (i.e. commit SHA)',
                                             max_length=40)
    undeployed_datetime = models.DateTimeField('Latest Undeployed Date/Time')
    undeployed_value = models.IntegerField('Deployed Value', default=0)

    deployed_identifier = models.CharField('Deployment Identifier (Commit SHA)',
                                           max_length=40, blank=True, null=True)
    deployed_datetime = models.DateTimeField('Deployment Date/Time', blank=True, null=True)
    deployed_value = models.IntegerField('Deployed Value', default=0)

    value = models.IntegerField('Unshipped Value Calculation', default=0)


