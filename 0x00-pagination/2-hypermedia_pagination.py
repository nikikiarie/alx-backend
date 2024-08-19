#!/usr/bin/env python3
"""Deletion-resilient hypermedia pagination
"""

import csv
import math
from typing import Dict, List, Tuple


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """Retrieves index range from given page and page size.
    """

    return ((page - 1) * page_size, ((page - 1) * page_size) + page_size)


class Server:
    """Class to paginate a database of baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached data
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as file:
                data = csv.reader(file)
                d_set = [row for row in data]
            self.__dataset = d_set[1:]

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """Retrieves page data
        """
        assert type(page) == int and type(page_size) == int
        assert page > 0 and page_size > 0
        start, end = index_range(page, page_size)
        info = self.dataset()
        if start > len(info):
            return []
        return info[start:end]

    def get_hyper_index(self, index: int = None, page_size: int = 10) -> Dict:
        """Retrieves ipage info from index and with a
        size.
        """
        info = self.indexed_dataset()
        assert index is not None and index >= 0 and index <= max(info.keys())
        arr = []
        info_sum = 0
        next_index = None
        start = index if index else 0
        for i, item in info.items():
            if i >= start and info_sum < page_size:
                arr.append(item)
                info_sum += 1
                continue
            if info_sum == page_size:
                next_index = i
                break
        info_page = {
            'index': index,
            'next_index': next_index,
            'page_size': len(arr),
            'data': arr,
        }
        return info_page