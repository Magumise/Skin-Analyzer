# This makes Python treat the directory as a package
# Can be empty, but typically imports all test classes for easier discovery

# Option 1: Explicit imports (recommended)
from .test_models import *
from .test_views import *
from .test_serializers import *
from .test_tokens import *

# Option 2: Dynamic imports (for large test suites)
"""
import pkgutil
import importlib

__all__ = []
for loader, module_name, is_pkg in pkgutil.walk_packages(__path__):
    if module_name.startswith('test_'):
        module = importlib.import_module(f'{__name__}.{module_name}')
        for name in dir(module):
            if name.startswith('Test'):
                globals()[name] = getattr(module, name)
        __all__.append(module_name)
"""