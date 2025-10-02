# 1 Title

Live Tracking Cache

# 2 Name

live_tracking_cache

# 3 Db Type

- inmemory
- keyvalue

# 4 Db Technology

Redis GEO

# 5 Entities

- {'name': 'RiderLiveLocation', 'description': 'Stores the last known location of online riders for real-time tracking and proximity-based allocation. Uses Redis GEO data structures for high performance.', 'attributes': [{'name': 'geoSetKey', 'type': 'String', 'isRequired': True, 'isPrimaryKey': True, 'size': 0, 'isUnique': True, 'constraints': ["Example: 'rider_live_locations'"], 'precision': 0, 'scale': 0, 'isForeignKey': False}, {'name': 'member', 'type': 'String (Guid)', 'isRequired': True, 'isPrimaryKey': False, 'size': 0, 'isUnique': False, 'constraints': ['The riderId'], 'precision': 0, 'scale': 0, 'isForeignKey': False}, {'name': 'longitude', 'type': 'Float', 'isRequired': True, 'isPrimaryKey': False, 'size': 0, 'isUnique': False, 'constraints': [], 'precision': 0, 'scale': 0, 'isForeignKey': False}, {'name': 'latitude', 'type': 'Float', 'isRequired': True, 'isPrimaryKey': False, 'size': 0, 'isUnique': False, 'constraints': [], 'precision': 0, 'scale': 0, 'isForeignKey': False}], 'primaryKeys': ['geoSetKey', 'member'], 'uniqueConstraints': [], 'indexes': [{'name': 'GEO_Index', 'columns': ['longitude', 'latitude'], 'type': 'Geospatial'}]}

