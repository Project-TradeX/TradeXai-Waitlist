# TradeX Backend

Lightweight, production-ready backend for the TradeX pre-launch landing page.

## Tech Stack
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL (Neon Serverless)
- **ORM**: SQLAlchemy 2.0
- **Migrations**: Alembic
- **Validation**: Pydantic V2

## Local Setup

1. **Prerequisites**: Python 3.10+ installed.
2. **Create Virtual Environment**:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
4. **Environment Variables**:
   Ensure you have a `.env` file in the root of the `backend/` directory with:
   ```env
   DATABASE_URL="postgresql://neondb_owner:password@your-neon-host.aws.neon.tech/neondb?sslmode=require"
   ```
5. **Database Migrations**:
   Run the following to apply the schema to your database:
   ```bash
   alembic upgrade head
   ```
6. **Seed Data (Optional)**:
   ```bash
   python scripts/seed.py
   ```
7. **Run the Server**:
   ```bash
   uvicorn app.main:app --reload
   ```
   The API will be available at `http://localhost:8000`. You can explore the Swagger UI at `http://localhost:8000/docs`.

## Production Deployment (DigitalOcean)

### DigitalOcean App Platform (Recommended)
The easiest way to deploy this FastAPI app is via DO App Platform.

1. **Prepare `requirements.txt`**: Ensure all dependencies are tracked (e.g. `fastapi`, `uvicorn`, `sqlalchemy`, `alembic`, `pydantic-settings`, `psycopg2-binary`).
2. **Procfile (Optional)**: If needed, create a `Procfile` with `web: uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
3. **Connect GitHub**: Go to DO App Platform, create a new App, and link your repository. Set the source directory to `backend/`.
4. **Environment Variables**: Add `DATABASE_URL` (your Neon connection string) to the App-Level Environment Variables in DigitalOcean.
5. **Build Command**: `pip install -r requirements.txt`
6. **Run Command**: `uvicorn app.main:app --host 0.0.0.0 --port 8080`
7. **Deploy**: DigitalOcean will automatically build and deploy your app.

### DigitalOcean Droplet (Alternative)
1. Provision an Ubuntu 24.04 Droplet.
2. Clone the repository and install `python3-pip`, `python3-venv`, `nginx`.
3. Set up the virtual environment and install dependencies.
4. Use `gunicorn` with `uvicorn` workers: `gunicorn -k uvicorn.workers.UvicornWorker app.main:app`.
5. Set up `systemd` to keep Gunicorn running.
6. Configure `nginx` as a reverse proxy to forward traffic to Gunicorn (port 8000).
7. Secure with Let's Encrypt (`certbot`).
