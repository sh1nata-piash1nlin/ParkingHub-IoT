# IoT Smart Parking System - MVP

A full-stack IoT Smart Parking system with ESP32-CAM integration, FastAPI backend, and Next.js admin dashboard.

## Architecture

- **Backend**: FastAPI (Python) - Receives RFID and image data from ESP32-CAM
- **Database**: Supabase (PostgreSQL + Storage)
- **Frontend**: Next.js 14 with TypeScript - Admin dashboard

## Project Structure

```
IOT/
├── backend/          # FastAPI application
│   ├── main.py      # Main API server
│   ├── requirements.txt
│   └── database/    # SQL migrations
├── frontend/        # Next.js application
│   ├── app/        # Next.js app directory
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Python 3.9+
- Node.js 18+
- Supabase account and project

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
Create a `.env` file in the `backend` directory:
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_STORAGE_BUCKET=parking-images
```

5. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL migrations in order:
     - `database/migrations/001_create_parking_events.sql`
     - `database/migrations/002_add_parking_fields.sql`
   - Create a storage bucket named `parking-images` (or update `SUPABASE_STORAGE_BUCKET` in `.env`)
   - Set bucket to public or configure RLS policies as needed

6. Run the backend server:
```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the `frontend` directory:
```
NEXT_PUBLIC_API_URL=http://localhost:8000

# ESP32-CAM Stream URLs (update with your actual camera IP addresses)
NEXT_PUBLIC_CAR_IN_CAMERA_URL=http://YOUR_CAR_IN_CAMERA_IP:81/stream
NEXT_PUBLIC_CAR_OUT_CAMERA_URL=http://YOUR_CAR_OUT_CAMERA_IP:81/stream
```

4. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### ESP32-CAM Endpoint

**POST** `/api/v1/esp32/upload`

- **Content-Type**: `multipart/form-data`
- **Form fields**:
  - `rfid_id`: string (RFID card ID)
  - `image`: file (JPEG image)
- **Response**: `200 OK` with JSON `{"rfid_id": "..."}`

### Admin Dashboard Endpoints

**GET** `/api/v1/parking-events`
- Query parameters: `limit` (default: 100), `offset` (default: 0)
- Returns list of parking events

**GET** `/api/v1/parking-events/{rfid_id}`
- Returns parking events for a specific RFID ID

**GET** `/api/v1/parking-sessions`
- Query parameters: `limit` (default: 100), `offset` (default: 0)
- Returns parking sessions with calculated Time IN and Time OUT
- Groups events by RFID and calculates parking sessions

## Frontend Pages

- **Menu** (`/menu`): Dashboard overview with statistics
- **Tracking** (`/tracking`): Real-time parking events with auto-refresh
- **History** (`/history`): Parking sessions history displaying:
  - Card ID (RFID ID)
  - Car Plate License
  - Time IN
  - Time OUT (or "Still Parked" if active)
  - Parking Slot
  - Search functionality by Card ID or License Plate

## ESP32-CAM Integration Example

Example code for ESP32-CAM (Arduino/PlatformIO):

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <esp_camera.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverUrl = "http://YOUR_SERVER_IP:8000/api/v1/esp32/upload";
const char* rfid_id = "YOUR_RFID_CARD_ID";

void setup() {
  Serial.begin(115200);
  
  // WiFi setup
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi connected");
  
  // Camera setup (configure according to your ESP32-CAM module)
  // ... camera initialization code ...
}

void loop() {
  // Capture image
  camera_fb_t *fb = esp_camera_fb_get();
  if (!fb) {
    Serial.println("Camera capture failed");
    return;
  }
  
  // Read RFID (implement your RFID reader logic)
  String current_rfid = readRFID(); // Your RFID reading function
  
  // Upload to backend
  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW");
  
  String body = "------WebKitFormBoundary7MA4YWxkTrZu0gW\r\n";
  body += "Content-Disposition: form-data; name=\"rfid_id\"\r\n\r\n";
  body += current_rfid + "\r\n";
  body += "------WebKitFormBoundary7MA4YWxkTrZu0gW\r\n";
  body += "Content-Disposition: form-data; name=\"image\"; filename=\"image.jpg\"\r\n";
  body += "Content-Type: image/jpeg\r\n\r\n";
  
  http.POST((uint8_t*)body.c_str(), body.length());
  // Append image bytes and send...
  
  esp_camera_fb_return(fb);
  delay(5000); // Wait 5 seconds before next capture
}
```

## Database Schema

```sql
CREATE TABLE parking_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rfid_id TEXT NOT NULL,
    image_path TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    license_plate TEXT,
    parking_slot TEXT,
    event_type TEXT DEFAULT 'IN' CHECK (event_type IN ('IN', 'OUT'))
);
```

The `event_type` field determines if an event is a check-in ('IN') or check-out ('OUT'). 
Parking sessions are calculated by pairing IN/OUT events for each RFID ID.

## Notes

- The backend returns `rfid_id` as JSON: `{"rfid_id": "..."}`
- Images are stored in Supabase Storage under the `parking-images` bucket
- The frontend auto-refreshes tracking data every 10 seconds
- All frontend packages are compatible with Next.js 14

## License

MIT

