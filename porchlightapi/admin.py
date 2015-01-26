# -*- coding: utf-8 -*-

from django.contrib import admin

from porchlightapi.models import Repository
from porchlightapi.models import ValueDataPoint

class RepositoryAdmin(admin.ModelAdmin):
    list_display = ('project', 'name', 'url',)
    list_display_links = ('project', 'name',)
    search_fields = ('name', 'url',)
    list_filter = ('project',)
admin.site.register(Repository, RepositoryAdmin)

class ValueDataPointAdmin(admin.ModelAdmin):
    # All the fields are readonly
    list_display = ('undeployed_identifier',
                    'undeployed_datetime',
                    'deployed_identifier',
                    'deployed_datetime',
                    'value')
    readonly_fields = ('repository',
                       'undeployed_identifier',
                       'undeployed_datetime',
                       'undeployed_value',
                       'deployed_identifier',
                       'deployed_datetime',
                       'deployed_value',
                       'value',)

    # We don't allow admin to add or change data points. Only view.
    def has_add_permission(self, request):
        return False


admin.site.register(ValueDataPoint, ValueDataPointAdmin)

