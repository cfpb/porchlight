# -*- coding: utf-8 -*-
from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets
from rest_framework import filters

from porchlightapi.models import Repository, ValueDataPoint
from porchlightapi.serializers import RepositorySerializer, ValueDataPointSerializer

class RepositoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    A REST view of repositories. Provides GET listing of Repositories,
    filtering on name and project, and individual repsositories on id.
    """
    queryset = Repository.objects.all()
    serializer_class = RepositorySerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ('name', 'project', 'url')

class ValueDataPointViewSet(viewsets.ReadOnlyModelViewSet):
    """
    A REST view of data points.
    """
    queryset = ValueDataPoint.objects.all()
    serializer_class = ValueDataPointSerializer


