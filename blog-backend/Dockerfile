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
RUN pip install gunicorn


COPY . .


EXPOSE 8001

CMD ["gunicorn", "blog.wsgi:application", "--bind", "0.0.0.0:8001"]
