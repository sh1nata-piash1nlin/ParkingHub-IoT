# Backend - FastAPI

FastAPI backend for IoT Smart Parking system.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure environment variables in `.env`:
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_STORAGE_BUCKET=parking-images
```

3. Run migrations:
   - Execute `database/migrations/001_create_parking_events.sql` in Supabase SQL Editor

4. Start server:
```bash
uvicorn main:app --reload --port 8000
```
5. Go to hf and download model: `license-plate-finetune-v1x.pt` and place it in /model_ckpt folder <br>
Link: `https://huggingface.co/morsetechlab/yolov11-license-plate-detection/tree/main`

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

