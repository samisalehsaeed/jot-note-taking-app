import sys
from deepmultilingualpunctuation import PunctuationModel

model = PunctuationModel()
text = sys.argv[1]
result = model.restore_punctuation(text)
print(result)
