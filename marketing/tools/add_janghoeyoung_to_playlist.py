#!/usr/bin/env python3
"""치중진담 채널에서 제목에 특정 키워드(기본: 장회영)가 들어간 모든 영상을
지정한 재생목록(기본: 장회영 원장의 통증 지식)에 중복 없이 추가한다.

재생목록 편집은 OAuth 인증이 필요하므로 이 스크립트는 로컬 PC에서 실행해야 한다.

사전 준비 (최초 1회):
  1. https://console.cloud.google.com/ 에서 프로젝트 선택 → "API 및 서비스"
     → "사용자 인증 정보" → "OAuth 클라이언트 ID" 생성 (앱 유형: 데스크톱 앱)
  2. 다운로드한 JSON을 이 스크립트와 같은 폴더에 client_secret.json 으로 저장
  3. "YouTube Data API v3"가 프로젝트에서 사용 설정되어 있는지 확인
  4. pip install google-api-python-client google-auth-oauthlib

실행:
  python add_janghoeyoung_to_playlist.py
  (첫 실행 시 브라우저가 열리며 채널 소유 구글 계정으로 로그인·동의.
   이후에는 token.json 이 재사용된다.)

옵션:
  --keyword 장회영                  제목 필터 키워드
  --playlist "장회영 원장의 통증 지식"  대상 재생목록 이름
  --dry-run                        실제 추가 없이 대상 영상 목록만 출력
"""

import argparse
import os
import sys

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

SCOPES = ["https://www.googleapis.com/auth/youtube.force-ssl"]
HERE = os.path.dirname(os.path.abspath(__file__))
CLIENT_SECRET = os.path.join(HERE, "client_secret.json")
TOKEN_FILE = os.path.join(HERE, "token.json")


def get_service():
    creds = None
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists(CLIENT_SECRET):
                sys.exit(f"client_secret.json 이 없습니다: {CLIENT_SECRET}\n"
                         "스크립트 상단의 '사전 준비' 절차를 먼저 진행하세요.")
            flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET, SCOPES)
            creds = flow.run_local_server(port=0)
        with open(TOKEN_FILE, "w") as f:
            f.write(creds.to_json())
    return build("youtube", "v3", credentials=creds)


def my_uploads_playlist_id(yt):
    resp = yt.channels().list(part="contentDetails,snippet", mine=True).execute()
    items = resp.get("items", [])
    if not items:
        sys.exit("로그인한 계정에 연결된 채널이 없습니다. 채널 소유 계정으로 로그인했는지 확인하세요.")
    ch = items[0]
    print(f"채널: {ch['snippet']['title']}")
    return ch["contentDetails"]["relatedPlaylists"]["uploads"]


def iter_playlist_video_ids_and_titles(yt, playlist_id):
    token = None
    while True:
        resp = yt.playlistItems().list(
            part="snippet,contentDetails", playlistId=playlist_id,
            maxResults=50, pageToken=token).execute()
        for it in resp.get("items", []):
            yield it["contentDetails"]["videoId"], it["snippet"]["title"]
        token = resp.get("nextPageToken")
        if not token:
            return


def find_or_create_playlist(yt, name, dry_run):
    token = None
    while True:
        resp = yt.playlists().list(part="snippet", mine=True,
                                   maxResults=50, pageToken=token).execute()
        for pl in resp.get("items", []):
            if pl["snippet"]["title"].strip() == name.strip():
                print(f"재생목록 발견: {name} ({pl['id']})")
                return pl["id"]
        token = resp.get("nextPageToken")
        if not token:
            break
    if dry_run:
        print(f"[dry-run] 재생목록 '{name}' 이 없어 실제 실행 시 새로 만듭니다.")
        return None
    resp = yt.playlists().insert(
        part="snippet,status",
        body={"snippet": {"title": name},
              "status": {"privacyStatus": "public"}}).execute()
    print(f"재생목록 생성: {name} ({resp['id']})")
    return resp["id"]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--keyword", default="장회영")
    ap.add_argument("--playlist", default="장회영 원장의 통증 지식")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    yt = get_service()
    uploads = my_uploads_playlist_id(yt)

    matched = [(vid, title)
               for vid, title in iter_playlist_video_ids_and_titles(yt, uploads)
               if args.keyword in title]
    print(f"제목에 '{args.keyword}' 포함 영상: {len(matched)}개")
    for _, title in matched:
        print(f"  - {title}")
    if not matched:
        return

    target = find_or_create_playlist(yt, args.playlist, args.dry_run)
    existing = set()
    if target:
        existing = {vid for vid, _ in iter_playlist_video_ids_and_titles(yt, target)}

    to_add = [(vid, title) for vid, title in matched if vid not in existing]
    print(f"이미 등록됨 {len(matched) - len(to_add)}개, 새로 추가할 영상 {len(to_add)}개")

    if args.dry_run:
        print("[dry-run] 실제 추가는 하지 않았습니다.")
        return

    for vid, title in to_add:
        yt.playlistItems().insert(
            part="snippet",
            body={"snippet": {
                "playlistId": target,
                "resourceId": {"kind": "youtube#video", "videoId": vid}}}).execute()
        print(f"추가 완료: {title}")

    print("모든 작업이 끝났습니다.")


if __name__ == "__main__":
    main()
