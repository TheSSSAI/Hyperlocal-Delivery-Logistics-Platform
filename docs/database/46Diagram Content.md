erDiagram
    ProductDocument {
        Keyword productId PK
        Text productName
        Text productDescription
        Float price
        Keyword categoryName
        Keyword vendorId
        Text vendorStoreName
        Float vendorRating
        Boolean isAvailable
        Boolean isVendorOnline
        GeoPoint location
    }