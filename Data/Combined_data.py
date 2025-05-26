import pandas as pd

# Load datasets
zenodo_df = pd.read_csv('Data/Zenodo.csv')
cip_df = pd.read_csv('Data/cip.csv')

# Select only relevant columns from zenodo
df_zenodo_filtered = zenodo_df[['N', 'P', 'K', 'ph']]

# Select only relevant columns from cip
df_cip_filtered = cip_df[['Latitude', 'Longitude', 'treat', 'tuberY']]

combined_df = pd.concat([df_cip_filtered, df_zenodo_filtered], axis=1)

# Drop rows with any missing values
combined_df.dropna(inplace=True)

# Save the combined dataset
combined_df.to_csv('Data/Final_data.csv', index=False)

print("Datasets combined and saved as 'combined_soil_data.csv'")
