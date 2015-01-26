# -*- coding: utf-8 -*-
from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets

from porchlightapi.models import Repository, ValueDataPoint
from porchlightapi.serializers import RepositorySerializer, ValueDataPointSerializer

class RepositoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Repository.objects.all()
    serializer_class = RepositorySerializer

class ValueDataPointViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ValueDataPoint.objects.all()
    serializer_class = ValueDataPointSerializer


