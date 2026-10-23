const express = require('express')
const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')
const { SignJWT, jwtVerify } = require('jose')
const app = express();
const port = 5000

app.use(express.json())

let products = [
    {
        "id": 1,
        "title": "Essence Mascara Lash Princess",
        "description": "Mascara Essence Lash Princess nổi tiếng với hiệu ứng làm dày và dài mi chỉ sau vài lần chải. Đầu cọ hình nón giúp tách đều từng sợi, chải được cả những sợi mi ngắn ở khóe mắt mà không bị vón cục. Công thức lâu trôi, giữ mi cong suốt ngày dài và không thử nghiệm trên động vật. Mẹo: chải theo hình zíc zắc từ chân mi lên để mi dày tự nhiên hơn.",
        "category": "beauty",
        "price": 9.99,
        "discountPercentage": 10.48,
        "rating": 2.56,
        "stock": 99,
        "tags": [
            "beauty",
            "mascara"
        ],
        "brand": "Essence",
        "sku": "BEA-ESS-ESS-001",
        "weight": 4,
        "dimensions": {
            "width": 15.14,
            "height": 13.08,
            "depth": 22.99
        },
        "warrantyInformation": "1 week warranty",
        "shippingInformation": "Ships in 3-5 business days",
        "availabilityStatus": "In Stock",
        "reviews": [
            {
                "rating": 3,
                "comment": "Would not recommend!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Eleanor Collins",
                "reviewerEmail": "eleanor.collins@x.dummyjson.com"
            },
            {
                "rating": 4,
                "comment": "Very satisfied!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Lucas Gordon",
                "reviewerEmail": "lucas.gordon@x.dummyjson.com"
            },
            {
                "rating": 5,
                "comment": "Highly impressed!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Eleanor Collins",
                "reviewerEmail": "eleanor.collins@x.dummyjson.com"
            }
        ],
        "returnPolicy": "No return policy",
        "minimumOrderQuantity": 48,
        "meta": {
            "createdAt": "2025-10-09T14:47:01.588Z",
            "updatedAt": "2026-05-23T11:27:41.868Z",
            "barcode": "5784719087687",
            "qrCode": "https://cdn.dummyjson.com/public/qr-code.png"
        },
        "images": [
            "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp"
        ],
        "thumbnail": "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp"
    },
    {
        "id": 2,
        "title": "Eyeshadow Palette with Mirror",
        "description": "Bảng phấn mắt nhiều tông màu từ nude, nâu đất đến ánh nhũ, đủ để tán từ lớp trang điểm đi làm nhẹ nhàng đến smokey eye buổi tối. Hạt phấn mịn, bám tốt và dễ tán chuyển màu. Gương lớn gắn trong nắp giúp bạn dặm lại lớp trang điểm mọi lúc mọi nơi, rất tiện mang theo khi đi làm hoặc du lịch.",
        "category": "beauty",
        "price": 19.99,
        "discountPercentage": 18.19,
        "rating": 2.86,
        "stock": 34,
        "tags": [
            "beauty",
            "eyeshadow"
        ],
        "brand": "Glamour Beauty",
        "sku": "BEA-GLA-EYE-002",
        "weight": 9,
        "dimensions": {
            "width": 9.26,
            "height": 22.47,
            "depth": 27.67
        },
        "warrantyInformation": "1 year warranty",
        "shippingInformation": "Ships in 2 weeks",
        "availabilityStatus": "In Stock",
        "reviews": [
            {
                "rating": 5,
                "comment": "Great product!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Savannah Gomez",
                "reviewerEmail": "savannah.gomez@x.dummyjson.com"
            },
            {
                "rating": 4,
                "comment": "Awesome product!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Christian Perez",
                "reviewerEmail": "christian.perez@x.dummyjson.com"
            },
            {
                "rating": 1,
                "comment": "Poor quality!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Nicholas Bailey",
                "reviewerEmail": "nicholas.bailey@x.dummyjson.com"
            }
        ],
        "returnPolicy": "7 days return policy",
        "minimumOrderQuantity": 20,
        "meta": {
            "createdAt": "2024-12-03T11:29:45.706Z",
            "updatedAt": "2025-08-24T16:52:47.806Z",
            "barcode": "9170275171413",
            "qrCode": "https://cdn.dummyjson.com/public/qr-code.png"
        },
        "images": [
            "https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/1.webp"
        ],
        "thumbnail": "https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/thumbnail.webp"
    },
    {
        "id": 3,
        "title": "Powder Canister",
        "description": "Phấn phủ dạng bột siêu mịn giúp cố định lớp nền và kiểm soát dầu suốt nhiều giờ. Kết cấu trong suốt, nhẹ mặt, không làm thay đổi màu kem nền và hạn chế tình trạng mốc hay xuống tông. Lớp hoàn thiện mịn lì, che mờ lỗ chân lông, phù hợp cho cả da dầu và da hỗn hợp. Dùng bông phấn hoặc cọ lớn, phủ nhẹ lên vùng chữ T để có hiệu quả tốt nhất.",
        "category": "beauty",
        "price": 14.99,
        "discountPercentage": 9.84,
        "rating": 4.64,
        "stock": 89,
        "tags": [
            "beauty",
            "face powder"
        ],
        "brand": "Velvet Touch",
        "sku": "BEA-VEL-POW-003",
        "weight": 8,
        "dimensions": {
            "width": 29.27,
            "height": 27.93,
            "depth": 20.59
        },
        "warrantyInformation": "3 months warranty",
        "shippingInformation": "Ships in 1-2 business days",
        "availabilityStatus": "In Stock",
        "reviews": [
            {
                "rating": 4,
                "comment": "Would buy again!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Alexander Jones",
                "reviewerEmail": "alexander.jones@x.dummyjson.com"
            },
            {
                "rating": 5,
                "comment": "Highly impressed!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Elijah Cruz",
                "reviewerEmail": "elijah.cruz@x.dummyjson.com"
            },
            {
                "rating": 1,
                "comment": "Very dissatisfied!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Avery Perez",
                "reviewerEmail": "avery.perez@x.dummyjson.com"
            }
        ],
        "returnPolicy": "No return policy",
        "minimumOrderQuantity": 22,
        "meta": {
            "createdAt": "2025-01-08T18:30:12.844Z",
            "updatedAt": "2025-11-26T14:49:26.980Z",
            "barcode": "8418883906837",
            "qrCode": "https://cdn.dummyjson.com/public/qr-code.png"
        },
        "images": [
            "https://cdn.dummyjson.com/product-images/beauty/powder-canister/1.webp"
        ],
        "thumbnail": "https://cdn.dummyjson.com/product-images/beauty/powder-canister/thumbnail.webp"
    },
    {
        "id": 4,
        "title": "Red Lipstick",
        "description": "Son thỏi màu đỏ cổ điển, sắc nét và nổi bật, hợp với hầu hết các tông da. Chất son mềm mượt, lướt êm trên môi, lên màu chuẩn chỉ sau một lần tô. Thành phần dưỡng ẩm giúp môi không bị khô hay lộ vân dù dùng cả ngày. Lựa chọn lý tưởng cho những buổi hẹn, tiệc tối hay khi bạn muốn một diện mạo tự tin.",
        "category": "beauty",
        "price": 12.99,
        "discountPercentage": 12.16,
        "rating": 4.36,
        "stock": 91,
        "tags": [
            "beauty",
            "lipstick"
        ],
        "brand": "Chic Cosmetics",
        "sku": "BEA-CHI-LIP-004",
        "weight": 1,
        "dimensions": {
            "width": 18.11,
            "height": 28.38,
            "depth": 22.17
        },
        "warrantyInformation": "3 year warranty",
        "shippingInformation": "Ships in 1 week",
        "availabilityStatus": "In Stock",
        "reviews": [
            {
                "rating": 4,
                "comment": "Great product!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Liam Garcia",
                "reviewerEmail": "liam.garcia@x.dummyjson.com"
            },
            {
                "rating": 5,
                "comment": "Great product!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Ruby Andrews",
                "reviewerEmail": "ruby.andrews@x.dummyjson.com"
            },
            {
                "rating": 5,
                "comment": "Would buy again!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Clara Berry",
                "reviewerEmail": "clara.berry@x.dummyjson.com"
            }
        ],
        "returnPolicy": "7 days return policy",
        "minimumOrderQuantity": 40,
        "meta": {
            "createdAt": "2025-11-22T23:28:00.911Z",
            "updatedAt": "2026-01-26T01:31:40.721Z",
            "barcode": "9467746727219",
            "qrCode": "https://cdn.dummyjson.com/public/qr-code.png"
        },
        "images": [
            "https://cdn.dummyjson.com/product-images/beauty/red-lipstick/1.webp"
        ],
        "thumbnail": "https://cdn.dummyjson.com/product-images/beauty/red-lipstick/thumbnail.webp"
    },
    {
        "id": 5,
        "title": "Red Nail Polish",
        "description": "Sơn móng tay màu đỏ đậm, bóng như gương, mang lại bộ móng chuẩn salon ngay tại nhà. Công thức khô nhanh, màu lên đều chỉ với hai lớp và hạn chế bong tróc. Cọ sơn bản dẹt giúp phủ kín móng gọn gàng, kể cả với người mới tự làm móng. Để móng bền màu hơn, nên dùng kèm một lớp sơn lót và sơn bóng.",
        "category": "beauty",
        "price": 8.99,
        "discountPercentage": 11.44,
        "rating": 4.32,
        "stock": 79,
        "tags": [
            "beauty",
            "nail polish"
        ],
        "brand": "Nail Couture",
        "sku": "BEA-NAI-NAI-005",
        "weight": 8,
        "dimensions": {
            "width": 21.63,
            "height": 16.48,
            "depth": 29.84
        },
        "warrantyInformation": "1 month warranty",
        "shippingInformation": "Ships overnight",
        "availabilityStatus": "In Stock",
        "reviews": [
            {
                "rating": 2,
                "comment": "Poor quality!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Benjamin Wilson",
                "reviewerEmail": "benjamin.wilson@x.dummyjson.com"
            },
            {
                "rating": 5,
                "comment": "Great product!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Liam Smith",
                "reviewerEmail": "liam.smith@x.dummyjson.com"
            },
            {
                "rating": 1,
                "comment": "Very unhappy with my purchase!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Clara Berry",
                "reviewerEmail": "clara.berry@x.dummyjson.com"
            }
        ],
        "returnPolicy": "No return policy",
        "minimumOrderQuantity": 22,
        "meta": {
            "createdAt": "2025-10-03T07:39:53.470Z",
            "updatedAt": "2026-04-24T00:21:44.635Z",
            "barcode": "4063010628104",
            "qrCode": "https://cdn.dummyjson.com/public/qr-code.png"
        },
        "images": [
            "https://cdn.dummyjson.com/product-images/beauty/red-nail-polish/1.webp"
        ],
        "thumbnail": "https://cdn.dummyjson.com/product-images/beauty/red-nail-polish/thumbnail.webp"
    },
    {
        "id": 6,
        "title": "Calvin Klein CK One",
        "description": "CK One ra mắt năm 1994 và trở thành một trong những mùi hương unisex nổi tiếng nhất thế giới. Hương đầu tươi mát của cam bergamot, chanh và dứa, chuyển dần sang lớp hương giữa nhẹ nhàng với hoa nhài và trà xanh, khép lại bằng xạ hương và gỗ. Mùi hương sạch sẽ, dễ chịu, phù hợp dùng hằng ngày, đi học, đi làm, đặc biệt vào mùa hè.",
        "category": "fragrances",
        "price": 49.99,
        "discountPercentage": 1.89,
        "rating": 4.37,
        "stock": 29,
        "tags": [
            "fragrances",
            "perfumes"
        ],
        "brand": "Calvin Klein",
        "sku": "FRA-CAL-CAL-006",
        "weight": 7,
        "dimensions": {
            "width": 29.36,
            "height": 27.76,
            "depth": 20.72
        },
        "warrantyInformation": "1 week warranty",
        "shippingInformation": "Ships overnight",
        "availabilityStatus": "In Stock",
        "reviews": [
            {
                "rating": 2,
                "comment": "Very disappointed!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Layla Young",
                "reviewerEmail": "layla.young@x.dummyjson.com"
            },
            {
                "rating": 4,
                "comment": "Fast shipping!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Daniel Cook",
                "reviewerEmail": "daniel.cook@x.dummyjson.com"
            },
            {
                "rating": 3,
                "comment": "Not as described!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Jacob Cooper",
                "reviewerEmail": "jacob.cooper@x.dummyjson.com"
            }
        ],
        "returnPolicy": "90 days return policy",
        "minimumOrderQuantity": 9,
        "meta": {
            "createdAt": "2025-02-27T22:08:36.617Z",
            "updatedAt": "2025-10-23T02:22:36.410Z",
            "barcode": "2451534060749",
            "qrCode": "https://cdn.dummyjson.com/public/qr-code.png"
        },
        "images": [
            "https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/1.webp",
            "https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/2.webp",
            "https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/3.webp"
        ],
        "thumbnail": "https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/thumbnail.webp"
    },
    {
        "id": 7,
        "title": "Chanel Coco Noir Eau De",
        "description": "Coco Noir là phiên bản bí ẩn và quyến rũ nhất trong dòng nước hoa Coco của Chanel. Mở đầu bằng bưởi và cam bergamot tươi sáng, lớp hương giữa là hoa hồng và hoa nhài sang trọng, để lại dư hương ấm áp của gỗ đàn hương, hoắc hương và vani. Mùi hương sâu lắng, lưu hương lâu, rất hợp cho những buổi tối, tiệc hoặc dịp đặc biệt.",
        "category": "fragrances",
        "price": 129.99,
        "discountPercentage": 16.51,
        "rating": 4.26,
        "stock": 58,
        "tags": [
            "fragrances",
            "perfumes"
        ],
        "brand": "Chanel",
        "sku": "FRA-CHA-CHA-007",
        "weight": 7,
        "dimensions": {
            "width": 24.5,
            "height": 25.7,
            "depth": 25.98
        },
        "warrantyInformation": "3 year warranty",
        "shippingInformation": "Ships overnight",
        "availabilityStatus": "In Stock",
        "reviews": [
            {
                "rating": 4,
                "comment": "Highly impressed!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Ruby Andrews",
                "reviewerEmail": "ruby.andrews@x.dummyjson.com"
            },
            {
                "rating": 5,
                "comment": "Awesome product!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Leah Henderson",
                "reviewerEmail": "leah.henderson@x.dummyjson.com"
            },
            {
                "rating": 5,
                "comment": "Very happy with my purchase!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Xavier Wright",
                "reviewerEmail": "xavier.wright@x.dummyjson.com"
            }
        ],
        "returnPolicy": "No return policy",
        "minimumOrderQuantity": 1,
        "meta": {
            "createdAt": "2025-04-13T12:15:53.051Z",
            "updatedAt": "2025-12-23T23:46:02.892Z",
            "barcode": "4091737746820",
            "qrCode": "https://cdn.dummyjson.com/public/qr-code.png"
        },
        "images": [
            "https://cdn.dummyjson.com/product-images/fragrances/chanel-coco-noir-eau-de/1.webp",
            "https://cdn.dummyjson.com/product-images/fragrances/chanel-coco-noir-eau-de/2.webp",
            "https://cdn.dummyjson.com/product-images/fragrances/chanel-coco-noir-eau-de/3.webp"
        ],
        "thumbnail": "https://cdn.dummyjson.com/product-images/fragrances/chanel-coco-noir-eau-de/thumbnail.webp"
    },
    {
        "id": 8,
        "title": "Dior J'adore",
        "description": "J'adore của Dior ra mắt năm 1999 và nhanh chóng trở thành biểu tượng của sự nữ tính, thanh lịch. Đây là một bó hoa rực rỡ kết hợp ngọc lan tây, hoa hồng và hoa nhài, mang lại cảm giác mềm mại, sang trọng nhưng không quá nồng. Mùi hương dễ dùng ở nhiều hoàn cảnh, từ công sở đến những buổi gặp gỡ quan trọng.",
        "category": "fragrances",
        "price": 89.99,
        "discountPercentage": 14.72,
        "rating": 3.8,
        "stock": 98,
        "tags": [
            "fragrances",
            "perfumes"
        ],
        "brand": "Dior",
        "sku": "FRA-DIO-DIO-008",
        "weight": 4,
        "dimensions": {
            "width": 27.67,
            "height": 28.28,
            "depth": 11.83
        },
        "warrantyInformation": "1 week warranty",
        "shippingInformation": "Ships in 2 weeks",
        "availabilityStatus": "In Stock",
        "reviews": [
            {
                "rating": 5,
                "comment": "Great value for money!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Nicholas Bailey",
                "reviewerEmail": "nicholas.bailey@x.dummyjson.com"
            },
            {
                "rating": 4,
                "comment": "Great value for money!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Penelope Harper",
                "reviewerEmail": "penelope.harper@x.dummyjson.com"
            },
            {
                "rating": 4,
                "comment": "Great product!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Emma Miller",
                "reviewerEmail": "emma.miller@x.dummyjson.com"
            }
        ],
        "returnPolicy": "7 days return policy",
        "minimumOrderQuantity": 10,
        "meta": {
            "createdAt": "2025-11-22T12:24:29.033Z",
            "updatedAt": "2026-05-11T22:03:20.337Z",
            "barcode": "1445086097250",
            "qrCode": "https://cdn.dummyjson.com/public/qr-code.png"
        },
        "images": [
            "https://cdn.dummyjson.com/product-images/fragrances/dior-j'adore/1.webp",
            "https://cdn.dummyjson.com/product-images/fragrances/dior-j'adore/2.webp",
            "https://cdn.dummyjson.com/product-images/fragrances/dior-j'adore/3.webp"
        ],
        "thumbnail": "https://cdn.dummyjson.com/product-images/fragrances/dior-j'adore/thumbnail.webp"
    },
    {
        "id": 9,
        "title": "Dolce Shine Eau de",
        "description": "Dolce Shine mang tinh thần vui tươi, rạng rỡ như ánh nắng mùa hè Địa Trung Hải. Hương xoài ngọt ngào hòa cùng hoa nhài tinh tế, khép lại bằng gỗ vàng ấm áp. Mùi hương trẻ trung, năng động, phù hợp với các bạn trẻ yêu thích sự tươi mới, dùng tốt cho những ngày đi chơi, dạo phố hay du lịch.",
        "category": "fragrances",
        "price": 69.99,
        "discountPercentage": 0.62,
        "rating": 3.96,
        "stock": 4,
        "tags": [
            "fragrances",
            "perfumes"
        ],
        "brand": "Dolce & Gabbana",
        "sku": "FRA-DOL-DOL-009",
        "weight": 6,
        "dimensions": {
            "width": 27.28,
            "height": 29.88,
            "depth": 18.3
        },
        "warrantyInformation": "3 year warranty",
        "shippingInformation": "Ships in 1 month",
        "availabilityStatus": "Low Stock",
        "reviews": [
            {
                "rating": 4,
                "comment": "Would buy again!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Mateo Bennett",
                "reviewerEmail": "mateo.bennett@x.dummyjson.com"
            },
            {
                "rating": 4,
                "comment": "Highly recommended!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Nolan Gonzalez",
                "reviewerEmail": "nolan.gonzalez@x.dummyjson.com"
            },
            {
                "rating": 5,
                "comment": "Very happy with my purchase!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Aurora Lawson",
                "reviewerEmail": "aurora.lawson@x.dummyjson.com"
            }
        ],
        "returnPolicy": "7 days return policy",
        "minimumOrderQuantity": 2,
        "meta": {
            "createdAt": "2024-11-19T07:56:01.798Z",
            "updatedAt": "2025-02-01T07:08:45.512Z",
            "barcode": "3023868210708",
            "qrCode": "https://cdn.dummyjson.com/public/qr-code.png"
        },
        "images": [
            "https://cdn.dummyjson.com/product-images/fragrances/dolce-shine-eau-de/1.webp",
            "https://cdn.dummyjson.com/product-images/fragrances/dolce-shine-eau-de/2.webp",
            "https://cdn.dummyjson.com/product-images/fragrances/dolce-shine-eau-de/3.webp"
        ],
        "thumbnail": "https://cdn.dummyjson.com/product-images/fragrances/dolce-shine-eau-de/thumbnail.webp"
    },
    {
        "id": 10,
        "title": "Gucci Bloom Eau de",
        "description": "Gucci Bloom được tạo ra như một khu vườn đầy hoa trắng đang nở rộ. Hương huệ trắng và hoa nhài đậm đà kết hợp cùng hoa dây giun Rangoon, tạo nên một mùi hương hoa cỏ phong phú, tự nhiên và hiện đại. Mùi hương mềm mại, lãng mạn, lưu hương tốt, phù hợp với những người yêu thích sự nữ tính nhưng vẫn cá tính.",
        "category": "fragrances",
        "price": 79.99,
        "discountPercentage": 14.39,
        "rating": 2.74,
        "stock": 91,
        "tags": [
            "fragrances",
            "perfumes"
        ],
        "brand": "Gucci",
        "sku": "FRA-GUC-GUC-010",
        "weight": 7,
        "dimensions": {
            "width": 20.92,
            "height": 21.68,
            "depth": 11.2
        },
        "warrantyInformation": "6 months warranty",
        "shippingInformation": "Ships overnight",
        "availabilityStatus": "In Stock",
        "reviews": [
            {
                "rating": 1,
                "comment": "Very dissatisfied!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Cameron Perez",
                "reviewerEmail": "cameron.perez@x.dummyjson.com"
            },
            {
                "rating": 5,
                "comment": "Very happy with my purchase!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Daniel Cook",
                "reviewerEmail": "daniel.cook@x.dummyjson.com"
            },
            {
                "rating": 4,
                "comment": "Highly impressed!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Addison Wright",
                "reviewerEmail": "addison.wright@x.dummyjson.com"
            }
        ],
        "returnPolicy": "No return policy",
        "minimumOrderQuantity": 2,
        "meta": {
            "createdAt": "2026-07-19T20:10:42.419Z",
            "updatedAt": "2026-07-27T15:21:17.071Z",
            "barcode": "3170832177880",
            "qrCode": "https://cdn.dummyjson.com/public/qr-code.png"
        },
        "images": [
            "https://cdn.dummyjson.com/product-images/fragrances/gucci-bloom-eau-de/1.webp",
            "https://cdn.dummyjson.com/product-images/fragrances/gucci-bloom-eau-de/2.webp",
            "https://cdn.dummyjson.com/product-images/fragrances/gucci-bloom-eau-de/3.webp"
        ],
        "thumbnail": "https://cdn.dummyjson.com/product-images/fragrances/gucci-bloom-eau-de/thumbnail.webp"
    },
    {
        "id": 11,
        "title": "Annibale Colombo Bed",
        "description": "Giường ngủ Annibale Colombo mang phong cách cổ điển Ý, được chế tác từ gỗ cao cấp với các đường nét chạm trổ tinh xảo. Đầu giường bọc nệm êm ái, tạo cảm giác thoải mái khi ngồi đọc sách hay nghỉ ngơi. Khung giường chắc chắn, chịu lực tốt, là điểm nhấn sang trọng cho phòng ngủ master.",
        "category": "furniture",
        "price": 1899.99,
        "discountPercentage": 8.57,
        "rating": 4.77,
        "stock": 88,
        "tags": [
            "furniture",
            "beds"
        ],
        "brand": "Annibale Colombo",
        "sku": "FUR-ANN-ANN-011",
        "weight": 10,
        "dimensions": {
            "width": 28.16,
            "height": 25.36,
            "depth": 17.28
        },
        "warrantyInformation": "1 year warranty",
        "shippingInformation": "Ships in 1 month",
        "availabilityStatus": "In Stock",
        "reviews": [
            {
                "rating": 2,
                "comment": "Would not recommend!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Christopher West",
                "reviewerEmail": "christopher.west@x.dummyjson.com"
            },
            {
                "rating": 4,
                "comment": "Highly impressed!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Vivian Carter",
                "reviewerEmail": "vivian.carter@x.dummyjson.com"
            },
            {
                "rating": 1,
                "comment": "Poor quality!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Mason Wright",
                "reviewerEmail": "mason.wright@x.dummyjson.com"
            }
        ],
        "returnPolicy": "No return policy",
        "minimumOrderQuantity": 1,
        "meta": {
            "createdAt": "2026-05-31T06:08:47.181Z",
            "updatedAt": "2026-06-02T19:49:21.474Z",
            "barcode": "3610757456581",
            "qrCode": "https://cdn.dummyjson.com/public/qr-code.png"
        },
        "images": [
            "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/1.webp",
            "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/2.webp",
            "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/3.webp"
        ],
        "thumbnail": "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/thumbnail.webp"
    },
    {
        "id": 12,
        "title": "Annibale Colombo Sofa",
        "description": "Sofa Annibale Colombo kết hợp thiết kế tinh tế với lớp bọc vải cao cấp, mềm mại và bền màu. Đệm ngồi dày, đàn hồi tốt, giữ form lâu dài kể cả khi sử dụng hằng ngày. Khung gỗ chắc chắn cùng chân sofa được hoàn thiện tỉ mỉ, mang lại vẻ sang trọng, ấm cúng cho phòng khách gia đình.",
        "category": "furniture",
        "price": 2499.99,
        "discountPercentage": 14.4,
        "rating": 3.92,
        "stock": 60,
        "tags": [
            "furniture",
            "sofas"
        ],
        "brand": "Annibale Colombo",
        "sku": "FUR-ANN-ANN-012",
        "weight": 6,
        "dimensions": {
            "width": 12.75,
            "height": 20.55,
            "depth": 19.06
        },
        "warrantyInformation": "Lifetime warranty",
        "shippingInformation": "Ships in 1 week",
        "availabilityStatus": "In Stock",
        "reviews": [
            {
                "rating": 3,
                "comment": "Very unhappy with my purchase!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Christian Perez",
                "reviewerEmail": "christian.perez@x.dummyjson.com"
            },
            {
                "rating": 5,
                "comment": "Fast shipping!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Lillian Bishop",
                "reviewerEmail": "lillian.bishop@x.dummyjson.com"
            },
            {
                "rating": 1,
                "comment": "Poor quality!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Lillian Simmons",
                "reviewerEmail": "lillian.simmons@x.dummyjson.com"
            }
        ],
        "returnPolicy": "7 days return policy",
        "minimumOrderQuantity": 1,
        "meta": {
            "createdAt": "2024-10-15T17:11:42.387Z",
            "updatedAt": "2025-05-26T20:53:48.329Z",
            "barcode": "1777662847736",
            "qrCode": "https://cdn.dummyjson.com/public/qr-code.png"
        },
        "images": [
            "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-sofa/1.webp",
            "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-sofa/2.webp",
            "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-sofa/3.webp"
        ],
        "thumbnail": "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-sofa/thumbnail.webp"
    },
    {
        "id": 13,
        "title": "Bedside Table African Cherry",
        "description": "Tủ đầu giường làm từ gỗ anh đào châu Phi với vân gỗ tự nhiên ấm áp. Ngăn kéo rộng rãi giúp cất gọn điện thoại, sách, kính và những vật dụng nhỏ, mặt tủ đủ chỗ đặt đèn ngủ hoặc ly nước. Thiết kế gọn gàng, dễ phối với nhiều phong cách nội thất, từ hiện đại đến cổ điển.",
        "category": "furniture",
        "price": 299.99,
        "discountPercentage": 19.09,
        "rating": 2.87,
        "stock": 64,
        "tags": [
            "furniture",
            "bedside tables"
        ],
        "brand": "Furniture Co.",
        "sku": "FUR-FUR-BED-013",
        "weight": 2,
        "dimensions": {
            "width": 13.47,
            "height": 24.99,
            "depth": 27.35
        },
        "warrantyInformation": "5 year warranty",
        "shippingInformation": "Ships overnight",
        "availabilityStatus": "In Stock",
        "reviews": [
            {
                "rating": 4,
                "comment": "Excellent quality!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Aaliyah Hanson",
                "reviewerEmail": "aaliyah.hanson@x.dummyjson.com"
            },
            {
                "rating": 4,
                "comment": "Excellent quality!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Liam Smith",
                "reviewerEmail": "liam.smith@x.dummyjson.com"
            },
            {
                "rating": 4,
                "comment": "Highly recommended!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Avery Barnes",
                "reviewerEmail": "avery.barnes@x.dummyjson.com"
            }
        ],
        "returnPolicy": "7 days return policy",
        "minimumOrderQuantity": 3,
        "meta": {
            "createdAt": "2025-01-02T18:14:51.517Z",
            "updatedAt": "2025-11-03T04:42:17.912Z",
            "barcode": "6441287925979",
            "qrCode": "https://cdn.dummyjson.com/public/qr-code.png"
        },
        "images": [
            "https://cdn.dummyjson.com/product-images/furniture/bedside-table-african-cherry/1.webp",
            "https://cdn.dummyjson.com/product-images/furniture/bedside-table-african-cherry/2.webp",
            "https://cdn.dummyjson.com/product-images/furniture/bedside-table-african-cherry/3.webp"
        ],
        "thumbnail": "https://cdn.dummyjson.com/product-images/furniture/bedside-table-african-cherry/thumbnail.webp"
    },
    {
        "id": 14,
        "title": "Knoll Saarinen Executive Conference Chair",
        "description": "Ghế hội nghị Knoll Saarinen Executive dựa trên thiết kế kinh điển của kiến trúc sư Eero Saarinen. Phần lưng và tay vịn bo cong ôm sát cơ thể, đệm bọc dày giúp ngồi thoải mái trong những cuộc họp dài. Kiểu dáng thanh lịch, vượt thời gian, phù hợp cho phòng họp, văn phòng giám đốc hoặc góc làm việc tại nhà.",
        "category": "furniture",
        "price": 499.99,
        "discountPercentage": 2.01,
        "rating": 4.88,
        "stock": 26,
        "tags": [
            "furniture",
            "office chairs"
        ],
        "brand": "Knoll",
        "sku": "FUR-KNO-KNO-014",
        "weight": 10,
        "dimensions": {
            "width": 13.81,
            "height": 7.5,
            "depth": 5.62
        },
        "warrantyInformation": "2 year warranty",
        "shippingInformation": "Ships overnight",
        "availabilityStatus": "In Stock",
        "reviews": [
            {
                "rating": 2,
                "comment": "Waste of money!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Ella Cook",
                "reviewerEmail": "ella.cook@x.dummyjson.com"
            },
            {
                "rating": 2,
                "comment": "Very dissatisfied!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Clara Berry",
                "reviewerEmail": "clara.berry@x.dummyjson.com"
            },
            {
                "rating": 5,
                "comment": "Would buy again!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Elena Long",
                "reviewerEmail": "elena.long@x.dummyjson.com"
            }
        ],
        "returnPolicy": "60 days return policy",
        "minimumOrderQuantity": 5,
        "meta": {
            "createdAt": "2025-07-05T18:32:17.642Z",
            "updatedAt": "2025-09-13T11:11:13.923Z",
            "barcode": "8919386859966",
            "qrCode": "https://cdn.dummyjson.com/public/qr-code.png"
        },
        "images": [
            "https://cdn.dummyjson.com/product-images/furniture/knoll-saarinen-executive-conference-chair/1.webp",
            "https://cdn.dummyjson.com/product-images/furniture/knoll-saarinen-executive-conference-chair/2.webp",
            "https://cdn.dummyjson.com/product-images/furniture/knoll-saarinen-executive-conference-chair/3.webp"
        ],
        "thumbnail": "https://cdn.dummyjson.com/product-images/furniture/knoll-saarinen-executive-conference-chair/thumbnail.webp"
    },
    {
        "id": 15,
        "title": "Wooden Bathroom Sink With Mirror",
        "description": "Bộ bồn rửa phòng tắm với mặt bàn gỗ và gương đồng bộ, mang lại cảm giác gần gũi thiên nhiên cho không gian phòng tắm. Gỗ được xử lý chống ẩm, hạn chế cong vênh trong môi trường thường xuyên tiếp xúc với nước. Gương lớn giúp phòng tắm trông rộng và sáng hơn, phù hợp với phong cách tối giản hoặc mộc mạc.",
        "category": "furniture",
        "price": 799.99,
        "discountPercentage": 8.8,
        "rating": 3.59,
        "stock": 7,
        "tags": [
            "furniture",
            "bathroom"
        ],
        "brand": "Bath Trends",
        "sku": "FUR-BAT-WOO-015",
        "weight": 10,
        "dimensions": {
            "width": 7.98,
            "height": 8.88,
            "depth": 28.46
        },
        "warrantyInformation": "3 year warranty",
        "shippingInformation": "Ships in 3-5 business days",
        "availabilityStatus": "Low Stock",
        "reviews": [
            {
                "rating": 4,
                "comment": "Fast shipping!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Logan Torres",
                "reviewerEmail": "logan.torres@x.dummyjson.com"
            },
            {
                "rating": 5,
                "comment": "Very pleased!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Aria Parker",
                "reviewerEmail": "aria.parker@x.dummyjson.com"
            },
            {
                "rating": 3,
                "comment": "Poor quality!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Dylan Wells",
                "reviewerEmail": "dylan.wells@x.dummyjson.com"
            }
        ],
        "returnPolicy": "60 days return policy",
        "minimumOrderQuantity": 2,
        "meta": {
            "createdAt": "2024-10-08T09:12:20.659Z",
            "updatedAt": "2026-08-22T08:09:35.091Z",
            "barcode": "1958104402873",
            "qrCode": "https://cdn.dummyjson.com/public/qr-code.png"
        },
        "images": [
            "https://cdn.dummyjson.com/product-images/furniture/wooden-bathroom-sink-with-mirror/1.webp",
            "https://cdn.dummyjson.com/product-images/furniture/wooden-bathroom-sink-with-mirror/2.webp",
            "https://cdn.dummyjson.com/product-images/furniture/wooden-bathroom-sink-with-mirror/3.webp"
        ],
        "thumbnail": "https://cdn.dummyjson.com/product-images/furniture/wooden-bathroom-sink-with-mirror/thumbnail.webp"
    },
    {
        "id": 16,
        "title": "Apple",
        "description": "Táo tươi giòn, ngọt thanh, được tuyển chọn kỹ về độ chín và màu sắc. Giàu chất xơ và vitamin C, táo là món ăn vặt lành mạnh cho cả gia đình. Có thể ăn trực tiếp, ép nước, làm salad hoặc nướng bánh. Bảo quản trong ngăn mát tủ lạnh để giữ độ giòn được lâu hơn.",
        "category": "groceries",
        "price": 1.99,
        "discountPercentage": 12.62,
        "rating": 4.19,
        "stock": 8,
        "tags": [
            "fruits"
        ],
        "sku": "GRO-BRD-APP-016",
        "weight": 9,
        "dimensions": {
            "width": 13.66,
            "height": 11.01,
            "depth": 9.73
        },
        "warrantyInformation": "3 year warranty",
        "shippingInformation": "Ships in 2 weeks",
        "availabilityStatus": "In Stock",
        "reviews": [
            {
                "rating": 5,
                "comment": "Very satisfied!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Sophia Brown",
                "reviewerEmail": "sophia.brown@x.dummyjson.com"
            },
            {
                "rating": 1,
                "comment": "Very dissatisfied!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Scarlett Bowman",
                "reviewerEmail": "scarlett.bowman@x.dummyjson.com"
            },
            {
                "rating": 3,
                "comment": "Very unhappy with my purchase!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "William Gonzalez",
                "reviewerEmail": "william.gonzalez@x.dummyjson.com"
            }
        ],
        "returnPolicy": "90 days return policy",
        "minimumOrderQuantity": 7,
        "meta": {
            "createdAt": "2026-03-03T03:28:19.029Z",
            "updatedAt": "2026-04-21T05:42:48.171Z",
            "barcode": "7962803553314",
            "qrCode": "https://cdn.dummyjson.com/public/qr-code.png"
        },
        "images": [
            "https://cdn.dummyjson.com/product-images/groceries/apple/1.webp"
        ],
        "thumbnail": "https://cdn.dummyjson.com/product-images/groceries/apple/thumbnail.webp"
    },
    {
        "id": 17,
        "title": "Beef Steak",
        "description": "Thịt bò bít tết được cắt dày vừa phải, vân mỡ xen kẽ giúp miếng thịt mềm và đậm vị khi chế biến. Phù hợp để áp chảo, nướng than hoặc nướng lò theo độ chín bạn yêu thích. Mẹo: để thịt về nhiệt độ phòng khoảng 20 phút và chỉ nêm muối tiêu trước khi nấu để giữ trọn vị ngọt tự nhiên.",
        "category": "groceries",
        "price": 12.99,
        "discountPercentage": 9.61,
        "rating": 4.47,
        "stock": 86,
        "tags": [
            "meat"
        ],
        "sku": "GRO-BRD-BEE-017",
        "weight": 10,
        "dimensions": {
            "width": 18.9,
            "height": 5.77,
            "depth": 18.57
        },
        "warrantyInformation": "3 year warranty",
        "shippingInformation": "Ships overnight",
        "availabilityStatus": "In Stock",
        "reviews": [
            {
                "rating": 3,
                "comment": "Would not recommend!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Eleanor Tyler",
                "reviewerEmail": "eleanor.tyler@x.dummyjson.com"
            },
            {
                "rating": 4,
                "comment": "Fast shipping!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Alexander Jones",
                "reviewerEmail": "alexander.jones@x.dummyjson.com"
            },
            {
                "rating": 5,
                "comment": "Great value for money!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Natalie Harris",
                "reviewerEmail": "natalie.harris@x.dummyjson.com"
            }
        ],
        "returnPolicy": "60 days return policy",
        "minimumOrderQuantity": 43,
        "meta": {
            "createdAt": "2024-10-02T14:03:32.118Z",
            "updatedAt": "2025-10-24T16:51:22.869Z",
            "barcode": "5640063409695",
            "qrCode": "https://cdn.dummyjson.com/public/qr-code.png"
        },
        "images": [
            "https://cdn.dummyjson.com/product-images/groceries/beef-steak/1.webp"
        ],
        "thumbnail": "https://cdn.dummyjson.com/product-images/groceries/beef-steak/thumbnail.webp"
    },
    {
        "id": 18,
        "title": "Cat Food",
        "description": "Thức ăn cho mèo được cân bằng dinh dưỡng với đạm từ thịt và cá, bổ sung vitamin và khoáng chất cần thiết. Hạt có kích thước vừa miệng, giúp mèo dễ ăn và hỗ trợ làm sạch răng. Công thức giúp lông mượt, hệ tiêu hóa khỏe mạnh. Luôn chuẩn bị đủ nước sạch cho mèo khi dùng thức ăn khô.",
        "category": "groceries",
        "price": 8.99,
        "discountPercentage": 9.58,
        "rating": 3.13,
        "stock": 46,
        "tags": [
            "pet supplies",
            "cat food"
        ],
        "sku": "GRO-BRD-FOO-018",
        "weight": 10,
        "dimensions": {
            "width": 18.08,
            "height": 9.26,
            "depth": 21.86
        },
        "warrantyInformation": "1 year warranty",
        "shippingInformation": "Ships overnight",
        "availabilityStatus": "In Stock",
        "reviews": [
            {
                "rating": 3,
                "comment": "Would not recommend!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Noah Lewis",
                "reviewerEmail": "noah.lewis@x.dummyjson.com"
            },
            {
                "rating": 3,
                "comment": "Very unhappy with my purchase!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Ruby Andrews",
                "reviewerEmail": "ruby.andrews@x.dummyjson.com"
            },
            {
                "rating": 2,
                "comment": "Very disappointed!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Ethan Thompson",
                "reviewerEmail": "ethan.thompson@x.dummyjson.com"
            }
        ],
        "returnPolicy": "No return policy",
        "minimumOrderQuantity": 18,
        "meta": {
            "createdAt": "2025-02-18T18:35:51.211Z",
            "updatedAt": "2026-08-16T13:50:03.194Z",
            "barcode": "1483991328610",
            "qrCode": "https://cdn.dummyjson.com/public/qr-code.png"
        },
        "images": [
            "https://cdn.dummyjson.com/product-images/groceries/cat-food/1.webp"
        ],
        "thumbnail": "https://cdn.dummyjson.com/product-images/groceries/cat-food/thumbnail.webp"
    },
    {
        "id": 19,
        "title": "Chicken Meat",
        "description": "Thịt gà tươi, thớ thịt mềm và săn chắc, được sơ chế sạch sẽ, đóng gói vệ sinh. Là nguồn đạm dồi dào, ít chất béo, phù hợp cho nhiều món như gà luộc, gà chiên, gà xào hay nấu cháo. Bảo quản ngăn mát và dùng trong 1–2 ngày, hoặc cấp đông nếu chưa dùng ngay.",
        "category": "groceries",
        "price": 9.99,
        "discountPercentage": 13.7,
        "rating": 3.19,
        "stock": 97,
        "tags": [
            "meat"
        ],
        "sku": "GRO-BRD-CHI-019",
        "weight": 1,
        "dimensions": {
            "width": 11.03,
            "height": 22.11,
            "depth": 16.01
        },
        "warrantyInformation": "1 year warranty",
        "shippingInformation": "Ships in 1 month",
        "availabilityStatus": "In Stock",
        "reviews": [
            {
                "rating": 5,
                "comment": "Great product!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Mateo Bennett",
                "reviewerEmail": "mateo.bennett@x.dummyjson.com"
            },
            {
                "rating": 4,
                "comment": "Highly recommended!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Jackson Evans",
                "reviewerEmail": "jackson.evans@x.dummyjson.com"
            },
            {
                "rating": 3,
                "comment": "Not worth the price!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Sadie Morales",
                "reviewerEmail": "sadie.morales@x.dummyjson.com"
            }
        ],
        "returnPolicy": "7 days return policy",
        "minimumOrderQuantity": 22,
        "meta": {
            "createdAt": "2026-02-15T02:18:37.851Z",
            "updatedAt": "2026-03-15T17:47:08.150Z",
            "barcode": "8829514594521",
            "qrCode": "https://cdn.dummyjson.com/public/qr-code.png"
        },
        "images": [
            "https://cdn.dummyjson.com/product-images/groceries/chicken-meat/1.webp",
            "https://cdn.dummyjson.com/product-images/groceries/chicken-meat/2.webp"
        ],
        "thumbnail": "https://cdn.dummyjson.com/product-images/groceries/chicken-meat/thumbnail.webp"
    },
    {
        "id": 20,
        "title": "Cooking Oil",
        "description": "Dầu ăn tinh luyện có điểm bốc khói cao, phù hợp cho chiên, xào, rán và trộn salad. Dầu trong, không mùi, giúp món ăn giữ nguyên hương vị tự nhiên. Chai thiết kế nắp chống tràn, dễ rót và bảo quản. Nên để nơi khô ráo, tránh ánh nắng trực tiếp sau khi mở nắp.",
        "category": "groceries",
        "price": 4.99,
        "discountPercentage": 9.33,
        "rating": 4.8,
        "stock": 10,
        "tags": [
            "cooking essentials"
        ],
        "sku": "GRO-BRD-COO-020",
        "weight": 5,
        "dimensions": {
            "width": 19.95,
            "height": 27.54,
            "depth": 24.86
        },
        "warrantyInformation": "Lifetime warranty",
        "shippingInformation": "Ships in 1-2 business days",
        "availabilityStatus": "In Stock",
        "reviews": [
            {
                "rating": 5,
                "comment": "Very happy with my purchase!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Victoria McDonald",
                "reviewerEmail": "victoria.mcdonald@x.dummyjson.com"
            },
            {
                "rating": 2,
                "comment": "Would not recommend!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Hazel Evans",
                "reviewerEmail": "hazel.evans@x.dummyjson.com"
            },
            {
                "rating": 5,
                "comment": "Would buy again!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Zoe Bennett",
                "reviewerEmail": "zoe.bennett@x.dummyjson.com"
            }
        ],
        "returnPolicy": "30 days return policy",
        "minimumOrderQuantity": 46,
        "meta": {
            "createdAt": "2025-09-25T15:34:34.194Z",
            "updatedAt": "2025-12-10T00:52:49.501Z",
            "barcode": "4874727824518",
            "qrCode": "https://cdn.dummyjson.com/public/qr-code.png"
        },
        "images": [
            "https://cdn.dummyjson.com/product-images/groceries/cooking-oil/1.webp"
        ],
        "thumbnail": "https://cdn.dummyjson.com/product-images/groceries/cooking-oil/thumbnail.webp"
    },
    {
        "id": 21,
        "title": "Cucumber",
        "description": "Dưa leo tươi giòn, mọng nước, vỏ xanh bóng và ruột chắc. Giàu nước và ít calo, dưa leo là lựa chọn tuyệt vời để làm salad, ăn kèm, muối chua hoặc ép nước giải nhiệt. Nên rửa sạch và bảo quản trong ngăn mát tủ lạnh để giữ độ tươi lâu hơn.",
        "category": "groceries",
        "price": 1.49,
        "discountPercentage": 0.16,
        "rating": 4.07,
        "stock": 84,
        "tags": [
            "vegetables"
        ],
        "sku": "GRO-BRD-CUC-021",
        "weight": 4,
        "dimensions": {
            "width": 12.8,
            "height": 28.38,
            "depth": 21.34
        },
        "warrantyInformation": "2 year warranty",
        "shippingInformation": "Ships in 1-2 business days",
        "availabilityStatus": "In Stock",
        "reviews": [
            {
                "rating": 4,
                "comment": "Great product!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Lincoln Kelly",
                "reviewerEmail": "lincoln.kelly@x.dummyjson.com"
            },
            {
                "rating": 4,
                "comment": "Great value for money!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Savannah Gomez",
                "reviewerEmail": "savannah.gomez@x.dummyjson.com"
            },
            {
                "rating": 2,
                "comment": "Poor quality!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "James Davis",
                "reviewerEmail": "james.davis@x.dummyjson.com"
            }
        ],
        "returnPolicy": "7 days return policy",
        "minimumOrderQuantity": 2,
        "meta": {
            "createdAt": "2025-01-12T11:53:56.805Z",
            "updatedAt": "2025-03-07T00:03:35.835Z",
            "barcode": "5300066378225",
            "qrCode": "https://cdn.dummyjson.com/public/qr-code.png"
        },
        "images": [
            "https://cdn.dummyjson.com/product-images/groceries/cucumber/1.webp"
        ],
        "thumbnail": "https://cdn.dummyjson.com/product-images/groceries/cucumber/thumbnail.webp"
    },
    {
        "id": 22,
        "title": "Dog Food",
        "description": "Thức ăn cho chó được phối trộn cân đối giữa đạm, chất béo, ngũ cốc và rau củ, cung cấp năng lượng cho các hoạt động hằng ngày. Bổ sung canxi giúp xương và răng chắc khỏe, omega giúp lông bóng mượt. Thích hợp cho chó trưởng thành; nên chia khẩu phần theo cân nặng và đảm bảo có đủ nước uống.",
        "category": "groceries",
        "price": 10.99,
        "discountPercentage": 10.27,
        "rating": 4.55,
        "stock": 71,
        "tags": [
            "pet supplies",
            "dog food"
        ],
        "sku": "GRO-BRD-FOO-022",
        "weight": 10,
        "dimensions": {
            "width": 16.93,
            "height": 27.15,
            "depth": 9.29
        },
        "warrantyInformation": "No warranty",
        "shippingInformation": "Ships in 1-2 business days",
        "availabilityStatus": "In Stock",
        "reviews": [
            {
                "rating": 5,
                "comment": "Excellent quality!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Nicholas Edwards",
                "reviewerEmail": "nicholas.edwards@x.dummyjson.com"
            },
            {
                "rating": 5,
                "comment": "Awesome product!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Zachary Lee",
                "reviewerEmail": "zachary.lee@x.dummyjson.com"
            },
            {
                "rating": 4,
                "comment": "Great product!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Nova Cooper",
                "reviewerEmail": "nova.cooper@x.dummyjson.com"
            }
        ],
        "returnPolicy": "60 days return policy",
        "minimumOrderQuantity": 43,
        "meta": {
            "createdAt": "2025-07-10T03:33:14.471Z",
            "updatedAt": "2026-05-15T13:09:53.695Z",
            "barcode": "5906686116469",
            "qrCode": "https://cdn.dummyjson.com/public/qr-code.png"
        },
        "images": [
            "https://cdn.dummyjson.com/product-images/groceries/dog-food/1.webp"
        ],
        "thumbnail": "https://cdn.dummyjson.com/product-images/groceries/dog-food/thumbnail.webp"
    },
    {
        "id": 23,
        "title": "Eggs",
        "description": "Trứng gà tươi, vỏ sạch, lòng đỏ đậm màu và thơm béo. Trứng là nguồn đạm và vitamin dồi dào, dễ chế biến thành nhiều món như trứng chiên, trứng luộc, trứng hấp hay làm bánh. Bảo quản trong ngăn mát tủ lạnh, đặt đầu nhọn hướng xuống để trứng giữ tươi lâu hơn.",
        "category": "groceries",
        "price": 2.99,
        "discountPercentage": 11.05,
        "rating": 2.53,
        "stock": 9,
        "tags": [
            "dairy"
        ],
        "sku": "GRO-BRD-EGG-023",
        "weight": 2,
        "dimensions": {
            "width": 11.42,
            "height": 7.44,
            "depth": 16.95
        },
        "warrantyInformation": "1 week warranty",
        "shippingInformation": "Ships in 1 week",
        "availabilityStatus": "In Stock",
        "reviews": [
            {
                "rating": 3,
                "comment": "Disappointing product!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Penelope King",
                "reviewerEmail": "penelope.king@x.dummyjson.com"
            },
            {
                "rating": 3,
                "comment": "Poor quality!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Eleanor Tyler",
                "reviewerEmail": "eleanor.tyler@x.dummyjson.com"
            },
            {
                "rating": 4,
                "comment": "Very pleased!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Benjamin Foster",
                "reviewerEmail": "benjamin.foster@x.dummyjson.com"
            }
        ],
        "returnPolicy": "No return policy",
        "minimumOrderQuantity": 32,
        "meta": {
            "createdAt": "2026-02-06T14:03:24.867Z",
            "updatedAt": "2026-08-20T05:44:35.354Z",
            "barcode": "3478638588469",
            "qrCode": "https://cdn.dummyjson.com/public/qr-code.png"
        },
        "images": [
            "https://cdn.dummyjson.com/product-images/groceries/eggs/1.webp"
        ],
        "thumbnail": "https://cdn.dummyjson.com/product-images/groceries/eggs/thumbnail.webp"
    },
    {
        "id": 24,
        "title": "Fish Steak",
        "description": "Cá cắt khoanh tươi, thịt chắc và ít xương, được sơ chế sẵn tiện lợi cho bữa ăn gia đình. Cá giàu omega-3 và đạm dễ tiêu hóa, tốt cho tim mạch. Phù hợp để chiên, kho, nướng hoặc áp chảo với bơ tỏi. Nên chế biến trong ngày hoặc cấp đông để giữ độ tươi ngon.",
        "category": "groceries",
        "price": 14.99,
        "discountPercentage": 4.23,
        "rating": 3.78,
        "stock": 74,
        "tags": [
            "seafood"
        ],
        "sku": "GRO-BRD-FIS-024",
        "weight": 6,
        "dimensions": {
            "width": 14.95,
            "height": 26.31,
            "depth": 11.27
        },
        "warrantyInformation": "1 month warranty",
        "shippingInformation": "Ships in 3-5 business days",
        "availabilityStatus": "In Stock",
        "reviews": [
            {
                "rating": 2,
                "comment": "Would not buy again!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Caleb Perkins",
                "reviewerEmail": "caleb.perkins@x.dummyjson.com"
            },
            {
                "rating": 5,
                "comment": "Excellent quality!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Isabella Jackson",
                "reviewerEmail": "isabella.jackson@x.dummyjson.com"
            },
            {
                "rating": 4,
                "comment": "Great value for money!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Nathan Dixon",
                "reviewerEmail": "nathan.dixon@x.dummyjson.com"
            }
        ],
        "returnPolicy": "60 days return policy",
        "minimumOrderQuantity": 50,
        "meta": {
            "createdAt": "2025-05-24T22:00:13.090Z",
            "updatedAt": "2025-12-05T01:25:43.902Z",
            "barcode": "9595036192098",
            "qrCode": "https://cdn.dummyjson.com/public/qr-code.png"
        },
        "images": [
            "https://cdn.dummyjson.com/product-images/groceries/fish-steak/1.webp"
        ],
        "thumbnail": "https://cdn.dummyjson.com/product-images/groceries/fish-steak/thumbnail.webp"
    },
    {
        "id": 25,
        "title": "Green Bell Pepper",
        "description": "Ớt chuông xanh tươi, vỏ bóng, thịt dày và giòn với vị hơi đắng nhẹ đặc trưng. Giàu vitamin C và chất chống oxy hóa, ớt chuông giúp món ăn thêm màu sắc và hương vị. Dùng ngon trong các món xào, salad, pizza hoặc nhồi thịt nướng.",
        "category": "groceries",
        "price": 1.29,
        "discountPercentage": 0.16,
        "rating": 3.25,
        "stock": 33,
        "tags": [
            "vegetables"
        ],
        "sku": "GRO-BRD-GRE-025",
        "weight": 2,
        "dimensions": {
            "width": 15.33,
            "height": 26.65,
            "depth": 14.44
        },
        "warrantyInformation": "1 month warranty",
        "shippingInformation": "Ships in 1 week",
        "availabilityStatus": "In Stock",
        "reviews": [
            {
                "rating": 4,
                "comment": "Highly recommended!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Avery Carter",
                "reviewerEmail": "avery.carter@x.dummyjson.com"
            },
            {
                "rating": 3,
                "comment": "Would not recommend!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Henry Hill",
                "reviewerEmail": "henry.hill@x.dummyjson.com"
            },
            {
                "rating": 5,
                "comment": "Excellent quality!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Addison Wright",
                "reviewerEmail": "addison.wright@x.dummyjson.com"
            }
        ],
        "returnPolicy": "30 days return policy",
        "minimumOrderQuantity": 12,
        "meta": {
            "createdAt": "2024-12-16T06:21:20.741Z",
            "updatedAt": "2025-03-26T10:22:41.216Z",
            "barcode": "2365227493323",
            "qrCode": "https://cdn.dummyjson.com/public/qr-code.png"
        },
        "images": [
            "https://cdn.dummyjson.com/product-images/groceries/green-bell-pepper/1.webp"
        ],
        "thumbnail": "https://cdn.dummyjson.com/product-images/groceries/green-bell-pepper/thumbnail.webp"
    },
    {
        "id": 26,
        "title": "Green Chili Pepper",
        "description": "Ớt xanh cay nồng, tươi giòn, giúp món ăn thêm đậm đà và kích thích vị giác. Thích hợp để làm nước chấm, xào, nấu canh chua hoặc ngâm giấm. Lưu ý đeo găng tay khi cắt ớt và tránh chạm tay lên mắt. Bảo quản trong ngăn mát để ớt tươi lâu hơn.",
        "category": "groceries",
        "price": 0.99,
        "discountPercentage": 1,
        "rating": 3.66,
        "stock": 3,
        "tags": [
            "vegetables"
        ],
        "sku": "GRO-BRD-GRE-026",
        "weight": 7,
        "dimensions": {
            "width": 15.38,
            "height": 18.12,
            "depth": 19.92
        },
        "warrantyInformation": "2 year warranty",
        "shippingInformation": "Ships in 1 week",
        "availabilityStatus": "Low Stock",
        "reviews": [
            {
                "rating": 4,
                "comment": "Great product!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Luna Russell",
                "reviewerEmail": "luna.russell@x.dummyjson.com"
            },
            {
                "rating": 1,
                "comment": "Waste of money!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Noah Lewis",
                "reviewerEmail": "noah.lewis@x.dummyjson.com"
            },
            {
                "rating": 3,
                "comment": "Very disappointed!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Clara Berry",
                "reviewerEmail": "clara.berry@x.dummyjson.com"
            }
        ],
        "returnPolicy": "30 days return policy",
        "minimumOrderQuantity": 39,
        "meta": {
            "createdAt": "2025-08-13T07:35:11.030Z",
            "updatedAt": "2026-07-07T04:30:44.059Z",
            "barcode": "9335000538563",
            "qrCode": "https://cdn.dummyjson.com/public/qr-code.png"
        },
        "images": [
            "https://cdn.dummyjson.com/product-images/groceries/green-chili-pepper/1.webp"
        ],
        "thumbnail": "https://cdn.dummyjson.com/product-images/groceries/green-chili-pepper/thumbnail.webp"
    },
    {
        "id": 27,
        "title": "Honey Jar",
        "description": "Mật ong nguyên chất, màu vàng óng, vị ngọt dịu và hương thơm tự nhiên của hoa. Dùng pha nước ấm với chanh, thêm vào trà, phết bánh mì, rưới lên sữa chua hoặc làm gia vị ướp thịt. Mật ong có thể kết tinh khi trời lạnh, đây là hiện tượng tự nhiên và không ảnh hưởng đến chất lượng.",
        "category": "groceries",
        "price": 6.99,
        "discountPercentage": 14.4,
        "rating": 3.97,
        "stock": 34,
        "tags": [
            "condiments"
        ],
        "sku": "GRO-BRD-HON-027",
        "weight": 2,
        "dimensions": {
            "width": 9.28,
            "height": 21.72,
            "depth": 17.74
        },
        "warrantyInformation": "1 month warranty",
        "shippingInformation": "Ships in 1-2 business days",
        "availabilityStatus": "In Stock",
        "reviews": [
            {
                "rating": 1,
                "comment": "Very disappointed!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Autumn Gomez",
                "reviewerEmail": "autumn.gomez@x.dummyjson.com"
            },
            {
                "rating": 4,
                "comment": "Highly impressed!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Benjamin Wilson",
                "reviewerEmail": "benjamin.wilson@x.dummyjson.com"
            },
            {
                "rating": 2,
                "comment": "Very disappointed!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Nicholas Edwards",
                "reviewerEmail": "nicholas.edwards@x.dummyjson.com"
            }
        ],
        "returnPolicy": "90 days return policy",
        "minimumOrderQuantity": 47,
        "meta": {
            "createdAt": "2024-09-24T17:38:48.991Z",
            "updatedAt": "2025-01-10T02:20:32.078Z",
            "barcode": "6354306346329",
            "qrCode": "https://cdn.dummyjson.com/public/qr-code.png"
        },
        "images": [
            "https://cdn.dummyjson.com/product-images/groceries/honey-jar/1.webp"
        ],
        "thumbnail": "https://cdn.dummyjson.com/product-images/groceries/honey-jar/thumbnail.webp"
    },
    {
        "id": 28,
        "title": "Ice Cream",
        "description": "Kem lạnh mềm mịn, béo ngậy từ sữa tươi, tan chảy ngay trong miệng. Có nhiều hương vị để lựa chọn, là món tráng miệng giải nhiệt lý tưởng cho những ngày nóng hoặc buổi tụ họp gia đình. Bảo quản ở ngăn đá và để ngoài vài phút trước khi múc để kem đạt độ mềm ngon nhất.",
        "category": "groceries",
        "price": 5.49,
        "discountPercentage": 8.69,
        "rating": 3.39,
        "stock": 27,
        "tags": [
            "desserts"
        ],
        "sku": "GRO-BRD-CRE-028",
        "weight": 1,
        "dimensions": {
            "width": 14.83,
            "height": 15.07,
            "depth": 24.2
        },
        "warrantyInformation": "1 month warranty",
        "shippingInformation": "Ships in 2 weeks",
        "availabilityStatus": "In Stock",
        "reviews": [
            {
                "rating": 5,
                "comment": "Very pleased!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Elijah Cruz",
                "reviewerEmail": "elijah.cruz@x.dummyjson.com"
            },
            {
                "rating": 4,
                "comment": "Excellent quality!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Jace Smith",
                "reviewerEmail": "jace.smith@x.dummyjson.com"
            },
            {
                "rating": 5,
                "comment": "Highly impressed!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Sadie Morales",
                "reviewerEmail": "sadie.morales@x.dummyjson.com"
            }
        ],
        "returnPolicy": "No return policy",
        "minimumOrderQuantity": 42,
        "meta": {
            "createdAt": "2025-10-23T18:27:08.836Z",
            "updatedAt": "2025-11-04T01:48:01.853Z",
            "barcode": "0788954559076",
            "qrCode": "https://cdn.dummyjson.com/public/qr-code.png"
        },
        "images": [
            "https://cdn.dummyjson.com/product-images/groceries/ice-cream/1.webp",
            "https://cdn.dummyjson.com/product-images/groceries/ice-cream/2.webp",
            "https://cdn.dummyjson.com/product-images/groceries/ice-cream/3.webp",
            "https://cdn.dummyjson.com/product-images/groceries/ice-cream/4.webp"
        ],
        "thumbnail": "https://cdn.dummyjson.com/product-images/groceries/ice-cream/thumbnail.webp"
    },
    {
        "id": 29,
        "title": "Juice",
        "description": "Nước ép trái cây thơm ngon, giàu vitamin, giúp bổ sung năng lượng và giải khát nhanh chóng. Vị ngọt tự nhiên, thích hợp dùng trong bữa sáng, sau khi tập luyện hoặc mang theo đi học, đi làm. Lắc đều trước khi uống, ngon hơn khi dùng lạnh; bảo quản ngăn mát sau khi mở nắp.",
        "category": "groceries",
        "price": 3.99,
        "discountPercentage": 12.06,
        "rating": 3.94,
        "stock": 50,
        "tags": [
            "beverages"
        ],
        "sku": "GRO-BRD-JUI-029",
        "weight": 1,
        "dimensions": {
            "width": 18.56,
            "height": 21.46,
            "depth": 28.02
        },
        "warrantyInformation": "6 months warranty",
        "shippingInformation": "Ships in 1 week",
        "availabilityStatus": "In Stock",
        "reviews": [
            {
                "rating": 5,
                "comment": "Excellent quality!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Nolan Gonzalez",
                "reviewerEmail": "nolan.gonzalez@x.dummyjson.com"
            },
            {
                "rating": 4,
                "comment": "Would buy again!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Bella Grant",
                "reviewerEmail": "bella.grant@x.dummyjson.com"
            },
            {
                "rating": 5,
                "comment": "Awesome product!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Aria Flores",
                "reviewerEmail": "aria.flores@x.dummyjson.com"
            }
        ],
        "returnPolicy": "No return policy",
        "minimumOrderQuantity": 25,
        "meta": {
            "createdAt": "2026-04-01T05:44:29.516Z",
            "updatedAt": "2026-07-04T11:56:17.202Z",
            "barcode": "6936112580956",
            "qrCode": "https://cdn.dummyjson.com/public/qr-code.png"
        },
        "images": [
            "https://cdn.dummyjson.com/product-images/groceries/juice/1.webp"
        ],
        "thumbnail": "https://cdn.dummyjson.com/product-images/groceries/juice/thumbnail.webp"
    },
    {
        "id": 30,
        "title": "Kiwi",
        "description": "Kiwi tươi với ruột xanh mọng nước, vị chua ngọt hài hòa. Kiwi giàu vitamin C, chất xơ và chất chống oxy hóa, hỗ trợ tiêu hóa và tăng cường đề kháng. Có thể bổ đôi ăn bằng thìa, thêm vào salad trái cây, sinh tố hoặc trang trí bánh. Kiwi còn cứng có thể để ở nhiệt độ phòng vài ngày cho chín mềm.",
        "category": "groceries",
        "price": 2.49,
        "discountPercentage": 15.22,
        "rating": 4.93,
        "stock": 99,
        "tags": [
            "fruits"
        ],
        "sku": "GRO-BRD-KIW-030",
        "weight": 5,
        "dimensions": {
            "width": 19.4,
            "height": 18.67,
            "depth": 17.13
        },
        "warrantyInformation": "6 months warranty",
        "shippingInformation": "Ships overnight",
        "availabilityStatus": "In Stock",
        "reviews": [
            {
                "rating": 4,
                "comment": "Highly recommended!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Emily Brown",
                "reviewerEmail": "emily.brown@x.dummyjson.com"
            },
            {
                "rating": 2,
                "comment": "Would not buy again!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Jackson Morales",
                "reviewerEmail": "jackson.morales@x.dummyjson.com"
            },
            {
                "rating": 4,
                "comment": "Fast shipping!",
                "date": "2025-04-30T09:41:02.053Z",
                "reviewerName": "Nora Russell",
                "reviewerEmail": "nora.russell@x.dummyjson.com"
            }
        ],
        "returnPolicy": "7 days return policy",
        "minimumOrderQuantity": 30,
        "meta": {
            "createdAt": "2025-08-27T05:46:53.584Z",
            "updatedAt": "2026-07-21T17:09:19.864Z",
            "barcode": "2530169917252",
            "qrCode": "https://cdn.dummyjson.com/public/qr-code.png"
        },
        "images": [
            "https://cdn.dummyjson.com/product-images/groceries/kiwi/1.webp"
        ],
        "thumbnail": "https://cdn.dummyjson.com/product-images/groceries/kiwi/thumbnail.webp"
    }
]
app.get('/', (req, res) => {
    res.send("Chào mừng đến với API Backend")
})

//Lấy tất cả
app.get('/api/products', (req, res) => {
    res.status(200).json(products)
})

app.listen(port, () => {
    console.log(`Server đang chạy ở cổng ${port}`);
})

// Thêm sản phẩm mới
app.post('/api/products', (req, res) => {
    const { name, price, sale, category, hot, quantity, description } = req.body;
    if (!name || price === undefined || sale === undefined || !category || hot === undefined || quantity === undefined || !description) {
        return res.status(400).json({
            message: `Yêu cầu nhập nội dung`
        })
    }
    const newProduct = {
        id: Date.now(),
        name: name,
        price: price,
        sale: sale,
        category: category,
        hot: hot,
        quantity: quantity,
        description: description
    }
    products.push(newProduct);
    saveData()

    res.status(201).json(newProduct)
})

// Sửa
app.put('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) {
        return res.status(404).json({
            message: `Ko tìm thấy id ${productId} này`
        })
    }
    const { name, price, sale, category, hot, quantity, description } = req.body;
    if (!name || price === undefined || sale === undefined || !category || hot === undefined || quantity === undefined || !description) {
        return res.status(400).json({
            message: `Yêu cầu nhập nội dung`
        })
    }
    const updatedProduct = {
        id: productId,
        name: name,
        price: price,
        sale: sale,
        category: category,
        hot: hot,
        quantity: quantity,
        description: description
    }
    products[productIndex] = updatedProduct;
    saveData()

    res.status(200).json(updatedProduct)
})

// Sửa 1 phần
app.patch('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) {
        return res.status(404).json({
            message: `Ko tìm thấy id ${productId} này`
        })
    }
    const { name, price, sale, category, hot, quantity, description } = req.body;
    const updatedProduct = {
        ...products[productIndex],
        ...(name !== undefined && { name }),
        ...(price !== undefined && { price }),
        ...(sale !== undefined && { sale }),
        ...(category !== undefined && { category }),
        ...(hot !== undefined && { hot }),
        ...(quantity !== undefined && { quantity }),
        ...(description !== undefined && { description })
    }
    products[productIndex] = updatedProduct;
    saveData()

    res.status(200).json(updatedProduct)
})

// Xóa
app.delete('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) {
        return res.status(404).json({
            message: `Ko tìm thấy id ${productId} này`
        })
    }
    products.splice(productIndex, 1);
    saveData()

    // 204: No content
    res.status(204).send();
})

// ---------- Tài khoản: đăng ký / đăng nhập (JWT) ----------
// Đăng ký / đăng nhập bằng JWT. Frontend lưu token vào localStorage và gửi lại qua header Authorization.
// Mảng users bên dưới là dữ liệu mẫu ban đầu; dữ liệu thật được lưu trong data.json (xem "Lưu dữ liệu").

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-doi-khi-deploy')

let users = [
    {
        "id": 1791240630410,
        "username": "thien",
        "email": "thien@example.com",
        "password": "1655ef9a0253be3cc795787e2eecdd8f:ddf0a2fe7af389d8456477dc919279aac2a7b8d6e6956103e7b83a64e4411a01e7df562ae311a715d26f4b417a8d55bc5b2cc0b0b83832f19088e971ad87aeaa",
        "createdAt": "2026-10-05T22:50:30.440Z"
    },
    {
        "id": 1791240633517,
        "username": "test_user",
        "email": "test@example.com",
        "password": "9f301459679bd8ccf6b10dcfda45c039:8f33f43745456e51d5098c8065245f1be37c2ca808e4c22cc0f147716d88ebc4420771465268c2f576af1acf2d6bfee90f292a3294e149ec3e8340e21895939b",
        "createdAt": "2026-10-05T22:50:33.548Z",
        "wishlist": [],
        "cart": []
    },
    {
        "id": 1791252160237,
        "username": "user1",
        "email": "user1@example.com",
        "password": "b23cfa3fbde0e0948a637e345f906dc8:01bf17326414d6944272fdee733c19e74db32986563d24549a52272df0bfb1313a7e7639628b8cbdcb755066a69b844a43ab142a2e1d548ece0356117d0fa405",
        "createdAt": "2026-10-06T02:02:40.270Z"
    },
    {
        "id": 1791843638780,
        "username": "user2",
        "email": "user2@example.com",
        "password": "352e9cbecdc7b72e6e57a9957d9520e8:3348487dff9457f90aeb5fd63d9dee400bb65ed0cb0b5325d0f37a380e8d51b83bb5d21296fa18698f1d977a7e7e3ec89d68f4407fb566c49eb8d51018eb751b",
        "createdAt": "2026-10-12T22:20:38.810Z",
        "cart": [],
        "wishlist": []
    },
    {
        "id": 1791854810748,
        "username": "user3",
        "email": "user3@example.com",
        "password": "6657dca074055c3011d1168b9a328e58:7216e9f33238f1aef227bdd872f1eaec6cc3d84da6a83e2a67ff0e439a602aeb95cbaf0d08586e36063e31286856ccdf99da8f0e9b3011042c0964a6b00a70dc",
        "createdAt": "2026-10-13T01:26:50.781Z",
        "cart": [
            {
                "productId": 30,
                "quantity": 1
            },
            {
                "productId": 10,
                "quantity": 3
            }
        ]
    }
]

// ---------- Lưu dữ liệu ra data.json ----------
// products và users ở trên chỉ là dữ liệu mẫu. Lần đầu chạy (chưa có data.json) server tạo file từ chúng;
// các lần sau đọc lại từ file. Mỗi lần dữ liệu thay đổi thì gọi saveData().
// Muốn làm lại từ đầu: xóa data.json. nodemon được cấu hình bỏ qua file này (package.json).
const DATA_FILE = path.join(__dirname, 'data.json')

// Đơn hàng (dùng ở cuối file). Khai báo ở đây vì saveData() và phần đọc file bên dưới cần nó.
let orders = []

function saveData() {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ products, users, orders }, null, 2))
}

if (fs.existsSync(DATA_FILE)) {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
    products = data.products ?? products
    users = data.users ?? users
    orders = data.orders ?? orders
} else {
    saveData()
}

// Băm mật khẩu bằng scrypt, lưu dạng "salt:hash".
function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex')
    const hash = crypto.scryptSync(password, salt, 64).toString('hex')
    return `${salt}:${hash}`
}

function checkPassword(password, stored) {
    const [salt, hash] = stored.split(':')
    const test = crypto.scryptSync(password, salt, 64)
    return crypto.timingSafeEqual(test, Buffer.from(hash, 'hex'))
}

// Không bao giờ trả mật khẩu về cho client.
function publicUser(user) {
    return { id: user.id, username: user.username, fullName: user.fullName, email: user.email, createdAt: user.createdAt }
}

function createToken(user) {
    return new SignJWT({ username: user.username })
        .setProtectedHeader({ alg: 'HS256' })
        .setSubject(String(user.id))
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(JWT_SECRET)
}

// Lấy token từ header "Authorization: Bearer <token>"
function getToken(req) {
    const header = req.headers.authorization || ''
    return header.startsWith('Bearer ') ? header.slice(7) : null
}

// Tìm người dùng từ JWT trong header Authorization.
// Trả về user, hoặc gửi lỗi 401 và trả về null.
async function requireUser(req, res) {
    const token = getToken(req)
    if (!token) {
        res.status(401).json({ message: 'Chưa đăng nhập.' })
        return null
    }
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET)
        const user = users.find(u => String(u.id) === payload.sub)
        if (!user) {
            res.status(401).json({ message: 'Tài khoản không tồn tại.' })
            return null
        }
        return user
    } catch {
        // Token sai hoặc hết hạn
        res.status(401).json({ message: 'Phiên đăng nhập đã hết hạn.' })
        return null
    }
}

// Đăng ký
app.post('/api/auth/register', async (req, res) => {
    // Họ và tên: bỏ khoảng trắng thừa ("  Nguyễn   Văn A " → "Nguyễn Văn A").
    // normalize('NFC') gộp dấu tách rời (một số bộ gõ gửi "e" + dấu riêng) thành một chữ.
    const fullName = String(req.body?.fullName ?? '').normalize('NFC').trim().replace(/\s+/g, ' ')
    const username = String(req.body?.username ?? '').trim()
    const email = String(req.body?.email ?? '').trim().toLowerCase()
    const password = String(req.body?.password ?? '')

    const errors = {}
    // 2–50 ký tự, chỉ chữ cái (kể cả tiếng Việt có dấu) và khoảng trắng.
    if (!/^[\p{L} ]{2,50}$/u.test(fullName)) {
        errors.fullName = 'Họ và tên gồm 2–50 ký tự, chỉ chữ cái và khoảng trắng.'
    }
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
        errors.username = 'Tên đăng nhập gồm 3–20 ký tự: chữ, số hoặc dấu gạch dưới.'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Email không hợp lệ.'
    }
    if (password.length < 6) {
        errors.password = 'Mật khẩu phải có ít nhất 6 ký tự.'
    }
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors })
    }

    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        return res.status(409).json({ errors: { username: 'Tên đăng nhập đã tồn tại.' } })
    }
    if (users.some(u => u.email === email)) {
        return res.status(409).json({ errors: { email: 'Email đã được sử dụng.' } })
    }

    const user = {
        id: Date.now(),
        username,
        fullName,
        email,
        password: hashPassword(password),
        createdAt: new Date().toISOString(),
    }
    users.push(user)
    saveData()

    // 201: Created
    res.status(201).json({ user: publicUser(user) })
})

// Đăng nhập: nhận tên đăng nhập hoặc email
app.post('/api/auth/login', async (req, res) => {
    const login = String(req.body?.username ?? '').trim().toLowerCase()
    const password = String(req.body?.password ?? '')

    if (!login || !password) {
        return res.status(400).json({ message: 'Vui lòng nhập tên đăng nhập và mật khẩu.' })
    }

    const user = users.find(u => u.username.toLowerCase() === login || u.email === login)
    if (!user || !checkPassword(password, user.password)) {
        return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu.' })
    }

    const token = await createToken(user)
    res.status(200).json({ token, user: publicUser(user) })
})

// Đăng xuất: không cần API, frontend chỉ cần xóa token khỏi localStorage.

// Lấy người dùng đang đăng nhập từ JWT trong header Authorization
app.get('/api/auth/me', async (req, res) => {
    const user = await requireUser(req, res)
    if (!user) return
    res.status(200).json({ user: publicUser(user) })
})

// Đổi email của người dùng đang đăng nhập
app.put('/api/auth/me', async (req, res) => {
    const user = await requireUser(req, res)
    if (!user) return

    const email = String(req.body?.email ?? '').trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ errors: { email: 'Email không hợp lệ.' } })
    }
    if (users.some(u => u.email === email && u.id !== user.id)) {
        return res.status(409).json({ errors: { email: 'Email đã được sử dụng.' } })
    }

    user.email = email
    saveData()

    res.status(200).json({ user: publicUser(user) })
})

// Đổi mật khẩu: phải nhập đúng mật khẩu hiện tại
app.put('/api/auth/password', async (req, res) => {
    const user = await requireUser(req, res)
    if (!user) return

    const currentPassword = String(req.body?.currentPassword ?? '')
    const newPassword = String(req.body?.newPassword ?? '')

    if (!checkPassword(currentPassword, user.password)) {
        return res.status(400).json({ errors: { currentPassword: 'Mật khẩu hiện tại không đúng.' } })
    }
    if (newPassword.length < 6) {
        return res.status(400).json({ errors: { newPassword: 'Mật khẩu phải có ít nhất 6 ký tự.' } })
    }

    user.password = hashPassword(newPassword)
    saveData()

    res.status(200).json({ message: 'Đổi mật khẩu thành công.' })
})

// ---------- Yêu thích (phải đăng nhập) ----------
// Lưu ngay trong tài khoản: user.wishlist = [productId].
// Mọi API bên dưới đều trả về { wishlist } mới nhất.

function shopData(user) {
    return { wishlist: user.wishlist ?? [] }
}

// productId phải là số nguyên dương (id sản phẩm trong server.js).
function toProductId(value) {
    const id = Number(value)
    return Number.isInteger(id) && id > 0 ? id : null
}

// Lấy danh sách yêu thích
app.get('/api/shop', async (req, res) => {
    const user = await requireUser(req, res)
    if (!user) return
    res.status(200).json(shopData(user))
})

// Thêm / bỏ một sản phẩm khỏi danh sách yêu thích
app.post('/api/shop/wishlist', async (req, res) => {
    const user = await requireUser(req, res)
    if (!user) return

    const productId = toProductId(req.body?.productId)
    if (!productId) {
        return res.status(400).json({ message: 'Sản phẩm không hợp lệ.' })
    }

    const wishlist = user.wishlist ?? []
    user.wishlist = wishlist.includes(productId)
        ? wishlist.filter(id => id !== productId)
        : [...wishlist, productId]
    saveData()

    res.status(200).json(shopData(user))
})

// ---------- Giỏ hàng (phải đăng nhập) ----------
// Lưu ngay trong tài khoản: user.cart = [{ productId, quantity }].
// Mọi API bên dưới đều trả về { cart } mới nhất.

const MAX_QUANTITY = 99

// Số lượng phải là số nguyên từ 1 đến MAX_QUANTITY.
function toQuantity(value) {
    const quantity = Number(value)
    return Number.isInteger(quantity) && quantity >= 1 && quantity <= MAX_QUANTITY ? quantity : null
}

// Trả về bản sao giỏ hàng, bỏ qua dữ liệu sai dạng (vd. cart: [] cũ của vài tài khoản).
function cartData(user) {
    const cart = (user.cart ?? [])
        .filter(item => toProductId(item?.productId) && toQuantity(item?.quantity))
        .map(item => ({ productId: item.productId, quantity: item.quantity }))
    return { cart }
}

// Lấy giỏ hàng
app.get('/api/cart', async (req, res) => {
    const user = await requireUser(req, res)
    if (!user) return
    res.status(200).json(cartData(user))
})

// Thêm sản phẩm vào giỏ: đã có thì cộng thêm số lượng (tối đa MAX_QUANTITY)
app.post('/api/cart', async (req, res) => {
    const user = await requireUser(req, res)
    if (!user) return

    const productId = toProductId(req.body?.productId)
    const quantity = toQuantity(req.body?.quantity ?? 1)
    if (!productId || !quantity) {
        return res.status(400).json({ message: 'Sản phẩm hoặc số lượng không hợp lệ.' })
    }

    const { cart } = cartData(user)
    const item = cart.find(i => i.productId === productId)
    if (item) {
        item.quantity = Math.min(item.quantity + quantity, MAX_QUANTITY)
    } else {
        cart.push({ productId, quantity })
    }
    user.cart = cart
    saveData()

    res.status(200).json(cartData(user))
})

// Đổi số lượng của một sản phẩm trong giỏ
app.put('/api/cart/:productId', async (req, res) => {
    const user = await requireUser(req, res)
    if (!user) return

    const productId = toProductId(req.params.productId)
    const quantity = toQuantity(req.body?.quantity)
    if (!productId || !quantity) {
        return res.status(400).json({ message: 'Sản phẩm hoặc số lượng không hợp lệ.' })
    }

    const { cart } = cartData(user)
    const item = cart.find(i => i.productId === productId)
    if (!item) {
        return res.status(404).json({ message: 'Sản phẩm không có trong giỏ hàng.' })
    }
    item.quantity = quantity
    user.cart = cart
    saveData()
    res.status(200).json(cartData(user))
})

// Xóa một sản phẩm khỏi giỏ
app.delete('/api/cart/:productId', async (req, res) => {
    const user = await requireUser(req, res)
    if (!user) return

    const productId = toProductId(req.params.productId)
    if (!productId) {
        return res.status(400).json({ message: 'Sản phẩm không hợp lệ.' })
    }

    user.cart = cartData(user).cart.filter(i => i.productId !== productId)
    saveData()

    res.status(200).json(cartData(user))
})

// Xóa hết giỏ hàng
app.delete('/api/cart', async (req, res) => {
    const user = await requireUser(req, res)
    if (!user) return

    user.cart = []
    saveData()
    res.status(200).json(cartData(user))
})

// 1. Lấy danh sách tất cả đơn hàng
app.get('/api/orders', (req, res) => {
    res.status(200).json({
        success: true,
        data: orders
    });
});

// 2. Tạo một đơn hàng mới
app.post('/api/orders', (req, res) => {
    const {
        idUser,
        customerName,
        address,
        phoneNumber,
        paymentMethod,
        items,
        totalPrice
    } = req.body;

    // Kiểm tra dữ liệu bắt buộc
    if (!idUser || !address || !phoneNumber || !items || items.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Vui lòng cung cấp đầy đủ: idUser, address, phoneNumber và danh sách items'
        });
    }

    const newOrder = {
        id: orders.length + 1,
        idUser: idUser,
        customerName: customerName || 'Khách lẻ',
        address: address,
        phoneNumber: phoneNumber,
        paymentMethod: paymentMethod || 'COD', // Mặc định là thanh toán khi nhận hàng (COD)
        items: items,
        totalPrice: totalPrice || 0,
        status: 'pending', // Trạng thái đơn hàng
        createdAt: new Date()
    };

    orders.push(newOrder);
    saveData()

    res.status(201).json({
        success: true,
        message: 'Tạo đơn hàng thành công',
        data: newOrder
    });
});

// 3. Lấy danh sách đơn hàng theo idUser
app.get('/api/orders/user/:userId', (req, res) => {
    const userId = req.params.userId;
    const userOrders = orders.filter(o => String(o.idUser) === String(userId));

    res.status(200).json({
        success: true,
        data: userOrders
    });
});

// 4. Lấy chi tiết 1 đơn hàng theo ID
app.get('/api/orders/:id', (req, res) => {
    const orderId = parseInt(req.params.id);
    const order = orders.find(o => o.id === orderId);

    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Không tìm thấy đơn hàng'
        });
    }

    res.status(200).json({
        success: true,
        data: order
    });
});
