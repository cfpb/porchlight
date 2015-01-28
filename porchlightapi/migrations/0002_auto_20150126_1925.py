# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('porchlightapi', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='valuedatapoint',
            name='created',
            field=models.DateTimeField(auto_now_add=True, verbose_name=b'Datetime of Data Point Creation', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='repository',
            name='deployed_value_source',
            field=models.CharField(help_text=b'This is a Python callable, defined in settings.py, that provides the deployed value for this repository.', max_length=200, verbose_name=b'Deployed Value Source', choices=[(b'porchlightapi.sources.mock_undeployed_source', b'Mock Undeployed Source')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='repository',
            name='name',
            field=models.CharField(help_text=b'The human-friendly repository name.', max_length=200, verbose_name=b'Repository Name'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='repository',
            name='project',
            field=models.CharField(help_text=b'The human-friendly project name that this repository belongs to.', max_length=200, verbose_name=b'Project'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='repository',
            name='undeployed_value_source',
            field=models.CharField(help_text=b'This is a Python callable, defined in settings.py, that provides the undeployed value for this repository.', max_length=200, verbose_name=b'Undeployed Value Source', choices=[(b'porchlightapi.sources.mock_deployed_source', b'Mock Deployed Source')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='repository',
            name='url',
            field=models.URLField(help_text=b'A URL, most likely Github, that is used as the unique identifier for this repository across undeployed and deployed sources.', unique=True, verbose_name=b'Identifing URL'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='repository',
            name='value_calculator',
            field=models.CharField(help_text=b'This is a Python callable, defined in settings.py, that calculates the total unshipped value for this repository.', max_length=200, verbose_name=b'Value Calculator', choices=[(b'porchlightapi.sources.difference_value_calculator', b'Difference Between Undeployed and Deployed Value'), (b'porchlightapi.sources.undeployed_value_only_calculator', b'Undeployed Value Only')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='valuedatapoint',
            name='repository',
            field=models.ForeignKey(related_name='datapoints', to='porchlightapi.Repository'),
            preserve_default=True,
        ),
    ]
