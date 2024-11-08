#!/usr/bin/env python3

'''Basic caching system
'''

from base_caching import BaseCaching


class BasicCache(BaseCaching):
    '''A caching system class `BasicCache` that inherits from `BaseCaching`
    '''

    def put(self, key, item):
        '''Adds `item` to `self.cache_data` with `key` as its identifier
        '''
        if key is not None and item is not None:
            self.cache_data[key] = item

    def get(self, key):
        '''Retrieves the value associated with `key` in `self.cache_data`
        '''
        return self.cache_data.get(key, None)
