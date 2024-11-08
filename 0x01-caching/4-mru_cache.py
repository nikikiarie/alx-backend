#!/usr/bin/env python3
""" BaseCaching module
"""
from base_caching import BaseCaching


class MRUCache(BaseCaching):
    """
    MRUCache defines a Most Recently Used caching system
    """

    def __init__(self):
        """
        Initialize the class and set up usage tracking
        """
        super().__init__()
        self.usage_order = []

    def put(self, key, item):
        """
        Add a key-value pair to the cache
        """
        if key is None or item is None:
            pass
        else:
            size = len(self.cache_data)
            if size >= BaseCaching.MAX_ITEMS and key not in self.cache_data:
                print("DISCARD: {}".format(self.usage_order[-1]))
                del self.cache_data[self.usage_order[-1]]
                del self.usage_order[-1]
            if key in self.usage_order:
                del self.usage_order[self.usage_order.index(key)]
            self.usage_order.append(key)
            self.cache_data[key] = item

    def get(self, key):
        """
        Retrieve the value associated with a given key, or None if not found
        """
        if key is not None and key in self.cache_data.keys():
            del self.usage_order[self.usage_order.index(key)]
            self.usage_order.append(key)
            return self.cache_data[key]
        return None
