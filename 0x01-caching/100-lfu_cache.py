#!/usr/bin/env python3
""" BaseCaching module
"""
from base_caching import BaseCaching


class LFUCache(BaseCaching):
    """
    LFUCache defines a Least Frequently Used caching system
    """

    def __init__(self):
        """
        Initialize with the parent's init method
        """
        super().__init__()
        self.access_order = []
        self.access_count = {}

    def put(self, key, item):
        """
        Store a key-value pair in the cache
        """
        if key is None or item is None:
            pass
        else:
            size = len(self.cache_data)
            if size >= BaseCaching.MAX_ITEMS and key not in self.cache_data:
                least_freq = min(self.access_count.values())
                least_freq_keys = []
                for k, v in self.access_count.items():
                    if v == least_freq:
                        least_freq_keys.append(k)
                if len(least_freq_keys) > 1:
                    lru_lfu = {}
                    for k in least_freq_keys:
                        lru_lfu[k] = self.access_order.index(k)
                    discard = min(lru_lfu.values())
                    discard = self.access_order[discard]
                else:
                    discard = least_freq_keys[0]

                print("DISCARD: {}".format(discard))
                del self.cache_data[discard]
                del self.access_order[self.access_order.index(discard)]
                del self.access_count[discard]
            # update usage frequency
            if key in self.access_count:
                self.access_count[key] += 1
            else:
                self.access_count[key] = 1
            if key in self.access_order:
                del self.access_order[self.access_order.index(key)]
            self.access_order.append(key)
            self.cache_data[key] = item

    def get(self, key):
        """
        Retrieve the value associated with a given key, or None
        """
        if key is not None and key in self.cache_data.keys():
            del self.access_order[self.access_order.index(key)]
            self.access_order.append(key)
            self.access_count[key] += 1
            return self.cache_data[key]
        return None
