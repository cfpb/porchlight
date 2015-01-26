# -*- coding: utf-8 -*-

from django.test import TestCase

import datetime
import pytz
import sha

# Test Date times
UNDEPLOYED_DATETIME = datetime.datetime(year=1972, month=3, day=17, hour=8, minute=23, tzinfo=pytz.utc)
DEPLOYED_DATETIME = datetime.datetime(year=1972, month=2, day=29, hour=10, minute=45, tzinfo=pytz.utc)

# Test Repository object
def create_test_repository():
    Repository.objects.create(
        url='https://github.com/cfpb/porchlight',
        name='Porchlight',
        project='System Tools',
        deployed_value_source='porchlightapi.tests.reliable_mock_deployed_source',
        undeployed_value_source='porchlightapi.tests.reliable_mock_undeployed_source',
        value_calculator='porchlightapi.sources.difference_value_calculator')

## Repository Test

from porchlightapi.models import Repository

def reliable_mock_undeployed_source(project_url):
    undeployed_datetime = UNDEPLOYED_DATETIME
    # Should be 'c9d2d5b79edd7d4acaf7172a98203bf3aee2586a'
    undeployed_identifier_sha = sha.new('Reliable Undeployed Identifier')
    undeployed_identifier = undeployed_identifier_sha.hexdigest()
    undeployed_value = 5
    return (undeployed_identifier, undeployed_datetime, undeployed_value)

def reliable_mock_deployed_source(project_url):
    deployed_datetime = DEPLOYED_DATETIME
    # Should be 'ba60a64b151e402a9f08f95710ec09db4649eb2e'
    deployed_identifier_sha = sha.new('Reliable Deployed Identifier')
    deployed_identifier = deployed_identifier_sha.hexdigest()
    deployed_value = 2
    return (deployed_identifier, deployed_datetime, deployed_value)

class RepositoryTestCase(TestCase):

    def setUp(self):
        create_test_repository()

    def test_undeployed_value_source(self):
        """
        Test that the model's undeployed_value() function correctly
        uses the lookup function to get and run the mock data source
        function.
        """
        test_repo = Repository.objects.get(url='https://github.com/cfpb/porchlight')
        undeployed_value_tuple = test_repo.undeployed_value()

        self.assertEqual(undeployed_value_tuple[0], 'c9d2d5b79edd7d4acaf7172a98203bf3aee2586a', )
        self.assertEqual(undeployed_value_tuple[1], UNDEPLOYED_DATETIME)
        self.assertEqual(undeployed_value_tuple[2], 5)

    def test_deployed_value_source(self):
        """
        Test that the model's undeployed_value() function correctly
        uses the lookup function to get and run the mock data source
        function.
        """
        test_repo = Repository.objects.get(url='https://github.com/cfpb/porchlight')
        deployed_value_tuple = test_repo.deployed_value()

        self.assertEqual(deployed_value_tuple[0], 'ba60a64b151e402a9f08f95710ec09db4649eb2e', )
        self.assertEqual(deployed_value_tuple[1], DEPLOYED_DATETIME)
        self.assertEqual(deployed_value_tuple[2], 2)

    def tearDown(self):
        pass


## Value Data Points
from porchlightapi.models import ValueDataPoint

class ValueDataPointTestCase(TestCase):

    def setUp(self):
        create_test_repository()

    def test_value_data_point_creation(self):
        test_repo = Repository.objects.get(url='https://github.com/cfpb/porchlight')
        datapoint = ValueDataPoint.objects.create_datapoint(test_repo)

        # Make sure the data from value tuples are correct
        self.assertEqual(datapoint.undeployed_identifier, 'c9d2d5b79edd7d4acaf7172a98203bf3aee2586a', )
        self.assertEqual(datapoint.undeployed_datetime, UNDEPLOYED_DATETIME)
        self.assertEqual(datapoint.undeployed_value, 5)
        self.assertEqual(datapoint.deployed_identifier, 'ba60a64b151e402a9f08f95710ec09db4649eb2e', )
        self.assertEqual(datapoint.deployed_datetime, DEPLOYED_DATETIME)
        self.assertEqual(datapoint.deployed_value, 2)

        # Make sure the value is correct.
        self.assertEqual(datapoint.value, 5 - 2)

    def tearDown(self):
        pass


## Test Data Sources

class DataSourceTestCase(TestCase):

    def setUp(self):
        pass

    def test_mock_source(self):
        pass


