FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    python3-dev \
    default-libmysqlclient-dev \
    libssl-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip setuptools wheel

COPY requirement.txt .

RUN pip install -r requirement.txt

COPY . .


EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
