import pandas as pd
import os

def load_file():
    filepath = os.path.join(os.getcwd(),'PokeDoki/')
    file = os.path.join(filepath,'pokemon_data.csv')
    df = pd.read_csv(file, delimiter= ",")

    return df

def load_info(pokemon):
    df = load_file()
    names = df["Name"]
    id_no = df["#"]
    mypokemon = None
    try:
        for i in range(df["Name"].count()):
            if names[i].lower() == pokemon.lower() :
                mypokemon = df.iloc[i]
            else:
                continue
    except (KeyError):
        mypokemon = {"message":"Value Not Found"}

    return mypokemon

