# "무궁화 꽃이 피었습니다" 게임 프로젝트

## 프로젝트 개요
doll이 idle 상태일 때는 player들이 결승선을 향해 전진해야 하고, doll이 watch 상태일 때는 player들이 정지해야 하는 게임.
watch 상태일 때 정지하지 않고 전진한 player는 탈락.
결승선을 통과한 player들은 살아남는다. 게임은 1분 동안 진행되며, 1분이 다 지나기 전에 결승선을 통과한 player들의 수가 게임의 점수.

## 게임 규칙
- canvas 위에 canvas와 같은 크기의 div로 만들어진 반투명한 cover를 포개어 놓고, cover div를 클릭하면 게임 시작. cover div를 클릭하기 전에는 게임이 시작되지 않음.
- 게임 시작 상태
    - doll: idle 상태
    - player들: running 상태
- doll이 idle 상태일 때는 player들이 결승선을 향해 전진(player의 running 상태)하고, doll이 watch 상태일 때는 player들이 정지(player의 idle 상태)해야 함.
- doll이 idle 상태일 때 모든 player들은 결승선을 향해 자동으로 전진(running 상태)하며, 각 player를 클릭하면 idle, running 상태 토글.
- doll의 idle 상태는 5초, watch 상태는 3초.
- watch 상태에서 정지하지 않고 전진한 player(running 상태인 player)는 탈락. 탈락한 player는 eliminated 상태.
- 결승선에 도달한 player는 살아남음.
- 게임은 1분 동안 진행되며, 1분이 다 지나기 전에 결승선을 통과한 player들의 수가 게임의 점수.
- 1분이 다 지나지 않았더라도 모든 player가 eliminated 상태라면 게임은 종료됨.
- 1분이 다 지나지 않았더라도 모든 player가 결승선을 통과하면 게임은 종료됨.

## 사용 기술
- vite
- pixi.js v8

## 세부 정보
- 캔버스 크기 360 * 640
- 클릭하면 게임이 시작되는 div 커버(#game-cover)
- 결승선은 y 150 위치에 표시
- doll
    - doll의 상태에 따라 /images/doll-sprite.png 이미지의 해당 프레임을 표시.
    - doll의 상태는 게임 시작 시 idle 상태.
    - doll의 상태는 5초 동안 idle 상태이고, 3초 동안 watch 상태.
    - 스프라이트 이미지 크기: 384 * 128
    - 스프라이트 이미지 프레임 수: 3
    - 스프라이트 표시 크기: 64 * 64
    - idle: 2, 1 프레임 재생 후 정지. 5초 간 유지.
    - watch: 2, 3 프레임 재생 후 정지. 3초 간 유지.
    - watch 상태로 전환 후, 전진하는 player를 곧바로 체크하지 않고 0.5초 후에 체크 시작.
    - doll 스프라이트 위치는 화면 중앙 상단.
    - idle 상태일 때 /sounds/voice.mp3 1회 재생.
- player
    - player의 상태에 따라 /images/player-sprite.png 이미지의 해당 프레임을 표시.
    - player의 상태는 게임 시작 시 정지.
    - doll이 idle 상태일 때 player는 결승선을 향해 자동으로 전진. 전진은 y 방향으로 위로 이동.
    - 스프라이트 이미지 크기: 256 * 64
    - 스프라이트 이미지 프레임 수: 4
    - 스프라이트 표시 크기: 32 * 32
    - idle: 1 프레임(프레임 1개)
    - running: 2, 3 프레임 반복 재생
    - eliminated: 4 프레임(프레임 1개). eleminated 상태로 전환 후 4 프레임을 바로 표시하지 않고, 1초 후에 4 프레임 이미지 표시.
    - player 스프라이트 위치는 화면 중앙 하단, 총 10개를 가로로 일정 간격 배치.
    - eleminated 상태가 되면 /sounds/shot.aac 1회 재생, 1초 후 4 프레임 이미지 표시.
- timer
    - 게임 시작 시 60초 타이머 시작.
    - 타이머는 60초 동안 카운트 다운.
    - 타이머가 0초가 되면 게임 종료.
    - 타이머가 0초가 되기 전에 모든 탈락(eliminated)되지 않은 player가 결승선을 통과하면 게임 종료.
    - 타이머가 0초가 되기 전에 모든 player가 탈락(eliminated)하면 게임 종료.
    - 화면 우측 상단에 표시.
    - 게임이 종료되면 화면 중앙에 게임 결과 표시.