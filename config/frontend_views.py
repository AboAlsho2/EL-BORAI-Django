from pathlib import Path

from django.conf import settings
from django.http import FileResponse, Http404


def frontend_app(request):
    index_file = Path(settings.BASE_DIR) / "frontend" / "dist" / "index.html"

    if not index_file.is_file():
        raise Http404("Frontend build not found")

    return FileResponse(index_file.open("rb"))
