from collections import defaultdict
from heapq import heappop, heappush

building_n = 0
building_roads = defaultdict(list)

def init(N, K, sBuilding, eBuilding, mDistance):
    global building_n, building_roads

    building_n = N
    building_roads = defaultdict(list)

    for i in range(K):
        building_roads[sBuilding[i]].append((eBuilding[i],mDistance[i]))
        building_roads[eBuilding[i]].append((sBuilding[i],mDistance[i]))


def add(sBuilding, eBuilding, mDistance):
    building_roads[sBuilding].append((eBuilding, mDistance))
    building_roads[eBuilding].append((sBuilding, mDistance))


def dijkstra(target_list, R):
    min_dist_list = [float('inf')] * building_n
    hq = []
    for _id in target_list:
        min_dist_list[_id] = 0
        heappush(hq, (0, _id))

    while hq:
        dist, node = heappop(hq)
        if dist > R:
            break
        if dist > min_dist_list[node]:
            continue

        for next_node, next_dist in building_roads[node]:
            total_dist = dist + next_dist
            if total_dist < min_dist_list[next_node]:
                min_dist_list[next_node] = total_dist
                if total_dist <= R:
                    heappush(hq, (total_dist, next_node))
    return min_dist_list


def calculate(M, mCoffee, P, mBakery, R):
    cafe_dist = dijkstra(mCoffee, R)
    bake_dist = dijkstra(mBakery, R)

    not_home_building_ids = set(mCoffee + mBakery)
    min_dist = float('inf')

    for i in range(building_n):
        if i in not_home_building_ids:
            continue
        if cafe_dist[i] <= R and bake_dist[i] <= R:
            min_dist = min(min_dist, cafe_dist[i] + bake_dist[i])

    if min_dist == float('inf'):
        return -1
    else:
        return min_dist