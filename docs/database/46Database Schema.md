# 1 Title

Product Search Index

# 2 Name

product_search_index

# 3 Db Type

- search

# 4 Db Technology

Amazon OpenSearch

# 5 Entities

- {'name': 'ProductDocument', 'description': "A denormalized document for fast and complex product searches and filtering. Data is replicated from the Vendor & Catalog service's database.", 'attributes': [{'name': 'productId', 'type': 'Keyword', 'isRequired': True, 'isPrimaryKey': True, 'size': 0, 'isUnique': True, 'constraints': [], 'precision': 0, 'scale': 0, 'isForeignKey': False}, {'name': 'productName', 'type': 'Text', 'isRequired': True, 'isPrimaryKey': False, 'size': 0, 'isUnique': False, 'constraints': ['With fuzzy matching and typo tolerance'], 'precision': 0, 'scale': 0, 'isForeignKey': False}, {'name': 'productDescription', 'type': 'Text', 'isRequired': False, 'isPrimaryKey': False, 'size': 0, 'isUnique': False, 'constraints': [], 'precision': 0, 'scale': 0, 'isForeignKey': False}, {'name': 'price', 'type': 'Float', 'isRequired': True, 'isPrimaryKey': False, 'size': 0, 'isUnique': False, 'constraints': [], 'precision': 0, 'scale': 0, 'isForeignKey': False}, {'name': 'categoryName', 'type': 'Keyword', 'isRequired': True, 'isPrimaryKey': False, 'size': 0, 'isUnique': False, 'constraints': [], 'precision': 0, 'scale': 0, 'isForeignKey': False}, {'name': 'vendorId', 'type': 'Keyword', 'isRequired': True, 'isPrimaryKey': False, 'size': 0, 'isUnique': False, 'constraints': [], 'precision': 0, 'scale': 0, 'isForeignKey': False}, {'name': 'vendorStoreName', 'type': 'Text', 'isRequired': True, 'isPrimaryKey': False, 'size': 0, 'isUnique': False, 'constraints': [], 'precision': 0, 'scale': 0, 'isForeignKey': False}, {'name': 'vendorRating', 'type': 'Float', 'isRequired': True, 'isPrimaryKey': False, 'size': 0, 'isUnique': False, 'constraints': [], 'precision': 0, 'scale': 0, 'isForeignKey': False}, {'name': 'isAvailable', 'type': 'Boolean', 'isRequired': True, 'isPrimaryKey': False, 'size': 0, 'isUnique': False, 'constraints': [], 'precision': 0, 'scale': 0, 'isForeignKey': False}, {'name': 'isVendorOnline', 'type': 'Boolean', 'isRequired': True, 'isPrimaryKey': False, 'size': 0, 'isUnique': False, 'constraints': [], 'precision': 0, 'scale': 0, 'isForeignKey': False}, {'name': 'location', 'type': 'GeoPoint', 'isRequired': True, 'isPrimaryKey': False, 'size': 0, 'isUnique': False, 'constraints': [], 'precision': 0, 'scale': 0, 'isForeignKey': False}], 'primaryKeys': ['productId'], 'uniqueConstraints': [], 'indexes': []}

