import pandas as pd
import os

def load_file():
    filepath = os.path.join(os.getcwd(),'PokeDoki/')
    file = os.path.join(filepath,'pokemon_data.csv')
    df = pd.read_csv(file, delimiter= ",")

    return df