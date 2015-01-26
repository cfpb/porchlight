# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Repository',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('url', models.URLField(unique=True, verbose_name=b'Identifing URL, probably Github')),
                ('name', models.CharField(max_length=200, verbose_name=b'Repository Name')),
                ('project', models.CharField(max_length=200, verbose_name=b'Project')),
                ('deployed_value_source', models.CharField(max_length=200, verbose_name=b'Deployed Value Source', choices=[(b'porchlightapi.sources.mock_undeployed_source', b'Mock Undeployed Source')])),
                ('undeployed_value_source', models.CharField(max_length=200, verbose_name=b'Undeployed Value Source', choices=[(b'porchlightapi.sources.mock_deployed_source', b'Mock Deployed Source')])),
                ('value_calculator', models.CharField(max_length=200, verbose_name=b'Value Calculator', choices=[(b'porchlightapi.sources.difference_value_calculator', b'Difference Between Undeployed and Deployed Value'), (b'porchlightapi.sources.undeployed_value_only_calculator', b'Undeployed Value Only')])),
            ],
            options={
                'verbose_name_plural': 'Repositories',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ValueDataPoint',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('undeployed_identifier', models.CharField(max_length=40, verbose_name=b'Latest Undeployed Identifier (i.e. commit SHA)')),
                ('undeployed_datetime', models.DateTimeField(verbose_name=b'Latest Undeployed Date/Time')),
                ('undeployed_value', models.IntegerField(default=0, verbose_name=b'Deployed Value')),
                ('deployed_identifier', models.CharField(max_length=40, verbose_name=b'Deployment Identifier (Commit SHA)')),
                ('deployed_datetime', models.DateTimeField(verbose_name=b'Deployment Date/Time')),
                ('deployed_value', models.IntegerField(default=0, verbose_name=b'Deployed Value')),
                ('value', models.IntegerField(default=0, verbose_name=b'Unshipped Value Calculation')),
                ('repository', models.ForeignKey(to='porchlightapi.Repository')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
