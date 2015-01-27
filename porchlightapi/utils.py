 # -*- coding: utf-8 -*-

from django.utils.importlib import import_module
from django.core.exceptions import ImproperlyConfigured

def get_class_or_func(import_path):
    """
    Use Django's importlib to help load a function or a class from a
    full python module path string.
    """
    module, attr = import_path.rsplit('.', 1)
    try:
        mod = import_module(module)
    except ImportError as e:
        raise ImproperlyConfigured('Error importing module %s: "%s"' %
                                   (module, e))

    try:
        imported = getattr(mod, attr)
    except AttributeError:
        raise ImproperlyConfigured('Module "%s" does not define a "%s" '
                                   'class or function.' % (module, attr))

    return imported


