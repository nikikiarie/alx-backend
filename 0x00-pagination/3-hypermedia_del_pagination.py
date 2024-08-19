#!/usr/bin/env python3
"""Task 2: Hypermedia pagination
"""

import csv
from typing import Dict, List, Tuple


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """Retrieves the index range from a given page and page size.
    """

    return ((page - 1) * page_size, ((page - 1) * page_size) + page_size)


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                data = csv.reader(f)
                info = [row for row in data]
            self.__dataset = info[1:]

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """Retrieves a page of data.
        """
        assert type(page) == int and type(page_size) == int
        assert page > 0 and page_size > 0
        a, z = index_range(page, page_size)
        data = self.dataset()
        if a > len(data):
            return []
        return data[a:z]

    def get_hyper_index(self, index: int = None, page_size: int = 10) -> Dict:
        """Retrieves page info from index and with a
        given size.
        """
        info = self.indexed_dataset()
        assert index is not None and index >= 0 and index <= max(info.keys())
        arr = []
        next_i = None
        data_sum = 0
        a = index if index else 0
        for i, item in info.items():
            if i >= a and data_sum < page_size:
                arr.append(item)
                data_sum += 1
                continue
            if data_sum == page_size:
                next_i = i
                break
        p_info = {
            'index': index,
            'next_index': next_i,
            'page_size': len(arr),
            'data': arr,
        }
        return p_info