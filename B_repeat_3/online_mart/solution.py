from heapq import heappop, heappush

class RESULT:
    def __init__(self, cnt, IDs):
        self.cnt = cnt
        self.IDs = IDs  # [int] * 5

product_info = {}
cate_com_matrix = [[list() for _ in range(6)] for _ in range(6)]
cate_com_count = [[0] * 6 for _ in range(6)]
cate_com_discount = [[0] * 6 for _ in range(6)]

def init() -> None:
    global product_info, cate_com_matrix, cate_com_discount, cate_com_count
    product_info = {}
    cate_com_matrix = [[list() for _ in range(6)] for _ in range(6)]
    cate_com_discount = [[0] * 6 for _ in range(6)]
    cate_com_count = [[0] * 6 for _ in range(6)]

def sell(mID : int, mCategory : int, mCompany : int, mPrice : int) -> int:
    total_price = mPrice + cate_com_discount[mCategory][mCompany]
    product_info[mID] = (mCategory, mCompany, total_price)
    heappush(cate_com_matrix[mCategory][mCompany], (total_price, mID))
    cate_com_count[mCategory][mCompany] += 1
    return cate_com_count[mCategory][mCompany]

def closeSale(mID : int) -> int:
    if mID not in product_info:
        return -1
    cate, com, t_p = product_info.pop(mID)
    real_price = t_p - cate_com_discount[cate][com]
    cate_com_count[cate][com] -= 1
    return real_price

def discount(mCategory : int, mCompany : int, mAmount : int) -> int:
    cate_com_discount[mCategory][mCompany] += mAmount
    discount_val = cate_com_discount[mCategory][mCompany]
    hq = cate_com_matrix[mCategory][mCompany]
    while hq:
        t_p, item_id = heappop(hq)
        if item_id not in product_info:
            continue
        #real_price = t_p - cate_com_discount[mCategory][mCompany]
        if t_p <= discount_val :
            del product_info[item_id]
            cate_com_count[mCategory][mCompany] -= 1
            continue
        heappush(hq, (t_p, item_id))
        break

    return cate_com_count[mCategory][mCompany]

def show(mHow : int, mCode : int) -> RESULT:
    if mHow == 0:
        targets = [(cate, com) for cate in range(1,6) for com in range(1,6)]
    elif mHow == 1:
        targets = [(mCode, com) for com in range(1,6)]
    elif mHow == 2:
        targets = [(cate, mCode) for cate in range(1,6)]

    candidate_list = []
    for cate, com in targets:
        hq = cate_com_matrix[cate][com]
        repair = []
        cnt = 0
        while hq and cnt < 5:
            t_p, item_id = heappop(hq)
            if item_id not in product_info:
                continue

            real_price = t_p - cate_com_discount[cate][com]

            heappush(candidate_list, (real_price, item_id))
            repair.append((t_p, item_id))
            cnt += 1

        for t_p, item_id in repair:
            heappush(hq, (t_p, item_id))

    result = [0, 0, 0, 0, 0]
    total_cnt = 0
    while candidate_list and total_cnt < 5:
        real_price, item_id = heappop(candidate_list)
        result[total_cnt] = item_id
        total_cnt += 1


    return RESULT(total_cnt, result)