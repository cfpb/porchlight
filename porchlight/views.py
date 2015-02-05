from django.http import HttpResponse
from django.template import RequestContext, loader


def index(request):
    template = loader.get_template('index.html')
    """
    Returns the Porchlight index page
    """
    context = RequestContext(request, {})
    return HttpResponse(template.render(context))