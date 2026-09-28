# Django + PostgreSQL + Docker + React/Vite/TypeScript

Стартовый full-stack шаблон с API и frontend в отдельных контейнерах.

## Запуск

1. Скопируйте `.env.example` в `.env`.
2. Выполните:

```bash
docker compose up --build
```

Откройте:

- Frontend: http://localhost:5173
- Django API health-check: http://localhost:8000/api/health/
- Django admin: http://localhost:8000/admin/

Для остановки:

```bash
docker compose down
```

Для удаления данных PostgreSQL:

```bash
docker compose down -v
```

## Структура

```text
backend/    Django-проект и API
frontend/   React + Vite + TypeScript
docker-compose.yml
```
