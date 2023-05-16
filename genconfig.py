#!/bin/env python3

import json

config = {}

config["message"] = input("What's the message you want to send? ")
country_code = int(input("What's the country code of all numbers? "))

numbers = []
print("Adding numbers (empty to quit)")
while True:
    number = input("> ")
    if number.strip() == "":
        break
    numbers.append({"country_code": country_code, "number": number})
config["numbers"] = numbers

json_config = json.dumps(config, indent = 4)
with open("numbers.json", "w") as f:
    f.write(json_config)

print("Done")
