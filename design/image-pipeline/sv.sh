#!/bin/zsh
# sv.sh X Y REL : saves the image at X,Y as public/img/REL (webp) and keeps the full PNG
S=${0:A:h}; T=~/personal/golem-compile/project/tools/gpt.sh; R=~/personal/raaj-site/public/img; P=$S/png/${3:r}.png
mkdir -p ${P:h} ${R}/${3:h}
$T save $1 $2 $P && cwebp -quiet -q 84 -resize 1800 0 $P -o $R/$3 && echo "webp $(stat -f %z $R/$3)"
