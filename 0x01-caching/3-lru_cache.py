#!/usr/bin/env python3
""" BaseCaching module
"""
from base_caching import BaseCaching


class LRUCache(BaseCaching):
    """
    LRUCache defines a Least Recently Used (LRU) caching system
    """
    def __init__(self):
        """
        Initialize the cache with the parent's init method
        """
        super().__init__()
        self.access_order = []

    def put(self, key, item):
        """
        Store a key-value pair in the cache
        """
        if key is None or item is None:
            pass
        else:
            size = len(self.cache_data)
            if size >= BaseCaching.MAX_ITEMS and key not in self.cache_data:
                print("DISCARD: {}".format(self.access_order[0]))
                del self.cache_data[self.access_order[0]]
                del self.access_order[0]
            if key in self.access_order:
                del self.access_order[self.access_order.index(key)]
            self.access_order.append(key)
            self.cache_data[key] = item

    def get(self, key):
        """
        Retrieve the value associated with a key, or None if not found
        """
        if key is not None and key in self.cache_data.keys():
            del self.access_order[self.access_order.index(key)]
            self.access_order.append(key)
            return self.cache_data[key]
        return None
