# main.py
from fastapi import FastAPI, Request
from pydantic import BaseModel
from deepmultilingualpunctuation import PunctuationModel

app = FastAPI()
model = PunctuationModel()  # loaded once on startup

class TextRequest(BaseModel):
    text: str

@app.post("/punctuate")
def punctuate_text(request: TextRequest):
    result = model.restore_punctuation(request.text)
    return { "punctuated": result }
