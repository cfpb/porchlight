# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('porchlightapi', '0003_auto_20150206_1253'),
    ]

    operations = [
        migrations.AlterField(
            model_name='valuedatapoint',
            name='deployed_identifier',
            field=models.CharField(max_length=40, null=True, verbose_name=b'Deployment Identifier (Commit SHA)', blank=True),
            preserve_default=True,
        ),
    ]
