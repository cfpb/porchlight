# -*- coding: utf-8 -*-
from django.shortcuts import render

# Create your views here.

import django_filters

from rest_framework import viewsets
from rest_framework import filters

from porchlightapi.models import Repository, ValueDataPoint
from porchlightapi.serializers import RepositorySerializer, ValueDataPointSerializer

class RepositoryFilter(django_filters.FilterSet):
    """
    Provide filtering of repository objects based on name or project.
    This is 'icontains' filtering, so a repo with the name "Porchlight"
    will match 'por', 'Por', etc.
    """
    name = django_filters.CharFilter(name="name", lookup_type='icontains')
    project = django_filters.CharFilter(name="project", lookup_type='icontains')
    class Meta:
        model = Repository
        fields = ['name', 'project',]

class RepositoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    A REST view of repositories. Provides GET listing of Repositories,
    filtering on name and project, and individual repsositories on id.
    """
    queryset = Repository.objects.all()
    serializer_class = RepositorySerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = RepositoryFilter
    # filter_fields = ('name', 'project')

class ValueDataPointViewSet(viewsets.ReadOnlyModelViewSet):
    """
    A REST view of data points.
    """
    queryset = ValueDataPoint.objects.all()
    serializer_class = ValueDataPointSerializer


