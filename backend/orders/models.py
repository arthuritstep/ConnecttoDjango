from django.db import models

class BurgerOrder(models.Model):
    customer = models.CharField(max_length=100)
    bun = models.CharField(max_length=50)
    meat = models.CharField(max_length=50)
    ingredients = models.JSONField(default=list)
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer} — {self.bun} burger"
