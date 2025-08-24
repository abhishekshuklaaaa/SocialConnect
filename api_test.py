from django.http import JsonResponse

def handler(request):
    return JsonResponse({"status": "ok", "message": "Django API is working"})