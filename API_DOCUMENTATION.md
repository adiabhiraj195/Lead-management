# Frontend API Documentation: Lead Management

This document details all available backend APIs for frontend developers building the Next.js client.

---

## 1. Overview & Base Configuration

- **Base URL**: `http://localhost:8000/api`
- **Recommended `.env.local` config in `client/`**:
  ```env
  NEXT_PUBLIC_API_URL=http://localhost:8000/api
  ```
- **CORS**: Configured on the server (`*` by default in development, or set via `CORS_ORIGIN`).
- **Content-Type**: Requests with bodies must include `Content-Type: application/json`.

---

## 2. Common Data Types & Enums

### TypeScript Interfaces

```typescript
export type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "CONVERTED";

export interface Lead {
  id: string;          // UUID v4
  name: string;
  email: string;
  phone: string | null;
  status: LeadStatus;
  createdAt: string;   // ISO 8601 date string, e.g. "2026-09-23T10:00:00.000Z"
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: true;
  data: T;
  pagination?: Pagination;
}

export interface ApiErrorDetail {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    status: number;
    details?: ApiErrorDetail[];
    stack?: string; // only present in development mode
  };
}
```

---

## 3. Endpoints

### 3.1 Get Leads (with Search & Pagination)

Retrieve leads sorted by `createdAt` in descending order (newest first). Supports server-side search across name, email, and phone, along with pagination.

- **Method**: `GET`
- **Path**: `/api/leads`
- **Query Parameters**:

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `page` | `number` | No | `1` | Current page number (minimum `1`) |
| `limit` | `number` | No | `10` | Leads per page (minimum `1`, maximum `100`) |
| `search` | `string` | No | `undefined` | Case-insensitive substring search matching `name`, `email`, or `phone` |

#### Example Request
```http
GET /api/leads?page=1&limit=10&search=john HTTP/1.1
Host: localhost:8000
```

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": [
    {
      "id": "c1f7b8a0-2f98-4c6e-8d89-6fa796123456",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1-555-0199",
      "status": "NEW",
      "createdAt": "2026-09-23T14:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

#### Error Response (`400 Bad Request` - Invalid Query Params)
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "status": 400,
    "details": [
      {
        "field": "limit",
        "message": "Limit cannot exceed 100"
      }
    ]
  }
}
```

---

### 3.2 Create a Lead

Create a new lead in the database. Validates required fields, email format, and status enum.

- **Method**: `POST`
- **Path**: `/api/leads`
- **Headers**: `Content-Type: application/json`
- **Request Body**:

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | **Yes** | Full name of the lead (trimmed, non-empty) |
| `email` | `string` | **Yes** | Valid email address (unique in database) |
| `phone` | `string` | **Yes** | Phone number of the lead (trimmed, non-empty) |
| `status` | `LeadStatus` | No | Status of lead: `"NEW"`, `"CONTACTED"`, `"QUALIFIED"`, `"CONVERTED"` (default: `"NEW"`) |

#### Example Request
```http
POST /api/leads HTTP/1.1
Host: localhost:8000
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "phone": "+1-555-0143",
  "status": "NEW"
}
```

#### Success Response (`201 Created`)
```json
{
  "success": true,
  "data": {
    "id": "e4b2d35a-9c71-4a11-b1e0-7981ab234567",
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "phone": "+1-555-0143",
    "status": "NEW",
    "createdAt": "2026-09-23T15:00:00.000Z"
  }
}
```

#### Error Responses

- **`400 Bad Request` - Validation Error**:
  ```json
  {
    "success": false,
    "error": {
      "message": "Validation failed",
      "status": 400,
      "details": [
        {
          "field": "email",
          "message": "Invalid email format"
        }
      ]
    }
  }
  ```

- **`409 Conflict` - Duplicate Email**:
  ```json
  {
    "success": false,
    "error": {
      "message": "A lead with this email already exists",
      "status": 409
    }
  }
  ```

---

### 3.3 Update Lead Status

Update the status of an existing lead. Verifies lead existence before performing the update.

- **Method**: `PATCH`
- **Path**: `/api/leads/:id/status`
- **Path Parameters**:
  - `id` (`string`, required): UUID v4 of the lead.
- **Headers**: `Content-Type: application/json`
- **Request Body**:

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `status` | `LeadStatus` | **Yes** | Must be one of `"NEW"`, `"CONTACTED"`, `"QUALIFIED"`, `"CONVERTED"` |

#### Example Request
```http
PATCH /api/leads/e4b2d35a-9c71-4a11-b1e0-7981ab234567/status HTTP/1.1
Host: localhost:8000
Content-Type: application/json

{
  "status": "QUALIFIED"
}
```

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "id": "e4b2d35a-9c71-4a11-b1e0-7981ab234567",
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "phone": "+1-555-0143",
    "status": "QUALIFIED",
    "createdAt": "2026-09-23T15:00:00.000Z"
  }
}
```

#### Error Responses

- **`400 Bad Request` - Invalid UUID or Status**:
  ```json
  {
    "success": false,
    "error": {
      "message": "Validation failed",
      "status": 400,
      "details": [
        {
          "field": "id",
          "message": "Invalid lead ID format"
        }
      ]
    }
  }
  ```

- **`404 Not Found` - Lead Does Not Exist**:
  ```json
  {
    "success": false,
    "error": {
      "message": "Lead not found",
      "status": 404
    }
  }
  ```

---

### 3.4 Health Check

Verify backend server status.

- **Method**: `GET`
- **Path**: `/health` or `/api/health`

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "uptime": 124.52,
    "timestamp": "2026-09-23T15:10:00.000Z",
    "environment": "development"
  }
}
```

---

## 4. Frontend Integration Examples

### Example API Client Utility (`client/src/lib/api.ts`)

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function fetchLeads(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", params.page.toString());
  if (params?.limit) query.set("limit", params.limit.toString());
  if (params?.search) query.set("search", params.search);

  const res = await fetch(`${API_URL}/leads?${query.toString()}`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || "Failed to fetch leads");
  return json;
}

export async function createLead(payload: {
  name: string;
  email: string;
  phone: string;
  status?: LeadStatus;
}) {
  const res = await fetch(`${API_URL}/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || "Failed to create lead");
  return json.data;
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  const res = await fetch(`${API_URL}/leads/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || "Failed to update status");
  return json.data;
}
```

