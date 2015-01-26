# -*- coding: utf-8 -*-

from django.core.management.base import BaseCommand, CommandError

from porchlightapi.models import Repository, ValueDataPoint

class Command(BaseCommand):
    args = '<repository_url repository_url ...>'
    help = 'Fetch value data points for the given repositories'

    def handle(self, *args, **options):
        for repository_url in args:
            try:
                repository = Repository.objects.get(url=repository_url)
            except Repository.DoesNotExist:
                raise CommandError('Repository {} is not in Porchlight'.format(repository_url))

            datapoint = ValueDataPoint.objects.create_datapoint(repository)

            self.stdout.write('Got datapoint for {}: {}'.format(repository_url, datapoint.value))


