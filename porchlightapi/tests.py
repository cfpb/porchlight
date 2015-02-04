# -*- coding: utf-8 -*-

from django.test import TestCase
import mock

import datetime
from dateutil import tz

## Repository Test

from porchlightapi.models import Repository

# Constant values used for testing
UNDEPLOYED_VALUE_TUPLE = ('c9d2d5b79edd7d4acaf7172a98203bf3aee2586a',
                          datetime.datetime(year=1972, month=3, day=17, hour=8, minute=23, tzinfo=tz.tzutc()),
                          5)
DEPLOYED_VALUE_TUPLE = ('ba60a64b151e402a9f08f95710ec09db4649eb2e',
                        datetime.datetime(year=1972, month=2, day=29, hour=10, minute=45, tzinfo=tz.tzutc()),
                        2)

class RepositoryTestCase(TestCase):

    def setUp(self):
        # Create a repository object for us to test
        Repository.objects.create(
            url='https://github.com/cfpb/porchlight',
            name='Porchlight',
            project='System Tools',
            deployed_value_source='porchlightapi.sources.random_source',
            undeployed_value_source='porchlightapi.sources.random_source',
            value_calculator='porchlightapi.sources.difference_value_calculator')


    @mock.patch("porchlightapi.sources.random_source")
    def test_undeployed_value_source(self, random_source):
        """
        Test that the model's undeployed_value() function correctly
        uses the lookup function to get and run the mock data source
        function.
        """
        random_source.return_value = UNDEPLOYED_VALUE_TUPLE

        test_repo = Repository.objects.get(url='https://github.com/cfpb/porchlight')
        undeployed_value_tuple = test_repo.undeployed_value()

        self.assertEqual(undeployed_value_tuple[0], UNDEPLOYED_VALUE_TUPLE[0])
        self.assertEqual(undeployed_value_tuple[1], UNDEPLOYED_VALUE_TUPLE[1])
        self.assertEqual(undeployed_value_tuple[2], UNDEPLOYED_VALUE_TUPLE[2])

    @mock.patch("porchlightapi.sources.random_source")
    def test_deployed_value_source(self, random_source):
        """
        Test that the model's undeployed_value() function correctly
        uses the lookup function to get and run the mock data source
        function.
        """
        random_source.return_value = DEPLOYED_VALUE_TUPLE

        test_repo = Repository.objects.get(url='https://github.com/cfpb/porchlight')
        deployed_value_tuple = test_repo.deployed_value()

        self.assertEqual(deployed_value_tuple[0], DEPLOYED_VALUE_TUPLE[0])
        self.assertEqual(deployed_value_tuple[1], DEPLOYED_VALUE_TUPLE[1])
        self.assertEqual(deployed_value_tuple[2], DEPLOYED_VALUE_TUPLE[2])

    @mock.patch("porchlightapi.sources.difference_value_calculator")
    def test_value(self, difference_value_calculator):
        """
        Test that the model's value() function correctly uses the lookup function
        to get and run the value calculator function.
        """
        difference_value_calculator.return_value = 3
        test_repo = Repository.objects.get(url='https://github.com/cfpb/porchlight')

        self.assertEqual(test_repo.value(UNDEPLOYED_VALUE_TUPLE, DEPLOYED_VALUE_TUPLE),
                         5 - 2)


## Value Data Points
from porchlightapi.models import ValueDataPointManager

class ValueDataPointManagerTestCase(TestCase):

    @mock.patch('porchlightapi.models.ValueDataPoint')
    def test_create_datapoint(self, ValueDataPoint):
        """
        Test the ValueDataPointManager's creation of ValueDataPoint
        objects from Repository objects. The manager should populate
        the ValueDataPoint using the Repository's value methods, which
        call the appropriate callables.
        """
        # Create a mock repository to pass to the ValueDataPointManager
        # create_datapoint() method with the appropriate return values.
        mock_repository = mock.create_autospec(Repository)
        mock_repository.undeployed_value.return_value = UNDEPLOYED_VALUE_TUPLE
        mock_repository.deployed_value.return_value = DEPLOYED_VALUE_TUPLE
        mock_repository.value.return_value = 3

        # We want to test that the create_datapoint method extracts the correct
        # values from the repository and calls the default create() method with
        # those values.
        objects = ValueDataPointManager()
        objects.create = mock.MagicMock()

        datapoint = objects.create_datapoint(mock_repository)

        objects.create.assert_called_with(
            repository=mock_repository,
            undeployed_identifier=UNDEPLOYED_VALUE_TUPLE[0],
            undeployed_datetime=UNDEPLOYED_VALUE_TUPLE[1],
            undeployed_value=UNDEPLOYED_VALUE_TUPLE[2],
            deployed_identifier=DEPLOYED_VALUE_TUPLE[0],
            deployed_datetime=DEPLOYED_VALUE_TUPLE[1],
            deployed_value=DEPLOYED_VALUE_TUPLE[2],
            value=3)


## Test Data Sources

import datetime
from porchlightapi.sources import github_source

class DataSourceTestCase(TestCase):

    @mock.patch("requests.get")
    def test_github_source(self, mock_request_get):
        # Test that our Github source function correctly constructs URLs by
        # mocking requests.get()

        test_date = datetime.datetime(year=2015, month=01, day=26, hour=21,
                                      minute=44, second=20, tzinfo=tz.tzutc())

        # First call, to /repos/porchlight is only interested in size
        mock_repo_response = mock.MagicMock()
        mock_repo_response.json.return_value = {u'size': 1619,}

        # Second call to /repos/porchlight/branches/master is used to
        # get last commit SHA and URL
        mock_branches_response = mock.MagicMock()
        mock_branches_response.json.return_value = {u'commit':
                {u'sha': u'130df1874519c11a79ac4a2e3e6671a165860441',
                 u'url': u'https://api.github.com/repos/cfpb/porchlight/commits/130df1874519c11a79ac4a2e3e6671a165860441'}
            }

        # Third call is to the commit itself, /repos/porchlight/commits/130df1874519c11a79ac4a2e3e6671a165860441
        # is used to get the date and file data
        mock_commit_response = mock.MagicMock()
        mock_commit_response.json.return_value = {
            u'commit': {u'committer': {u'date': u'2015-01-26 21:44:20Z',},},
            u'files':[
                {'additions': 1, 'deletions': 2, 'changes':3},
                {'additions': 4, 'deletions': 5, 'changes':6},
                {'additions': 7, 'deletions': 8, 'changes':9},
            ]
        }

        mock_request_get.side_effect = [
            mock_repo_response,
            mock_branches_response,
            mock_commit_response
        ]

        porchlight_url = 'https://github.com/cfpb/porchlight'

        source_tuple = github_source(porchlight_url)

        self.assertEqual(source_tuple[0], '130df1874519c11a79ac4a2e3e6671a165860441')
        self.assertEqual(source_tuple[1], test_date)
        self.assertEqual(source_tuple[2], 15)


