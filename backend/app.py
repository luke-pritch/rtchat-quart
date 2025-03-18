from quart import Quart, websocket, jsonify, request, Blueprint
from quart_auth import QuartAuth, login_required
import asyncio
from typing import Set, Dict
import json
import uuid
from datetime import datetime
import logging
from quart_schema import QuartSchema, validate_request, DataSource
from pydantic import BaseModel
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize Quart app
app = Quart(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "default-secret-key")
auth = QuartAuth(app)
schema = QuartSchema(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# In-memory storage
rooms: Dict[str, Set] = {"general": set()}
messages: Dict[str, list] = {"general": []}

# Pydantic models
class MessageRequest(BaseModel):
    content: str
    user: str = "Anonymous"

class RoomRequest(BaseModel):
    name: str

@app.route('/')
async def index():
    return "Quart Chat Backend - Real-Time Chat Application"

@app.websocket('/ws/<room>')
async def ws(room: str):
    client = websocket._get_current_object()
    if room not in rooms:
        await client.send(json.dumps({"type": "error", "message": "Room not found"}))
        return
    
    rooms[room].add(client)
    logger.info(f"Client connected to room: {room}, total clients: {len(rooms[room])}")
    
    for msg in messages[room][-50:]:
        await client.send(json.dumps(msg))
    
    try:
        while True:
            data = await client.receive()
            try:
                message = json.loads(data)
                msg_content = message.get("content", "").strip()
                msg_user = message.get("user", "Anonymous")
                
                if not msg_content:
                    continue
                
                msg = {
                    "type": "message",
                    "content": msg_content,
                    "user": msg_user,
                    "timestamp": datetime.utcnow().isoformat(),
                    "id": str(uuid.uuid4())
                }
                
                messages[room].append(msg)
                for c in rooms[room]:
                    await c.send(json.dumps(msg))
                    
            except json.JSONDecodeError:
                await client.send(json.dumps({"type": "error", "message": "Invalid message format"}))
                
    except asyncio.CancelledError:
        logger.info(f"Client disconnected from room: {room}")
    finally:
        rooms[room].remove(client)
        if not rooms[room]:
            del rooms[room]
            del messages[room]
            logger.info(f"Room {room} deleted due to no clients")

api_bp = Blueprint('api', __name__)

@api_bp.route('/rooms', methods=['GET'])
async def get_rooms():
    return jsonify({"rooms": list(rooms.keys())})

@api_bp.route('/rooms', methods=['POST'])
@validate_request(RoomRequest, source=DataSource.JSON)
@login_required
async def create_room(data: RoomRequest):
    room_name = data.name.strip().lower()
    if room_name in rooms:
        return jsonify({"error": "Room already exists"}), 400
    rooms[room_name] = set()
    messages[room_name] = []
    logger.info(f"Room created: {room_name}")
    return jsonify({"room": room_name}), 201

@api_bp.route('/rooms/<room>/messages', methods=['GET'])
async def get_room_messages(room: str):
    if room not in rooms:
        return jsonify({"error": "Room not found"}), 404
    return jsonify({"messages": messages[room][-100:]})

app.register_blueprint(api_bp, url_prefix='/api')

@app.route('/api/login', methods=['POST'])
async def login():
    data = await request.get_json()
    username = data.get("username")
    password = data.get("password")
    if username and password == "password":  # Replace with secure auth in production
        auth.set_session({"user_id": username})
        return jsonify({"message": "Logged in"}), 200
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/api/logout', methods=['POST'])
@login_required
async def logout():
    auth.logout()
    return jsonify({"message": "Logged out"}), 200

if __name__ == "__main__":
    app.run(
        host=os.getenv("QUART_HOST", "0.0.0.0"),
        port=int(os.getenv("QUART_PORT", 5001)),
        debug=os.getenv("QUART_DEBUG", "True") == "True"
    )