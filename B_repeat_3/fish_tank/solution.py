from typing import List

from collections import defaultdict

class Result:
    def __init__(self) -> None:
        self.ID: int = 0
        self.height: int = 0
        self.used: int = 0

class FishTank:
    def __init__(self, tank_id, tank_w, tank_h, lengths, up_shapes):
        self.tank_id = tank_id
        self.tank_w = tank_w
        self.tank_h = tank_h
        self.tank_lengths = list(lengths)
        self.tank_up_shapes = list(up_shapes)
        self.water_needs = [0] * (self.tank_h + 1)
        self.subset_up_shapes = defaultdict(list)
        self.cal_water_needs()
        self.cal_subset_up_shape()

    def cal_water_needs(self):
        h_waters = [0] * (self.tank_h + 1)
        for l in self.tank_lengths:
            if l <= self.tank_h:
                h_waters[l] += 1

        total_need = 0
        current_need = 0
        for h in range(1, self.tank_h + 1):
            current_need += h_waters[h-1]
            total_need += current_need
            self.water_needs[h] = total_need

    def cal_subset_up_shape(self):
        self.subset_up_shapes = defaultdict(list)
        for i in range(self.tank_w - 2):
            subset = (self.tank_up_shapes[i], self.tank_up_shapes[i+1], self.tank_up_shapes[i+2])
            self.subset_up_shapes[subset].append(i)

    def is_install(self, col, lengths, up_shapes, down_shapes):
        len_1 = self.tank_lengths[col]
        len_2 = self.tank_lengths[col + 1]
        len_3 = self.tank_lengths[col + 2]

        install_len_1 = len_1 + lengths[0]
        install_len_2 = len_2 + lengths[1]
        install_len_3 = len_3 + lengths[2]

        if install_len_1 > self.tank_h or install_len_2 > self.tank_h or install_len_3 > self.tank_h:
            return False

        if install_len_1 <= len_2 or install_len_3 <= len_2:
            return False
        if install_len_2 <= len_1 or install_len_2 <= len_3:
            return False
        return True

    def do_install(self, col, lengths, up_shapes, down_shapes):
        for i in range(3):
            self.tank_lengths[col + i] += lengths[i]
            self.tank_up_shapes[col + i] = up_shapes[i]

        self.cal_water_needs()
        self.cal_subset_up_shape()

tank_n = 0
tank_list = []

def init(N: int, mWidth: int, mHeight: int, mIDs: List[int], mLengths: List[List[int]], mUpShapes: List[List[int]]) -> None:
    global tank_n, tank_list
    tank_n = N
    tank_list = []
    for i in range(N):
        tank = FishTank(mIDs[i], mWidth, mHeight, mLengths[i], mUpShapes[i])
        tank_list.append(tank)

    tank_list.sort(key=lambda x:x.tank_id)

def checkStructures(mLengths: List[int], mUpShapes: List[int], mDownShapes: List[int]) -> int:
    cnt = 0

    subset_shape = tuple(mDownShapes)
    for tank in tank_list:
        if subset_shape in tank.subset_up_shapes:
            for col in tank.subset_up_shapes[subset_shape]:
                if tank.is_install(col, mLengths, mUpShapes, mDownShapes):
                    cnt += 1

    return cnt

def addStructures(mLengths: List[int], mUpShapes: List[int], mDownShapes: List[int]) -> int:
    subset_shape = tuple(mDownShapes)
    for tank in tank_list:
        if subset_shape in tank.subset_up_shapes:
            for col in tank.subset_up_shapes[subset_shape]:
                if tank.is_install(col, mLengths, mUpShapes, mDownShapes):
                    tank.do_install(col, mLengths, mUpShapes, mDownShapes)
                    result = tank.tank_id * 1000 + col + 1
                    return result
    return 0

def pourIn(mWater: int) -> Result:
    rs_id, rs_h, rs_used = 0, 0, 0

    for tank in tank_list:
        top, bottom = tank.tank_h, 1
        max_h, max_water = 0, 0

        while bottom <= top:
            middle = (top + bottom) // 2
            need = tank.water_needs[middle]
            if 0 < need <= mWater:
                max_h = middle
                max_water = need
                bottom = middle + 1
            else:
                if need == 0 and middle < tank.tank_h:
                    bottom = middle + 1
                else:
                    top = middle - 1

        if max_h > rs_h:
            rs_id, rs_h, rs_used = tank.tank_id, max_h, max_water
        elif max_h > 0 and max_h == rs_h and max_water > rs_used:
            rs_id, rs_used = tank.tank_id, max_water

    ret = Result()
    ret.ID, ret.height, ret.used = rs_id, rs_h, rs_used
    return ret
