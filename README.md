# ks-tracker

## Commands

```

curl -sS --rate 55/m --oauth2-bearer $MIGHTPULSE_TOKEN -o ./players/171510294.json https://api.mightpulse.com/v1/players/171510294?include=base,ranks

curl -sS --rate 55/m --oauth2-bearer $MIGHTPULSE_TOKEN -o 1156-boards.json https://api.mightpulse.com/v1/kingdoms/1156?include=boards

jq keys 1156-boards.json 

curl -sS --rate 55/m --oauth2-bearer "$MIGHTPULSE_TOKEN" -o "./kingdoms/#1.json" "https://api.mightpulse.com/v1/kingdoms/[1087-1221]?include=boards"

jq -r '[.ok, .fresh, .kid, .kingdom.kid, .boards[0].key] | @csv' *.json

# kingdoms
jq -s '[.[] | {kid, aid: [.boards[0].rows[0:15][] | .abbr] | join(",")}]' *.json > ../curl.json

jq -r '.[2:10][] | "output = \"./alliances/\(.kid)-#1.json\"\nurl = \"https://api.mightpulse.com/v1/alliances/\(.kid)/{\(.aid)}?include=info,roster\"\n"' ./curl.json > ./urls

curl -sS --rate 55/m --oauth2-bearer "$MIGHTPULSE_TOKEN" --fail --write-out "%{response_code} %{url.path}\n%{onerror}ERROR %{errormsg}\n" --config urls 

find ./players/ -type f -name "*.json" -exec sh -c "jq . {} | sponge {}" \; 

jq -cs '[ .[] | {kid, tag, players: [.members[] | {governor_id, nick_name, power}]} ]' alliances/*.json | jq '[ .[] | .kid as $kid | .tag as $aid | .players[] | {id: .governor_id, name: .nick_name, power, tag: $aid, kid: $kid} ]' > players.json

```

## Get top players of a kingdom

Top 100 of every board and all the players from the top 20 alliances.

```
curl -sS --rate 55/m --oauth2-bearer "$MIGHTPULSE_TOKEN" -o "./1139.json" "https://api.mightpulse.com/v1/kingdoms/1139?include=boards"

jq '{kid, aid: [.boards[0].rows[0:20][] | .abbr] | join(",")}' ./1139.json | jq -r '"output = \"./\(.kid)-#1.json\"\nurl = \"https://api.mightpulse.com/v1/alliances/\(.kid)/{\(.aid)}?include=info,roster\"\n"' > ./urls

curl -sS --rate 55/m --oauth2-bearer "$MIGHTPULSE_TOKEN" --fail --write-out "%{response_code} %{url.path}\n%{onerror}ERROR %{errormsg}\n" --config ./urls

jq -rs '.[] | .members[] | .governor_id' ./1139-*.json > ./governors
jq -r '.boards[] | select(.kind == "player") | .rows[] | .governor_id' ./1139.json >> ./governors
sort -u ./governors | jq -R '[inputs]' | jq -r '.[] | "output = \"./player-\(.).json\"\nurl = \"https://api.mightpulse.com/v1/players/\(.)?include=base,heroes\"\n"' > ./urls

curl -sS --rate 55/m --oauth2-bearer "$MIGHTPULSE_TOKEN" --fail --write-out "%{response_code} %{url.path}\n%{onerror}ERROR %{errormsg}\n" --config ./urls

jq -s '[ .[] | {governor_id, name: .player.nick_name, heroes: [.heroes[] | {name, star, stars, star_label}]} ]' ./player-*.json > ./heroes.json

```
