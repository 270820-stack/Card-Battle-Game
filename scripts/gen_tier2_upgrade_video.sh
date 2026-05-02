#!/usr/bin/env bash
# 生成二级升级全屏短片（约 2 秒，H.264 MP4）。需已安装 ffmpeg（brew install ffmpeg）。
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

FFMPEG="${FFMPEG:-ffmpeg}"
if ! command -v "$FFMPEG" >/dev/null 2>&1; then
  if [[ -x /opt/homebrew/bin/ffmpeg ]]; then
    FFMPEG=/opt/homebrew/bin/ffmpeg
  elif [[ -x /usr/local/bin/ffmpeg ]]; then
    FFMPEG=/usr/local/bin/ffmpeg
  fi
fi

OUT="assets/tier2-upgrade.mp4"
echo "Writing $OUT ..."
"$FFMPEG" -y -t 2 -f lavfi -i color=c=0x1a120c:s=1280x720:r=30,format=gbrp -vf "\
geq=r='clip(0.12+0.25*sin(2*PI*T*0.85)+0.55*exp(-((X-W/2)*(X-W/2)+(Y-H/2)*(Y-H/2))/(2*(180+90*sin(2*PI*T)))*(180+90*sin(2*PI*T))),0,1)*255':\
g='clip(0.08+0.18*sin(2*PI*T*0.75)+0.42*exp(-((X-W/2)*(X-W/2)+(Y-H/2)*(Y-H/2))/(2*(200+70*sin(2*PI*T)))*(200+70*sin(2*PI*T))),0,1)*255':\
b='clip(0.05+0.12*sin(2*PI*T*0.95)+0.28*exp(-((X-W/2)*(X-W/2)+(Y-H/2)*(Y-H/2))/(2*(220+60*sin(2*PI*T)))*(220+60*sin(2*PI*T))),0,1)*255',\
format=yuv420p,fade=t=in:st=0:d=0.2,fade=t=out:st=1.8:d=0.2" \
  -c:v libx264 -pix_fmt yuv420p -movflags +faststart -an "$OUT"

echo "Done: $OUT"
