# -*- coding: utf-8 -*-

from rest_framework import serializers

from porchlightapi.models import Repository, ValueDataPoint

class RepositorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Repository
        fields = ('id', 'url', 'name', 'project','datapoints')

class ValueDataPointSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ValueDataPoint
        fields = ('id',
                  'created',
                  'undeployed_identifier',
                  'undeployed_datetime',
                  'deployed_identifier',
                  'deployed_datetime',
                  'value',)



