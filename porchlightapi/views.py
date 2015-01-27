# -*- coding: utf-8 -*-
from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets
from rest_framework import filters

from porchlightapi.models import Repository, ValueDataPoint
from porchlightapi.serializers import RepositorySerializer, ValueDataPointSerializer

class RepositoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Returns a list of all available repositories in Porchlight.

    The `name`, `project`, and `url` fields can all be searched using
    `?search=`. For example, `?search=porc` will match Porchlight.

    Ordering can be changed based on `name`, `project`, and `url` using
    `?ordering=`. For example, `?ordering=name` will order by name,
    alphabetically. The ordering can be reversed using `?ordering=-name`.
    """
    queryset = Repository.objects.all()
    serializer_class = RepositorySerializer
    filter_backends = (filters.SearchFilter, filters.OrderingFilter)
    search_fields = ('name', 'project', 'url')
    ordering_fields = ('name', 'project', 'url')

class ValueDataPointViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Returns a list of available value data points in Porchlight.

    The data points can be searched based on their associated
    repository's `name`, `project`, or `url` using `?search=`. For
    example, `?search=porc` would return a list of all data points
    associated with the Porchlight repository.

    Data points are always ordered descending by the date the data point
    was created.
    """
    queryset = ValueDataPoint.objects.all()
    serializer_class = ValueDataPointSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ('repository__name', 'repository__project', 'repository__url')


