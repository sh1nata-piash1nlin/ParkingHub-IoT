# Quick Start Guide

## Prerequisites Setup

1. **Supabase Setup**:
   - Create account at https://supabase.com
   - Create a new project
   - Go to SQL Editor and run: `backend/database/migrations/001_create_parking_events.sql`
   - Go to Storage and create a bucket named `parking-images`
   - Make the bucket public (or configure RLS policies)
   - Copy your Project URL and anon key from Settings > API

## Backend Setup (5 minutes)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_STORAGE_BUCKET=parking-images
EOF

# Run server
uvicorn main:app --reload --port 8000
```

Backend will be available at: http://localhost:8000
API Docs: http://localhost:8000/docs

## Frontend Setup (3 minutes)

```bash
cd frontend
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Run dev server
npm run dev
```

Frontend will be available at: http://localhost:3000

## Testing the ESP32 Endpoint

You can test the endpoint using curl:

```bash
curl -X POST http://localhost:8000/api/v1/esp32/upload \
  -F "rfid_id=TEST123" \
  -F "image=@/path/to/test-image.jpg"
```

Expected response:
```json
{"rfid_id": "TEST123"}
```

## Project Structure

- `backend/main.py` - FastAPI server with ESP32 endpoint
- `backend/database/migrations/` - SQL schema
- `frontend/app/` - Next.js pages (Menu, Tracking, History)
- `frontend/app/components/` - Reusable components (Sidebar, DashboardLayout)

## Next Steps

1. Configure ESP32-CAM to send POST requests to `/api/v1/esp32/upload`
2. Customize the frontend dashboard as needed
3. Add authentication/authorization for production
4. Configure CORS properly for production deployment

