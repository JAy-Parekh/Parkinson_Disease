from flask import Flask,render_template,request,jsonify

import pickle
import pandas as pd
import numpy as np
import json# import cv2

from keras import Sequential
from keras.layers import Conv2D, MaxPooling2D, Flatten, Dense
import tensorflow as tf
from keras import layers
from keras import layers
from sklearn.model_selection import train_test_split
from PIL import Image
import os
from keras.preprocessing import image
from keras.applications.xception import preprocess_input, decode_predictions


X = []
y = []
for foldername in os.listdir('parkinsons-drawings/drawings'):
    folderpath = os.path.join('parkinsons-drawings/drawings', foldername)

    for foldername1 in os.listdir(folderpath):
        folderpath1 = os.path.join(folderpath, foldername1)
        for foldername2 in os.listdir(folderpath1):
            folderpath2 = os.path.join(folderpath1, foldername2)

            for foldername3 in os.listdir(folderpath2):
                folderpath3 = os.path.join(folderpath2, foldername3)
                img = Image.open(folderpath3)
                img = img.convert('RGB')
                img = img.resize((128, 128))
                img_array = np.array(img) / 255.0
                X.append(img_array)
                if foldername2 == 'parkinson':
                    y.append(1)
                else:
                    y.append(0)
X = np.array(X)
y = np.array(y)


X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42,stratify=y)

base_model = tf.keras.applications.Xception(
    include_top=False, weights='imagenet', input_shape=(128, 128, 3)
)
x = base_model.output

x = layers.GlobalAveragePooling2D()(x)
x = layers.Dense(128, activation='relu')(x)
predictions = layers.Dense(1, activation='sigmoid')(x)
model = tf.keras.Model(inputs=base_model.input, outputs=predictions)


for layer in base_model.layers:
    layer.trainable = False
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
model.fit(X_train, y_train, epochs=1, validation_data=(X_test, y_test))


# Evaluate model using testing subset of dataset
test_loss, test_acc = model.evaluate(X_test, y_test, verbose=2)
print(f'Test accuracy: {test_acc}')


app=Flask(__name__)

# model=pickle.load(open('model.pkl',"rb"))

@app.get("/")
def hello():
    return render_template('index.html')

@app.post("/predict")
def predict():
    imagefile=request.files['imagefile']
    image_path=os.path.join('images', imagefile.filename)
    imagefile.save(image_path)
    img1=Image.open(image_path)
    img1 = img1.convert('RGB')
    img1 = img1.resize((128, 128))
    img_array1=np.array(img1)
    img_array1 = np.expand_dims(img_array1, axis=0)
    img_array1 = preprocess_input(img_array1)
    preds = model.predict(img_array1)
    result=""
    # print(preds[0])
    if preds[0] > 0.50:
        result="Parkinson Disease"
    else:
        result="Healthy"
    # print(result)
    response_object={'preds':float(preds[0]),
        'result':result
    }

    json_string = json.dumps(response_object)
    print(json_string)
    return json_string

if __name__=="__main__":
    app.run()
