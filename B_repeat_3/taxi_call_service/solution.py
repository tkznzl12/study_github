from typing import List
from heapq import heappush, heappop

class Result:
    def __init__(self, mX, mY, mMoveDistance, mRideDistance):
        self.mX = mX
        self.mY = mY
        self.mMoveDistance = mMoveDistance
        self.mRideDistance = mRideDistance

# 도시 한 변의 길이
city_n = 0
# 호출 받을 수 있는 택시의 최대 거리
call_l = 0
# 택시 정보
taxi_info = {} # taxi_info[taxi_num] = [ (taxi_x, taxi_y), total_dist, cumstom_dist ]
# 버킷
buckets = [[]]
# 최대 이동 거리 정보(heapq)
best_taxi_dist = []

def init(N : int, M : int, L : int, mXs : List[int], mYs : List[int]) -> None:
    global city_n, call_l, taxi_info, buckets, best_taxi_dist
    city_n = N
    call_l = L
    bucket_n = (N // L) + 1
    buckets = [[set() for _ in range(bucket_n)] for _ in range(bucket_n)]
    best_taxi_dist = []

    for i in range(M):
        # 택시 번호는 1 ~ M
        taxi_info[i+1] = [(mXs[i], mYs[i]), 0, 0]
        bx, by = mXs[i] // L, mYs[i] // L
        buckets[bx][by].add(i+1)
        heappush(best_taxi_dist, (0, i+1)) # 고객이동거리, 택시번호

'''
택시 호출, 버킷좌표로 변환, 버킷좌표 포함 9구역 탐색
해당 버킷에 있는 택시 번호 가져오기
택시번호로 진짜 좌표 가져오기
멘헤튼 거리 구해서 범위를 벗어났는지 확인
가장 가까운 거리면 타겟으로 선정
만약 거리가 같으면 택시 번호가 작은것 선정
'''
def pickup(mSX : int, mSY : int, mEX : int, mEY : int) -> int:
    bsx, bsy = mSX // call_l, mSY // call_l

    bucket_n = len(buckets)

    min_dist = float('inf')
    target_num = float('inf')

    for dx in range(-1,2):
        for dy in range(-1,2):
            bnx, bny = bsx + dx, bsy + dy

            if not (0 <= bnx < bucket_n and 0 <= bny < bucket_n):
                continue

            for taxi_num in buckets[bnx][bny]:
                (t_x, t_y), total, custom = taxi_info[taxi_num]
                dist = abs(t_x - mSX) + abs(t_y - mSY)
                if dist > call_l: continue

                if dist < min_dist:
                    min_dist = dist
                    target_num = taxi_num
                elif dist == min_dist and target_num > taxi_num:
                    target_num = taxi_num

    if min_dist == float('inf'):
        return -1

    # 택시 호출에 성공한경우
    # 호출한 택시 정보 갱신
    dist_taxi_custom = min_dist
    dist_custom_end = abs(mSX - mEX) + abs(mSY - mEY)

    (t_x, t_y), total, custom = taxi_info[target_num]

    next_total = total + dist_taxi_custom + dist_custom_end
    next_custom = custom + dist_custom_end

    taxi_info[target_num] = [(mEX, mEY), next_total, next_custom]
    # 택시 정보 갱신 완료 -----

    # 버킷 정보 갱신
    # 현재 버킷 위치에서 제거
    box, boy = t_x // call_l, t_y // call_l
    buckets[box][boy].remove(target_num)

    # 이동 버킷 위치에 추가
    bnx, bny = mEX // call_l, mEY // call_l
    buckets[bnx][bny].add(target_num)
    # 버킷 정보 갱신 완료

    # 최대 이동 힙 갱신
    heappush(best_taxi_dist, (-next_custom, target_num)) # 최대힙이므로 음수로 넣기

    return target_num

def reset(mNo : int) -> Result:
    (tx, ty), total, custom = taxi_info[mNo]
    taxi_info[mNo] = [(tx, ty), 0, 0]
    heappush(best_taxi_dist, (0, mNo))
    return Result(tx, ty, total, custom)

def getBest(mNos : List[int]) -> None:
    need_cnt = len(mNos)
    hq = best_taxi_dist
    # 힙에서 같은 값을 가진 정보가 두개 있을 수 있다.
    # 힙에서 빼올때 거리가 크고, 번호가 작은 순서대로 뽑아온다
    target_list = []
    repair = []
    while hq and len(target_list) < need_cnt:
        move_dist, taxi_num = heappop(hq)
        move_dist = -move_dist
        real_custom_dist = taxi_info[taxi_num][2]
        if move_dist != real_custom_dist:
            continue
        if taxi_num in target_list:
            continue

        target_list.append(taxi_num)
        repair.append((-move_dist, taxi_num))

    for dist, t_num in repair:
        heappush(hq, (dist, t_num))

    for idx, t_n in enumerate(target_list):
        mNos[idx] = t_n