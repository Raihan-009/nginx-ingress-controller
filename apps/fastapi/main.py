from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional

# Initialize FastAPI app
app = FastAPI(
    title="Simple API",
    description="A basic FastAPI application with two routes",
    version="1.0.0"
)

# Data model for a simple item
class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float

# In-memory storage
items = {}

@app.get("/")
async def read_root():
    """
    Root endpoint returning a welcome message
    """
    return {"message": "Welcome to the Simple API!"}

@app.post("/items/", response_model=Item)
async def create_item(item: Item):
    """
    Create a new item
    """
    if item.name in items:
        raise HTTPException(status_code=400, detail="Item already exists")
    items[item.name] = item
    return item

@app.get("/items/{item_name}")
async def read_item(item_name: str):
    """
    Get an item by name
    """
    if item_name not in items:
        raise HTTPException(status_code=404, detail="Item not found")
    return items[item_name]