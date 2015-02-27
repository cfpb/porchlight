# -*- coding: utf-8 -*-

from django.contrib import admin

from porchlightapi.models import Repository
from porchlightapi.models import ValueDataPoint

class RepositoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'project', 'url',)
    list_display_links = ('name',)
    search_fields = ('name', 'url',)
    list_filter = ('project',)
admin.site.register(Repository, RepositoryAdmin)

class ValueDataPointAdmin(admin.ModelAdmin):
    # All the fields are readonly
    list_display = ('created',
                    'repository',
                    'undeployed_datetime',
                       'undeployed_identifier',
                    'deployed_datetime',
                       'deployed_identifier',
                    'value')
    readonly_fields = ('repository',
                       'created',
                       'undeployed_identifier',
                       'undeployed_datetime',
                       'undeployed_value',
                       'deployed_identifier',
                       'deployed_datetime',
                       'deployed_value',
                       'value',)
    list_filter = ('repository',)

    # We don't allow admin to add or change data points. Only view.
    def has_add_permission(self, request):
        return False

admin.site.register(ValueDataPoint, ValueDataPointAdmin)

