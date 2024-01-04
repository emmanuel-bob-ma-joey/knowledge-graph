
from textblob import TextBlob
text = "Natural language processing (NLP) is a field of computer science, artificial intelligence, and computational linguistics concerned with the interactions between computers and human (natural) languages."
text2= "A transformer is a deep learning architecture based on the multi-head attention mechanism. // It is notable for not containing any recurrent units, and thus requires less training time than previous recurrent neural architectures, // such as long short-term memory."
blob = TextBlob(text2)

print(list(blob.noun_phrases))
print(type(blob.noun_phrases))