# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('porchlightapi', '0002_auto_20150126_1925'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='valuedatapoint',
            options={'ordering': ('-created',)},
        ),
        migrations.AlterField(
            model_name='repository',
            name='deployed_value_source',
            field=models.CharField(help_text=b'This is a Python callable, defined in settings.py, that provides the deployed value for this repository.', max_length=200, verbose_name=b'Deployed Value Source', choices=[(b'porchlightapi.sources.random_source', b'Random Source'), (b'porchlightapi.sources.json_file_source', b'JSON File (defined in settings.py)')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='repository',
            name='undeployed_value_source',
            field=models.CharField(help_text=b'This is a Python callable, defined in settings.py, that provides the undeployed value for this repository.', max_length=200, verbose_name=b'Undeployed Value Source', choices=[(b'porchlightapi.sources.random_source', b'Random Source'), (b'porchlightapi.sources.github_source', b'Github Source')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='repository',
            name='value_calculator',
            field=models.CharField(help_text=b'This is a Python callable, defined in settings.py, that calculates the total unshipped value for this repository.', max_length=200, verbose_name=b'Value Calculator', choices=[(b'porchlightapi.sources.difference_value_calculator', b'Difference Between Undeployed and Deployed Value'), (b'porchlightapi.sources.undeployed_value_only_calculator', b'Undeployed Value Only'), (b'porchlightapi.sources.incremental_value_calculator', b'Incremental Undeployed Value (adds new value to prior value)')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='valuedatapoint',
            name='deployed_datetime',
            field=models.DateTimeField(null=True, verbose_name=b'Deployment Date/Time', blank=True),
            preserve_default=True,
        ),
    ]
