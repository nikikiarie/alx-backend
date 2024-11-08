#!/usr/bin/env python3
""" BaseCaching module
"""
from base_caching import BaseCaching


class FIFOCache(BaseCaching):
    """
    FIFO caching system implementation
    """

    def __init__(self):
        """
        Initialize the cache with a FIFO order list
        """
        super().__init__()
        self.order = []

    def put(self, key, item):
        """
        Add a key-value pair to the cache, removing oldest if full
        """
        if key is None or item is None:
            pass
        else:
            size = len(self.cache_data)
            if size >= BaseCaching.MAX_ITEMS and key not in self.cache_data:
                print("DISCARD: {}".format(self.order[0]))
                del self.cache_data[self.order[0]]
                del self.order[0]
            self.order.append(key)
            self.cache_data[key] = item

    def get(self, key):
        """
        Retrieve the value associated with a key, or None if not found
        """
        if key is not None and key in self.cache_data.keys():
            return self.cache_data[key]
        return None
