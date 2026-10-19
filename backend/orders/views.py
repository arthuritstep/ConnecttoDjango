import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from .models import BurgerOrder

ALLOWED_BUNS = ["Бриошь", "Черный"]
ALLOWED_MEATS = ["Говядина", "Курица"]
ALLOWED_INGREDIENTS = [
    "Сыр",
    "Бекон",
    "Помидор",
    "Салат",
    "Лук",
]

@csrf_exempt
@require_POST
def create_order(request):
    try:
        data = json.loads(request.body)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse(
            {"error": "Некорректный JSON"},
            status=400,
        )

    customer = data.get("customer", "").strip()
    bun = data.get("bun")
    meat = data.get("meat")
    ingredients = data.get("ingredients", [])
    quantity = data.get("quantity")

    if not customer:
        return JsonResponse(
            {"error": "Введите имя клиента"},
            status=400,
        )

    if bun not in ALLOWED_BUNS:
        return JsonResponse(
            {"error": "Выберите правильную булочку"},
            status=400,
        )

    if meat not in ALLOWED_MEATS:
        return JsonResponse(
            {"error": "Выберите мясо. Без мяса заказ недоступен"},
            status=400,
        )

    if (
        not isinstance(ingredients, list)
        or any(
            item not in ALLOWED_INGREDIENTS
            for item in ingredients
        )
    ):
        return JsonResponse(
            {"error": "Некорректные ингредиенты"},
            status=400,
        )

    if (
        not isinstance(quantity, int)
        or isinstance(quantity, bool)
        or not 1 <= quantity <= 100
    ):
        return JsonResponse(
            {"error": "Количество должно быть от 1 до 100"},
            status=400,
        )

    order = BurgerOrder.objects.create(
        customer=customer,
        bun=bun,
        meat=meat,
        ingredients=ingredients,
        quantity=quantity,
    )

    return JsonResponse(
        {
            "message": "Заказ создан!",
            "order": {
                "id": order.id,
                "customer": order.customer,
                "bun": order.bun,
                "meat": order.meat,
                "ingredients": order.ingredients,
                "quantity": order.quantity,
            },
        },
        status=201,
    )
