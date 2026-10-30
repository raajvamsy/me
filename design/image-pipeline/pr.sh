#!/bin/zsh
# pr.sh I X Y : pastes prompt I into the composer at X,Y
S=${0:A:h}; python3 -c "import json,sys;print(json.load(open('$S/prompts.json'))[$1]['prompt'],end='')" > $S/cur.txt
~/personal/golem-compile/project/tools/gpt.sh click $2 $3 >/dev/null; sleep 0.6
~/personal/golem-compile/project/tools/gpt.sh text $2 $3 $S/cur.txt; python3 -c "import json;print(json.load(open('$S/prompts.json'))[$1]['path'])"
