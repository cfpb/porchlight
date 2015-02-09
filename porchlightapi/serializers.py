# -*- coding: utf-8 -*-

from rest_framework import serializers

from django.core.paginator import Paginator
from rest_framework.pagination import PaginationSerializer

from porchlightapi.models import Repository, ValueDataPoint

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

class PaginatedValueDataPointSerializer(PaginationSerializer):
    class Meta:
        object_serializer_class = ValueDataPointSerializer

class RepositorySerializer(serializers.HyperlinkedModelSerializer):
    # Uncommment this line and comment the following line if you want paginated
    # datapoints.
    # datapoints = serializers.SerializerMethodField('paginated_datapoints')
    datapoints = ValueDataPointSerializer(many=True)

    class Meta:
        model = Repository
        fields = ('id', 'url', 'name', 'project','datapoints')

    def paginated_datapoints(self, obj):
        paginator = Paginator(obj.datapoints.order_by('-created'), 10)
        datapoints = paginator.page(1)

        serializer = PaginatedValueDataPointSerializer(datapoints)
        return serializer.data


