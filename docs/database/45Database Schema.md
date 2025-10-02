# 1 Title

Location History Archive

# 2 Name

location_archive_db

# 3 Db Type

- timeseries

# 4 Db Technology

Amazon Timestream

# 5 Entities

- {'name': 'RiderLocationEvent', 'description': "Stores a time-series of a rider's GPS location for historical analysis, route playback, and auditing. Optimized for fast time-based queries.", 'attributes': [{'name': 'riderId', 'type': 'Dimension', 'isRequired': True, 'isPrimaryKey': False, 'size': 0, 'isUnique': False, 'constraints': [], 'precision': 0, 'scale': 0, 'isForeignKey': False}, {'name': 'time', 'type': 'Timestamp', 'isRequired': True, 'isPrimaryKey': True, 'size': 0, 'isUnique': False, 'constraints': [], 'precision': 0, 'scale': 0, 'isForeignKey': False}, {'name': 'latitude', 'type': 'Measure (Double)', 'isRequired': True, 'isPrimaryKey': False, 'size': 0, 'isUnique': False, 'constraints': [], 'precision': 0, 'scale': 0, 'isForeignKey': False}, {'name': 'longitude', 'type': 'Measure (Double)', 'isRequired': True, 'isPrimaryKey': False, 'size': 0, 'isUnique': False, 'constraints': [], 'precision': 0, 'scale': 0, 'isForeignKey': False}, {'name': 'accuracy', 'type': 'Measure (Double)', 'isRequired': False, 'isPrimaryKey': False, 'size': 0, 'isUnique': False, 'constraints': [], 'precision': 0, 'scale': 0, 'isForeignKey': False}], 'primaryKeys': ['time', 'riderId'], 'uniqueConstraints': [], 'indexes': []}

