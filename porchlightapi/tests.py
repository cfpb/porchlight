# -*- coding: utf-8 -*-

from django.test import TestCase
from mock import patch

import datetime
import pytz

## Repository Test

from porchlightapi.models import Repository

# Constant values used for testing
UNDEPLOYED_VALUE_TUPLE = ('c9d2d5b79edd7d4acaf7172a98203bf3aee2586a',
                          datetime.datetime(year=1972, month=3, day=17, hour=8, minute=23, tzinfo=pytz.utc),
                          5)
DEPLOYED_VALUE_TUPLE = ('ba60a64b151e402a9f08f95710ec09db4649eb2e',
                        datetime.datetime(year=1972, month=2, day=29, hour=10, minute=45, tzinfo=pytz.utc),
                        2)

# Test Repository object
def create_test_repository():
    Repository.objects.create(
        url='https://github.com/cfpb/porchlight',
        name='Porchlight',
        project='System Tools',
        deployed_value_source='porchlightapi.sources.mock_deployed_source',
        undeployed_value_source='porchlightapi.sources.mock_undeployed_source',
        value_calculator='porchlightapi.sources.difference_value_calculator')

class RepositoryTestCase(TestCase):

    def setUp(self):
        create_test_repository()

    @patch("porchlightapi.sources.mock_undeployed_source")
    def test_undeployed_value_source(self, mock_undeployed_source):
        """
        Test that the model's undeployed_value() function correctly
        uses the lookup function to get and run the mock data source
        function.
        """
        mock_undeployed_source.return_value = UNDEPLOYED_VALUE_TUPLE

        test_repo = Repository.objects.get(url='https://github.com/cfpb/porchlight')
        undeployed_value_tuple = test_repo.undeployed_value()

        self.assertEqual(undeployed_value_tuple[0], UNDEPLOYED_VALUE_TUPLE[0])
        self.assertEqual(undeployed_value_tuple[1], UNDEPLOYED_VALUE_TUPLE[1])
        self.assertEqual(undeployed_value_tuple[2], UNDEPLOYED_VALUE_TUPLE[2])

    @patch("porchlightapi.sources.mock_deployed_source")
    def test_deployed_value_source(self, mock_deployed_source):
        """
        Test that the model's undeployed_value() function correctly
        uses the lookup function to get and run the mock data source
        function.
        """
        mock_deployed_source.return_value = DEPLOYED_VALUE_TUPLE

        test_repo = Repository.objects.get(url='https://github.com/cfpb/porchlight')
        deployed_value_tuple = test_repo.deployed_value()

        self.assertEqual(deployed_value_tuple[0], DEPLOYED_VALUE_TUPLE[0])
        self.assertEqual(deployed_value_tuple[1], DEPLOYED_VALUE_TUPLE[1])
        self.assertEqual(deployed_value_tuple[2], DEPLOYED_VALUE_TUPLE[2])

    @patch("porchlightapi.sources.difference_value_calculator")
    def test_value(self, difference_value_calculator):
        """
        Test that the model's value() function correctly uses the lookup function
        to get and run the value calculator function.
        """
        difference_value_calculator.return_value = 3
        test_repo = Repository.objects.get(url='https://github.com/cfpb/porchlight')

        self.assertEqual(test_repo.value(UNDEPLOYED_VALUE_TUPLE, DEPLOYED_VALUE_TUPLE),
                         5 - 2)

    def tearDown(self):
        pass


