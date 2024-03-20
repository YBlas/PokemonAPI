## API Endpoints

### GET `/`

- Returns a list of all Pokémon in the database.

### GET `/:name`

- Returns Pokémon matching the provided name.

### POST `/`

- Adds a new Pokémon to the database.
- Requires `name`, `image`, `sound`, and `creator` fields in the request body.
- Supported image formats: jpg, jpeg, png.
- Supported audio format: mp3.

### DELETE `/:name`

- Deletes a Pokémon from the database.
- Requires the `name` and `creator` fields in the request body.

## Example Usage

### Fetch all Pokémon

curl http://localhost:3000/

### Fetch pokemon by name

curl http://localhost:3000/pikachu

### Add a new Pokémon

curl -X POST -H "Content-Type: application/json" -d '{"name":"Charizard","image":"charizard.jpg","sound":"charizard.mp3","creator":"Ash"}' http://localhost:3000/

### Delete a Pokémon

curl -X DELETE -H "Content-Type: application/json" -d '{"creator":"Ash"}' http://localhost:3000/charizard
