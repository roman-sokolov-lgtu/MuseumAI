import time
from collections import defaultdict
from fastapi import Request
from fastapi.responses import JSONResponse


def _get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def make_rate_limiter(max_requests: int, window_seconds: int, paths: list[str]):
    buckets: dict[str, dict[str, list[float]]] = defaultdict(lambda: defaultdict(list))
    path_set = set(paths)
    window = window_seconds

    async def rate_limit_middleware(request: Request, call_next):
        path = request.url.path
        if path in path_set:
            ip = _get_client_ip(request)
            now = time.time()
            entries = buckets[ip][path]
            cutoff = now - window
            while entries and entries[0] < cutoff:
                entries.pop(0)
            if len(entries) >= max_requests:
                retry = int(window - (now - entries[0])) + 1
                return JSONResponse(
                    status_code=429,
                    content={
                        "detail": f"Слишком много запросов. Попробуйте через {retry} сек."
                    },
                    headers={"Retry-After": str(retry)},
                )
            entries.append(now)
        return await call_next(request)

    return rate_limit_middleware
