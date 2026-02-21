from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Annotated
import pickle
import pandas as pd

# Load model and scaler
with open("model.pkl", "rb") as f:
    model = pickle.load(f)

with open("scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

app = FastAPI()
origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserInput(BaseModel):
    cgpa: Annotated[float, Field(ge=0.0, le=10.0, description="CGPA must be between 0 and 10")]
    iq: Annotated[int, Field(ge=0, description="IQ must be a non-negative integer")]

@app.post("/predict")
def prediction(data: UserInput):
    # Create DataFrame with user input
    user_input = pd.DataFrame([[data.cgpa, data.iq]], columns=['cgpa', 'iq'])
    
    # Scale the input data
    user_input_scaled = scaler.transform(user_input)
    
    # Make prediction
    prediction = model.predict(user_input_scaled)[0]
    
    return JSONResponse(
        status_code=200,
        content={"prediction": int(prediction)}
    )

@app.get("/")
def home():
    return {"message": "Hello World"}